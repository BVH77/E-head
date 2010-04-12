<?php

/**
 * Client implementation of RADIUS. This are wrapper classes for
 * the RADIUS PECL. 
 * Provides RADIUS Authentication (RFC2865) and RADIUS Accounting (RFC2866).
 *
 * @category OSDN
 * @package OSDN_Auth_Radius
 */
abstract class OSDN_Auth_Adapter_Radius_Abstract implements OSDN_Auth_Adapter_Radius_Interface
{
    /**
     * Resource.
     * @var  resource
     * @see  open(), close()
     */
    protected $_resource = null;
    
    /**
     * Username for authentication and accounting requests.
     * @var  string
     */
    protected $_username = null;
    
    /**
     * Password for plaintext-authentication (PAP).
     * @var  string
     */
    protected $_password = null;
    
    /**
     * The servers storage
     *
     * @var array
     */
    protected $_servers = array();
    
    /**
     * Switch whether we should put standard attributes or not
     * @var  bool
     * @see  putStandardAttributes()
     */
    protected $_useStandardAttributes = true;

    /**
     * Creates a RADIUS resource
     *
     * Creates a RADIUS resource for authentication. This should be the first
     * call before you make any other things with the library.
     *
     * @throws OSDN_Auth_Adapter_Radius_Exception
     * @return OSDN_Auth_Adapter_Radius_Pap
     */
    abstract public function open();
    
    /**
     * Creates an authentication request 
     *
     * Creates an authentication request.
     * You MUST call this method before you can put any attribute
     *
     * @throws OSDN_Auth_Adapter_Radius_Exception
     * @return OSDN_Auth_Adapter_Radius_Abstract
     */
    abstract protected function _createRequest();
    
    /** 
     * Initialize the "radius" request
     *
     * @throws OSDN_Auth_Adapter_Radius_Exception
     * @return OSDN_Auth_Adapter_Radius_Abstract
     */
    public function initialize()
    {
        $this->open();
        if (!empty($this->_servers)) {
            $this->addServers($this->_servers);
        }
        $this->_createRequest();
        $this->_putStandardAttributes();
        $this->_putAuthAttributes();
        return $this;
    }
    
    /**
     * Adds a RADIUS server to the list of servers for requests.
     *
     * At most 10 servers may be specified. When multiple servers 
     * are given, they are tried in round-robin fashion until a 
     * valid response is received
     *
     * @param  string  $hostname     Servername or IP-Address
     * @param  integer $port         Portnumber
     * @param  string  $secret       Shared secret
     * @param  integer $timeout      Timeout for each request
     * @param  integer $maxTries     Max. retries for each request
     * 
     * @throws OSDN_Auth_Adapter_Radius_Exception          
     * @return bool
     */
    public function addServers(array $servers)
    {
        if (empty($servers)) {
            return $this;
        }
        
        if (isset($servers[0])) {
            foreach ($servers as $server) {
                $this->addServers($server);
            }
            return $this;
        }
        
        extract($servers);
        if (!isset($hostname)) {
            $hostname = 'localhost';
        }
        
        if (!isset($port)) {
            $port = 0;
        }
        
        if (empty($secret)) {
            $secret = '';
        }
        
        if (!isset($timeout)) {
            $timeout = 3;
        }
        
        if (!isset($max_tries)) {
            $max_tries = 3;
        }
        
        if (!radius_add_server($this->_resource, $hostname, $port, $secret, $timeout, $max_tries)) {
            throw new OSDN_Auth_Adapter_Radius_Exception('Add radius server failed.');
        }
        return true;
    }

    /**
     * Set adapter options
     *
     * @param array $options
     */
    public function setOptions(array $options)
    {
        foreach ($options as $name => $option){
            switch ($name) {
                case 'server':
                    if (empty($option)) {
                        continue;
                    }
                    
                    if (isset($a[0])) {
                        $this->_servers += $option;
                        continue;    
                    }
                    $this->_servers[] = $option;
                    break;
                    
                default:
                    throw new OSDN_Auth_Adapter_Radius_Exception(
                        sprintf('Unknown option: "%s"', $name));
            }
        }
    }
    
    /**
     * Set username
     *
     * @param string $name
     */
    public function setUsername($name) 
    {
        $this->_username = $name;
        return $this;
    }
    
    /**
     * Set password
     */
    public function setPassword($password)
    {
        $this->_password = $password;
        return $this;
    }
    
    /**
     * Returns an error message, if an error occurred.
     *
     * @access public
     * @return string
     */
    public function getError() 
    {
        return radius_strerror($this->_resource);
    }
    
