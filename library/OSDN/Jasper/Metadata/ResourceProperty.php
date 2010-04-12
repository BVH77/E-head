<?php

/**
 * Metadata implementation ResourceProperty
 * 
 * @see com.jaspersoft.jasperserver.api.metadata.xml.domain.impl.ResourceProperty
 * 
 * @category    OSDN
 * @package     OSDN_Jasper_Metadata
 * @version     $Id: ResourceProperty.php 5449 2008-11-17 15:49:39Z flash $
 */
class OSDN_Jasper_Metadata_ResourceProperty
{
    /**
     * Default template
     *
     * @var string
     */
    protected $_tpl = '<resourceProperty name="%s">%s</resourceProperty>';
    
    /**
     * Default value template
     *
     * @var string
     */
    protected $_valueTpl = '<value><![CDATA[%s]]></value>';
    
    /**
     * Property name
     *
     * @var string
     */
    protected $_name;
    
    /**
     * Property value
     *
     * @var string
     */
    protected $_value;
    
    /**
     * Properties collection of OSDN_Jasper_Metadata_ResourceProperty instances
     *
     * @var OSDN_Collection_ArrayList
     */
    protected $_properties;
    
    /**
     * Creates a new instance of ResourceProperty
     *
     * @param string $name      The property name   OPTIONAL
     * @param string $value     The property value  OPTIONAL
     */
    public function __construct($name = "", $value = "")
    {
        $this->_name = $name;
        $this->_value = $value;
        $this->_properties = new OSDN_Collection_ArrayList();
    }
    
    /**
     * Retrieve property name
     *
     * @return string
     */
    public function getName()
    {
        return $this->_name;
    }
    
    /**
     * Retrieve the properties
     *
     * @return OSDN_Collection_ArrayList
     */
    public function getProperties()
    {
        return $this->_properties;
    }
    
    /**
     * Get property value
     *
     * @return string
     */
    public function getValue()
    {
        return $this->_value;
    }
    
    /**
     * Set property name
     *
     * @param string $name      The property name
     * @return OSDN_Jasper_Metadata_ResourceProperty
     */
    public function setName($name)
    {
        $this->_name = $name;
        return $this;
    }
    
    /**
     * Set property value
     *
     * @param string $value     The property value
     * @return OSDN_Jasper_Metadata_ResourceProperty
     */
    public function setValue($value)
    {
        $this->_value = $value;
        return $this;
    }
    
    /**
     * Set properties
     *
     * @param array $properties     Properties collection
     * @return OSDN_Jasper_Metadata_ResourceProperty
     */
    public function setProperties(OSDN_Collection_ArrayList $properties)
    {
        $this->_properties = $properties;
        return $this;
    }
    
    /**
     * Retrieve the property xml
     *
     * @return string
     */
    public function __toString()
    {
        $value = "";
        if (!empty($this->_value)) {
            $value = sprintf($this->_valueTpl, $this->getValue());
        }
        
        $properties = "";
        if (!empty($this->_properties)) {
            $properties = join("", $this->getProperties()->toArray());
        }
        return sprintf($this->_tpl, $this->_name, $value . $properties);
    }
}