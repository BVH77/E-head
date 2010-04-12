<?php

/**
 * Report generator
 *
 * @abstract
 *
 * @category		OSDN
 * @package		OSDN_Jasper_Report_Generate
 * @version		$Id: Abstract.php 6239 2009-01-16 14:24:53Z flash $
 */
abstract class OSDN_Jasper_Report_Generate_Abstract
{
    /**
     * An SQL query
     *
     * @var string
     */
    protected $_query;

    /**
     * Default adapter
     *
     * @var Zend_Db_Adapter_Abstract
     */
    protected $_db;

    /**
     * Default view renderer
     *
     * @var Zend_View_Abstract
     */
    protected $_view;
    
    /**
     * Template name
     *
     * @var string
     */
    protected $_template = "";
    
    /**
     * The constructor
     *
     * @param OSDN_Jasper_Metadata_Request $request
     */
    public function __construct(OSDN_Jasper_Metadata_Request $request)
    {
        $rd = $request->getResourceDescriptor();
        $parameters = $rd->getParameters();
        $value = null;
        foreach ($parameters as $p) {
            if ($p->getName() == 'REPORT_QUERY') {
                $value = $p->getValue();
                break;
            }
        }
        
        $this->setQuery($value);
    }
    
    /**
     * Fetch query
     *
     * @return string   The SQL query
     */
    public function getQuery()
    {
        return $this->_query;
    }
    
    /**
     * Fetch template
     *
     * @return string
     */
    public function getTemplate()
    {
        return $this->_template;
    }
    
    /**
     * Get view renderer
     *
     * @return Zend_View_Abstract
     */
    public function getView()
    {
        if (!$this->_view instanceof Zend_View_Abstract) {
            throw new OSDN_Jasper_Report_Generate_Exception(
                'View must be instance of Zend_View_Abstract');
        }
        
        return $this->_view;
    }
    
    /**
     * Set default adapter
     *
     * @param Zend_Db_Adapter_Abstract $dbAdapter
     * @return OSDN_Jasper_Report_Generate_Abstract
     */
    public function setDbAdapter(Zend_Db_Adapter_Abstract $dbAdapter)
    {
        $this->_db = $dbAdapter;
        return $this;
    }
    
    /**
     * Set SQL query
     *
     * @param string $query     The SQL query
     * @return OSDN_Jasper_Report_Generate_Abstract
     */
    public function setQuery($query)
    {
        $this->_query = $query;
        return $this;
    }
    
    /**
     * Set template
     *
     * @param string $template
     * @return OSDN_Jasper_Report_Generate_Abstract
     */
    public function setTemplate($template)
    {
        $this->_template = (string) $template;
        return $this;
    }
    
    /**
     * Set view renderer
     *
     * @param Zend_View_Abstract $view
     * @return OSDN_Jasper_Report_Generate_Abstract
     */
    public function setView(Zend_View_Abstract $view)
    {
        $this->_view = $view;
        return $this;
    }
    
    /**
     * Generate output content
     *
     * @return string
     */
    abstract public function generate();
}