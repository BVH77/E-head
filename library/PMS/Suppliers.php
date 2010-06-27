<?php

class PMS_Suppliers
{
	protected $_table;
	
    public function __construct()
    {
        $this->_table = new PMS_Suppliers_Table_Suppliers();
    }
    
    public function add(array $params)
    {
        $f = new OSDN_Filter_Input(array(
        ), array(
            'name' => array(array('StringLength', 1, 255), 'presence' => 'required')
        ), $params);
        
        $response = new OSDN_Response();
        $response->addInputStatus($f);
        if ($response->hasNotSuccess()) {
            return $response;
        }
        
        try {
            $id = $this->_table->insert($f->getData());
            $status = $id ? PMS_Status::OK : PMS_Status::FAILURE;
        } catch (Exception $e) {
            return $response->addStatus(new PMS_Status(PMS_Status::DATABASE_ERROR));
        }

        $response->id = $id;
        return $response->addStatus(new PMS_Status($status));
    }
    
    public function update(array $params)
    {
        $f = new OSDN_Filter_Input(array(), array(
            'id'          => array('int', 'presence' => 'required'),
            'name'        => array(array('StringLength', 1, 255), 'presence' => 'required')
        ), $params);

        $response = new OSDN_Response();
        $response->addInputStatus($f);
        if ($response->hasNotSuccess()) {
            return $response;
        }
        
        try {
            $updatedRows = $this->_table->updateByPk($f->getData(), $f->getEscaped('id'));
	        if ($updatedRows > 0) {
	            $status = PMS_Status::UPDATED;
	        } else if ($updatedRows === 0) {
	            $status = PMS_Status::UPDATED_NO_ONE_ROWS_UPDATED;
	        } else {
	            $status = PMS_Status::FAILURE;
	        }
        } catch (Exception $e) {
            return $response->addStatus(new PMS_Status(PMS_Status::DATABASE_ERROR));
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
        $affectedRows = $this->_table->deleteByPk($id);
        $status = PMS_Status::retrieveAffectedRowStatus($affectedRows);
        return $response->addStatus(new PMS_Status($status));
    }
    
    public function get($id)
    {
        $response = new OSDN_Response();
        $validate = new OSDN_Validate_Id();
        if (!$validate->isValid($id)) {
            $response->addStatus(new PMS_Status(PMS_Status::INPUT_PARAMS_INCORRECT, 'id'));
            return $response;
        }
        $select = $this->_table->getAdapter()->select()
            ->from($this->_table->getTableName())
            ->where("id = ? ", $id);
        try {
            $response->setRow($select->query()->fetch());
            $status = PMS_Status::OK;
        } catch (Exception $e) {
            if (OSDN_DEBUG) {
                throw $e;
            }
            $status = PMS_Status::DATABASE_ERROR;
        }
        return $response->addStatus(new PMS_Status($status));
    }
    
    /**
     * Retrieve orders
     *
     * @param array $params
     * The param examples<code>
     *      sort    => 'name'
     *      dir     => 'ASC'
     *      limit   => 20
     *      start   => 1
     *      ...
     *      filter[0][data][type]   string
     *      filter[0][data][value]  1
     *      filter[0][field]        alias
     * </code>
     * @param array $where      The array of where clauses<code>
     *  array(
     *      array('name = ?' => test),
     *      array('id' => 1)
     *  );</code>
     *
     * @return OSDN_Response
     * Details of contain data 
     * <code>
     *      rows array  the rows collection
     *      total int   the total count of rows
     * </code>
     */
    public function getList(array $params, array $where = array())
    {
        $response = new OSDN_Response();
        $select = $this->_table->getAdapter()->select();
        $select->from(array('s' => $this->_table->getTableName()), '*');
        $plugin = new OSDN_Db_Plugin_Select($this->_table, $select);
        $plugin->parse($params);
        $status = null;
        try {
            $response->setRowset($select->query()->fetchAll());
            $response->totalCount = $plugin->getTotalCount();
            $status = PMS_Status::OK;
        } catch (Exception $e) {
            $status = PMS_Status::DATABASE_ERROR;
            if (OSDN_DEBUG) {
                throw $e;
            }
        }
        return $response->addStatus(new PMS_Status($status));
    }
    
    public function attach($supplier_id, $order_id)
    {
    	$response = new OSDN_Response();
        $validate = new OSDN_Validate_Id();
        if (!$validate->isValid($supplier_id)) {
            return $response->addStatus(new PMS_Status(
                PMS_Status::INPUT_PARAMS_INCORRECT, 'supplier_id'));
        }
        if (!$validate->isValid($order_id)) {
            return $response->addStatus(new PMS_Status(
                PMS_Status::INPUT_PARAMS_INCORRECT, 'order_id'));
        }
        $ordersSuppliers = new PMS_Orders_Table_OrdersSuppliers();
        $row = $ordersSuppliers->fetchRow(
            'supplier_id = "' . $supplier_id . '" AND order_id = "' . $order_id . '"');
        if ($row != null) {
            return $response->addStatus(new PMS_Status(PMS_Status::ADD_FAILED));
        }
        
        try {
	        $ordersSuppliers->insert(array(
	            'supplier_id'   => $supplier_id, 
	            'order_id'      => $order_id, 
	            'success'       => 0
	        ));
	        $status = PMS_Status::OK;
        } catch (Exception $e) {
            $status = PMS_Status::DATABASE_ERROR;
            if (OSDN_DEBUG) {
                //throw $e;
            }
        }
        return $response->addStatus(new PMS_Status($status));
    }
    
    public function remove($id)
    {
    	$response = new OSDN_Response();
        $validate = new OSDN_Validate_Id();
        if (!$validate->isValid($id)) {
            return $response->addStatus(new PMS_Status(
                PMS_Status::INPUT_PARAMS_INCORRECT, 'id'));
        }
        $ordersSuppliers = new PMS_Orders_Table_OrdersSuppliers();
        try {
	        $ordersSuppliers->deleteByPk($id);
	        $status = PMS_Status::OK;
        } catch (Exception $e) {
            $status = PMS_Status::DATABASE_ERROR;
            if (OSDN_DEBUG) {
                throw $e;
            }
        }
        return $response->addStatus(new PMS_Status($status));
    }
    
    public function check($id, $success)
    {
    	$response = new OSDN_Response();
        $validate = new OSDN_Validate_Id();
        if (!$validate->isValid($id)) {
            return $response->addStatus(new PMS_Status(
                PMS_Status::INPUT_PARAMS_INCORRECT, 'id'));
        }
        if ($success !== 0 && $success !== 1) {
            return $response->addStatus(new PMS_Status(
                PMS_Status::INPUT_PARAMS_INCORRECT, 'success'));
        }
        $ordersSuppliers = new PMS_Orders_Table_OrdersSuppliers();
        try {
	        $ordersSuppliers->updateByPk(array(
	           'success' => $success, 
	           'date' => new Zend_Db_Expr('NOW()')
	        ), $id);
	        $status = PMS_Status::OK;
        } catch (Exception $e) {
            $status = PMS_Status::DATABASE_ERROR;
            if (OSDN_DEBUG) {
                throw $e;
            }
        }
        return $response->addStatus(new PMS_Status($status));
    }
    
    public function getByOrderId($id) {
        $response = new OSDN_Response();
        $validate = new OSDN_Validate_Id();
        if (!$validate->isValid($id)) {
            return $response->addStatus(new PMS_Status(
                PMS_Status::INPUT_PARAMS_INCORRECT, 'id'));
        }
        $ordersSuppliers = new PMS_Orders_Table_OrdersSuppliers();
        $select = $this->_table->getAdapter()->select();
        $select->from(array('os' => $ordersSuppliers->getTableName()), 
            array('id', 'success', 'date', 'cost', 'note'));
        $select->join(array('s' => $this->_table->getTableName()), 
            'os.supplier_id=s.id', array('name', 'description'));
        $select->where('os.order_id = ? ', $id);
        try {
            $response->setRowset($select->query()->fetchAll());
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