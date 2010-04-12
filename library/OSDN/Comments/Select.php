<?php

/**
 * Class for retrieving comments by different parameters.
 *
 * @category OSDN
 * @package OSDN_Comments
 * @subpackage OSDN_Comments_Select
 */
class OSDN_Comments_Select
{
    /**
     * @var OSDN_Comments_Table_Comments
     */
    protected $_tableComments = null;
    
    /**
     * @var string
     */
    protected $_tableAccounts;
    
    /**
     * Select constructor
     *
     */
    public function __construct()
    {
        $this->_tableComments       = new OSDN_Comments_Table_Comments();
        $this->_tableAccounts       = OSDN_Db_Table_Abstract::getDefaultPrefix() . 'accounts';
    }
    
    protected function _fetchAll(array $whereClause = array(), array $params = array())
    {
        $response = new OSDN_Response();
        $select = $this->_tableComments->getAdapter()->select();
        $select->from(
            array('comments' => $this->_tableComments->getTableName()),
            array('comment_id' => 'id', '*')
        )->joinLeft(
            array('creator_accounts' => $this->_tableAccounts),
            'comments.creator_account_id = creator_accounts.id',
            array('creator_account_name' => 'name')
        )->joinLeft(
            array('modified_accounts' => $this->_tableAccounts),
            'comments.modified_account_id = modified_accounts.id',
            array('modified_account_name' => 'name')
        );
        
        foreach ($whereClause as $cond => $value) {
            if ($value instanceof Zend_Db_Expr) {
                $select->where($value);
                continue;
            }
            
            $select->where($cond, $value);
        }

        $plugin = new OSDN_Db_Plugin_Select($this->_tableComments, $select);
        $plugin->parse($params);
        
        $commentary = new OSDN_Comments_Commentary();
        try {
            $query = $select->query();
            $rows = array();
            while($row = $query->fetch()) {
                $commentaryResponse = $commentary->getRepliesCount($row['id']);
                if ($commentaryResponse->isSuccess()) {
                    $row['replies_count'] = $commentaryResponse->count;
                }
                
                $row['notificated_owner'] = $row['notificated_account_id'] == OSDN_Accounts_Prototype::getId();
                $rows[] = $row;
            }
            $status = OSDN_Comments_Status::OK;
        } catch (Exception $e) {
            if (OSDN_DEBUG) {
                throw $e;
            }
            $status = OSDN_Comments_Status::DATABASE_ERROR;
        }
        
        $response->rows = $rows;
        $response->totalCount = $plugin->getTotalCount();
        $response->addStatus(new OSDN_Comments_Status($status));
        return $response;
    }
    
    /**
     * Fetch commentary for entity type by entity id
     *
     * @param int $entityTypeId
     * @param int $entityId
     * @param array $params
     *
     * @return OSDN_Response
     */
    public function fetchAll($entityTypeId, $entityId, array $params = array())
    {
        $validate = new OSDN_Validate_Id();
        if (!$validate->isValid($entityTypeId) || !$validate->isValid($entityId)) {
            $response = new OSDN_Response();
            $response->addStatus(new OSDN_Comments_Status(OSDN_Comments_Status::INPUT_PARAMS_INCORRECT));
            return $response;
        }
        
        return $this->_fetchAll(array(
            'comments.entitytype_id = ?' => $entityTypeId,
            'comments.entity_id = ?' => $entityId,
            new Zend_Db_Expr('comments.parent_id IS NULL')
        ), $params);
    }
    
    /**
     * Fetch all commentaries by entity type ids
     *
     * @param array $entityTypesIds     The entity types ids
     * @param array $params
     * @return OSDN_Response
     */
    public function fetchAllByEntityTypes(array $entityTypesIds, array $params = array())
    {
        if (empty($entityTypesIds)) {
            $response = new OSDN_Response();
            $response->addStatus(new OSDN_Comments_Status(OSDN_Comments_Status::INPUT_PARAMS_INCORRECT));
            return $response;
        }
        
        $validate = new OSDN_Validate_Id();
        foreach($entityTypesIds as $entityTypeId) {
            if (!$validate->isValid($entityTypeId)) {
                $response = new OSDN_Response();
                $response->addStatus(new OSDN_Comments_Status(OSDN_Comments_Status::INPUT_PARAMS_INCORRECT));
                return $response;
            }
        }
        
        return $this->_fetchAll(array(
            'comments.entitytype_id IN (?)' => $entityTypesIds,
            new Zend_Db_Expr('comments.parent_id IS NULL')
        ), $params);
    }
    
    public function fetchReplies($entityTypeId, $entityId, $commentaryId, array $params = array())
    {
        $validate = new OSDN_Validate_Id();
        if (
            !$validate->isValid($entityTypeId)
            || !$validate->isValid($entityId)
            || !$validate->isValid($commentaryId))
        {
            $response = new OSDN_Response();
            $response->addStatus(new OSDN_Comments_Status(OSDN_Comments_Status::INPUT_PARAMS_INCORRECT));
            return $response;
        }
        
        return $this->_fetchAll(array(
            'comments.entitytype_id = ?' => $entityTypeId,
            'comments.entity_id = ?' => $entityId,
            'comments.parent_id = ?' => $commentaryId
        ), $params);
    }
    
