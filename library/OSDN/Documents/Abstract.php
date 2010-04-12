<?php

/**
 * OSDN_Documents_Abstract
 *
 * @category OSDN
 * @package OSDN_Documents
 *
 * @todo organize the structure
 */
abstract class OSDN_Documents_Abstract
{
    /**
     * @var OSDN_Documents_Table_DocumentTypes
     */
    protected $_table;
    
    protected $_entityTypeId = null;
    
    protected $_allowedDocumentTypes = array();
    
    protected $_allowedFileExtensions = array();
    
    public function __construct($entityType = null, $allowedDocumentTypes = null, $allowedFileExtensions = null)
    {
        if (isset($entityType)) {
            $this->_entityTypeId = $entityType;
        }
        if (isset($allowedDocumentTypes)) {
            $this->_allowedDocumentTypes = $allowedDocumentTypes;
        }
        
        if (isset($allowedFileExtensions)) {
            $this->_allowedFileExtensions = $allowedFileExtensions;
        }
        $this->_table = new OSDN_Documents_Table_Documents();
        $this->_docTypes = new OSDN_Documents_Table_DocumentTypes();
        $this->_file = new OSDN_Files($this->_allowedDocumentTypes, $this->_allowedFileExtensions);
    }
    
    /**
     * check whether allowed document type or not
     *
     * @return boolean
     */
    public function isAllowedDocumentType($file)
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
        
