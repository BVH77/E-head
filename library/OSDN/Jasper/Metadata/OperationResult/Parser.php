<?php

/**
 * Operation result parser
 * Allow parse the result xml and generate OSDN_Jasper_Metadata_OperationResult object
 * 
 * @category    OSDN
 * @package     OSDN_Jasper_Metadata
 * @version     $Id: Parser.php 5449 2008-11-17 15:49:39Z flash $
 */
class OSDN_Jasper_Metadata_OperationResult_Parser
{
    /**
     * Operation result
     *
     * @var OSDN_Jasper_Metadata_OperationResult
     */
    protected $_operationResult;
    
    /**
     * The constructor
     *
     */
    public function __construct(OSDN_Jasper_Metadata_OperationResult $operationResult)
    {
        $this->_operationResult = $operationResult;
    }
    
    /**
     * Parse operation result
     *
     * @param SimpleXMLElement $operationResultXml
     * @return OSDN_Jasper_Metadata_OperationResult
     */
    public function operationResult(SimpleXMLElement $operationResultXml)
    {
        $attributes = $operationResultXml->attributes();

        if (isset($attributes['version'])) {
            $this->_operationResult->setVersion($attributes['version']);
        }
        
        $resourceDescriptors = array();
        foreach ($operationResultXml->children() as $child) {
            switch ($child->getName()) {
                case 'resourceDescriptor':
                    $resourceDescriptors[] = $this->parseResourceDescriptor($child);
                    break;
                    
                case 'returnCode':
                    $this->_operationResult->setReturnCode((string) $child);
                    break;
                    
                case 'returnMessage':
                    $this->_operationResult->setReturnMessage((string) $child);
                    break;
            }
        }
        
        if (!empty($resourceDescriptors)) {
            $this->_operationResult->getResourceDescriptors()->addAll($resourceDescriptors);
        }
        
        return $this->_operationResult;
    }
    
    /**
     * Parse resource descriptor
     *
     * @param SimpleXMLElement $resourceDescriptorXml
     * @return OSDN_Jasper_Metadata_ResourceDescriptor
     */
    public function parseResourceDescriptor(SimpleXMLElement $resourceDescriptorXml)
    {
        $resourceDescriptor = new OSDN_Jasper_Metadata_ResourceDescriptor();
        $attributes = $resourceDescriptorXml->attributes();
        if (isset($attributes['name'])) {
            $resourceDescriptor->setName($attributes['name']);
        }
        
        if (isset($attributes['wsType'])) {
            $resourceDescriptor->setWsType($attributes['wsType']);
        }
        
        if (isset($attributes['uriString'])) {
            $resourceDescriptor->setUriString($attributes['uriString']);
        }
        
        if (isset($attributes['isNew'])) {
            $resourceDescriptor->setIsNew($attributes['isNew']);
        }
        
        $resourceDescriptors = array();
        $resourceProperties = array();
        $parameters = array();
        foreach ($resourceDescriptorXml->children() as $child) {
            switch ($child->getName()) {
                case 'label':
                    $resourceDescriptor->setLabel((string) $child);
                    break;
                    
                case 'description':
                    $resourceDescriptor->setDescription((string) $child);
                    break;
                    
                case 'resourceProperty':
                    $resourceProperties[] = $this->parseResourceProperty($child);
                    break;
                    
                case 'resourceDescriptor':
                    $resourceDescriptors[] = $this->parseResourceDescriptor($child);
                    break;
                    
                case 'parameter':
                    $parameters[] = new OSDN_Jasper_Metadata_Parameter(
                        $child->attributes()->name, (string) $child
                    );
                    break;
            }
        }
        
        if (!empty($resourceDescriptors)) {
            $resourceDescriptor->getChildren()->addAll($resourceDescriptors);
        }
        
        if (!empty($resourceProperties)) {
            $resourceDescriptor->getProperties()->addAll($resourceProperties);
        }
        
        if (!empty($parameters)) {
            $resourceDescriptor->getParameters()->addAll($parameters);
        }
        
        return $resourceDescriptor;
    }
    
    /**
     * Parse resource property
     *
     * @param SimpleXMLElement $resourcePropertyXml
     * @return OSDN_Jasper_Metadata_ResourceProperty
     */
    public function parseResourceProperty(SimpleXMLElement $resourcePropertyXml)
    {
        $name = $resourcePropertyXml->attributes()->name;
        $resourceProperty = new OSDN_Jasper_Metadata_ResourceProperty((string) $name);
        
        $resourceProperties = array();
        foreach ($resourcePropertyXml->children() as $child) {
            switch ($child->getName()) {
                case 'value':
                    $resourceProperty->setValue((string) $child);
                    break;
                    
                case 'resourceProperty':
                    $resourceProperties[] = $this->parseResourceProperty($child);
                    break; 
            }
        }
        
        if (!empty($resourceProperties)) {
            $resourceProperty->getProperties()->addAll($resourceProperties);
        }
        return $resourceProperty;
    }
}