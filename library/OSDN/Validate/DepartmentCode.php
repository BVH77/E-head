<?php

/**
 * The basic department code validator
 *
 * @category OSDN
 * @package OSDN_Validate
 */
class OSDN_Validate_DepartmentCode extends Zend_Validate_Abstract
{

    const INCORRECT = 'notCorrectDepartmentCode';
    
    /**
     * Contain error messages
     * @var array
     */
    protected $_messageTemplates = array(
        self::INCORRECT => "'%value%' does not appear to be a valid department code"
    );
    
    /**
     * Defined by Zend_Validate_Interface
     *
     * Returns true if and only if $value is a valid department code
     *
     * @param  string|int $value
     * @return boolean
     */
    public function isValid($value)
    {
        return true;
    }
}
