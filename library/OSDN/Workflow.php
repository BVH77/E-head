<?php

/**
 * The OSDN_Workflow class is a class for make easily communication
 * interface and API parts
 *
 *
 * @category OSDN
 * @package OSDN
 */
class OSDN_Workflow extends ezcWorkflow
{
    public function __get($propertyName)
    {
        $result = null;
        
        switch ( $propertyName ) {
            case 'steps':
            case 'title':
                $result = $this->properties[$propertyName];
                break;
                
            case 'plugins':
                $result = array();
                if (array_key_exists('plugins', $this->properties)) {
                    if (is_array($this->properties[$propertyName])) {
                        $result = $this->properties[$propertyName];
                    }
                }
                break;
                
            default:
               $result = parent::__get($propertyName);
                
        }
        
        return $result;
    }
    
    public function __set($propertyName, $val)
    {
        $result = null;
        
        switch ( $propertyName ) {
            case 'steps':
                if ( !( is_array( $val ) ) )
                {
                    throw new ezcBaseValueException( $propertyName, $val, 'array' );
                }
                $this->properties[$propertyName] = $val;
                break;
            case 'title':
                if ( !( is_string( $val ) ) )
                {
                    throw new ezcBaseValueException( $propertyName, $val, 'string' );
                }

                $this->properties[$propertyName] = $val;
                break;
                
            case 'plugins':
                
                if (!is_array($val)) {
                    throw new ezcBaseValueException($propertyName, $val, 'array');
                }
                
                $this->properties['plugins'] = $val;
                break;
                
            default:
               $result = parent::__set($propertyName, $val);
        }
        
        return $result;
    }
    
    public function __isset($key)
    {
        $result = false;
        
        switch ($key) {
            case 'steps':
            case 'title':
            case 'plugins':
                $result = true;
                break;
                
            default:
                $result = parent::__isset($key);
        }
        
        return $result;
    }
    
    
}