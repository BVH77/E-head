<?php

/**
 * Radius authorization maker class
 *
 * @category OSDN
 * @package OSDN_Auth_Adapter
 */
class OSDN_Auth_Adapter_Radius
{
    /**
     * Create instance of radius adapter
     *
     * @param string $adapter               The adapter name
     * @param array|Zend_Config $config     The adapter configuration
     *
     * @throws OSDN_Auth_Exception
     * @return OSDN_Auth_Adapter_Radius_Abstract
     */
	public static function factory($adapter, $config = array())
	{
	    if ($config instanceof Zend_Config) {
	        $config = $config->toArray();
	    }
	    
	    if (empty($config) || !is_array($config)) {
	        throw new OSDN_Auth_Exception('The options is not defined.');
	    }
	    
	    if (!is_string($adapter) || empty($adapter)) {
	        throw new OSDN_Auth_Exception('Adapter name must be specified in a string');
	    }
	    
	    $adapterCls = 'OSDN_Auth_Adapter_Radius_' . ucfirst(strtolower($adapter));
	    Zend_Loader::loadClass($adapterCls);
        
        $authAdapter = new $adapterCls;
        $authAdapter->setOptions($config);
        return $authAdapter;
	}
}