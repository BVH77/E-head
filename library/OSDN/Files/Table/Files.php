<?php

/**
 * Files table object
 * 
 * @category OSDN
 * @package OSDN_Files
 */
class OSDN_Files_Table_Files extends OSDN_Db_Table_Abstract 
{
    /**
     * Table name
     *
     * @var string
     */
    protected $_name = 'files';
    
    /**
     * Insert new record
     *
     * @param array $data
     * @return int|boolean  last_inserted_id | false if exception
     */
    public function insert(array $data) 
    {
        $data['created'] = new Zend_Db_Expr('NOW()');
        if (empty($data['creator_user_id'])) {
        	$data['creator_user_id'] = OSDN_Accounts_Prototype::getId();
        }
        
        $id = parent::insert($data);
        return $id;
    }
    
    /**
     * Update
     *
     * @param int $id
     * @param array $data
     * 
     * @see parent::update()
     */
    public function update(array $data, $where)
    {
        $data['modified'] = new Zend_Db_Expr('NOW()');
        if (empty($data['modified_user_id'])) {
        	$data['modified_user_id'] = OSDN_Accounts_Prototype::getId();
        }
        
        return parent::update($data, $where);
    }
}