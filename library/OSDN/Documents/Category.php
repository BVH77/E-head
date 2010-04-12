<?php
/**
 * OSDN_Documents_Category
 *
 * @category CA
 * @package CA
 */

class OSDN_Documents_Category
{
    /**
     * The categories table
     *
     * @var OSDN_Documents_Table_Categories
     */
    protected $_tableCategory;
    
    /**
     * The entity type of categories
     *
     * @var integer
     */
    protected $_entityTypeId = null;
    
     /**
     * construct function of the class
     *
     */
    public function __construct($entityTypeId)
    {
        if (empty($entityTypeId)) {
            throw 'Entity type is missed!';
        }
        $this->_entityTypeId = $entityTypeId;
        $this->_tableCategory = new OSDN_Documents_Table_Categories();
    }
    
    /**
     * change order
     *
     * @param array $params
     * @return OSDN_Response
     */
    public function changeOrder($category_id, $order) {
        $response = new OSDN_Response();
        $validate = new OSDN_Validate_Id();
        if (!$validate->isValid($category_id)) {
            $response->addStatus(new OSDN_Documents_Status(
                OSDN_Documents_Status::INPUT_PARAMS_INCORRECT, 'category_id'));
            return $response;
        }
        
        $this->_tableCategory->updateByPk(array('order' => $order*2 + 1), $category_id);
        $this->_reorderCategories();
        return $response->addStatus(new OSDN_Documents_Status(OSDN_Documents_Status::OK));
    }
    
    /**
     * Add new document category
     *
     * @param array $params
     * @return OSDN_Response
     */
    public function add(array $params)
    {
        $params['entitytype_id'] = $this->_entityTypeId;
        $f = new OSDN_Filter_Input(array(
            '*'             => 'StringTrim'
        ), array(
            'name'          => array(array('StringLength', 0, 140)),
            'entitytype_id' => array('Int'),
            'order'         => array('Int')
        ), $params);
        
        $response = new OSDN_Response();
        $response->addInputStatus($f);
        if ($response->hasNotSuccess()) {
            return $response;
        }
        
        $id = $this->_tableCategory->insert($f->getData());
        if (false !== $id) {
            $status = OSDN_Documents_Status::OK;
            $response->id = $id;
        } else {
            $status = OSDN_Documents_Status::DATABASE_ERROR;
        }
        $response->addStatus(new OSDN_Documents_Status($status));
        $this->_reorderCategories();
        return $response;
    }
    
    /**
     * Update document category
     *
     * @param int $id           The category id
     * @param array $params     Updated params
     * @return OSDN_Response
     */
    public function update($id, array $params)
    {
        $params['id'] = $id;
        $f = new OSDN_Filter_Input(array(
            '*'             => 'StringTrim'
        ), array(
            'name'          => array(array('StringLength', 0, 140)),
            'entitytype_id' => array('Int'),
            'order'         => array('Int')
        ), $params);
        
        $response = new OSDN_Response();
        $response->addInputStatus($f);
        if ($response->hasNotSuccess()) {
            return $response;
        }
        $affectedRows = $this->_tableCategory->updateByPk($f->getData(), $id);
        $response->addStatus(new OSDN_Documents_Status(
            OSDN_Documents_Status::retrieveAffectedRowStatus($affectedRows)));
        return $response;
    }
    
    /**
     * Delete the document category by Pk
     *
     * @param int $id   The category id
     * @return OSDN_Response
     */
    public function delete($id)
    {
        $response = new OSDN_Response();
        $validate = new OSDN_Validate_Id();
        if (!$validate->isValid($id)) {
            return $response->addStatus(new OSDN_Documents_Status(
                OSDN_Documents_Status::INPUT_PARAMS_INCORRECT, 'id'));
        }
        try {
            $affectedRows = $this->_tableCategory->deleteByPk($id);
            $status = OSDN_Documents_Status::retrieveAffectedRowStatus($affectedRows);
        } catch (Exception $e) {
            $status = OSDN_Documents_Status::FAILURE;
        }
        $response->addStatus(new OSDN_Documents_Status($status));
        return $response;
    }
    
    /**
     * get category information by id
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
        try {
            $row = $this->_tableCategory->findOne($id);
            if ($row) {
                $response->data = $row->toArray();
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
     * Fetch all categories
     *
     * @param array $params         conditions for select
     *
     * @return OSDN_Response
     */
    public function fetchAll(array $params = array())
    {
        $response = new OSDN_Response();
        $select = $this->_tableCategory->getAdapter()->select()
            ->from($this->_tableCategory->getTableName())
            ->where('entitytype_id = ?', $this->_entityTypeId)
            ->order('order ASC');
        
        $plugin = new OSDN_Db_Plugin_Select(null, $select);
        $select = $plugin->parse($params);
        
        $data = $select->query()->fetchAll();
        $response->data = $data;
        $response->addStatus(new OSDN_Documents_Status(OSDN_Documents_Status::OK));
        return $response;
    }
    
    protected function _reorderCategories() {
        $res = $this->fetchAll();
        if ($res->isError()) {
            return false;
        }
        $order = 0;
        foreach ($res->data as $row) {
            $order+=2;
            $this->_tableCategory->updateByPk(array('order' => $order), $row['id']);
        }
        return true;
    }  
}