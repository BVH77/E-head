<?php

/**
 * DocumentTypes table object
 * 
 * @category OSDN
 * @package OSDN_Documents
 */
class OSDN_Documents_Table_DocumentTypes extends OSDN_Db_Table_Abstract 
{
    protected $_nullableFields = array('category_id');
    /**
     * Table name
     *
     * @var string
     */
    protected $_name = 'documents_types';
}