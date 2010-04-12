<?php

/**
 * Metadata implementation ResourceDescriptor
 * 
 * @see com.jaspersoft.jasperserver.api.metadata.xml.domain.impl.ResourceDescriptor
 * 
 * @category    OSDN
 * @package     OSDN_Jasper_Metadata
 * @version     $Id: ResourceDescriptor.php 5448 2008-11-17 15:38:28Z flash $
 */
class OSDN_Jasper_Metadata_ResourceDescriptor
{
    const CONTENT_TYPE_CSV = 'csv';
    
    const CONTENT_TYPE_HTML = 'html';
    
    const CONTENT_TYPE_IMAGE = 'img';
    
    const CONTENT_TYPE_PDF = 'pdf';
    
    const CONTENT_TYPE_RTF = 'rtf';
    
    const CONTENT_TYPE_XLS = 'xls';
    
    const DT_TYPE_DATE = 3;
    
    const DT_TYPE_DATE_TIME = 4;
    
    const DT_TYPE_NUMBER = 2;
    
    const DT_TYPE_TEXT = 1;
    
    const IC_TYPE_BOOLEAN = 1;
    
    const IC_TYPE_MULTI_SELECT_LIST_OF_VALUES = 6;
    
    const IC_TYPE_MULTI_SELECT_LIST_OF_VALUES_CHECKBOX = 10;
    
    const IC_TYPE_MULTI_SELECT_QUERY = 7;
    
    const IC_TYPE_MULTI_SELECT_QUERY_CHECKBOX = 11;
    
    const IC_TYPE_MULTI_VALUE = 5;
    
    const IC_TYPE_SINGLE_SELECT_LIST_OF_VALUES = 3;
    
    const IC_TYPE_SINGLE_SELECT_LIST_OF_VALUES_RADIO = 8;
    
    const IC_TYPE_SINGLE_SELECT_QUERY = 4;
    
    const IC_TYPE_SINGLE_SELECT_QUERY_RADIO = 9;
    
    const IC_TYPE_SINGLE_VALUE = 2;
    
    const PROP_CONTENT_RESOURCE_TYPE = 'CONTENT_TYPE';
    
    const PROP_CREATION_DATE = 'PROP_CREATION_DATE';
    
    const PROP_DATA_ATTACHMENT_ID = 'DATA_ATTACHMENT_ID';
    
    const PROP_DATASOURCE_BEAN_METHOD = 'PROP_DATASOURCE_BEAN_METHOD';
    
    const PROP_DATASOURCE_BEAN_NAME = 'PROP_DATASOURCE_BEAN_NAME';
    
    const PROP_DATASOURCE_CONNECTION_URL = 'PROP_DATASOURCE_CONNECTION_URL';
    
    const PROP_DATASOURCE_CUSTOM_PROPERTY_MAP = 'PROP_DATASOURCE_CUSTOM_PROPERTY_MAP';
    
    const PROP_DATASOURCE_CUSTOM_SERVICE_CLASS = 'PROP_DATASOURCE_CUSTOM_SERVICE_CLASS';
    
    const PROP_DATASOURCE_DRIVER_CLASS = 'PROP_DATASOURCE_DRIVER_CLASS';
    
    const PROP_DATASOURCE_JNDI_NAME = 'PROP_DATASOURCE_JNDI_NAME';
    
    const PROP_DATASOURCE_PASSWORD = 'PROP_DATASOURCE_PASSWORD';
    
    const PROP_DATASOURCE_USERNAME = 'PROP_DATASOURCE_USERNAME';
    
    const PROP_DATATYPE_MAX_VALUE = 'PROP_DATATYPE_MAX_VALUE';
    
    const PROP_DATATYPE_MIN_VALUE = 'PROP_DATATYPE_MIN_VALUE';
    
    const PROP_DATATYPE_PATTERN = 'PROP_DATATYPE_PATTERN';
    
    const PROP_DATATYPE_STRICT_MAX = 'PROP_DATATYPE_STRICT_MAX';
    
    const PROP_DATATYPE_STRICT_MIN = 'PROP_DATATYPE_STRICT_MIN';
    
    const PROP_FILERESOURCE_HAS_DATA = 'PROP_HAS_DATA';
    
    const PROP_FILERESOURCE_IS_REFERENCE = 'PROP_IS_REFERENCE';
    
    const PROP_FILERESOURCE_REFERENCE_URI = 'PROP_REFERENCE_URI';
    
