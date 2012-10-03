<?php

class PMS_Orders_Payments
{
	protected $_table;

    public function __construct()
    {
        $this->_table = new PMS_Orders_Payments_Table();
    }

    public function getList($params)
    {
        $response = new OSDN_Response();

        $select = $this->_table->getAdapter()->select()->from($this->_table->getTableName());

        $plugin = new OSDN_Db_Plugin_Select($this->_table, $select);
        $plugin->setSqlCalcFoundRows(true);
        $plugin->parse($params);

        try {
            $rows = $select->query()->fetchAll();
            $response->totalCount = $plugin->getTotalCountSql();
            $response->setRowset($rows);
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
            'order_id'  => 'Int',
            'status'    => 'Int',
            '*'         => 'StringTrim'
        ), array(
            'order_id'  => array('Id', 'allowEmpty' => false, 'presence' => 'required'),
            'date'      => array(array('StringLength', 1, 255), 'presence' => 'required'),
            'summ'      => array(array('StringLength', 1, 10), 'presence' => 'required'),
            'status'     => array('Int', 'allowEmpty' => false, 'presence' => 'required')
        ), $params);
        $response->addInputStatus($f);
        if ($response->hasNotSuccess()) {
            return $response;
        }

        $data = $f->getData();

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
            'id'        => 'Int',
            'order_id'  => 'Int',
            'status'    => 'Int',
            '*'         => 'StringTrim'
        ), array(
            'order_id'  => array('Id', 'allowEmpty' => false, 'presence' => 'required'),
            'date'      => array(array('StringLength', 1, 255), 'presence' => 'required'),
            'summ'      => array(array('StringLength', 1, 10), 'presence' => 'required'),
            'status'     => array('Int', 'allowEmpty' => false, 'presence' => 'required')
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
        $response = new OSDN_Response();
        $validate = new OSDN_Validate_Id();
        if (!$validate->isValid($id)) {
            return $response->addStatus(new PMS_Status(PMS_Status::INPUT_PARAMS_INCORRECT, 'id'));
        }
        if (!$this->_checkRelations($id)) {
            return $response->addStatus(new PMS_Status(PMS_Status::DELETE_FAILED));
        }
        try {
            $affectedRows = $this->_table->deleteByPk($id);
            $status = PMS_Status::retrieveAffectedRowStatus($affectedRows);
        } catch (Exception $e) {
            if (OSDN_DEBUG) {
                throw $e;
            }
            $status = PMS_Status::DATABASE_ERROR;
        }
        return $response->addStatus(new PMS_Status($status));
    }

}