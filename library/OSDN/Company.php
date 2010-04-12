<?php

/**
 * Company manager
 *
 * @category OSDN
 * @package OSDN_Company
 */
class OSDN_Company
{
	/**
	 * Retrieve the company name
	 * 
	 * @return string
	 * @throws OSDN_Exception
	 */
	public static function getName()
	{
		if (!Zend_Registry::isRegistered('config')) {
            throw new OSDN_Exception('The config is missing');
            return;
        }
        return Zend_Registry::get('config')->company->name;
	}
	
	/**
	 * Retrieve the company id
	 * 
	 * @return int
	 * @throws OSDN_Exception
	 */
	public static function getId()
	{
		if (!Zend_Registry::isRegistered('config')) {
			throw new OSDN_Exception('The config is missing');
			return;
		}
		return (int) Zend_Registry::get('config')->company->id;
	}
}