<?php

/**
 * Storage table for Accounts Entity
 *
 * @version $Id $
 * @category OSDN
 * @package OSDN_Accounts_Entity
 * @subpackage OSDN_Accounts_Entity_Table
 */
class OSDN_Accounts_Entity_Table_Entity extends OSDN_Db_Table_Abstract
{
    /**
     * Table name
     *
     * @var string
     */
    protected $_name = 'accounts_entity';

    /**
     * return password for set account id
     *
     * @param  int $id
     * @return string
     */
    public function fetchPassword($id)
    {
        $select = $this->_db->select()
            ->from($this->_name, array('password'))
            ->where("id = ? ", $id);
        return $select->query()->fetchColumn(0);
    }
}