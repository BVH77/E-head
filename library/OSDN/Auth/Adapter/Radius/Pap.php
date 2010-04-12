<?php

/**
 * Class for authenticating using PAP (Plaintext)
 * 
 * @category OSDN
 * @package OSDN_Auth_Radius 
 */
class OSDN_Auth_Adapter_Radius_Pap extends OSDN_Auth_Adapter_Radius_Abstract  
{
    /**
	 * Performs an authentication attempt
     *
     * @throws OSDN_Auth_Exception If authentication cannot be performed
     * @return Zend_Auth_Result
     */
	public function authenticate()
	{
		$this->initialize();
		$result = $this->send();
		$this->close();
        if (true === $result) {
            $code = Zend_Auth_Result::SUCCESS; 
        } else {
            $code = Zend_Auth_Result::FAILURE_UNCATEGORIZED;
        }
		
        $identity = '1';
		return new Zend_Auth_Result($code, $identity);
	}
	
    /**
     * Creates a RADIUS resource
     *
     * Creates a RADIUS resource for authentication. This should be the first
     * call before you make any other things with the library.
     *
     * @throws OSDN_Auth_Adapter_Radius_Exception
     * @return OSDN_Auth_Adapter_Radius_Pap
     */
    public function open() 
    {
        if (!$resource = radius_auth_open()) {
            throw new OSDN_Auth_Adapter_Radius_Exception('Connection failed.' . $this->getError());
        }
        
        $this->_resource = $resource;
        return $this;
    }
    
    /**
     * Creates an authentication request 
     *
     * Creates an authentication request.
     * You MUST call this method before you can put any attribute
     *
     * @throws OSDN_Auth_Adapter_Radius_Exception
     * @return OSDN_Auth_Adapter_Radius_Pap
     */
    protected function _createRequest()
    {
        if (!radius_create_request($this->_resource, RADIUS_ACCESS_REQUEST)) {
            throw new OSDN_Auth_Adapter_Radius_Exception('Request refused.' . $this->getError());
        }
        
        return $this;
    }

    /**
     * Put authentication specific attributes 
     *
     * @return 
     */
    protected function _putAuthAttributes()
    {
        if (isset($this->_username)) {
            $this->_putAttribute(RADIUS_USER_NAME, $this->_username);        
        }
        
        if (isset($this->_password)) {
            $this->_putAttribute(RADIUS_USER_PASSWORD, $this->_password);
        }
        return $this;
    }
}