    const PROP_FILERESOURCE_WSTYPE = 'PROP_WSTYPE';
    
    const PROP_INPUTCONTROL_IS_MANDATORY = 'PROP_INPUTCONTROL_IS_MANDATORY';
    
    const PROP_INPUTCONTROL_IS_READONLY = 'PROP_INPUTCONTROL_IS_READONLY';
    
    const PROP_INPUTCONTROL_TYPE = 'PROP_INPUTCONTROL_TYPE';
    
    const PROP_LOV = 'PROP_LOV';
    
    const PROP_LOV_LABEL = 'PROP_LOV_LABEL';
    
    const PROP_LOV_VALUE = 'PROP_LOV_VALUE';
    
    const PROP_PARENT_FOLDER = 'PROP_PARENT_FOLDER';
    
    const PROP_QUERY = 'PROP_QUERY';
    
    const PROP_QUERY_DATA = 'PROP_QUERY_DATA';
    
    const PROP_QUERY_DATA_ROW = 'PROP_QUERY_DATA_ROW';
    
    const PROP_QUERY_DATA_ROW_COLUMN = 'PROP_QUERY_DATA_ROW_COLUMN';
    
    const PROP_QUERY_LANGUAGE = 'PROP_QUERY_LANGUAGE';
    
    const PROP_QUERY_VALUE_COLUMN = 'PROP_QUERY_VALUE_COLUMN';
    
    const PROP_QUERY_VISIBLE_COLUMN_NAME = 'PROP_QUERY_VISIBLE_COLUMN_NAME';
    
    const PROP_QUERY_VISIBLE_COLUMNS = 'PROP_QUERY_VISIBLE_COLUMNS';
    
    const PROP_RESOURCE_TYPE = 'PROP_RESOURCE_TYPE';
    
    const PROP_RU_ALWAYS_PROPMT_CONTROLS = 'PROP_RU_ALWAYS_PROPMT_CONTROLS';
    
    const PROP_RU_CONTROLS_LAYOUT = 'PROP_RU_CONTROLS_LAYOUT';
    
    const PROP_RU_DATASOURCE_TYPE = 'PROP_RU_DATASOURCE_TYPE';
    
    const PROP_RU_INPUTCONTROL_RENDERING_VIEW = 'PROP_RU_INPUTCONTROL_RENDERING_VIEW';
    
    const PROP_RU_IS_MAIN_REPORT = 'PROP_RU_IS_MAIN_REPORT';
    
    const PROP_RU_REPORT_RENDERING_VIEW = 'PROP_RU_REPORT_RENDERING_VIEW';
    
    const PROP_VERSION = 'PROP_VERSION';
    
    const PROP_XMLA_CATALOG = 'PROP_XMLA_CATALOG';
    
    const PROP_XMLA_DATASOURCE = 'PROP_XMLA_DATASOURCE';
    
    const PROP_XMLA_PASSWORD = 'PROP_XMLA_PASSWORD';
    
    const PROP_XMLA_URI = 'PROP_XMLA_URI';
    
    const PROP_XMLA_USERNAME = 'PROP_XMLA_USERNAME';
    
    const RU_CONTROLS_LAYOUT_POPUP_SCREEN = 1;
    
    const RU_CONTROLS_LAYOUT_SEPARATE_PAGE = 2;
    
    const RU_CONTROLS_LAYOUT_TOP_OF_PAGE = 3;
    
    const TYPE_ACCESS_GRANT_SCHEMA = 'accessGrantSchema';
    
    const TYPE_CLASS_JAR = 'jar';
    
    const TYPE_CONTENT_RESOURCE = 'contentResource';
    
    const TYPE_DATA_TYPE = 'dataType';
    
    const TYPE_DATASOURCE = 'datasource';
    
    const TYPE_DATASOURCE_BEAN = 'bean';
    
    const TYPE_DATASOURCE_CUSTOM = 'custom';
    
    const TYPE_DATASOURCE_JDBC = 'jdbc';
    
    const TYPE_DATASOURCE_JNDI = 'jndi';
    
    const TYPE_FOLDER = 'folder';
    
    const TYPE_FONT = 'font';
    
    const TYPE_IMAGE = 'img';
    
    const TYPE_INPUT_CONTROL = 'inputControl';
    
    const TYPE_JRXML = 'jrxml';
    
    const TYPE_LOV = 'lov';
    
    const TYPE_MONDRIAN_SCHEMA = 'olapMondrianSchema';
    
