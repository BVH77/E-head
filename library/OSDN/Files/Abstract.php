<?php

/**
 * OSDN_Files_Abstract
 *
 * @category OSDN
 * @package OSDN_Files
 *
 */
abstract class OSDN_Files_Abstract
{

    /**
     * @var OSDN_Files_Table_Files
     */
    protected $_table;

    protected $_allowedFileTypes = array();
    
    protected $_allowedFileExtensions = array();
    
    public function __construct($allowedFileTypes = null, $allowedFileExtensions = null)
    {
        if (isset($allowedFileTypes)) {
            $this->_allowedFileTypes = $allowedFileTypes;
        } else {
            $this->_allowedFileTypes = Zend_Registry::get('config')->file->upload->types->toArray();
        }
        if (isset($allowedFileExtensions)) {
            $this->_allowedFileExtensions = $allowedFileExtensions;
        } else {
            $this->_allowedFileExtensions = Zend_Registry::get('config')->file->upload->extensions->toArray();
        }
        $this->_table = new OSDN_Files_Table_Files();
    }
    
    /**
     * check whether uploaded file is allowed
     *
     * @return OSDN_Response
     */
    public function isAllowedFile($file)
    {
        $response = new OSDN_Response();
        if (!$this->isAllowedFileType($file)
                || !isset($file['name'])
                || !$this->isAllowedFileExtension($file['name'])) {
            $response->addStatus(new OSDN_Files_Status(OSDN_Files_Status::WRONG_FILE_FORMAT, 'file'));
            return $response;
        }
        $response->addStatus(new OSDN_Files_Status(OSDN_Files_Status::OK));
        return $response;
    }
    
    /**
     * check whether allowed document type or not
     *
     * @return boolean
     */
    public function isAllowedFileType($file)
    {
        if (class_exists('fileinfo', false)) {
            $info = new finfo(FILEINFO_MIME);
            $documentType = $info->file($file['tmp_name']);
            $info->close();
        } else if (function_exists('mime_content_type')) {
            $documentType = mime_content_type($file['tmp_name']);
        }

        if (empty($documentType) and ($file !== null)) {
            $documentType = $file['type'];
        }
        
        return in_array($documentType, $this->getAllowedFileTypes());
    }
    
    /**
     * check whether allowed file extension  or not
     *
     * @return boolean
     */
    public function isAllowedFileExtension($filename)
    {
        $ext = substr(strrchr($filename, "."), 1);
        return in_array($ext, $this->getAllowedFileExtensions());
    }
    
    /**
     * get allowed document types
     *
     * @return array
     */
    public function getAllowedFileTypes()
    {
        return $this->_allowedFileTypes;
    }
    
    /**
     * get allowed file extensions
     *
     * @return array
     */
    public function getAllowedFileExtensions()
    {
        return $this->_allowedFileExtensions;
    }
        
    /**
     * return file by id
     *
	 * @param int $id
	 *
     * @return OSDN_Response
     */
    public function get($id, $fields = '*')
    {
        $response = new OSDN_Response();
        $validate = new OSDN_Validate_Id();
        if (!$validate->isValid($id)) {
            return $response->addStatus(new OSDN_Files_Status(OSDN_Files_Status::INPUT_PARAMS_INCORRECT, 'id'));
        }
        try {
            
            $select = $this->_table->getAdapter()->select();
            $select->from($this->_table->getTableName(), $fields);
            $select->where(" id = ? ", $id);
            $rowset = $select->query()->fetchAll();
            if ($rowset) {
                $response->data = $rowset[0];
            } else {
                $response->data = null;
            }
            $response->addStatus(new OSDN_Files_Status(OSDN_Files_Status::OK));
        } catch (Exception $e) {
            $response->addStatus(new OSDN_Files_Status(OSDN_Files_Status::DATABASE_ERROR));
            if (OSDN_DEBUG) {
                throw $e;
            }
        }
        return $response;
    }
    
