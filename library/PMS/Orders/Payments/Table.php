<?php

class PMS_Orders_Payments_Table extends OSDN_Db_Table_Abstract
{
    /**
     * Table name
     * @var string
     */
    protected $_name = 'orders_payments';
    
    protected $_nullableFields = array('date_pay');
}