    const TYPE_OLAP_MONDRIAN_CONNECTION = 'olapMondrianCon';
    
    const TYPE_OLAP_XMLA_CONNECTION = 'olapXmlaCon';
    
    const TYPE_QUERY = 'query';
    
    const TYPE_REFERENCE = 'reference';
    
    const TYPE_REPORTUNIT = 'reportUnit';
    
    const TYPE_RESOURCE_BUNDLE = 'prop';
    
    const TYPE_STYLE_TEMPLATE = 'jrtx';
    
    const TYPE_UNKNOW = 'unknow';
    
    /**
     * Default template
     *
     * @var string      Use the sprintf format
     * @see http://ua.php.net/sprintf
     */
    protected $_tpl = '<resourceDescriptor name="%s" wsType="%s" uriString="%s" isNew="%s">%s</resourceDescriptor>';
    
    protected $_tplLabel = '<label>%s</label>';
    
    protected $_tplDescription = '<description>%s</description>';
    
    /**
     * Parameters collection
     *
     * @var OSDN_Collection_ArrayList
     */
    protected $_parameters;
    
    /**
     * @var string
     */
    protected $_wsType;
    
    /**
     * Descriptor name
     *
     * @var string
     */
    protected $_name;
    
    /**
     * Descriptor label
     *
     * @var string
     */
    protected $_label;
    
    /**
     * Descriptor description
     *
     * @var string
     */
    protected $_description;
    
    /**
     * ResourceDescriptions collections
     *
     * @var OSDN_Collection_ArrayList
     */
    protected $_children;
    
    /**
     * Descriptor uri string
     *
     * @var string
     */
    protected $_uriString;
    
    /**
     * The isNew attribute is used with the put operation 
     * to indicate whether the resource being uploaded is new 
     * or replaces an existing resource in the repository.
     *
     * @var bool
     */
    protected $_isNew = false;
    
    /**
     * Creation date
     *
     * @var int
     */
    protected $_creationDate;
    
    /**
     * Hash map collection
     *
     * @var OSDN_Collection_HashMap
     */
    protected $_hm;
    
    /**
     * Properties
     *
     * @var OSDN_Collection_ArrayList
     */
    protected $_properties;
    
    /**
     * This data is used to store the data for sunsequent calls to getQueryData....
     *
     * @var unknown_type
     */
    protected $_queryDataCache = null;

    /**
     * The constructor
     *
     * Initialize base objects, e.g. parameters, properties, children, hm, etc.
     */
    public function __construct()
    {
        $this->_parameters = new OSDN_Collection_ArrayList();
        $this->_properties = new OSDN_Collection_ArrayList();
        $this->_children = new OSDN_Collection_ArrayList();
        $this->_hm = new OSDN_Collection_HashMap();
    }
    
    public function getBeanMethod()
    {
        return $this->getResourcePropertyValue(self::PROP_DATASOURCE_BEAN_METHOD);
    }
    
    public function getBeanName()
    {
        return getResourcePropertyValue(self::PROP_DATASOURCE_BEAN_NAME);
    }
    
    /**
     * Retrieve the children
     *
     * @return OSDN_Collection_ArrayList
     */
    public function getChildren()
    {
        return $this->_children;
    }

    /**
     * Retrieve the connection url
     *
     * @return string
     */
    public function getConnectionUrl()
    {
        return $this->getResourcePropertyValue(self::PROP_DATASOURCE_CONNECTION_URL);
    }
    
    /**
     * Retrieve the control type
     *
     * @todo problem then asseble java code
     *  Byte.valueOf( s ).byteValue(); to (int) $s;
     * 
     * @return int
     */
    public function getControlType()
    {
        $result = $this->getResourcePropertyValue(self::PROP_INPUTCONTROL_TYPE);
        if (empty($result)) {
            return 0; 
        }
        
        return (int) $this->getResourceProperty(self::PROP_INPUTCONTROL_TYPE);
    }
    
    /**
     * Retrieve the creation datetime
     *
     * @return int|null
     */
    public function getCreationDate()
    {
        return $this->_creationDate;
    }
    
    /**
     * Retrieve the resource property type
     *
     * @return string
     */    
    public function getDataSourceType()
    {
        return (string) $this->getResourcePropertyValue(self::PROP_RU_DATASOURCE_TYPE);
    }
    
    /**
     * Retrieve the data type
     *
     * @todo problem then asseble java code
     *  Byte.valueOf( s ).byteValue(); to (int) $s;
     * @return int|null
     */
    public function getDataType()
    {
        $result = $this->getResourcePropertyValue(self::PROP_DATATYPE_TYPE);
        if (empty($result)) {
            return 0;
        }
        
        return (int) $result;
    }
    