        return in_array($documentType, $this->getAllowedDocumentTypes());
    }
    
    public function isAllowedFileExtension($filename)
    {
        $ext = substr(strrchr($filename, "."), 1);
        return in_array($ext, $this->getAllowedFileExtensions());
    }
    
    /**
     * set allowed document types
     *
     * @return array
     */
    public function setAllowedDocumentTypes($allowedDocumentTypes)
    {
        $this->_allowedDocumentTypes = $allowedDocumentTypes;
        return $this->_allowedDocumentTypes;
    }

    /**
     * get allowed document types
     *
     * @return array
     */
    public function getAllowedDocumentTypes()
    {
        return $this->_allowedDocumentTypes;
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
     * return all document sourses
     *
	 *
     * @return OSDN_Response
     */
    public function getDocSourses()
    {
        $response = new OSDN_Response();
        
        $sourses = new OSDN_Documents_Table_DocumentSourses();
        
        $list = $sourses->fetchAll();
        if ($list) {
            $list = $list->toArray();
        }
        
        $response->addStatus(new OSDN_Documents_Status(OSDN_Documents_Status::OK));
        
        $response->success = true;
        
        $response->rows = $list;

        return $response;
    }
    
	/**
     * return all document type files
     *
     * @return OSDN_Response
     */
    public function fetchAllDocTypeFiles($params)
    {
        $response = new OSDN_Response();
        
        if (!isset($params['fields'])) {
            $params['fields'] = "*";
        } else {
            if (!isset($params['fields']['document_type_id'])) {
                $params['fields']['document_type_id'] = 'id';
            }
        }
        
        $DocumentTypesFiles = new OSDN_Documents_Table_DocumentTypesFiles();
        
        $select = $this->_docTypes->getAdapter()->select();
        $select->from(array('dt' => $this->_docTypes->getTableName()), $params['fields']);
        $select->join(array('dtf' => $DocumentTypesFiles->getTableName()),
        	"dtf.document_type_id = dt.id ", array('file_id'));
        
        if (!empty($params['where'])) {
            foreach($params['where'] as $k => $v) {
                $select->where("dt.$k = ? ", $v);
            }
        }
        
        if (isset($params['allowedDocumentTypes'])) {
            if (empty($params['allowedDocumentTypes'])) {
                $select->where("dt.id = '-1' ");
            } else {
                $select->where("dt.id IN (?) ", $params['allowedDocumentTypes']);
            }
        }
        $select->where("dt.entitytype_id = ?", $this->_entityTypeId);
        
        $plugin = new OSDN_Db_Plugin_Select($this->_docTypes, $select);
        $plugin->parse($params);
        
        $selectTotal = clone ($select);
        $selectTotal->reset(Zend_Db_Select::COLUMNS);
        $selectTotal->reset(Zend_Db_Select::LIMIT_COUNT);
        $selectTotal->reset(Zend_Db_Select::LIMIT_COUNT);
        $selectTotal->columns(array('c' => new Zend_Db_Expr('COUNT(*)')));

        $status = null;
        try {
            $rowset = $select->query()->fetchAll();
            $total = $selectTotal->query()->fetchColumn(0);
            
            if ($rowset) {
                $templates = array();
                foreach ($rowset as $k => $v) {
                    if (isset($v['file_id'])) {
                        $res = $this->_file->get($v['file_id'], array('originalfilename', 'type', 'size'));
                        if (isset($res->data)) {
                            $data = $res->data;
                            $rowset[$k]['originalfilename'] = $data['originalfilename'];
                            $rowset[$k]['type'] = $data['type'];
                            $rowset[$k]['size'] = $data['size'];
                        }
                    }
                }
            }
            $response->rows = $rowset;
            $response->total = $total;
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
     * return all document for doc type
     *
     * @return OSDN_Response
     */
    public function fetchAllForDocType(array $params = array())
    {
        
        $response = new OSDN_Response();
        
        $documentSourses = new OSDN_Documents_Table_DocumentSourses();
        
        $select = $this->_table->getAdapter()->select()
            ->from(array('d' => $this->_table->getTableName()))
            ->joinLeft(array('s' => $documentSourses->getTableName()),
                "d.document_storage_source_id = s.id", array('sourseName' => 'name'))
            ->where("d.entity_id = ?", intval($params['entity_id']))
            ->where("d.entitytype_id = ?", $this->_entityTypeId)
            ->where("d.document_type_id = ?", intval($params['document_type_id']))
            ->order('d.title ASC');
        $status = null;
        try {
            $rowset = $select->query()->fetchAll();
            $commentary = new OSDN_Comments_Select();
            if ($rowset) {
                $templates = array();
                foreach ($rowset as $k => $v) {
                    if (isset($v['file_id'])) {
                        $res = $this->_file->get($v['file_id'], array('originalfilename', 'type', 'size'));
                        if (isset($res->data)) {
                            $data = $res->data;
                            $rowset[$k]['originalfilename'] = $data['originalfilename'];
                            $rowset[$k]['type'] = $data['type'];
                            $rowset[$k]['size'] = $data['size'];
                        }
                    }
                }
            }
            $response->setRowset($rowset);
//            if ($params['entity_id'] == 259) {
//                var_dump($rowset);
//            }
            $status = OSDN_Documents_Status::OK;
        } catch (Exception $e) {
            if (OSDN_DEBUG) {
                throw $e;
            }
            $status = OSDN_Documents_Status::DATABASE_ERROR;
        }
        return $response->addStatus(new OSDN_Documents_Status($status));
    }
    
    /**
     * return all document for each doc type
     *
     * @return OSDN_Response
     */
    public function fetchAllForDocTypes($params)
    {
        $response = new OSDN_Response();
        
        if (!isset($params['fields']['dt'])) {
            $params['fields']['dt'] = "*";
        } else {
            if (!isset($params['fields']['dt']['document_type_id'])) {
                $params['fields']['dt']['document_type_id'] = 'id';
            }
        }
        if (!isset($params['fields']['d'])) {
            $params['fields']['d'] = "*";
        } else {
            if (false === array_search('file_id', $params['fields']['d'])) {
                $params['fields']['d'][] = 'file_id';
            }
        }
        
        $documentSourses = new OSDN_Documents_Table_DocumentSourses();
        $categoriesTable = new OSDN_Documents_Table_Categories();
        
        $select = $this->_table->getAdapter()->select();
        $select->from(array('dt' => $this->_docTypes->getTableName()), $params['fields']['dt']);
        $select->joinLeft(array('d' => $this->_table->getTableName()),
        	"d.document_type_id = dt.id and d.entity_id = {$params['entity_id']}",
            $params['fields']['d']);
        $select->joinLeft(array('s' => $documentSourses->getTableName()),
        	"d.document_storage_source_id = s.id", array('sourseName' => 'name'));
        $select->joinLeft(array('dc' => $categoriesTable->getTableName()), 
            "dc.id = dt.category_id",
            array(
                'category_name' => 'name',
                'category_id'   => 'id'
            )
        );
        
        if (!empty($params['document_type_id'])) {
            if (!$validate->isValid($params['document_type_id'])) {
                return $response->addStatus(
                    new OSDN_Documents_Status(OSDN_Documents_Status::INPUT_PARAMS_INCORRECT, 'document_type_id')
                );
            }
            $select->where("document_type_id = ?", $params['document_type_id']);
        }
        
        if (!empty($params['category_id'])) {
            $select->where("dt.category_id = ? ", intval($params['category_id']));
        }
        
        if (!empty($params['where']['dt'])) {
            foreach($params['where']['dt'] as $k => $v) {
                $select->where("dt.$k = ? ", $v);
            }
        }
        if (!empty($params['where']['d'])) {
            foreach($params['where']['d'] as $k => $v) {
                $select->where("d.$k = ? ", $v);
            }
        }
        
        if (isset($params['allowedDocumentTypes'])) {
            if (empty($params['allowedDocumentTypes'])) {
                $select->where("dt.id = '-1' ");
            } else {
                $select->where("dt.id IN (?) ", $params['allowedDocumentTypes']);
            }
        }
        
        
        $select->where("dt.entitytype_id = ?", $this->_entityTypeId);
        $select->order('dc.order ASC');
        
        $plugin = new OSDN_Db_Plugin_Select($this->_table, $select);
        $plugin->parse($params);
        
        $selectTotal = clone ($select);
        $selectTotal->reset(Zend_Db_Select::COLUMNS);
        $selectTotal->reset(Zend_Db_Select::LIMIT_COUNT);
        $selectTotal->reset(Zend_Db_Select::LIMIT_COUNT);
        $selectTotal->columns(array('c' => new Zend_Db_Expr('COUNT(*)')));

        $status = null;
        try {
            $rowset = $select->query()->fetchAll();
            $total = $selectTotal->query()->fetchColumn(0);
            $commentary = new OSDN_Comments_Select();
            if ($rowset) {
                $DocumentTypes = new OSDN_DocumentTypes($this->_entityTypeId, $this->_allowedDocumentTypes);
                $templates = array();
                foreach ($rowset as $k => $v) {
                    
                    if (isset($v['file_id'])) {
                        $res = $this->_file->get($v['file_id'], array('originalfilename', 'type', 'size'));
                        if (isset($res->data)) {
                            $data = $res->data;
                            $rowset[$k]['originalfilename'] = $data['originalfilename'];
                            $rowset[$k]['type'] = $data['type'];
                            $rowset[$k]['size'] = $data['size'];
                        }
                    }
                    if (!isset($templates[$v['document_type_id']])) {
                        $res = $DocumentTypes->getFiles($v['document_type_id']);
                        if ($res->isError()) {
                            return $res;
                        }
                        $templates[$v['document_type_id']] = $res->rows;
                    }
                    
                    if ($v['id']) {
                        $commentaryResponse = $commentary->fetchCount(OSDN_EntityTypes::DOCUMENT, $v['id']);
                        if ($commentaryResponse->isSuccess()) {
                           $rowset[$k]['comments'] = $commentaryResponse->count;
                        }
                    }
                    
                    $rowset[$k]['templates'] = $templates[$v['document_type_id']];
                    
                }
            }
            $response->rows = $rowset;
            $response->total = $total;
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
     * return all document
     *
	 *
     * @return OSDN_Response
     */
    public function fetchAll($params)
    {
        $response = new OSDN_Response();
        
        if (!isset($params['fields']['d'])) {
            $params['fields']['d'] = "*";
        } else {
            if (false === array_search('file_id', $params['fields']['d'])) {
                $params['fields']['d'][] = 'file_id';
            }
        }
        
        $documentSourses = new OSDN_Documents_Table_DocumentSourses();
        
        $select = $this->_table->getAdapter()->select();
        $select->from(array('d' => $this->_table->getTableName()),
            $params['fields']['d']);
        $select->joinLeft(array('s' => $documentSourses->getTableName()),
        	"d.document_storage_source_id = s.id", array('sourseName' => 'name'));
        
        $select->where("d.document_type_id is null");
        $select->where("d.entity_id = ? ", $params['entity_id']);
        $select->where("d.entitytype_id = ? ", $this->_entityTypeId);
     
        if (!empty($params['where']['d'])) {
            foreach($params['where']['d'] as $k => $v) {
                $select->where("d.$k = ? ", $v);
            }
        }
        
        $plugin = new OSDN_Db_Plugin_Select($this->_table, $select);
        $plugin->parse($params);
        
        $selectTotal = clone ($select);
        $selectTotal->reset(Zend_Db_Select::COLUMNS);
        $selectTotal->reset(Zend_Db_Select::LIMIT_COUNT);
        $selectTotal->reset(Zend_Db_Select::LIMIT_COUNT);
        $selectTotal->columns(array('c' => new Zend_Db_Expr('COUNT(*)')));

        $status = null;
        try {
            $rowset = $select->query()->fetchAll();
            $total = $selectTotal->query()->fetchColumn(0);
            
            if ($rowset) {
                $commentary = new OSDN_Comments_Select();
                foreach ($rowset as $k => $v) {
                    if (isset($v['file_id'])) {
                        $res = $this->_file->get($v['file_id'], array('originalfilename', 'type', 'size'));
                        if (isset($res->data)) {
                            $data = $res->data;
                            $rowset[$k]['originalfilename'] = $data['originalfilename'];
                            $rowset[$k]['type'] = $data['type'];
                            $rowset[$k]['size'] = $data['size'];
                        }
                        $commentaryResponse = $commentary->fetchCount(OSDN_EntityTypes::DOCUMENT, $v['id']);
                        if ($commentaryResponse->isSuccess()) {
                           $rowset[$k]['comments'] = $commentaryResponse->count;
                        }
                    }
                }
            }
            $response->rows = $rowset;
            $response->total = $total;
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
     * return file by id
     *
	 * @param int $id
	 *
     * @return OSDN_Response
     */
    public function get($id, $fields = '*', $filefields = '*')
    {
        $response = new OSDN_Response();
        $validate = new OSDN_Validate_Id();
        if (!$validate->isValid($id)) {
            return $response->addStatus(new OSDN_Documents_Status(OSDN_Documents_Status::INPUT_PARAMS_INCORRECT, 'id'));
        }
        try {
            
            if (is_array($fields) && !($fields['file_id']) && in_array('file_id', $fields)) {
                $fields[] = 'file_id';
            }
            
            $select = $this->_table->getAdapter()->select();
            $select->from($this->_table->getTableName(), $fields);
            $select->where(" id = ? ", $id);
            
            $rowset = $select->query()->fetchAll();
            
            if ($rowset) {
                $data = $rowset[0];
               
                if ($filefields == '*' || (is_array($filefields) && count($filefields) > 0 )) {
                    if ($data['file_id']) {
                        $res = $this->_file->get($data['file_id'], $filefields);
                        if (!$res->isSuccess()) {
                            return $res;
                        }
                        $data['fileData'] = $res->data;
                    }
                }
            } else {
                $data = null;
            }
            
            $response->data = $data;
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
     * Insert new file
     *
     * @param array $data
	 *
     * @return OSDN_Response
     */
    public function insert(array $data)
    {
        $response = new OSDN_Response();
        
        $data['entitytype_id'] = $this->_entityTypeId;
        
        $validators = array(
            'entity_id'			        => array('id', 'presence' => 'required'),
        	'entitytype_id'		        => array('id', 'presence' => 'required'),
        	'document_type_id'          => array('id'),
			'document_storage_source_id'  => array('id'),
            'question_response'			=> array('int'),
			'title'                     => array(array('StringLength', 0, 100)),
            'author'                    => array(array('StringLength', 0, 100)),
            'subject'                   => array(array('StringLength', 0, 100)),
            'keywords'	                => array(array('StringLength', 0, 100)),
            
        );
        //'expired_date'

        $filterInput = new OSDN_Filter_Input(array(), $validators, $data);
        $response->addInputStatus($filterInput);
        
        if ($response->hasNotSuccess()) {
            return $response;
        }
        
        $data = $filterInput->getData();
        
        if (isset($data['file'])) {
            if (!$this->isAllowedDocumentType($data['file'])) {
                $response->addStatus(new OSDN_Documents_Status(OSDN_Documents_Status::WRONG_FILE_FORMAT, 'file'));
                return $response;
            }
            
            if (!isset($data['file']['name']) || !$this->isAllowedFileExtension($data['file']['name'])) {
                $response->addStatus(new OSDN_Documents_Status(OSDN_Documents_Status::WRONG_FILE_FORMAT, 'file'));
                return $response;
            }
            
            $res = $this->_file->insert($data['file']);
            if (!$res->isSuccess()) {
                return $res;
            }
            $data['file_id'] = $res->fileId;
        }

        /**
         * insert
         */
        
        $docId = $this->_table->insert($data);

        /**
         * check inserted id
         */
        $validate = new OSDN_Validate_Id();
        if (!$validate->isValid($docId)) {
            $response->addStatus(new OSDN_Documents_Status(
                OSDN_Documents_Status::DATABASE_ERROR));
            return $response;
        }
        $response->addStatus(new OSDN_Documents_Status(OSDN_Documents_Status::ADDED));
        $response->docId = $docId;
        return $response;
    }
    
    /**
     * Update document
     *
     * @param int $id
     * @param array $data
     * @return OSDN_Response
     */
    public function update($id, array $data)
    {
        $response = new OSDN_Response();
        
        $data['entitytype_id'] = $this->_entityTypeId;
        
        $validate = new OSDN_Validate_Id();
        if (!$validate->isValid($id)) {
            $response->addStatus(new OSDN_Documents_Status(
                OSDN_Documents_Status::INPUT_PARAMS_INCORRECT, 'id'));
            return $response;
        }
        
        $validators = array(
            'entity_id'			        => array('id'),
        	'entitytype_id'		        => array('id'),
        	'document_type_id'          => array('id'),
			'document_storage_source_id'=> array('id'),
        	'question_response'			=> array('int'),
            'title'                     => array(array('StringLength', 0, 100)),
            'author'                    => array(array('StringLength', 0, 100)),
            'subject'                   => array(array('StringLength', 0, 100)),
            'keywords'	                => array(array('StringLength', 0, 100)),
        );
        
        $filterInput = new OSDN_Filter_Input(array(), $validators, $data);
        $response->addInputStatus($filterInput);
        
        if ($response->hasNotSuccess()) {
            return $response;
        }
        
        unset($data['file_id']);
        
        if (isset($data['file'])) {
            if (!$this->isAllowedDocumentType($data['file'])) {
                $response->addStatus(new OSDN_Documents_Status(OSDN_Documents_Status::WRONG_FILE_FORMAT, 'file'));
                return $response;
            }
            
            if (!isset($data['file']['name']) || !$this->isAllowedFileExtension($data['file']['name'])) {
                $response->addStatus(new OSDN_Documents_Status(OSDN_Documents_Status::WRONG_FILE_FORMAT, 'file'));
                return $response;
            }
            
            $res = $this->get($id);
            if (!$res->isSuccess()) {
                return $res;
            }
            
            $file_id = $res->data['file_id'];
            
            if (!$file_id) {
                
                $res = $this->_file->insert($data['file']);
                if (!$res->isSuccess()) {
                    return $res;
                }
                $data['file_id'] = $res->fileId;
            } else {
                $res = $this->_file->update($file_id, $data['file']);
                if (!$res->isSuccess()) {
                    return $res;
                }
            }
        }
        
        $affectedRows = $this->_table->updateByPk($data, $id);
        
        $status = null;
        if ($affectedRows > 0) {
            $status = OSDN_Documents_Status::UPDATED;
        } else if ($affectedRows === 0) {
            $status = OSDN_Documents_Status::UPDATED_NO_ONE_ROWS_UPDATED;
        } else {
            $status = OSDN_Documents_Status::FAILURE;
        }
        $response->addStatus(new OSDN_Documents_Status($status));
        $response->affectedRows = $affectedRows;
        return $response;
    }
    
    /**
     * Delete document
     *
     * @param int $id
     * @return OSDN_Response
     */
    public function delete($id)
    {
        $response = new OSDN_Response();
        
        $validate = new OSDN_Validate_Id();
        if (!$validate->isValid($id)) {
            $response->addStatus(new OSDN_Documents_Status(
                OSDN_Documents_Status::INPUT_PARAMS_INCORRECT, 'id'));
            return $response;
        }
        
        $res = $this->get($id);
        if ($res->isError()) {
            return $res;
        }
        if (isset($res->data['file_id'])) {
            $res->data['file_id'];
            $res = $this->_file->delete($res->data['file_id']);
            if ($res->isError()) {
                return $res;
            }
        }
        
        $affectedRows = $this->_table->deleteByPk($id);
        if (false === $affectedRows) {
            $status = OSDN_Documents_Status::DELETE_FAILED;
        } else {
            $status = OSDN_Documents_Status::DELETED;
        }
        $response->addStatus(new OSDN_Documents_Status($status));
        $response->affectedRows = $affectedRows;
        return $response;
    }
    
    /**
     * Delete document for entity id
     *
     * @param int $entityId
     * @return OSDN_Response
     */
    public function deleteAllWithEntityId($entityId)
    {
        $response = new OSDN_Response();
        $validate = new OSDN_Validate_Id();
        if (!$validate->isValid($entityId)) {
            $response->addStatus(new OSDN_Documents_Status(
                OSDN_Documents_Status::INPUT_PARAMS_INCORRECT, 'entity id'));
            return $response;
        }
        
        $affectedRows = $this->_table->delete("entity_id = '$entityId' and entitytype_id='{$this->_entityTypeId}'");
        if (false === $affectedRows) {
            $status = OSDN_Documents_Status::DELETE_FAILED;
        } else {
            $status = OSDN_Documents_Status::DELETED;
        }
        $response->addStatus(new OSDN_Documents_Status($status));
        $response->affectedRows = $affectedRows;
        return $response;
    }
    
	/**
     * Delete file
     *
     * @param int $id
     * @return OSDN_Response
     */
    public function deleteFile($id, $file_id)
    {
        $response = new OSDN_Response();
        
        $affectedRows = $this->_table->updateByPk(array('file_id' => new Zend_Db_Expr("NULL")), $id);
        
        $status = null;
        if ($affectedRows > 0) {
            $status = OSDN_Documents_Status::UPDATED;
        } else if ($affectedRows === 0) {
            $status = OSDN_Documents_Status::UPDATED_NO_ONE_ROWS_UPDATED;
        } else {
            $status = OSDN_Documents_Status::FAILURE;
        }
        $response->addStatus(new OSDN_Documents_Status($status));
        $response->affectedRows = $affectedRows;
        
        if (!$response->isSuccess()) {
            return $response;
        }
        
        return $this->_file->delete($file_id);
    }
    
    /**
     * return count of general documents
     *
     * @param array $params
     * @return OSDN_Response
     */
    public function getCountOfGeneralDocuments($params)
    {
        $response = new OSDN_Response();
        
        $documentSourses = new OSDN_Documents_Table_DocumentSourses();
        
        $select = $this->_table->getAdapter()->select();
        $select->from(array('d' => $this->_table->getTableName()),
            array('c' => new Zend_Db_Expr('COUNT(*)')));
        
        $select->where("d.document_type_id is null");
        if ($params['entity_id']) {
            $select->where("d.entity_id = ? ", $params['entity_id']);
        }
        $select->where("d.entitytype_id = ? ", $this->_entityTypeId);
     
        if (!empty($params['where'])) {
            foreach($params['where'] as $k => $v) {
                $select->where("d.$k = ? ", $v);
            }
        }
        $plugin = new OSDN_Db_Plugin_Select($this->_table, $select);
        $plugin->parse($params);
        
        $select->reset(Zend_Db_Select::LIMIT_COUNT);
        $select->reset(Zend_Db_Select::LIMIT_COUNT);

        $status = null;
        try {
            $total = $select->query()->fetchColumn(0);
            $response->count = $total;
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
}