<?php

/**
 * The basic banknumber validator
 *
 * @category OSDN
 * @package OSDN_Validate
 */
class OSDN_Validate_BankNumber extends Zend_Validate_Abstract
{
    const INCORRECT = 'notCorrectBankNumberId';
    
    /**
     * Contain error messages
     * @var array
     */
    protected $_messageTemplates = array(
        self::INCORRECT => "'%value%' does not appear to be a bank number"
    );
    
    /**
     * Defined by Zend_Validate_Interface
     *
     * Returns true if and only if $value is a valid bank number
     *
     * @param  string|int $value
     * @return boolean
     */
    public function isValid($value)
    {
        $stringLength = new Zend_Validate_StringLength(0 ,45);
        if (!$stringLength->isValid($value)) {
            $this->_error(null, $value);
            return false;
        }
        return true;
    }
}