    /**
     * Retrieve the descriptor description
     *
     * @return string
     */
    public function getDescription()
    {
        return $this->_description;
    }
    
    public function getDriverClass()
    {
        return $this->getResourcePropertyValue(self::PROP_DATASOURCE_DRIVER_CLASS);
    }
    
    public function getHasData()
    {
        return $this->getResourcePropertyValueAsInteger(self::PROP_FILERESOURCE_HAS_DATA);
    }
    
    /**
     * Retrieve the isNew status
     *
     * @return bool
     */
    public function getIsNew()
    {
        return (boolean) $this->_isNew;
    }
    
    public function getIsReference()
    {
        return $this->getResourcePropertyValueAsBoolean(self::PROP_FILERESOURCE_IS_REFERENCE);
    }
    
    public function getJndiName()
    {
        return $this->getResourcePropertyValue(self::PROP_DATASOURCE_JNDI_NAME);
    }
    
    /**
     * Retrieve the descriptor label
     *
     * @return string
     */
    public function getLabel()
    {
        return $this->_label;
    }
    
    /**
     *  Returns the property PROP_LOV as a list of ListItem....
     *  Columns name are looked for in the property PROP_LOV,
     *  name="LABEL" and value="value"
     *  i.e.
     *  <resourceProperty name="PROP_LOV">
     *      <resourceProperty name="1">
     *              <value>test1</value>
     *      </resourceProperty>
     *      <resourceProperty name="2">
     *              <value>test2</value>
     *      </resourceProperty>
     *  </resourceProperty>
     *  are in the list.
     * 
     * @todo change to array list
     * 
     * @return array
     */
    public function getListOfValues()
    {
        $resourceProperty = $this->getResourceProperty(self::PROP_LOV);
        if (empty($resourceProperty)) {
            return array();
        }
        
        $listOfValues  = array();
        foreach ($resourceProperty->getProperties() as $property) {
            $listOfValues[] = array($property->getValue() != null ? $property().getValue() : $property->getName() => $property->getName());
        }
        return $listOfValues;
    }
    
    public function getMaxValue()
    {
        return $this->getResourcePropertyValue(self::PROP_DATATYPE_MAX_VALUE);
    }
    
    public function getMinValue()
    {
        return $this->getResourcePropertyValue(self::PROP_DATATYPE_MIN_VALUE);
    }
    
    /**
     * Retrieve the descriptor name
     *
     * @return string
     */
    public function getName()
    {
        return $this->_name;
    }
    
    /**
     * Get parameters array
     *
     * @return OSDN_Collection_ArrayList
     */
    public function getParameters()
    {
        return $this->_parameters;
    }
    
    public function getParentFolder()
    {
        return $this->getResourcePropertyValue(self::PROP_PARENT_FOLDER);
    }
    
    public function getPassword()
    {
        return $this->getResourcePropertyValue(self::PROP_DATASOURCE_PASSWORD);
    }
    
    public function getPattern()
    {
        return $this->getResourcePropertyValue(self::PROP_DATATYPE_PATTERN);
    }
    
    /**
     * Return the List of properties.
     *
     * @return OSDN_Collection_ArrayList
     */
    public function getProperties()
    {
        return $this->_properties;
    }
    
    /**
     * @todo change me
     *
     * @return unknown
     */
    public function getPropertyMap()
    {
        $resourceProperty = $this->getResourceProperty(self::PROP_DATASOURCE_CUSTOM_PROPERTY_MAP);
        $map = array();
        if (!empty($resourceProperty)) {
            foreach ($resourceProperty->getProperties() as $property) {
                $map[$property->getName()] = $property->getValue();
            }
        }
        return $map;
    }
    
    /**
     * Return the property PROP_QUERY_DATA 
     * as set of InputControlQueryDataRow the structure is as follow: 
     * PROP_QUERY_DATA { PROP_QUERY_DATA_ROW { PROP_QUERY_DATA_COLUMN_VALUE } } } 
     * This method is performed only once, and the result is cached in queryDataCache.
     *
     * @todo Implement functionality
     * @return array
     */
    public function getQueryData()
    {
        if (!is_null($this->_queryDataCache)) {
            return $this->_queryDataCache;
        }
        
        
    }
    
