<?php

class PMS_Staff
{
	protected $_table;

	static $PAY_PERIODS = array('hour', 'day', 'month');

    public function __construct()
    {
        $this->_table = new PMS_Staff_Table();
    }

    public function getList($params)
    {
        $response = new OSDN_Response();

        $currentAccountId = OSDN_Accounts_Prototype::getId();

        $select = $this->_table->getAdapter()->select();
        $select->from($this->_table->getTableName());

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

    public function get($id)
    {
        $id = intval($id);
        $response = new OSDN_Response();
        if ($id == 0) {
            return $response->addStatus(new PMS_Status(
                PMS_Status::INPUT_PARAMS_INCORRECT, 'id'));
        }
        $row = $this->_table->findOne($id);
        if (!$row) {
            return $response->addStatus(new PMS_Status(PMS_Status::DATABASE_ERROR));
        }
        $response->setRow($row->toArray());
        return $response->addStatus(new PMS_Status(PMS_Status::OK));
    }

    public function add(array $params)
    {
        $f = new OSDN_Filter_Input(array(
            'pay_rate'      => 'Int',
            '*'             => 'StringTrim'
        ), array(
            'pay_period'    => array(array('InArray', self::$PAY_PERIODS), 'presence' => 'required'),
            'name'          => array(array('StringLength', 0, 250), 'presence' => 'required'),
            'function'      => array(array('StringLength', 0, 250), 'presence' => 'required'),
            'hire_date'     => array(array('StringLength', 0, 10), 'presence' => 'required')
        ), $params);

        $response = new OSDN_Response();

        $response->addInputStatus($f);
        if ($response->hasNotSuccess()) {
            return $response;
        }

        $id = $this->_table->insert($f->getData());
        if (!$id) {
            return $response->addStatus(new PMS_Status(PMS_Status::DATABASE_ERROR));
        }

        $response->id = $id;
        return $response->addStatus(new PMS_Status(PMS_Status::OK));
    }

    public function update(array $params)
    {
        $f = new OSDN_Filter_Input(array(
            'id'            => 'Int',
            'pay_rate'      => 'Int',
            '*'             => 'StringTrim'
        ), array(
            'id'            => array('Id', 'presence' => 'required'),
            'pay_period'    => array(array('InArray', self::$PAY_PERIODS), 'presence' => 'required'),
            'name'          => array(array('StringLength', 0, 250), 'presence' => 'required'),
            'function'      => array(array('StringLength', 0, 250), 'presence' => 'required'),
            'hire_date'     => array(array('StringLength', 0, 10), 'presence' => 'required')
        ), $params);

        $response = new OSDN_Response();

        $response->addInputStatus($f);
        if ($response->hasNotSuccess()) {
            return $response;
        }
        $rows = $this->_table->updateByPk($f->getData(), $f->id);
        $status = PMS_Status::retrieveAffectedRowStatus($rows);
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
        $res = $this->_table->deleteByPk($id);
        $status = false === $res ? PMS_Status::DATABASE_ERROR : PMS_Status::OK;
        return $response->addStatus(new PMS_Status($status));
    }
}