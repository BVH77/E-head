<?php

class PMS_Storage_Assets
{
	protected $_table;

    public function __construct()
    {
        $this->_table = new PMS_Storage_Assets_Table();
    }

    public function getList($params)
    {
        $response = new OSDN_Response();

        $select = $this->_table->select()->from($this->_table->getTableName());
        if (isset($params['categoryId']) && intval($params['categoryId']) > 0) {
            $select->where('category_id = ?', $params['categoryId']);
        }
        $plugin = new OSDN_Db_Plugin_Select($this->_table, $select);
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
            'categoryId'    => 'Int',
            'qty'           => 'Int',
            '*'             => 'StringTrim'
        ), array(
            'name'          => array(array('StringLength', 1, 250), 'presence' => 'required'),
            'measure'       => array(array('StringLength', 1, 50), 'presence' => 'required'),
            'qty'           => array('Int', 'allowEmpty' => true),
            'categoryId'    => array(array('Id', true)),
            'unit_price'    => array(array('Float', 'en'), 'allowEmpty' => true)
            // Here we use en locale to set "."(point) as deciminal separator
        ), $params);
        $response->addInputStatus($f);
        if ($response->hasNotSuccess()) {
            return $response;
        }

        $data = $f->getData();

        // If category specified, check existing
        if ($data['categoryId'] > 0) {
            $categories = new PMS_Storage_Assets_Categories();
            $resp = $categories->get($data['categoryId']);
            if (!$resp->isSuccess()) {
                return $response->import($resp);
            }
            $row = $resp->getRow();
            if (empty($row)) {
                return $response->addStatus(new PMS_Status(
                    PMS_Status::INPUT_PARAMS_INCORRECT, 'categoryId'));
            }
            $data['category_id'] = $data['categoryId'];
        }
        unset($data['categoryId']);

        try {
            $id = $this->_table->insert($data);
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
        $response = new OSDN_Response();

        $f = new OSDN_Filter_Input(array(
            'id'            => 'Int',
            'qty'           => 'Int',
            '*'             => 'StringTrim'
        ), array(
            'id'            => array(array('Id', true)),
            'name'          => array(array('StringLength', 1, 250), 'presence' => 'required'),
            'measure'       => array(array('StringLength', 1, 50), 'presence' => 'required'),
            'qty'           => array('Int', 'allowEmpty' => true),
            'unit_price'    => array(array('Float', 'en'), 'allowEmpty' => true)
            // Here we use en locale to set "."(point) as deciminal separator
        ), $params);
        $response->addInputStatus($f);
        if ($response->hasNotSuccess()) {
            return $response;
        }

        try {
            $this->_table->updateByPk($f->getData(), $f->id);
            $status = PMS_Status::OK;
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
        // TODO: check relations
        try {
            $this->_table->deleteByPk($id);
            $status = PMS_Status::OK;
        } catch (Exception $e) {
            if (OSDN_DEBUG) {
                throw $e;
            }
            $status = PMS_Status::DATABASE_ERROR;
        }
        return $response->addStatus(new PMS_Status($status));
    }
}