    /**
     * Puts an attribute.
     *
     * @access public
     * @param  integer $attrib       Attribute-number
     * @param  mixed   $port         Attribute-value
     * @param  type    $type         Attribute-type
     * @return bool  true on success, false on error
     */    
    protected function _putAttribute($attrib, $value, $type = null)
    {
        if ($type == null) {
            $type = gettype($value);
        }
        
        switch ($type) {
	        case 'integer':
	        case 'double':
	            return radius_put_int($this->_resource, $attrib, $value);
	        
	        case 'addr':
	            return radius_put_addr($this->_resource, $attrib, $value);
	            
	        case 'string':
	        default:
	            return radius_put_attr($this->_resource, $attrib, $value);
        }
    }
    
    /**
     * Puts a vendor-specific attribute.
     *
     * @param  integer $vendor       Vendor (MSoft, Cisco, ...)
     * @param  integer $attrib       Attribute-number
     * @param  mixed   $port         Attribute-value
     * @param  type    $type         Attribute-type
     * @return bool  true on success, false on error
     */ 
    protected function _putVendorAttribute($vendor, $attrib, $value, $type = null) 
    {
        
        if ($type == null) {
            $type = gettype($value);
        }
        
        switch ($type) {
	        case 'integer':
	        case 'double':
	            return radius_put_vendor_int($this->_resource, $vendor, $attrib, $value);
	        
	        case 'addr':
	            return radius_put_vendor_addr($this->_resource, $vendor,$attrib, $value);
	            
	        case 'string':
	        default:
	            return radius_put_vendor_attr($this->_resource, $vendor, $attrib, $value);
        }
    }
    
    /**
     * Puts standard attributes.
     *
     */ 
    function _putStandardAttributes()
    {
        if (true !== $this->_useStandardAttributes) {
        	return;
        }
        
        $httpHost = 'localhost';
        if (isset($_SERVER['HTTP_HOST'])) {
        	$httpHost = $_SERVER['HTTP_HOST'];
        }
        
        $remoteHost = '127.0.0.1';
        if (isset($_SERVER['REMOTE_HOST'])) {
        	$remoteHost = $_SERVER['REMOTE_HOST']; 
        }
        
        $this->_putAttribute(RADIUS_NAS_IDENTIFIER, $httpHost);
        $this->_putAttribute(RADIUS_NAS_PORT_TYPE, RADIUS_VIRTUAL);
        $this->_putAttribute(RADIUS_SERVICE_TYPE, RADIUS_FRAMED);
        $this->_putAttribute(RADIUS_FRAMED_PROTOCOL, RADIUS_PPP);
        $this->_putAttribute(RADIUS_CALLING_STATION_ID, $remoteHost);
    }
    
    /**
     * Puts custom attributes.
     */ 
    protected function _putAuthAttributes()
    {
        if (isset($this->_username)) {
            $this->_putAttribute(RADIUS_USER_NAME, $this->_username);        
        }
    }
    
    /**
     * Sends a prepared RADIUS request and waits for a response
     *
     * @throws OSDN_Auth_Adapter_Radius_Exception
     * @return boolean
     */ 
    public function send()
    {
        if (!$request = radius_send_request($this->_resource)) {
            throw new OSDN_Auth_Adapter_Radius_Exception('Error sending request: ' . $this->getError());
        }

        switch($request) {
	        case RADIUS_ACCESS_ACCEPT:
	            if (is_subclass_of($this, 'auth_radius_acct')) {
	            	throw new OSDN_Auth_Adapter_Radius_Exception(
	            	    'RADIUS_ACCESS_ACCEPT is unexpected for accounting');
	            }
	            return true;
	
	        case RADIUS_ACCESS_REJECT:
	            return false;
	            
	        case RADIUS_ACCOUNTING_RESPONSE:
	            if (is_subclass_of($this, 'auth_radius_pap')) {
	            	throw new OSDN_Auth_Adapter_Radius_Exception(
	            	    'RADIUS_ACCOUNTING_RESPONSE is unexpected for authentication');
	                return;
	            }
	            return true;
	
	        default:
	        	throw new OSDN_Auth_Adapter_Radius_Exception("Unexpected return value: $request");
	    }
    }    

    
    
    /**
     * Frees resources.
     *
     * Calling this method is always a good idea, because all security relevant
     * attributes are filled with Nullbytes to leave nothing in the mem.
     */   
    public function close()
    {
        if (!is_null($this->_resource)) {
            if (!radius_close($this->_resource)) {
                throw new OSDN_Auth_Adapter_Radius_Exception('Failed to close radius connection.');
            };
            $this->_resource = null;
        }
        
        $this->_username = str_repeat("\0", strlen($this->_username));
        $this->_password = str_repeat("\0", strlen($this->_password));
    }
}
