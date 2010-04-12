<?php

/**
 * The basic secure id validator
 *
 * @category OSDN
 * @package OSDN_Validate
 */
class OSDN_Validate_SecureId extends Zend_Validate_Abstract
{

    const INCORRECT = 'notCorrectSecureId';
    
    /**
     * Contain error messages
     * @var array
     */
    protected $_messageTemplates = array(
        self::INCORRECT => "'%value%' does not appear to be an secure id"
    );
    
    /**
     * Format of secure id
     *
     * @var boolean
     */
    protected $_format = 'md5';
    
    /**
     * OSDN_Validate_SecureId constructor
     *
     * @param boolean $format        format of secure id
     *      available next values :
     *          md5
     */
    public function __construct($format = null)
    {
        if (isset($format)) {
            $this->_format = $format; 
        }
    }

    /**
     * Defined by Zend_Validate_Interface
     *
     * Returns true if and only if $value is a valid secure id
     *
     * @param  string $value
     * @return boolean
     */
    public function isValid($value)
    {
        $regex = new Zend_Validate_Regex('/^[a-f0-9]{32}$/');
        if (!$regex->isValid($value)) {
            $this->_error(null, $value);
            return false;
        }

        return true;
    }
}