    public function getQueryValueColumn()
    {
        return $this->getResourcePropertyValue(self::PROP_QUERY_VALUE_COLUMN);
    }
    
    /**
     * Return the set of visible columns as a String array....
     *
     * @todo implement functionality
     * 
     * @return array
     */
    public function getQueryVisibleColumns()
    {
        
    }
    
    public function getReferenceUri()
    {
        return $this->getResourcePropertyValue(self::PROP_FILERESOURCE_REFERENCE_URI);
    }
    
    /**
     * Check if resource property present is hashmap
     *
     * @param string $resourcePropertyName
     * @return boolean
     */
    protected function _hasResourceProperty($resourcePropertyName)
    {
        return $this->_hm->exists($resourcePropertyName);
    }
    
    /**
     * Retrieve the resource property by name
     *
     * @param string $resourcePropertyName
     * @throws OSDN_Jasper_Exception
     * @return OSDN_Jasper_Metadata_ResourceProperty
     */
    public function getResourceProperty($resourcePropertyName)
    {
        if (!$this->_hasResourceProperty($resourcePropertyName)) {
            throw new OSDN_Jasper_Exception('The property does not exists in hash map.');
        }
        
        return $this->_hm->get($resourcePropertyName);
    }
    
    /**
     * Return the value of the property resourcePropertyName as String 
     * Return null if the property is not found or the property value is null.
     *
     * @return string |null
     */
    public function getResourcePropertyValue($resourcePropertyName)
    {
        $resourceProperty = $this->getResourceProperty($resourcePropertyName);
        if (is_null($resourceProperty)) {
            return null;
        }
        return $resourceProperty->getValue();
    }
    
    /**
     * Return the value of the property resourcePropertyName as Boolean
     * Return null if the property is not found
     *
     */
    public function getResourcePropertyValueAsBoolean($resourcePropertyName)
    {
        $resourceProperty = $this->getResourceProperty($resourcePropertyName);
        if (is_null($resourceProperty)) {
            return null;
        }
        
        return (boolean) $resourceProperty->getValue();
    }
    
    /**
     * Return the value of the property resourcePropertyName as Integer 
     * Return null if the property is not found or is not an integer
     *
     * @return int|null
     */
    public function getResourcePropertyValueAsInteger($resourcePropertyName)
    {
        $resourceProperty = $this->getResourceProperty($resourcePropertyName);
        if (is_null($resourceProperty)) {
            return null;
        }
        
        return (int) $resourceProperty->getValue();
    }
    
    public function getResourceType()
    {
        return $this->getResourcePropertyValue(self::PROP_RESOURCE_TYPE);
    }
    
    public function getServiceClass()
    {
        return $this->getResourcePropertyValue(self::PROP_DATASOURCE_CUSTOM_SERVICE_CLASS);
    }
    
    public function getSql()
    {
        return $this->getResourcePropertyValue(PROP_QUERY);
    }
    
    /**
     * Retrieve descriptor uri string
     *
     * @return string
     */
    public function getUriString()
    {
        return $this->_uriString;
    }
    
    public function getUsername()
    {
        return $this->getResourcePropertyValue(self::PROP_DATASOURCE_USERNAME);
    }
    
    /**
     * Return the value for the property PROP_VERSION.
     *
     * @return int
     */
    public function getVersion()
    {
        return $this->getResourcePropertyValueAsInteger(self::PROP_VERSION);
    }
    
    public function getWsType()
    {
        return $this->_wsType;
    }
    
    public function isMainReport()
    {
        return $this->getResourcePropertyValueAsBoolean(self::PROP_RU_IS_MAIN_REPORT);
    }
    
    
    public function isMandatory()
    {
        return $this->getResourcePropertyValueAsBoolean(self::PROP_INPUTCONTROL_IS_MANDATORY);
    }
    
    public function isReadOnly()
    {
        return $this->getResourcePropertyValueAsBoolean(self::PROP_INPUTCONTROL_IS_READONLY);
    }
    
    public function isStrictMax()
    {
        return $this->getResourcePropertyValueAsBoolean(self::PROP_DATATYPE_STRICT_MAX);
    }
    
    public function isStrictMin()
    {
        return $this->getResourcePropertyValueAsBoolean(self::PROP_DATATYPE_STRICT_MIN);
    }
    
    /**
     * Remove all the resource properties with name = rp.getName()
     *
     * @throws OSDN_Jasper_Exception
     * @return boolean
     */
    public function removeResourceProperty(OSDN_Jasper_Metadata_ResourceProperty $resourceProperty)
    {
        return $this->removeResourcePropertyByName($resourceProperty->getName());
    }
    