    /**
     * Insert new file
     *
     * @param array $data
     * @param boolean $append
     * @return OSDN_Response
     */
    public function insert(array $data)
    {
        $response = new OSDN_Response();
        
        $validators = array(
            'description'       => array(array('StringLength', 0, 250))
        );

        $filterInput = new OSDN_Filter_Input(array(), $validators, $data);
        $response->addInputStatus($filterInput);
        
        if ($response->hasNotSuccess()) {
            return $response;
        }
        
        

        $data = $filterInput->getData();
        if (isset($data['name']) && $data['name']) {
            $response = $this->isAllowedFile($data);
            if ($response->isError()) {
                return $response;
            }
            
        	$data['originalfilename'] = $data['name'];
            if (empty($data['filecontent']) && !empty($data['tmp_name'])) {
            	$data['filecontent'] = file_get_contents($data['tmp_name']);
            }
        }
        
        /**
         * insert
         */
        $fileId = $this->_table->insert($data);

        /**
         * check inserted id
         */
        $validate = new OSDN_Validate_Id();
        if (!$validate->isValid($fileId)) {
            $response->addStatus(new OSDN_Files_Status(
                OSDN_Files_Status::DATABASE_ERROR));
            return $response;
        }
        
        $response->addStatus(new OSDN_Files_Status(OSDN_Files_Status::ADDED));
        $response->fileId = $fileId;
        return $response;
    }
    
    /**
     * Update file
     *
     * @param int $id
     * @param array $data
     * @return OSDN_Response
     */
    public function update($id, array $data)
    {
        $response = new OSDN_Response();
        
        $validate = new OSDN_Validate_Id();
        if (!$validate->isValid($id)) {
            $response->addStatus(new OSDN_Files_Status(
                OSDN_Files_Status::INPUT_PARAMS_INCORRECT, 'id'));
            return $response;
        }
        
        $validators = array(
            'description'       => array(array('StringLength', 0, 250)),
        );
        
        $filterInput = new OSDN_Filter_Input(array(), $validators, $data);
        $response->addInputStatus($filterInput);
        
        if ($response->hasNotSuccess()) {
            return $response;
        }
        
        $data = $filterInput->getData();
        if (isset($data['name']) && $data['name']) {
            $response = $this->isAllowedFile($data);
            if ($response->isError()) {
                return $response;
            }
            
            $data['originalfilename'] = $data['name'];
            if (empty($data['filecontent']) && !empty($data['tmp_name'])) {
            	$data['filecontent'] = file_get_contents($data['tmp_name']);
            }
        }
        
        $affectedRows = $this->_table->updateByPk($data, $id);
        
        $status = null;
        if ($affectedRows > 0) {
            $status = OSDN_Files_Status::UPDATED;
        } else if ($affectedRows === 0) {
            $status = OSDN_Files_Status::UPDATED_NO_ONE_ROWS_UPDATED;
        } else {
            $status = OSDN_Files_Status::FAILURE;
        }
        $response->addStatus(new OSDN_Files_Status($status));
        $response->affectedRows = $affectedRows;
        return $response;
    }
    
    /**
     * Delete file
     *
     * @param int $id
     * @return OSDN_Response
     */
    public function delete($id)
    {
        $response = new OSDN_Response();
        
        $validate = new OSDN_Validate_Id();
        if (!$validate->isValid($id)) {
            $response->addStatus(new OSDN_Files_Status(
                OSDN_Files_Status::INPUT_PARAMS_INCORRECT, 'id'));
            return $response;
        }
        
        $affectedRows = $this->_table->deleteByPk($id);
        if (false === $affectedRows) {
            $status = OSDN_Files_Status::DELETE_FAILED;
        } else {
            $status = OSDN_Files_Status::DELETED;
        }
        $response->addStatus(new OSDN_Files_Status($status));
        $response->affectedRows = $affectedRows;
        return $response;
    }
}