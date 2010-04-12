<?php

/**
 * Metadata implementation parameter
 * 
 * @category    OSDN
 * @package     OSDN_Jasper_Metadata
 * @version     $Id: Parameter.php 5448 2008-11-17 15:38:28Z flash $
 */
class OSDN_Jasper_Metadata_Parameter
{
    /**
     * Attribute name
     *
     * @var string
     */
    protected $_name;
    
    /**
     * Attribute value
     *
     * @var string
     */
    protected $_value;
    
    /**
     * Default template
     *
     * @var string      Use the sprintf format
     * @see http://ua.php.net/sprintf
     */
    protected $_tpl = '<parameter name="%s"><![CDATA[%s]]></parameter>';
    
    /**
     * Creates a new instance of Parameter
     *
     * @param string $name      The parameter name   OPTIONAL
     * @param string $value     The parameter value  OPTIONAL
     */
    public function __construct($name = null, $value = null)
    {
        $this->_name = $name;
        $this->_value = $value;
    }
    
    /**
     * Retrieve the parameter name
     *
     * @return string
     */
    public function getName()
    {
        return $this->_name;
    }
    
    /**
     * Retrieve the parameter value
     *
     * @return string
     */
    public function getValue()
    {
        return $this->_value;
    }
    
    /**
     * Set the parameter name
     *
     * @param string $name
     * @return OSDN_Jasper_Metadata_Parameter
     */
    public function setName($name)
    {
        $this->_name = $name;
        return $this;
    }
    
    /**
     * The the parameter value
     *
     * @param string $value
     * @return OSDN_Jasper_Metadata_Parameter
     */
    public function setValue($value)
    {
        $this->_value = $value;
        return $this;
    }
    
    /**
     * Rertieve the compiled parameter string
     *
     * @return string
     */
    public function __toString()
    {
        return sprintf($this->_tpl, $this->_name, $this->_value);
    }
}