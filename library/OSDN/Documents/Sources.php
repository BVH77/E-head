<?php

/**
 * OSDN_Documents_Sources
 *
 * @category OSDN
 * @package OSDN_Documents
 */
class OSDN_Documents_Sources
{
    /**
     * @var OSDN_Documents_Table_DocumentSourses
     */
    protected $_tableDocumentSources = null;

    /**
     * construct function of the class
     *
     */
    public function __construct()
    {
        $this->_tableDocumentSources = new OSDN_Documents_Table_DocumentSourses();
    }

    /**
     * Retrieve the departments by id
     *
     * @param int $id
     *
     * @return OSDN_Response
     */
    public function get($id)
    {
        $response = new OSDN_Response();
        $validate = new OSDN_Validate_Id();
        if (!$validate->isValid($id)) {
            $response->addStatus(new OSDN_Documents_Status(OSDN_Documents_Status::INPUT_PARAMS_INCORRECT, 'id'));
            return $response;
        }
        $selectFields = $this->_tableDocumentSources->getAdapter()->select()
            ->from($this->_tableDocumentSources->getTableName())
            ->where("id = ? ", $id);
        try {
            $response->data = $selectFields->query()->fetchAll();
            $status = OSDN_Documents_Status::OK;
        } catch (Exception $e) {
            if (OSDN_DEBUG) {
                throw $e;
            }
            $status = OSDN_Documents_Status::DATABASE_ERROR;
        }
        
        $response->addStatus(new OSDN_Documents_Status($status));
        return $response;
    }
    
    /**
     * Retrieve the work locations
     *
     * @param
     * @param string|array $fields
     *
     * @return OSDN_Response
     */
    public function getList(array $params, $fields = "*")
    {
        $response = new OSDN_Response();

        $selectFields = $this->_tableDocumentSources->getAdapter()->select()
            ->from($this->_tableDocumentSources->getTableName(), $fields);
            
        $plugin = new OSDN_Db_Plugin_Select($this->_tableDocumentSources, $selectFields);
        $selectFields = $plugin->parse((array) $params);
        
        $selectCount = clone($selectFields);
        $selectCount->reset(Zend_Db_Select::COLUMNS);
        $selectCount->reset(Zend_Db_Select::LIMIT_COUNT);
        $selectCount->reset(Zend_Db_Select::LIMIT_COUNT);
        $selectCount->columns(array('c' => new Zend_Db_Expr("COUNT(*)")));
        
        try {
            $response->rows = $selectFields->query()->fetchAll();
            $row = $selectCount->query()->fetch();
            $response->totalCount = !empty($row) ? $row['c'] : 0;
            $status = OSDN_Documents_Status::OK;
        } catch (Exception $e) {
            if (OSDN_DEBUG) {
                throw $e;
            }
            $status = OSDN_Documents_Status::DATABASE_ERROR;
        }
        
        $response->addStatus(new OSDN_Documents_Status($status));
        return $response;
    }
    
    /**
     * Update location
     *
     * @param  int              id
     * @param  array            data
     * @return OSDN_Response    the response object
     */
    public function update($id, array $data)
    {
        $response = new OSDN_Response();
        $validate = new OSDN_Validate_Id();
        if (!$validate->isValid($id)) {
            $response->addStatus(new OSDN_Documents_Status(OSDN_Documents_Status::INPUT_PARAMS_INCORRECT, 'id'));
            return $response;
        }
        
        $filters = array('*' => 'StringTrim');
        $validators = array(
            'name'  => array(array('StringLength', 0, 255), 'presence' => 'required')
        );
        
        $filterInput = new OSDN_Filter_Input($filters, $validators, $data);
        $response->addInputStatus($filterInput);

        if ($response->hasNotSuccess()) {
            return $response;
        }
        
        try{
            $updatedRows = $this->_tableDocumentSources->updateByPk($filterInput->getData(), $id);
        } catch (Exception $e) {
            $response->addStatus(new OSDN_Documents_Status(OSDN_Documents_Status::COMPANY_NAME_IS_USED_ALREADY, 'company_name'));
            return $response;
        }
        $status = null;
        if ($updatedRows > 0) {
            $status = OSDN_Documents_Status::UPDATED;
        } else if ($updatedRows === 0) {
            $status = OSDN_Documents_Status::UPDATED_NO_ONE_ROWS_UPDATED;
        } else {
            $status = OSDN_Documents_Status::FAILURE;
        }

        $response->addStatus(new OSDN_Documents_Status($status));
        $response->addData('updatedRows', $updatedRows);
        return $response;
    }
    
    /**
     * Add new location
     *
     * @param  array            data
     * @return OSDN_Response    the response object
     */
    public function add(array $data)
    {
        $response = new OSDN_Response();
        $filters = array('*' => 'StringTrim');
        $validators = array(
            'name'  => array(array('StringLength', 0, 255), 'presence' => 'required')
        );
        
        $filterInput = new OSDN_Filter_Input($filters, $validators, $data);
        $response->addInputStatus($filterInput);

        
        if ($response->hasNotSuccess()) {
            return $response;
        }
        
        try{
            $departmentId = $this->_tableDocumentSources->insert($filterInput->getData());
        } catch (Exception $e) {
            $response->addStatus(new OSDN_Documents_Status(OSDN_Documents_Status::COMPANY_NAME_IS_USED_ALREADY, 'company_name'));
            return $response;
        }
        
        $status = null;
        if ($departmentId) {
            $status = OSDN_Documents_Status::OK;
        } else {
            $status = OSDN_Documents_Status::FAILURE;
        }

        $response->addStatus(new OSDN_Documents_Status($status));
        $response->departmentId = $departmentId;
        return $response;
    }
    
    /**
     * Fetch department by id
     *
     * @param int $id       location id
     * @return OSDN_Response
     */
    public function find($id)
    {
        $response = new OSDN_Response();
        $validate = new OSDN_Validate_Id();
        if (!$validate->isValid($id)) {
            return $response->addStatus(new OSDN_Documents_Status(OSDN_Documents_Status::INPUT_PARAMS_INCORRECT, 'id'));
        }
        try {
            
            $row = $this->_tableDocumentSources->findOne($id);
            if ($row) {
                $row = $row->toArray();
            }
            $response->data = $row;
            $response->addStatus(new OSDN_Documents_Status(OSDN_Documents_Status::OK));
        } catch (Exception $e) {
            $response->addStatus(new OSDN_Documents_Status(OSDN_Documents_Status::DATABASE_ERROR));
            if (OSDN_DEBUG) {
                throw $e;
            }
        }
        return $response;
    }
    
    /**
     * delete department by id
     *
     * @param int $id   location id
     * @return OSDN_Response
     */
    public function delete($id)
    {
        $response = new OSDN_Response();
        $validate = new OSDN_Validate_Id();

        if (!$validate->isValid($id)) {
            $response->addStatus(new OSDN_Documents_Status(OSDN_Documents_Status::INPUT_PARAMS_INCORRECT, 'id'));
            return $response;
        }

        //TODO - make relation validation
        try{
            $affectedRows = $this->_tableDocumentSources->deleteByPk($id);
        } catch (Exception $e) {
            $affectedRows = false;
        }
        if (false === $affectedRows) {
            $response->addStatus(new OSDN_Documents_Status(OSDN_Documents_Status::CANNOT_BE_DELETED_BECAUSE_ITS_USING_ALREADY));
            return $response;
        }
        $response->addData('affectedRows', $affectedRows);
        $response->addStatus(new OSDN_Documents_Status(OSDN_Documents_Status::DELETED));
        return $response;
    }
}