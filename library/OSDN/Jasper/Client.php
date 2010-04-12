<?php

/**
 * Jasper webservice client
 *
 * @category		OSDN
 * @package		OSDN_Jasper_Client
 * @version		$Id: Client.php 6272 2009-01-19 14:26:49Z flash $
 */
class OSDN_Jasper_Client
{
    /**
     * Default namespace
     *
     * @var string
     */
    protected $_namespace = 'http://www.jaspersoft.com/namespaces/php';

    /**
     * Soap client
     *
     * @var OSDN_Soap_Client
     */
    protected $_client;
    
    /**
     * Report attachment
     *
     * @var string
     */
    protected $_attachment = "";
    
    /**
     * Default db adapter
     *
     * @var Zend_Db_Adapter_Abstract
     */
    protected $_db = null;
    
    /**
     * Default view renderer
     *
     * @var Zend_View_Abstract
     */
    protected $_view;
    
    /**
     * Shared repository
     *
     * @var boolean
     */
    protected $_isSharedRepository = false;
    
    /**
     * The constructor
     * Initialize RPC client
     *
     * @param array $options
     */
    public function __construct($options)
    {
        if ($options instanceof Zend_Config) {
            $options = $options->toArray();
        }
        
        $this->_client = new OSDN_Soap_Client(null, $options);
    }
    
    /**
     * Run report
     *
     * @param OSDN_Jasper_Metadata_Request $request
     * @return OSDN_Jasper_Metadata_OperationResult
     */
	public function runReport(OSDN_Jasper_Metadata_Request $request)
	{
	    if ($this->isLocal($request->getArgumentValue(OSDN_Jasper_Metadata_Argument::RUN_OUTPUT_FORMAT))) {
            $generator = new OSDN_Jasper_Report_Generate_Sxls($request);
            
            /**
             * try setap database adapter
             */
            if (is_null($this->_db)) {
                $this->_db = OSDN_Db_Table_Abstract::getDefaultAdapter();
            }
            $generator->setDbAdapter($this->_db);
            
            /**
             * try setup view renderer
             */
            
            $extension = 'phtml';
            if (is_null($this->_view) && Zend_Controller_Action_HelperBroker::hasHelper('ViewRenderer')) {
                $viewRenderer = Zend_Controller_Action_HelperBroker::getStaticHelper('ViewRenderer');
                $this->_view = $viewRenderer->view;
                $extension = $viewRenderer->getViewSuffix();
            }
            
            $generator->setView($this->_view);
            
            $uriString = $request->getResourceDescriptor()->getUriString();
            $path = array('..', 'reports');
            
            // try to retrieve the company name
            if (true !== $this->_isSharedRepository) {
                $company = basename(dirname($uriString));
                if ($company) {
                    $path[] = (string) $company;
                }
            }
            
            $path[] = basename($uriString);
            $generator->setTemplate(join(DIRECTORY_SEPARATOR, $path) . '.' . $extension);
            
            $this->setAttachment($generator->generate());
            $operationResult = new OSDN_Jasper_Metadata_OperationResult();
            $operationResult->setReturnCode(0);
            return $operationResult;
	    }
	    
	    /**
	     * Request
	     */
        $requestXml = $request->__toString();
        $response = $this->_client->runReport(new SoapParam(new SoapVar($requestXml, XSD_ANYTYPE), 'request'));
        return new OSDN_Jasper_Metadata_OperationResult($response);
	}
	
	public function get(OSDN_Jasper_Metadata_Request $request)
	{
	    $requestXml = $request->__toString();
        $response = $this->_client->get(new SoapParam(new SoapVar($requestXml, XSD_ANYTYPE), 'request'));
        return new OSDN_Jasper_Metadata_OperationResult($response);
	}
	
	/**
	 * Retrieve the attachment
	 *
	 * @return string|null
	 */
	public function getAttachment()
	{
	    if (!empty($this->_attachment)) {
	        return $this->_attachment;
	    }
	    
	    $attachments = $this->_client->getAttachments();
	    reset($attachments);
	    return current($attachments);
	}
	
	/**
	 * Set attachment
	 *
	 * @param string $attachment
	 * @return OSDN_Jasper_Client
	 */
	public function setAttachment($attachment)
	{
	    $this->_attachment = $attachment;
	    return $this;
	}
	
	/**
	 * Set default adapter
	 *
	 * @param Zend_Db_Adapter_Abstract $dbAdapter
	 * @return OSDN_Jasper_Client
	 */
	public function setDbAdapter(Zend_Db_Adapter_Abstract $dbAdapter)
	{
	    $this->_db = $dbAdapter;
	    return $this;
	}
	
	/**
	 * Set view renderer
	 *
	 * @param Zend_View_Abstract $view
	 * @return OSDN_Jasper_Client
	 */
	public function setView(Zend_View_Abstract $view)
	{
	    $this->_view = $view;
	    return $this;
	}
	
	/**
	 * Check if report generation is locally
	 *
	 * @param string $format
	 * @return boolean
	 */
	public function isLocal($format)
	{
        return in_array($format, array(
            OSDN_Jasper_Metadata_Argument::RUN_OUTPUT_FORMAT_SXLS
        ));
	}
	
	/**
	 * Set to default using shared repository
	 *
	 * @param boolean $flag
	 * @return OSDN_Jasper_Client
	 */
	public function useSharedRepository($flag = true)
	{
	    $this->_isSharedRepository = (boolean) $flag;
	    return $this;
	}
}