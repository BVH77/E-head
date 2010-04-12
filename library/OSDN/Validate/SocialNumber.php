<?php

/**
 * The basic social number validator
 *
 * @category OSDN
 * @package OSDN_Validate
 */
class OSDN_Validate_SocialNumber extends Zend_Validate_Abstract
{

    const INCORRECT = 'notCorrectSocialNumberId';

    const INCORRECT_REGEXP = 'notCorrectSocialNumberIdRegExp';

    /**
     * Contain error messages
     * @var array
     */
    protected $_messageTemplates = array(
        self::INCORRECT => "'%value%' does not appear to be a valid social number",
        self::INCORRECT_REGEXP => "'%value%' does not appear to be a valid social number"
    );

    /**
     * Defined by Zend_Validate_Interface
     *
     * Returns true if and only if $value is a valid social number
     *
     * @param  string|int $value
     * @return boolean
     */
    public function isValid($value)
    {
        $regex = new Zend_Validate_Regex('/^[0-9]{9}$/');
        if (!$regex->isValid($value)) {
            $this->_error(self::INCORRECT_REGEXP, $value);
            return false;
        }

        $v = (string)$value;
        $testssn = 0;
        for ($i = 0; $i < 8; $i++) {
            $testssn = $testssn + (intval($v[$i]) * (9 - $i));
        }
        $testssn = $testssn - intval($v[8]);

        if ($testssn % 11 === 0) {
        	return true;
        } else {
        	$this->_error(self::INCORRECT, $value);
            return false;
        }
    }
}