    /**
     * Remove all resources with name = resourcePropertyName
     *
     * @return boolean
     */
    public function removeResourcePropertyByName($resourcePropertyName)
    {
        if (!$this->_hasResourceProperty($resourcePropertyName)) {
            throw new OSDN_Jasper_Exception('The property does not exists.');
        }
        
        $this->_hm->remove($resourcePropertyName);
        foreach ($this->getProperties() as $key => $property) {
            if ($property->getName() == $resourcePropertyName) {
                $this->_properties->remove($key);
                return true;
            }
        }
        
        return false;
    }
    
    public function setBeanMethod($beanMethod)
    {
        $this->setResourceProperty(self::PROP_DATASOURCE_BEAN_METHOD, (string) $beanMethod);
        return $this;
    }
    
    public function setBeanName($beanName)
    {
        $this->setResourceProperty(self::PROP_DATASOURCE_BEAN_NAME, (string) $beanName);
        return $this;
    }
    
    /**
     * Set children
     *
     * @param OSDN_Collection_ArrayList $children
     * @return OSDN_Jasper_Metadata_ResourceDescriptor
     */
    public function setChildren(OSDN_Collection_ArrayList $children)
    {
        $this->_children = $children;
        return $this;
    }
    
    /**
     * Set connection url
     *
     * @param string $uri
     * @return OSDN_Jasper_Metadata_ResourceDescriptor
     */
    public function setConnectionUrl($uri)
    {
        $this->_uriString = $uri;
        return $this; 
    }
    
    public function setControlType($controlType)
    {
        $this->setResourceProperty(PROP_INPUTCONTROL_TYPE, (string) $controlType);
        return $this;
    }
    
    /**
     * Set creation date
     *
     * @param int $date
     * @return OSDN_Jasper_Metadata_ResourceDescriptor
     */
    public function setCreationDate($date)
    {
        $this->_creationDate = $date;
        return $this;
    }
    
    public function setDataSourceType($dataSourceType)
    {
        $this->setResourceProperty(PROP_RU_DATASOURCE_TYPE, $dataSourceType);
        return $this;
    }
    
    public function setDataType($dataType)
    {
        $this->setResourceProperty(PROP_DATATYPE_TYPE, (string) $dataType);
        return $this;
    }
    
    /**
     * Set descriptor description
     *
     * @param string $description
     * @return OSDN_Jasper_Metadata_ResourceDescriptor
     */
    public function setDescription($description)
    {
        $this->_description = $description;
        return $this;
    }
    
    public function setDriverClass($driverClass)
    {
        $this->setResourceProperty(self::PROP_DATASOURCE_DRIVER_CLASS, $driverClass);
        return $this;
    }
    
    public function setHasData($hasData)
    {
        $this->setResourceProperty(self::PROP_FILERESOURCE_HAS_DATA, (string) $hasData);
        return $this;
    }
    
    /**
     * Set isNew status
     *
     * @see isNew
     * @param string $isNew
     * @return OSDN_Jasper_Metadata_ResourceDescriptor
     */
    public function setIsNew($isNew)
    {
        $this->_isNew = (boolean) $isNew;
        return $this;
    }
    
    public function setIsReference($isReference)
    {
        $this->setResourceProperty(self::PROP_FILERESOURCE_IS_REFERENCE, (string) $isReference);
        return $this;
    }
    
    public function setJndiName($jndiName)
    {
        $this->setResourceProperty(self::PROP_DATASOURCE_JNDI_NAME, $jndiName);
    }
    
    /**
     * Set descriptor label
     *
     * @param string $label
     * @return OSDN_Jasper_Metadata_ResourceDescriptor
     */
    public function setLabel($label)
    {
        $this->_label = $label;
        return $this;
    }
    
    /**
     * Convenient way to create tje LOV property from a list of ListItem
     *
     * @todo implement
     * @param array $listOfValues
     */
    public function setListOfValues(array $listOfValues)
    {}
    
    public function setMainReport($isMainReport)
    {
        $this->setResourceProperty(self::PROP_RU_IS_MAIN_REPORT, (string) $isMainReport);
        return $this;
    }
    
    public function setMandatory($mandatory)
    {
        $this->setResourceProperty(self::PROP_INPUTCONTROL_IS_MANDATORY, (string) $mandatory);
        return $this;
    }
    
