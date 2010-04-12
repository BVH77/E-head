<?php

/**
 * System response status storage
 *
 * @category OSDN
 * @package OSDN_Response_Status
 */
class OSDN_Response_Status_Storage extends OSDN_Response_Status_Storage_Abstract
{
    /**
     * Module code
     *
     * @var int
     */
    protected $_moduleCode = OSDN_EntityTypes::SYSTEM;
    
    /**
     * Module name
     *
     * @var int
     */
    protected $_moduleName = 'System';
    
    public function __construct($status, $field = null)
    {
        if (is_int($status)) {
            parent::__construct($status, $field);
        } else {
            $this->_msg = $status;
            parent::__construct(self::SPECIAL_ERROR);
        }
    }
}
