<?php

/**
 * Storage table for comments
 *
 * @category OSDN
 * @package OSDN_Comments
 * @subpackage OSDN_Comments_Table
 */
class OSDN_Comments_Table_Comments extends OSDN_Db_Table_Abstract 
{
    /**
     * Table name
     *
     * @var string
     */
    protected $_name = 'comments';
    
    protected $_dependentTables = array('OSDN_Comments_Table_Types');
    
    /**
     * Insert new comment
     *
     * @param array $data
     * @return int|boolean  last_inserted_id | false if exception
     */
    public function insert(array $data) 
    {
        $data['createddatetime'] = new Zend_Db_Expr('NOW()');
        if (empty($data['creator_account_id'])) {
            $data['creator_account_id'] = new Zend_Db_Expr('NULL');
        }
        
        return parent::insert($data);
    }
    
    /**
     * Update comment
     *
     * @param array $data
     * @param string $where
     * @return int|false    Count of affected rows | false if exception
     */
    public function update(array $data, $where)
    {
        $data['modifieddatetime'] = new Zend_Db_Expr('NOW()');
        return parent::update($data, $where);
    }
}