    /**
     * Enter description here...
     *
     * @param unknown_type $entityTypeId
     * @param unknown_type $entityId
     * @param unknown_type $commentaryId
     * @return OSDN_Response
     */
    public function fetchCommentaryByEntity($entityTypeId, $entityId, $commentaryId)
    {
        $validate = new OSDN_Validate_Id();
        if (
            !$validate->isValid($entityTypeId)
            || !$validate->isValid($entityId)
            || !$validate->isValid($commentaryId))
        {
            $response = new OSDN_Response();
            $response->addStatus(new OSDN_Comments_Status(OSDN_Comments_Status::INPUT_PARAMS_INCORRECT));
            return $response;
        }
        
        $response = $this->_fetchAll(array(
            'comments.entitytype_id = ?' => $entityTypeId,
            'comments.entity_id = ?' => $entityId,
            'comments.id = ?' => $commentaryId
        ));
        
        if ($response->isSuccess()) {
            $rows = $response->rows;
            $response->commentary = is_array($rows) ? current($rows) : array();
            unset($response->getDataCollection()->rows);
        }
        return $response;
    }
    
    /**
     * Fetch history (title/text pairs)
     *
     * @param int $entityTypeId     The entity type id
     * @param int $entityId         The entity id
     * @param int $parentId         The parent id
     *
     * @return OSDN_Response
     */
    public function fetchHistory($entityTypeId, $entityId, $parentId)
    {
        $response = new OSDN_Response();
        $validate = new OSDN_Validate_Id();
        
        if (
            !$validate->isValid($entityTypeId)
            || !$validate->isValid($entityId)
            || !$validate->isValid($parentId))
        {
            $response = new OSDN_Response();
            $response->addStatus(new OSDN_Comments_Status(OSDN_Comments_Status::INPUT_PARAMS_INCORRECT));
            return $response;
        }
        
        $history = array();
        $select = $this->_tableComments->getAdapter()->select()
            ->from(array('comments' => $this->_tableComments->getTableName()))
            ->joinLeft(
                array('accounts' => $this->_tableAccounts),
                'comments.notificated_account_id = accounts.id',
                array('email', 'name')
            )->join(
                array('creator_accounts' => $this->_tableAccounts),
                'comments.creator_account_id = creator_accounts.id',
                array('creator_account_name' => 'name')
            );
            
        $id = $parentId;
        
        do {
            $select->reset(Zend_Db_Select::WHERE);
            $select->where('comments.entitytype_id = ?', $entityTypeId);
            $select->where('comments.entity_id = ?', $entityId);
            $select->where('comments.id = ?', $id);
            unset($id); // on every iteration different id
            
            try {
                $row = $select->query()->fetch();
                if (!empty($row)) {
                    if (isset($row['parent_id'])) {
                        $id = $row['parent_id'];
                    }
                    $history[] = $row;
                }
                
            } catch (Exception $e) {
                if (OSDN_DEBUG) {
                    throw $e;
                }
                break;
            }
            
        } while (isset($id) && (int) $id);
        
        $response->history = array_reverse($history);
        $response->addStatus(new OSDN_Comments_Status(OSDN_Comments_Status::OK));
        return $response;
    }

    /**
     * Fetch count comments by entity and entity type
     *
     * @param int $entityTypeId     The entity type id
     * @param int $entityId         The entity id
     * @return OSDN_Response
     * <code> {
     *     'count' => int
     *     'unread'=> int       // the unread calculated only for related account
     * }
     * </code
     */
    public function fetchCount($entityTypeId, $entityId)
    {
        $response = new OSDN_Response();
        $validate = new OSDN_Validate_Id();
        
        if (
            !$validate->isValid($entityTypeId)
            || !$validate->isValid($entityId))
        {
            $response = new OSDN_Response();
            $response->addStatus(new OSDN_Comments_Status(OSDN_Comments_Status::INPUT_PARAMS_INCORRECT));
            return $response;
        }

        $unreadClause = $this->_tableComments->getAdapter()->quoteInto(
            'SUM(IF(reaction_received IS NULL AND notificated_account_id = ?, 1, 0))',
            OSDN_Accounts_Prototype::getId()
        );
        
        $select = $this->_tableComments->select()
            ->from(
                array('comments' => $this->_tableComments->getTableName()),
                array(
                    'count'   => new Zend_Db_Expr('COUNT(*)'),
                    'unread'  => new Zend_Db_Expr($unreadClause)
                )
            )
            ->where('entitytype_id = ?', $entityTypeId)
            ->where('entity_id = ?', $entityId);
        
        try {
            $query = $select->query();
            $row = $query->fetchObject();

            $response->count = $row->count;
            $response->unread = $row->unread;
            $status = OSDN_Comments_Status::OK;
        } catch (Exception $e) {
            if (OSDN_DEBUG) {
                throw $e;
            }
            $status = OSDN_Comments_Status::DATABASE_ERROR;
        }
        
        $response->addStatus(new OSDN_Comments_Status($status));
        return $response;
    }
}
