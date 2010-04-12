<?php

/**
 * The basic phonenumber validator
 *
 * @category OSDN
 * @package OSDN_Validate
 */
class OSDN_Validate_PhoneNumber extends Zend_Validate_Abstract
{

    const INCORRECT = 'notCorrectPhoneNumberId';
    
    /**
     * Contain error messages
     * @var array
     */
    protected $_messageTemplates = array(
        self::INCORRECT => "'%value%' does not appear to be a phone number"
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
        $regex = new Zend_Validate_Regex('/^\+?[0-9-]{2,14}$/');
        if (!$regex->isValid($value)) {
            $this->_error(null, $value);
            return false;
        }

        return true;
    }
}
