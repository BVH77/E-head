<?php

/**
 * Metadata implementation operation result
 * 
 * @see com.jaspersoft.jasperserver.api.metadata.xml.domain.impl.OperationResult
 * 
 * @category    OSDN
 * @package     OSDN_Jasper_Metadata
 * @version     $Id: OperationResult.php 5448 2008-11-17 15:38:28Z flash $
 */
class OSDN_Jasper_Metadata_OperationResult
{
    /**
     * Version
     *
     * @var string
     */
    protected $_version = '2.0.1';
    
    /**
     * Return code
     *
     * @var string
     */
    protected $_returnCode = 0;

    /**
     * Resource descriptors collection
     *
     * @var OSDN_Collection_ArrayList
     */
    protected $_resourceDescriptors;
    
    /**
     * Default template
     *
     * @var string
     */
    protected $_tpl = '<operationResult version="%s">%s</operationResult>';
    
    /**
     * Return code template
     *
     * @var string
     */
    protected $_tplReturnCode = '<returnCode><![CDATA[%s]]></returnCode>';
    
    /**
     * Return message template
     *
     * @var string
     */
    protected $_tplReturnMessage = '<returnMessage><![CDATA[%s]]></returnMessage>';
    
    /**
     * Output message
     *
     * @var string
     */
    protected $_returnMessage;            
    
    /**
     * The constructor
     * Extract dom response
     *
     * @param string $operationResultXml        The response xml OPTIONAL
     */
    public function __construct($operationResultXml = null)
    {
        $this->_resourceDescriptors = new OSDN_Collection_ArrayList();
        
        if (!is_null($operationResultXml)) {
            $sdom = simplexml_load_string($operationResultXml);
            $parser = new OSDN_Jasper_Metadata_OperationResult_Parser($this);
            $parser->operationResult($sdom);    
        }
    }
    
    /**
     * Retrieve the return message
     *
     * @return string
     */
    public function getReturnMessage()
    {
        return (string) $this->_returnMessage;
    }
    
    /**
     * Retrieve the resource descriptors
     *
     * @return OSDN_Collection_ArrayList
     */
    public function getResourceDescriptors()
    {
        return $this->_resourceDescriptors;
    }
    
    /**
     * Retrieve return code
     *
     * @return int
     */
    public function getReturnCode()
    {
        return (int) $this->_returnCode;
    }
    
    /**
     * Set message
     *
     * @param string $message
     * @return OSDN_Jasper_Metadata_OperationResult
     */
    public function setReturnMessage($message)
    {
        $this->_returnMessage = $message;
        return $this;
    }
    
    /**
     * Set resource descriptors
     *
     * @param OSDN_Collection_ArrayList     $resourceDescriptors
     * @return OSDN_Jasper_Metadata_OperationResult
     */
    public function setResourceDescriptors(OSDN_Collection_ArrayList $resourceDescriptors)
    {
        $this->_resourceDescriptors = $resourceDescriptors;
        return $this;
    }
    
    /**
     * Set return code
     *
     * @param int $code
     * @return OSDN_Jasper_Metadata_OperationResult
     */
    public function setReturnCode($code)
    {
        $this->_returnCode = (int) $code;
        return $this;
    }
    
    /**
     * Set version
     *
     * @param string $version
     * @return OSDN_Jasper_Metadata_OperationResult
     */
    public function setVersion($version)
    {
        $this->_version = (string) $version;
        return $this;
    }

    /**
     * Check if response is success
     *
     * @return bool
     */
    public function isSuccess()
    {
        return 0 == $this->getReturnCode();
    }
    
    /**
     * Fetch output xml
     *
     * @return string
     */
    public function __toString()
    {
        $body = array();
        $body[] = sprintf($this->_tplReturnCode, $this->_returnCode);
        
        if (!empty($this->_returnMessage)) {
            $body[] = sprintf($this->_tplReturnMessage, $this->getReturnMessage());
        }
        
        if (!empty($this->_resourceDescriptors)) {
            $body[] = join('', $this->getResourceDescriptors()->toArray());
        }
        
        return sprintf($this->_tpl, $this->_version, join('', $body));
    }
}