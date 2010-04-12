<?php

/**
 * The basic zipcode validator
 *
 * @category OSDN
 * @package OSDN_Validate
 */
class OSDN_Validate_Zipcode extends Zend_Validate_Abstract
{

    const INCORRECT = 'notCorrectZipcodeId';
    
    /**
     * Contain error messages
     * @var array
     */
    protected $_messageTemplates = array(
        self::INCORRECT => "'%value%' does not appear to be a zipcode"
    );
    
    /**
     * Defined by Zend_Validate_Interface
     *
     * Returns true if and only if $value is a valid secure id
     *
     * @param  string|int $value
     * @return boolean
     */
    public function isValid($value)
    {
        return true;
    }
}
