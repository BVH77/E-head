<?php

class PMS_Expenses_Table extends OSDN_Db_Table_Abstract
{
    /**
     * Table name
     * @var string
     */
    protected $_name = 'expenses';

    protected $_nullableFields = array('order_id', 'category', 'entry', 'comment');
}