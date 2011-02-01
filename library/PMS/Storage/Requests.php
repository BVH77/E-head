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
            ->from(array('av' => $this->_table->getTableName()), '*')
            ->joinLeft(array('as' => 'storage_assets'),
                'av.asset_id=as.id', array('name', 'measure'))
            ->joinLeft(array('ac' => 'accounts'),
                'av.account_id=ac.id', array('account_name' => 'ac.name'));
        $plugin = new OSDN_Db_Plugin_Select($this->_table, $select,
            array('name', 'measure', 'qty', 'account_name', 'request_on', 'created'));
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
            'qty'           => 'Int',
            '*'             => 'StringTrim'
        ), array(
            'asset_id'      => array(array('Id'), 'presence' => 'required'),
            'qty'           => array('Int', 'allowEmpty' => true),
            'request_on'    => array(array('Date', OSDN_DATE_FORMAT), 'presence' => 'required')
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
            'qty'           => 'Int',
            '*'             => 'StringTrim'
        ), array(
            'id'            => array('Int', 'presence' => 'required'),
            'qty'           => array('Int', 'allowEmpty' => true),
            'request_on'    => array(array('Date', OSDN_DATE_FORMAT), 'presence' => 'required')
        ), $params);

        $response = new OSDN_Response();

        $response->addInputStatus($f);
        if ($response->hasNotSuccess()) {
            return $response;
        }

        try {
            $rows = $this->_table->updateByPk(array('qty' => $f->qty), $f->id);
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
}