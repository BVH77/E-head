<?php

/**
 * OSDN_Documents_TypesAbstract
 *
 * @category OSDN
 * @package OSDN_Documents
 *
 */
abstract class OSDN_Documents_TypesAbstract
{

    protected $_entityTypes = array();

    protected $_allowedDocumentTypes = array();

    protected $_allowedFileExtensions = array();

    protected $_entityTypeId = null;

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
        $this->_docTypes = new OSDN_Documents_Table_DocumentTypes();
        $this->_docTypesFiles = new OSDN_Documents_Table_DocumentTypesFiles();
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
     * get allowed file extensions
     *
     * @return array
     */
    public function getAllowedFileExtensions()
    {
        return $this->_allowedFileExtensions;
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
     * Retrieve the document types
     *
     * @param array $params
     * @param boolean $countable        True to allow the rows calculation
     * @return OSDN_Response
     */
    public function fetchAll(array $params = array(), $countable = false)
    {
        $response = new OSDN_Response();

        $select = $this->_docTypes->getAdapter()->select()
            ->from(array('dt' => $this->_docTypes->getTableName()))
            ->where('dt.entitytype_id = ?', $this->_entityTypeId);
        if (!empty($params['category_id'])) {
            $select->where('dt.category_id = ?', intval($params['category_id']));
        }
        $select->order('dt.name');

        if (!empty($params) || $countable) {
            $plugin = new OSDN_Db_Plugin_Select($this->_docTypes, $select);
            $plugin->parse($params);
        }

        $status = null;
        try {
            $response->setRowset($select->query()->fetchAll());
            if ($countable) {
                $response->totalCount = $plugin->getTotalCount();
            }

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
     * return all document Types structure grouped by categories 
     *
     * @return OSDN_Response
     */
    public function getDocumentTypesStructure()
    {
        $response = new OSDN_Response();
        $documentCategory = new OSDN_Documents_Category($this->_entityTypeId);
        $res = $documentCategory->fetchAll();
        if ($res->isError()) {
            return $res;
        }
        $categories = $res->data;
        foreach ($categories as &$category) {
            $res = $this->fetchAllWithFiles(array(
                'category_id' => $category['id']
            ));
            if ($res->isError()) {
                return $res;
            }
            $category['document_types'] = $res->rows ? $res->rows : array();
        }
        $response->addStatus(new OSDN_Documents_Status(OSDN_Documents_Status::OK));
        $response->setRowset($categories);
        return $response;
        
    }
    
    /**
     * return all documentTypes
     *
	 * @param array $params
	 *
     * @return OSDN_Response
     */
    public function fetchAllWithFiles(array $params)
    {
        $response = new OSDN_Response();

        if (!isset($params['fields'])) {
            $params['fields'] = "*";
        }

        $categoriesTable = new OSDN_Documents_Table_Categories();

        $select = $this->_docTypes->getAdapter()->select();
        $select->from(array('dt' => $this->_docTypes->getTableName()), $params['fields']);
        $select->joinLeft(array('dc' => $categoriesTable->getTableName()),
            "dc.id = dt.category_id",
            array('category_name' => 'name')
        );
        if (!empty($params['where'])) {
            foreach($params['where'] as $k => $v) {
                $select->where("dt.$k = ? ", $v);
            }
        }
        $select->where("dt.entitytype_id = ? ", $this->_entityTypeId);
        if (!empty($params['category_id'])) {
            $select->where("dt.category_id = ? ", intval($params['category_id']));
        }
        $select->order('dc.order ASC');

        $plugin = new OSDN_Db_Plugin_Select($this->_docTypes, $select, array('name' => 'dt.name'));
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
                foreach ($rowset as $k => $v) {
                    $res = $this->getFiles($v['id']);
                    if (!$res->isSuccess())
                    {
                        return $res;
                    }
                    $rowset[$k]['files'] = Zend_Json::encode($res->rows);
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
     * return all documentTypes
     *
	 * @param array $params
	 *
     * @return OSDN_Response
     */
    public function fetchAllWithReplaceable($documentTypeId, array $params)
    {
        $response = new OSDN_Response();
        $validate = new OSDN_Validate_Id();

        if (!$validate->isValid($documentTypeId)) {
            $response->addStatus(new OSDN_Documents_Status(OSDN_Documents_Status::INPUT_PARAMS_INCORRECT));
            return $response;
        }

        $select = $this->_docTypes->getAdapter()->select();
        $select->from(array('dt' => $this->_docTypes->getTableName()), '*');
        $categoriesTable = new OSDN_Documents_Table_Categories();
        $select->joinLeft(array('dc' => $categoriesTable->getTableName()),
            "dc.id = dt.category_id",
            array('category_name' => 'name')
        );
        $replaceableTable = new OSDN_Documents_Table_DocumentTypesReplaceable();
        $select->joinLeft(array('dtr' => $replaceableTable->getTableName()),
            "dt.id = dtr.replaceable_id",
            array(
                'replaceable' => new Zend_Db_Expr('IF(dtr.document_type_id=' . $documentTypeId . ', 1, 0)')
            )
        );
        $select->where("dt.entitytype_id = ? ", $this->_entityTypeId);
        $select->order('dc.order ASC');

        $plugin = new OSDN_Db_Plugin_Select($this->_docTypes, $select, array('name' => 'dt.name'));
        $plugin->parse($params);
        $status = null;
        try {
            $rowset = $select->query()->fetchAll();
            $response->setRowset($rowset);
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
     * return all files for document type
	 *
	 * @param int $doc_type_id
	 * @param array $fields
	 *
     * @return OSDN_Response
     */
    public function getFiles($doc_type_id, $fields = array('id', 'originalfilename', 'type', 'size', 'description'))
    {
        $response = new OSDN_Response();

        $validate = new OSDN_Validate_Id();
        if (!$validate->isValid($doc_type_id)) {
            return $response->addStatus(new OSDN_Documents_Status(OSDN_Documents_Status::INPUT_PARAMS_INCORRECT, 'document_type_id'));
        }

        $result = array();
        $select = $this->_docTypesFiles->getAdapter()->select();
        $select->from(array('dtf' => $this->_docTypesFiles->getTableName()));
        $select->where("dtf.document_type_id = ?", $doc_type_id);

        try {
            $rowset = $select->query()->fetchAll();

            if ($rowset) {
                foreach ($rowset as $k => $v) {
                    $res = $this->_file->get($v['file_id'], $fields);
                    if (isset($res->data)) {
                        $result[] = $res->data;
                    }
                }
            }

            $response->rows = $result;
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
	 * @param int $file_id
	 * @param array $fields
	 *
     * @return OSDN_Response
     */
    public function getFile($file_id, $fields = array('id', 'originalfilename', 'type', 'size', 'description'))
    {
        return $this->_file->get($file_id, $fields);
    }


    /**
     * return document type by id
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

            $select = $this->_docTypes->getAdapter()->select();
            $select->from($this->_docTypes->getTableName(), $fields);
            $select->where(" id = ? ", $id);

            $rowset = $select->query()->fetchAll();

            if ($rowset) {
                $data = $rowset[0];
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
     * Insert new documentType
     *
     * @param array $data
	 *
     * @return OSDN_Response
     */
    public function insert(array $data)
    {
        $response = new OSDN_Response();

        $data['entitytype_id'] = $this->_entityTypeId;

        $filters = array(
            '*'                  => 'StringTrim'
        );

        $validators = array(
        	'entitytype_id'		        => array('id', 'presence' => 'required'),
            'category_id'               => array('Int'),
        	'name'                      => array(array('StringLength', 0, 100)),
            'question'					=> array(array('StringLength', 0, 255)),
			'abbreviation'              => array(array('StringLength', 0, 100)),
            'expired_date_required'     => array('Int'),
            'required'                  => array('Int')
        );

        $filterInput = new OSDN_Filter_Input($filters, $validators, $data);
        $response->addInputStatus($filterInput);

        if ($response->hasNotSuccess()) {
            return $response;
        }

        /**
         * insert
         */

        $docTypeId = $this->_docTypes->insert($filterInput->getData());

        /**
         * check inserted id
         */
        $validate = new OSDN_Validate_Id();
        if (!$validate->isValid($docTypeId)) {
            $response->addStatus(new OSDN_Documents_Status(
                OSDN_Documents_Status::DATABASE_ERROR));
            return $response;
        }
        $response->addStatus(new OSDN_Documents_Status(OSDN_Documents_Status::ADDED));
        $response->docTypeId = $docTypeId;
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

        $filters = array(
            '*'                  => 'StringTrim'
        );

        $validators = array(
        	'entitytype_id'		        => array('id', 'presence' => 'required'),
            'category_id'               => array('Int'),
        	'name'                      => array(array('StringLength', 0, 100)),
        	'question'					=> array(array('StringLength', 0, 255)),
			'abbreviation'              => array(array('StringLength', 0, 100)),
            'expired_date_required'     => array('Int'),
            'required'                  => array('Int')
        );


        $filterInput = new OSDN_Filter_Input($filters, $validators, $data);
        $response->addInputStatus($filterInput);

        if ($response->hasNotSuccess()) {
            return $response;
        }

        $affectedRows = $this->_docTypes->updateByPk($filterInput->getData(), $id);

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
     * Delete Document type
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

        $result = array();
        $select = $this->_docTypesFiles->getAdapter()->select();
        $select->from(array('dtf' => $this->_docTypesFiles->getTableName()));
        $select->where("dtf.document_type_id = ?", $id);

        try {
            $rowset = $select->query()->fetchAll();
            try {
                $affectedRows = $this->_docTypes->deleteByPk($id);
            } catch (Exception $e) {
                $affectedRows = false;
            }
            if (false === $affectedRows) {
                $status = OSDN_Documents_Status::DELETE_FAILED;
                $response->addStatus(new OSDN_Documents_Status($status));
                return $response;
            }

            if ($rowset) {
                foreach ($rowset as $k => $v) {
                    $res = $this->_file->delete($v['file_id']);
                }
            }
            $response->rows = $result;
        } catch (Exception $e) {
            /*if (OSDN_DEBUG) {
                throw $e;
            }*/

            $status = OSDN_Documents_Status::DATABASE_ERROR;
            $response->addStatus(new OSDN_Documents_Status($status));
            return $response;
        }

        $status = OSDN_Documents_Status::DELETED;
        $response->addStatus(new OSDN_Documents_Status($status));
        $response->affectedRows = $affectedRows;
        return $response;
    }

    /**
     * Delete File
     *
     * @param int $id
     * @return OSDN_Response
     */
    public function deleteFile($id)
    {
        return $this->_file->delete($id);
    }

    /**
     * insert File connected to document type
     *
     * @param array $data
     * @return OSDN_Response
     */
    public function insertFile(array $data)
    {
        $response = new OSDN_Response();
        if (isset($data['file'])  && isset($data['file']['name']) && $data['file']['name']) {
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
        $this->_docTypesFiles->insert($data);
        $response->addStatus(new OSDN_Documents_Status(OSDN_Documents_Status::OK));
        return $response;

    }

    /**
     * update File connected to document type
     *
     * @param array $data
     * @return OSDN_Response
     */
    public function updateFile(array $data)
    {
        $response = new OSDN_Response();
        if (isset($data['file'])) {
            if (isset($data['file']['name']) && $data['file']['name']) {
                if (!$this->isAllowedDocumentType($data['file'])) {
                    $response->addStatus(new OSDN_Documents_Status(OSDN_Documents_Status::WRONG_FILE_FORMAT, 'file'));
                    return $response;
                }

                if (!isset($data['file']['name']) || !$this->isAllowedFileExtension($data['file']['name'])) {
                    $response->addStatus(new OSDN_Documents_Status(OSDN_Documents_Status::WRONG_FILE_FORMAT, 'file'));
                    return $response;
                }
            }

            $res = $this->_file->update($data['file_id'], $data['file']);
            if (!$res->isSuccess()) {
                return $res;
            }
        }
        $response->addStatus(new OSDN_Documents_Status(OSDN_Documents_Status::OK));
        return $response;
    }


    public function getCountOfDocumentTypes($params = array())
    {
        $response = new OSDN_Response();

        $select = $this->_docTypes->getAdapter()->select();
        $select->from(array('dt' => $this->_docTypes->getTableName()),
            array('c' => new Zend_Db_Expr('COUNT(*)')));

        $select->where("dt.entitytype_id = ? ", $this->_entityTypeId);

        if (!empty($params['where'])) {
            foreach($params['where'] as $k => $v) {
                $select->where("dt.$k = ? ", $v);
            }
        }

        $plugin = new OSDN_Db_Plugin_Select($this->_docTypes, $select);
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

    public function getCountOfIncludedDocuments($params = array())
    {
        $response = new OSDN_Response();

        $Documents = new OSDN_Documents_Table_Documents();

        $select = $this->_docTypes->getAdapter()->select();
        $select->from(array('dt' => $this->_docTypes->getTableName()),
            array('c' => new Zend_Db_Expr('COUNT(dt.id)')));
        $select->join(array('d' => $Documents->getTableName()),
            'dt.id = d.document_type_id', array());

        $select->where("dt.entitytype_id = ? ", $this->_entityTypeId);

        if ($params['entity_id']) {
            $select->where("d.entity_id = ? ", $params['entity_id']);
        }
        if (!empty($params['where'])) {
            foreach($params['where'] as $k => $v) {
                $select->where("dt.$k = ? ", $v);
            }
        }

        $select->group('dt.entitytype_id');

        $plugin = new OSDN_Db_Plugin_Select($this->_docTypes, $select);
        $plugin->parse($params);

        $select->reset(Zend_Db_Select::LIMIT_COUNT);
        $select->reset(Zend_Db_Select::LIMIT_COUNT);
        $status = null;
        try {
            $total = $select->query()->fetchColumn(0);
            $response->count = $total ? $total : 0;
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
     * Fetch documents by documents types abbreviation
     *
     * @todo move to document type
     *
     * @param string $abbreviation      The document abbreviation
     * @return OSDN_Response
     */
    public function fetchAllByAbbreviation($abbreviation, $presence = null)
    {
        $response = new OSDN_Response();

        $adapter = $this->_docTypes->getAdapter();
        $prefix = $this->_docTypes->getPrefix();
        $select = $adapter->select()
            ->from(array('dt' => $prefix . 'documents_types'))
            ->join(
                array('d' => $prefix . 'documents'),
                'dt.id = d.document_type_id'
            )
            ->where('dt.abbreviation = ?', $abbreviation);

         if (!is_null($presence)) {
             $select->where('d.presence = ?', (int) $presence);
         }

         try {
             $rowset = $select->query()->fetchAll();
             $response->setRowset($rowset);
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
     * Fetch documents by documents types abbreviation and entity
     *
     * @todo move to document type
     *
     * @param string $abbreviation      The document abbreviation
     * @return OSDN_Response
     */
    public function fetchAllByAbbreviationEntity($abbreviation, $entityId, $entityTypeId = null, $presence = null)
    {
        $response = new OSDN_Response();

        if (empty($entityTypeId)) {
            $entityTypeId = $this->_entityTypeId;
        }

        $adapter = $this->_docTypes->getAdapter();
        $prefix = $this->_docTypes->getPrefix();
        $select = $adapter->select()
            ->from(array('dt' => $prefix . 'documents_types'))
            ->join(
                array('d' => $prefix . 'documents'),
                'dt.id = d.document_type_id'
            )
            ->where('dt.abbreviation = ?', $abbreviation)
            ->where('d.entitytype_id = ?', $entityTypeId)
            ->where('d.entity_id = ?', $entityId);

        if (!is_null($presence)) {
             $select->where('d.presence = ?', (int) $presence);
        }

        try {
            $rowset = $select->query()->fetchAll();
            $response->setRowset($rowset);
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
     * Fetch documents by documents types abbreviation and entity
     *
     * @todo move to document type
     *
     * @param string $abbreviation      The document abbreviation
     * @return OSDN_Response
     */
    public function fetchCountByAbbreviationEntity($abbreviation, $entityId, $entityTypeId = null, $presence = null)
    {
        $response = new OSDN_Response();

        if (empty($entityTypeId)) {
            $entityTypeId = $this->_entityTypeId;
        }

        $adapter = $this->_docTypes->getAdapter();
        $prefix = $this->_docTypes->getPrefix();
        $select = $adapter->select()
            ->from(array('dt' => $prefix . 'documents_types'), new Zend_Db_Expr('COUNT(*)'))
            ->join(
                array('d' => $prefix . 'documents'),
                'dt.id = d.document_type_id',
                array()
            )
            ->where('dt.abbreviation = ?', $abbreviation)
            ->where('d.entitytype_id = ?', $entityTypeId)
            ->where('d.entity_id = ?', $entityId);

        if (!is_null($presence)) {
            $select->where('d.presence = ?', (int) $presence);
        }

         try {
             $count = $select->query()->fetchColumn();
             $response->count = $count;
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
     * Fetch documents by documents types id and entity id
     *
     * @todo move to document type
     *
     * @param string $abbreviation      The document abbreviation
     * @return OSDN_Response
     */
    public function fetchAllByIdAndEntityId($documentTypeId, $entityId, $entityTypeId = null, $presence = null)
    {
        $response = new OSDN_Response();

        if (empty($entityTypeId)) {
            $entityTypeId = $this->_entityTypeId;
        }

        $adapter = $this->_docTypes->getAdapter();
        $prefix = $this->_docTypes->getPrefix();
        $select = $adapter->select()
            ->from(array('dt' => $prefix . 'documents_types'))
            ->join(
                array('d' => $prefix . 'documents'),
                'dt.id = d.document_type_id'
            )
            ->where('dt.id = ?', $documentTypeId)
            ->where('d.entitytype_id = ?', $entityTypeId)
            ->where('d.entity_id = ?', $entityId);

        if (!is_null($presence)) {
            $select->where('d.presence = ?', (int) $presence);
        }

        try {
            $response->setRowset($select->query()->fetchAll());
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
     * Fetch documents by documents types id and entity id
     *
     * @todo move to document type
     *
     * @param string $abbreviation      The document abbreviation
     * @return OSDN_Response
     */
    public function fetchCountByIdAndEntityId($documentTypeId, $entityId, $entityTypeId = null, $presence = null)
    {
        $response = new OSDN_Response();

        if (empty($entityTypeId)) {
            $entityTypeId = $this->_entityTypeId;
        }

        $adapter = $this->_docTypes->getAdapter();
        $prefix = $this->_docTypes->getPrefix();
        $select = $adapter->select()
            ->from(array('dt' => $prefix . 'documents_types'), new Zend_Db_Expr('COUNT(*)'))
            ->join(
                array('d' => $prefix . 'documents'),
                'dt.id = d.document_type_id',
                array()
            )
            ->where('dt.id = ?', $documentTypeId)
            ->where('d.entitytype_id = ?', $entityTypeId)
            ->where('d.entity_id = ?', $entityId);

        if (!is_null($presence)) {
            $select->where('d.presence = ?', (int) $presence);
        }

        try {
            $response->count = $select->query()->fetchColumn();
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