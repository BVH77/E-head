<?php

/**
 * Metadata implementation argument
 * 
 * @see com.jaspersoft.jasperserver.api.metadata.xml.domain.impl.Argument
 * @example Argument.java 4307 2006-08-24 08:13:55
 * 
 * @category    OSDN
 * @package     OSDN_Jasper_Metadata
 * @version     $Id: Argument.php 5448 2008-11-17 15:38:28Z flash $
 */
class OSDN_Jasper_Metadata_Argument
{
    
    const CREATE_REPORTUNIT = 'CREATE_REPORTUNIT_BOOLEAN';
    
    /**
     * Argument used to pass the destination URI for the resource/folder copy/move operations. 
     *
     * @var string
     */
    const DESTINATION_URI = 'DESTINATION_URI';
    
    const IC_GET_QUERY_DATA = 'IC_GET_QUERY_DATA';
    
    const LIST_DATASOURCES = 'LIST_DATASOURCES';
    
    const LIST_RESOURCES = 'LIST_RESOURCES';
    
    const MODIFY_REPORTUNIT = 'MODIFY_REPORTUNIT_URI';

    const NO_RESOURCE_DATA_ATTACHMENT = 'NO_ATTACHMENT';
    
    const NO_SUBRESOURCE_DATA_ATTACHMENTS = 'NO_SUBRESOURCE_ATTACHMENTS';
    
    const REPORT_TYPE = 'REPORT_TYPE';

    const RESOURCE_TYPE = 'RESOURCE_TYPE';
    
    const RUN_OUTPUT_FORMAT = 'RUN_OUTPUT_FORMAT';

    const RUN_OUTPUT_FORMAT_CSV = 'CSV';
    
    const RUN_OUTPUT_FORMAT_HTML = 'HTML';
    
    const RUN_OUTPUT_FORMAT_JRPRINT = 'JRPRINT';
    
    const RUN_OUTPUT_FORMAT_PDF = 'PDF';
    
    const RUN_OUTPUT_FORMAT_RTF = 'RTF';
    
    const RUN_OUTPUT_FORMAT_XLS = 'XLS';
    
    const RUN_OUTPUT_FORMAT_XML = 'XML';
    
    const RUN_OUTPUT_FORMAT_SXLS = 'SXLS';
    
    const RUN_OUTPUT_IMAGES_URI = 'IMAGES_URI';
    
    const RUN_OUTPUT_PAGE = 'PAGE';

    const START_FROM_DIRECTORY = 'START_FROM_DIRECTORY';
    
    const VALUE_TRUE = 'true';
    
    const VALUE_FALSE = 'false';
    
    const USE_DIME_ATTACHMENTS = 'USE_DIME_ATTACHMENTS';
    
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
    protected $_tpl = '<argument name="%s"><![CDATA[%s]]></argument>';
    
    /**
     * Creates a new instance of Argument
     *
     * @param string $name      The argument name   OPTIONAL
     * @param string $value     The argument value  OPTIONAL
     */
    public function __construct($name = null, $value = null)
    {
        $this->_name = $name;
        $this->_value = $value;
    }
    
    /**
     * Retrieve the argument name
     *
     * @return string
     */
    public function getName()
    {
        return $this->_name;
    }
    
    /**
     * Retrieve the argument value
     *
     * @return string
     */
    public function getValue()
    {
        return $this->_value;
    }
    
    /**
     * Set the argument name
     *
     * @param string $name
     * @return OSDN_Jasper_Metadata_Argument
     */
    public function setName($name)
    {
        $this->_name = $name;
        return $this;
    }
    
    /**
     * The the argument value
     *
     * @param string $value
     * @return OSDN_Jasper_Metadata_Argument
     */
    public function setValue($value)
    {
        $this->_value = $value;
        return $this;
    }
    
    /**
     * Rertieve the compiled argument string
     *
     * @return string
     */
    public function __toString()
    {
        return sprintf($this->_tpl, $this->_name, $this->_value);
    }
}