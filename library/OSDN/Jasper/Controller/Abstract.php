<?php

class OSDN_Jasper_Controller_Abstract extends OSDN_Controller_Action
{
    protected $_configuration;
    
    public function init()
    {
        $this->_configuration = Zend_Registry::get('config')->jasper;
        parent::init();
    }
    
    public function saveAction()
    {
        $uniq = $this->_set($this->_getAllParams());
        $this->view->success = true;
        $this->view->uniq = $uniq;
    }
    
    protected function _get($uniq)
    {
        $ns = new Zend_Session_Namespace($this->_getNamespace());
        
        $uniq = (string) $uniq;
        $params = null;
        if (isset($ns->$uniq)) {
            $params = $ns->$uniq;
            unset($ns->$uniq);
        }
        
        return is_array($params) ? $params : array();
    }
    
    protected function _set(array $params)
    {
        $ns = new Zend_Session_Namespace($this->_getNamespace());
        $uniq = md5(uniqid());
        $ns->$uniq = $params;
        return $uniq;
    }
    
    protected function _getNamespace()
    {
        return $this->getRequest()->getControllerName();
    }
}