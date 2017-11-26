<?php

class PMS_Expenses
{
	protected $_table;

    public function __construct()
    {
        $this->_table = new PMS_Expenses_Table();
    }

    public function getList($params)
    {
        $response = new OSDN_Response();

        $select = $this->_table->getAdapter()->select();
        $select->from($this->_table->getTableName());

        /*
        if (isset($params['categoryId']) && intval($params['categoryId']) > 0) {
            $select->where('category_id = ?', intval($params['categoryId']));
        }
        */

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
        $select = $this->_table->getAdapter()->select();
        $select->from(array('s' => $this->_table->getTableName()));
        // $select->join(array('c' => 'staff_categories'), 's.category_id=c.id',
        //              array('category_name' => 'c.name'));
        $select->where('s.id = ?', $id);

        $row = $select->query()->fetchAll();
        if (!$row) {
            return $response->addStatus(new PMS_Status(PMS_Status::DATABASE_ERROR));
        }
        $response->setRow($row[0]);
        return $response->addStatus(new PMS_Status(PMS_Status::OK));
    }
    
    public function add(array $params)
    {
        $f = new OSDN_Filter_Input(array(
            'order_id'      => 'Int',
            '*'             => 'StringTrim'
        ), array(
            'order_id'      => array('Int'),
            'category'      => array(array('StringLength', 0, 250)),
            'entry'         => array(array('StringLength', 0, 250)),
            'summ'          => array(array('StringLength', 0, 250)),
            'comment'       => array(array('StringLength', 0, 250)),
            'date'          => array(array('StringLength', 0, 10))
        ), $params);

        $response = new OSDN_Response();

        $response->addInputStatus($f);
        if ($response->hasNotSuccess()) {
            return $response;
        }
        $data = $f->getData();
        if ($data['order_id'] === 0) {
            $data['order_id'] = NULL;
        }

        $id = $this->_table->insert($data);
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
            'order_id'      => 'Int',
            '*'             => 'StringTrim'
        ), array(
            'order_id'      => array('Int'),
            'category'      => array(array('StringLength', 0, 250)),
            'entry'         => array(array('StringLength', 0, 250)),
            'summ'          => array(array('StringLength', 0, 250)),
            'comment'       => array(array('StringLength', 0, 250)),
            'date'          => array(array('StringLength', 0, 10))
        ), $params);

        $response = new OSDN_Response();

        $response->addInputStatus($f);
        if ($response->hasNotSuccess()) {
            return $response;
        }

        $data = $f->getData();
        if ($data['order_id'] === 0) {
            $data['order_id'] = NULL;
        }
        
        $rows = $this->_table->updateByPk($data, $f->id);
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

        $resp = $this->get($id);
        if ($resp->hasNotSuccess()) {
            return $response->importStatuses($resp->getStatusCollection());
        }
        $row = $resp->getRow();

        $res = $this->_table->deleteByPk($id);
        if (false === $res) {
            return $response->addStatus(new PMS_Status(PMS_Status::DATABASE_ERROR));
        } else return $response->addStatus(new PMS_Status(PMS_Status::OK));
    }

    /*
    public function changeCategory($id, $categoryId)
    {
        $id = intval($id);
        $categoryId = intval($categoryId);

        $response = new OSDN_Response();
        if (0 == $id || 0 == $categoryId) {
            return $response->addStatus(new PMS_Status(
                PMS_Status::INPUT_PARAMS_INCORRECT));
        }

        $rows = $this->_table->updateByPk(array('category_id' => $categoryId), $id);
        return $response->addStatus(new PMS_Status(
            PMS_Status::retrieveAffectedRowStatus($rows)
        ));
    }
    */
}