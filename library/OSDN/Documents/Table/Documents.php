<?php

/**
 * Documents table object
 *
 * @category OSDN
 * @package OSDN_Documents
 */
class OSDN_Documents_Table_Documents extends OSDN_Db_Table_Abstract
{
    
    protected $_nullableFields = array('expired_date');
    /**
     * Table name
     *
     * @var string
     */
    protected $_name = 'documents';
    
    /**
     * Insert new record
     *
     * @param array $data
     * @return int|boolean  last_inserted_id | false if exception
     */
    public function insert(array $data)
    {
        $data['created'] = new Zend_Db_Expr('NOW()');
        $data['creator_user_id'] = OSDN_Accounts_Prototype::getId();
        return parent::insert($data);
    }
    
    /**
     * Update records by primary key
     *
     * @param array $data  Column-value pairs.
     * <code>array(
     *      'count'  => 1,
     *      'date'   => new Zend_Db_Expr('NOW()')
     * )</code>
     * @param mixed $pkValue
     * $return int  number of affected rows
     */
    public function updateByPk(array $data, $id) {
        $row = $this->findOne($id);
        if ($row) {
            $row = $row->toArray();
        }
        if ($row['presence'] == 0 ) {
            if (empty($data['received_date'])) {
                $data['received_date'] = new Zend_Db_Expr('Now()');
            }
            $data['presence'] = 1;
        }
        return parent::updateByPk($data, $id);
    }
    
    
}