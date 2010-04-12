<?php

/**
 * Metadata implementation request
 * 
 * @see com.jaspersoft.jasperserver.api.metadata.xml.domain.impl.Request
 * @example Request.java 3614 2006-06-09 12:14:38Z
 * 
 * @category    OSDN
 * @package     OSDN_Jasper_Metadata
 * @version     $Id: Request.php 5448 2008-11-17 15:38:28Z flash $
 */
class OSDN_Jasper_Metadata_Request
{
    const OPERATION_CHECK_DEPENDS = 'checkForDependentResources';
    
    const OPERATION_GET = 'get';
    
    const OPERATION_LIST = 'list';

    const OPERATION_LOGIN = 'login';
    
    const OPERATION_PUT = 'put';
    
    const OPERATION_RUN_REPORT = 'runReport';
    
    /**
     * Default template
     *
     * @var string      Use the sprintf format
     * @see http://ua.php.net/sprintf
     */
    protected $_tpl = '<request operationName="%s" locale="%s">%s</request>';
    
    /**
     * The operation name
     *
     * @var string
     */
    protected $_operationName;
    
    /**
     * Request arguments collection
     *
     * @var OSDN_Collection_ArrayList
     */
    protected $_arguments;
    
    /**
     * Define request locale
     *
     * @var string
     */
    protected $_locale = 'en';
    
    /**
     * Resource description resource
     *
     * @var OSDN_Jasper_Metadata_ResourceDescriptor
     */
    protected $_resourceDescriptor;
    
    /**
     * The constructor
     * Define arguments collection
     * 
     */
    public function __construct()
    {
        $this->_arguments = new OSDN_Collection_ArrayList();
    }
    
    /**
     * Retrieve the arguments collection
     *
     * @return OSDN_Collection_ArrayList
     */
    public function getArguments()
    {
        return $this->_arguments;
    }

    /**
     * Retrieve the argument value
     *
     * @return string
     */
    public function getArgumentValue($argumentName)
    {
        $value = null;
        if ($this->_arguments->isEmpty()) {
            return $value;
        }
        
        
        foreach ($this->getArguments() as $argument) {
            if ($argument->getName() == $argumentName) {
                $value = $argument->getValue();
                break;
            }
        }
        
        return $value;
    }
    
    /**
     * Retrieve request locale
     *
     * @return string
     */
    public function getLocale()
    {
        return $this->_locale;
    }
    
    /**
     * Retrieve the operation name
     *
     * @return string
     */
    public function getOperationName()
    {
        return $this->_operationName;
    }

    /**
     * Retrieve the resource descriptor
     *
     * @return OSDN_Jasper_Metadata_ResourceDescriptor | null if empty
     */
    public function getResourceDescriptor()
    {
        return $this->_resourceDescriptor;
    }
    
    /**
     * Set request arguments
     *
     * @param OSDN_Collection_ArrayList $arguments
     * @return OSDN_Jasper_Metadata_Request
     */
    public function setArguments(OSDN_Collection_ArrayList $arguments)
    {
        $this->_arguments = $arguments;
        return $this;
    }
    
    /**
     * Set request locale
     *
     * @param string $locale
     * @return OSDN_Jasper_Metadata_Request
     */
    public function setLocale($locale)
    {
        $this->_locale = $locale;
        return $this;
    }
    
    /**
     * Set operation name
     *
     * @param string $name
     * @return OSDN_Jasper_Metadata_Request
     */
    public function setOperationName($name)
    {
        $this->_operationName = $name;
        return $this;
    }
    
    /**
     * Set resource descriptor
     *
     * @param OSDN_Jasper_Metadata_ResourceDescriptor $resourceDescriptor
     * @return OSDN_Jasper_Metadata_Request
     */
    public function setResourceDescriptor(OSDN_Jasper_Metadata_ResourceDescriptor $resourceDescriptor)
    {
        $this->_resourceDescriptor = $resourceDescriptor;
        return $this;
    }
    
    /**
     * Retrieve the request xml
     *
     * @return string
     */
    public function __toString()
    {
        $requestBody = array();
        if (!empty($this->_arguments)) {
            $requestBody[] = join('', $this->getArguments()->toArray());
        }
        
        if (!empty($this->_resourceDescriptor)) {
            $requestBody[] = $this->getResourceDescriptor();
        }
        return sprintf($this->_tpl, $this->_operationName, $this->_locale, join('', $requestBody));
    }
}