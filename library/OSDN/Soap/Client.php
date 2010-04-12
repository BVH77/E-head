<?php

class OSDN_Soap_Client extends Zend_Soap_Client
{
    /**
     * Initialize SOAP Client object
     *
     * @throws Zend_Soap_Client_Exception
     */
    protected function _initSoapClientObject()
    {
        $wsdl = $this->getWsdl();
        $options = array_merge($this->getOptions(), array('trace' => true));


        if ($wsdl == null) {
            if (!isset($options['location'])) {
                throw new Zend_Soap_Client_Exception('\'location\' parameter is required in non-WSDL mode.');
            }
            if (!isset($options['uri'])) {
                throw new Zend_Soap_Client_Exception('\'uri\' parameter is required in non-WSDL mode.');
            }
        } else {
            if (isset($options['use'])) {
                throw new Zend_Soap_Client_Exception('\'use\' parameter only works in non-WSDL mode.');
            }
            if (isset($options['style'])) {
                throw new Zend_Soap_Client_Exception('\'style\' parameter only works in non-WSDL mode.');
            }
        }
        unset($options['wsdl']);

        $this->_soapClient = new OSDN_Soap_Client_Common(array($this, '_doRequest'), $wsdl, $options);
    }
    
    /**
     * Perform a SOAP call
     *
     * @param string $name
     * @param array  $arguments
     * @return mixed
     */
    public function __call($name, $arguments)
    {
        if ($this->_soapClient == null) {
            $this->_initSoapClientObject();
        }

        $this->_lastMethod = $name;
        
        // @todo when bo library will be migrated to 1.8 zend framework this shit will be removed.
        if (1 == Zend_Version::compareVersion('1.7')) {

            $soapHeaders = array_merge($this->_permanentSoapInputHeaders, $this->_soapInputHeaders);
            $result = $this->_soapClient->__soapCall($name,
                                                     $this->_preProcessArguments($arguments),
                                                     null, /* Options are already set to the SOAP client object */
                                                     (count($soapHeaders) > 0)? $soapHeaders : null,
                                                     $this->_soapOutputHeaders);
    
            // Reset non-permanent input headers
            $this->_soapInputHeaders = array();

        } else {
            $result = call_user_func_array(array($this->_soapClient, $name), $this->_preProcessArguments($arguments));
        }
        
        return $this->_preProcessResult($result);
    }
}