<?php

/**
 * Write xml config
 *
 * @deprecated 
 * 
 * @category		OSDN
 * @package		OSDN_Config_Writer
 * @version		$Id: Xml.php 9870 2009-06-26 05:28:51Z yaroslav $
 */
class OSDN_Config_Writer_Xml extends Zend_Config_Writer_Xml
{
    /**
     * Add a branch to an XML object recursively
     *
     * @deprecated 
     * 
     * @param  Zend_Config      $config
     * @param  SimpleXMLElement $xml
     * @return void
     * 
     */
    protected function _addBranch(Zend_Config $config, SimpleXMLElement $xml)
    {
        foreach ($config as $key => $value) {
            if ($value instanceof Zend_Config) {
                
                if (is_null($value->get(0))) {
                    $child = $xml->addChild((string) $key);
                    $this->_addBranch($value, $child);
                    continue;
                }
                
                foreach($value as $v) {
                    $xml->addChild((string) $key, $v);
                }
                
            } else {
                $xml->addChild($key, (string) $value);
            }
        }
    }
}