    public function setMaxValue($maxValue)
    {
        $this->setResourceProperty(self::PROP_DATATYPE_MAX_VALUE, $maxValue);
        return $this;
    }
    
    public function setMinValue($minValue)
    {
        $this->setResourceProperty(self::PROP_DATATYPE_MIN_VALUE, $minValue);
        return $this;
    }
    
    /**
     * Set descriptor name
     *
     * @param string $name
     * @return OSDN_Jasper_Metadata_ResourceDescriptor
     */
    public function setName($name)
    {
        $this->_name = $name;
        return $this;
    }
    
    /**
     * Set parameters
     *
     * @param OSDN_Collection_ArrayList $parameters
     * @return OSDN_Jasper_Metadata_ResourceDescriptor
     */
    public function setParameters(OSDN_Collection_ArrayList $parameters)
    {
        $this->_parameters = $parameters;
        return $this;
    }
    
    public function setParentFolder($parentFolder)
    {
        $this->setResourceProperty(self::PROP_PARENT_FOLDER, (string) $parentFolder);
        return $this;
    }
    
    public function setPassword($password)
    {
        $this->setResourceProperty(self::PROP_DATASOURCE_PASSWORD, $password);
        return $this;
    }
    
    public function setPattern($pattern)
    {
        $this->setResourceProperty(self::PROP_DATATYPE_PATTERN, $pattern);
        return $this;
    }
    
    /**
     * Replace all the properties with the specified list.
     *
     * @param OSDN_Collection_ArrayList $properties
     * @throws OSDN_Jasper_Exception
     * @return OSDN_Jasper_Metadata_ResourceDescriptor
     */
    public function setProperties(OSDN_Collection_ArrayList $properties)
    {
        $this->_properties = $properties;
        $this->_hm = new OSDN_Collection_HashMap();
        foreach ($properties as $resourceProperty) {
            if (!$resourceProperty instanceof OSDN_Jasper_Metadata_ResourceProperty) {
                throw new OSDN_Jasper_Exception('Property must be instanceof ' . 
                    'OSDN_Jasper_Metadata_ResourceProperty');
            }
            
            $name = $resourceProperty->getName();
            if ($this->_hm->exists($name)) {
                throw new OSDN_Jasper_Exception('The property is already exists.');
            }
            
            $this->_hm->add($name, $resourceProperty);
        }
        return $this;
    }
    
    /**
     * @todo implement
     *
     */
    public function setPropertyMap()
    {}
    
    /**
     * Convenient way to create the PROP_QUERY_DATA 
     * properties from a set of InputControlQueryDataRow 
     * the structure will be create as follow: 
     * PROP_QUERY_DATA { PROP_QUERY_DATA_ROW { PROP_QUERY_DATA_COLUMN_VALUE } } } 
     * A call to this method will set to null the queryDataCache
     *
     * @todo implement
     */
    public function setQueryData()
    {}
    
    /**
     * Set query value column
     *
     * @param string $queryValueColumn
     * @return 
     */
    public function setQueryValueColumn($queryValueColumn)
    {
        $this->setResourcePropertyString(self::PROP_QUERY_VALUE_COLUMN, $queryValueColumn);
        return $this;
    }
    
    /**
     * Set the list of columns using a String array 
     * The result is a new ResourceProperty (PROP_QUERY_VISIBLE_COLUMNS) 
     * filled with a set of children, one per column.
     *
     * @todo implement
     */
    public function setQueryVisibleColumns($readOnly)
    {}
    
    
    public function setReadOnly()
    {
        $this->setResourceProperty(self::PROP_INPUTCONTROL_IS_READONLY, (string) $readOnly);
        return $this;
    }
    
    public function setReferenceUri($referenceUri)
    {
        $this->setResourceProperty(self::PROP_FILERESOURCE_REFERENCE_URI, $referenceUri);
        return $this;
    }
    
    /**
     * Set resource property
     *
     * @param OSDN_Jasper_Metadata_ResourceProperty $resourceProperty
     * @return OSDN_Jasper_Metadata_ResourceDescriptor
     */
    public function setResourceProperty(OSDN_Jasper_Metadata_ResourceProperty $resourceProperty)
    {
        $resourcePropertyName = $resourceProperty->getName();
        if ($this->_hasResourceProperty($resourcePropertyName)) {
            $this->removeResourceProperty($resourceProperty);
        }
        
        $this->_properties->add($resourceProperty);
        $this->_hm->add($resourcePropertyName, $resourceProperty);
        return $this;
    }

