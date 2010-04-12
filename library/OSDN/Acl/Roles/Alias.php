<?php

/**
 * Define the roles alias
 * This alias are using when we want to recognize the role
 * @category		OSDN
 * @package		OSDN_Acl
 * @version		$Id: Alias.php 9806 2009-06-24 12:48:53Z uerter $
 */
class OSDN_Acl_Roles_Alias extends OSDN_Entity_Abstract
{
    const STUDENT = '5af2d344-6f3b-102c-a17c-0015f2204b84';
    
    const TEACHER = '6cc9dcac-6f3b-102c-a17c-0015f2204b84';
    
    const ADMINISTRATION_MANAGER = '2b00a868-b208-102c-acd2-0015f2204b84';
    
    /**
     * Instance container
     *
     * @var OSDN_Acl_Roles_Alias
     */
    protected static $_instance;
    
    /**
     * Create the instance of alias object
     *
     * @return OSDN_Acl_Roles_Alias
     */
    public static function getInstance()
    {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }
        
        return self::$_instance;
    }
}