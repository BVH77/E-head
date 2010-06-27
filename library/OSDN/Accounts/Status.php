<?php

/**
 * Accounts status constant
 *
 * @category OSDN
 * @package OSDN_Accounts
 */
class OSDN_Accounts_Status extends OSDN_Response_Status_Storage_Abstract
{
    /**
     * Module code
     *
     * @var int
     */
    protected $_moduleCode = 15;
    
    /**
     * Module name
     *
     * @var int
     */
    protected $_moduleName = 'Accounts';
    
    const ACCOUNT_IS_ALREADY_EXISTS = -100;
    
    const ACCOUNT_IS_PROTECTED = -101;
    
    const WRONG_PASSWORD = -102;
    
    const UNCORRECT_NEW_PASSWORD = -103;
    const PASSWORD_HAS_BE_SAME_IN_BOSS_FIELDS = -105;
    
    const ACCOUNT_IS_NOT_EXISTS = -104;
    
    const EMAIL_DOES_NOT_EXIST = -106;
    
    /**
     * Description storage
     *
     * @var array
     */
    protected $_storage = array(
        self::ACCOUNT_IS_ALREADY_EXISTS => 'Account exists already.',
        self::ACCOUNT_IS_PROTECTED      => 'Account is protected.',
        self::WRONG_PASSWORD            => 'Wrong password',
        self::UNCORRECT_NEW_PASSWORD    => 'Incorrect new password',
        self::PASSWORD_HAS_BE_SAME_IN_BOSS_FIELDS => 'Password has to be the same in both fields',
        self::ACCOUNT_IS_NOT_EXISTS     => 'Account does not exist.',
        self::EMAIL_DOES_NOT_EXIST      => 'Email does not exist'
    );
}