    /**
     * Set resource property string
     *
     * @param string $resourcePropertyName
     * @param string $value
     * @return OSDN_Jasper_Metadata_ResourceDescriptor | null
     */
    public function setResourcePropertyString($resourcePropertyName, $value)
    {
        if (empty($resourcePropertyName)) {
            return null;
        }
            
        $resourceProperty = new OSDN_Jasper_Metadata_ResourceProperty($resourcePropertyName, (string) $value);
        return $this->setResourceProperty($resourceProperty);
    }
    
    /**
     * Set an integer resource property value.
     * 
     * @param resourcePropertyName the property name
     * @param value the value
     * @return OSDN_Jasper_Metadata_ResourceDescriptor | null
     */ 
    public function setResourcePropertyInt($resourcePropertyName, $value)
    {
        if (empty($resourcePropertyName)) {
            return null;
        }
            
        $resourceProperty = new OSDN_Jasper_Metadata_ResourceProperty($resourcePropertyName, (string) (int) $value);
        return $this->setResourceProperty($resourceProperty);
    }
    
    /**
     * Set a boolean resource property value.
     * 
     * @param resourcePropertyName the property name
     * @param value the value
     * @return OSDN_Jasper_Metadata_ResourceDescriptor | null
     */
    public function setResourcePropertyBoolean($resourcePropertyName, $value)
    {
        if (empty($resourcePropertyName)) {
            return;
        }
            
        $resourceProperty = new OSDN_Jasper_Metadata_ResourceProperty($resourcePropertyName, (boolean) $value);
        return $this->setResourceProperty($resourceProperty);
    } 
    
    public function setResourceType($resourceType)
    {
        $this->setResourceProperty(self::PROP_RESOURCE_TYPE, (string) $resourceType);
        return $this;
    }
    
    public function setServiceClass($svcClass)
    {
        $this->setResourceProperty(self::PROP_DATASOURCE_CUSTOM_SERVICE_CLASS, (string) $svcClass);
        return $this;
    }
    
    /**
     * Set SQL query
     *
     * @param string $sql
     * @return OSDN_Jasper_Metadata_ResourceDescriptor
     */
    public function setSql($sql)
    {
        $this->setResourcePropertyString(self::PROP_QUERY, $sql);
        return $this;
    }
    
    public function setStrictMax($strictMax)
    {
        $this->setResourcePropertyString(self::PROP_DATATYPE_STRICT_MAX, (string) $strictMax);
        return $this;
    }
    
    public function setStrictMin($strictMin)
    {
        $this->setResourcePropertyString(self::PROP_DATATYPE_STRICT_MIN, (string) $strictMin);
        return $this;
    }
    
    /**
     * Set the descriptor uri string
     *
     * @param string $uriString
     * @return OSDN_Jasper_Metadata_ResourceDescriptor
     */
    public function setUriString($uriString)
    {
        $this->_uriString = $uriString;
        return $this;
    }
    
    public function setUsername($username)
    {
        $this->setResourcePropertyString(self::PROP_DATASOURCE_USERNAME, (string) $username);
        return $this;
    }
    
    public function setVersion($version)
    {
        $this->setResourcePropertyString(self::PROP_VERSION, (string) $version);
        return $this;
    }
    
    /**
     * Set wsType
     *
     * @param string $wsType
     * @return OSDN_Jasper_Metadata_ResourceDescriptor
     */
    public function setWsType($wsType)
    {
        $this->_wsType = $wsType;
        return $this;
    }
    
    public function __toString()
    {
        $resourceDescriptorContent = array();
        
        if (!$this->_children->isEmpty()) {
            $resourceDescriptorContent[] = join("", $this->getChildren()->toArray());
        }
        
        $resourceDescriptorContent[] = join("", $this->getProperties()->toArray());
        
        if (!is_null($this->_label)) {
            $resourceDescriptorContent[] = sprintf($this->_tplLabel, (string) $this->getLabel());
        }
        
        if (!is_null($this->_description)) {
            $resourceDescriptorContent[] = sprintf($this->_tplDescription, (string) $this->getDescription());
        }
        
        if (!$this->_parameters->isEmpty()) {
            $resourceDescriptorContent[] = join("", $this->getParameters()->toArray());
        }

        return sprintf($this->_tpl, 
            $this->getName(), 
            $this->getWsType(), 
            $this->getUriString(), 
            $this->getIsNew() ? 'true' : 'false',
            join("", $resourceDescriptorContent)
        );
    }
}