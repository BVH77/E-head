<?php

class PMS_Storage_Requests
{
	protected $_table;

    public function __construct()
    {
        $this->_table = new PMS_Storage_Requests_Table();
    }

    public function getList($params)
    {
        $response = new OSDN_Response();

        $select = $this->_table->getAdapter()->select()
            ->from(array('av' => $this->_table->getTableName()), array(
                'id',
                'asset_id',
                'account_id',
                'order_id',
                'qty',
                'created',
                'request_on',
                'description',
                'processed',
                'name' => new Zend_Db_Expr('IF(asset_id IS NULL,av.name,as.name)'),
                'measure' => new Zend_Db_Expr('IF(asset_id IS NULL,av.measure,as.measure)'),
                'account_name' => 'ac.name',
                'out_of_stock' => new Zend_Db_Expr('IF(asset_id IS NULL OR as.qty < av.qty,1,0)')
            ))
            ->joinLeft(array('as' => 'storage_assets'),
                'av.asset_id=as.id', array())
            ->joinLeft(array('ac' => 'accounts'),
                'av.account_id=ac.id', array());

        $plugin = new OSDN_Db_Plugin_Select($this->_table, $select, array(
            'name',
            'measure',
            'qty',
            'account_name',
            'request_on',
            'order_id',
            'created',
            'description'
        ));

        $plugin->parse($params);
        try {
            $rows = $select->query()->fetchAll();
            $response->setRowset($rows);
            $response->totalCount = $plugin->getTotalCount();
            $status = PMS_Status::OK;
        } catch (Exception $e) {
            if (OSDN_DEBUG) {
                throw $e;
            }
            $status = PMS_Status::DATABASE_ERROR;
        }
        return $response->addStatus(new PMS_Status($status));
    }

    public function add(array $params)
    {
        $response = new OSDN_Response();

        $f = new OSDN_Filter_Input(array(
            'asset_id'      => 'Int',
            'order_id'      => 'Int',
            'qty'           => 'Int',
            '*'             => 'StringTrim'
        ), array(
            'asset_id'      => array('Id', 'allowEmpty' => true),
            'order_id'      => array('Id', 'allowEmpty' => true),
            'name'          => array(array('StringLength', 0, 250), 'allowEmpty' => true),
            'measure'       => array(array('StringLength', 0, 50), 'allowEmpty' => true),
            'qty'           => array('Int', 'allowEmpty' => true),
            'request_on'    => array(array('Date', OSDN_DATE_FORMAT), 'presence' => 'required'),
            'description'   => array(array('StringLength', 0, 4096), 'allowEmpty' => true)
        ), $params);

        $response->addInputStatus($f);
        if ($response->hasNotSuccess()) {
            return $response;
        }

        try {
            $id = $this->_table->insert($f->getData());
            $status = $id ? PMS_Status::OK : PMS_Status::FAILURE;
            $response->id = $id;
        } catch (Exception $e) {
            if (OSDN_DEBUG) {
                throw $e;
            }
            $status = PMS_Status::DATABASE_ERROR;
        }

        return $response->addStatus(new PMS_Status($status));
    }

    public function update(array $params)
    {
        $f = new OSDN_Filter_Input(array(
            'id'            => 'Int',
            'asset_id'      => 'Int',
            'qty'           => 'Int',
            '*'             => 'StringTrim'
        ), array(
            'id'            => array('Id', 'presence' => 'required'),
            'asset_id'      => array('Int', 'allowEmpty' => true),
            'name'          => array(array('StringLength', 0, 250), 'allowEmpty' => true),
            'measure'       => array(array('StringLength', 0, 50), 'allowEmpty' => true),
            'qty'           => array('Int', 'allowEmpty' => true),
            'request_on'    => array(array('Date', OSDN_DATE_FORMAT), 'presence' => 'required'),
            'description'   => array(array('StringLength', 0, 4096), 'allowEmpty' => true)
        ), $params);

        $response = new OSDN_Response();

        $response->addInputStatus($f);
        if ($response->hasNotSuccess()) {
            return $response;
        }

        try {
            $rows = $this->_table->updateByPk($f->getData(), $f->id);
            $status = PMS_Status::retrieveAffectedRowStatus($rows);
        } catch (Exception $e) {
            if (OSDN_DEBUG) {
                throw $e;
            }
            $status = PMS_Status::DATABASE_ERROR;
        }

        return $response->addStatus(new PMS_Status($status));
    }

    public function delete($id)
    {
        $id = intval($id);
        $response = new OSDN_Response();
        if ($id == 0) {
            return $response->addStatus(new PMS_Status(
                PMS_Status::INPUT_PARAMS_INCORRECT, 'id'));
        }
        try {
            $this->_table->deleteByPk($id);
            $status = PMS_Status::OK;
        } catch (Exception $e) {
            $status = PMS_Status::DATABASE_ERROR;
            if (OSDN_DEBUG) {
                throw $e;
            }
        }
        return $response->addStatus(new PMS_Status($status));
    }

    public function process($id)
    {
        $id = intval($id);
        $response = new OSDN_Response();

        if ($id == 0) {
            return $response->addStatus(new PMS_Status(
                PMS_Status::INPUT_PARAMS_INCORRECT, 'id'));
        }

        $request = $this->_table->findOne($id);
        if (!$request || is_null($request) || $request->processed > 0) {
            return $response->addStatus(new PMS_Status(
                PMS_Status::INPUT_PARAMS_INCORRECT, 'id'));
        }

        if (empty($request->asset_id)) {
            return $response->addStatus(new PMS_Storage_Requests_Status(
                PMS_Storage_Requests_Status::NOT_IN_STOCK));
        }

        $assetClass = new PMS_Storage_Assets();
        $asset = $assetClass->getById($request->asset_id);
        if (!$asset || is_null($asset)) {
            return $response->addStatus(new PMS_Storage_Requests_Status(
                PMS_Storage_Requests_Status::NOT_IN_STOCK));
        }

        if ($request->qty > $asset->qty) {
            return $response->addStatus(new PMS_Storage_Requests_Status(
                PMS_Storage_Requests_Status::OUT_OF_STOCK));
        }

        $historyTable = new PMS_Storage_History_Table();

        $data = array(
            'asset_id'      => $request->asset_id,
            'order_id'      => intval($request->order_id) > 0 ? intval($request->order_id) : null,
            'request_id'    => $request->id,
            'qty'           => -1 * $request->qty,
            'sender_id'     => OSDN_Accounts_Prototype::getId(),
            'reciever_id'   => $request->account_id,
        );

        $historyId = $historyTable->insert($data);
        if (!$historyId) {
            return $response->addStatus(new PMS_Status(PMS_Status::ADD_FAILED));
        }

        $result = $assetClass->updateQty($request->asset_id, -1 * $request->qty);
        if (!$result) {
            $historyTable->deleteByPk($historyId);
            return $response->addStatus(new PMS_Status(PMS_Status::UPDATE_FAILED));
        }

        $request->processed = 1;
        $result = $request->save();
        if (!$result) {
            $historyTable->deleteByPk($historyId);
            $assetClass->updateQty($request->asset_id, $request->qty);
            return $response->addStatus(new PMS_Status(PMS_Status::UPDATE_FAILED));
        }

        return $response->addStatus(new PMS_Status(PMS_Status::OK));
    }
}