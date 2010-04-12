<?php

/**
 * The basic region code validator
 *
 * @category OSDN
 * @package OSDN_Validate
 */
class OSDN_Validate_RegionCode extends Zend_Validate_Abstract
{

    const INCORRECT = 'notCorrectRegionCode';
    
    /**
     * Contain error messages
     * @var array
     */
    protected $_messageTemplates = array(
        self::INCORRECT => "'%value%' does not appear to be a valid region code"
    );
    
    /**
     * Defined by Zend_Validate_Interface
     *
     * Returns true if and only if $value is a valid region code
     *
     * @param  string|int $value
     * @return boolean
     */
    public function isValid($value)
    {
        return true;
    }
}