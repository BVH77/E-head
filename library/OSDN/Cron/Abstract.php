<?php

abstract class OSDN_Cron_Abstract
{
    protected $_debug = false;
    
    /**
     * Collection container
     *
     * @var OSDN_Collection_ArrayList
     */
    protected $_collection;
    
    public function __construct(array $configs = array())
    {
        $this->_collection = new OSDN_Collection_ArrayList();
    }
    
    public function setDebug($flag)
    {
        $this->_debug = (boolean) $flag;
        return $this;
    }
    
    abstract function read();
    
    abstract function write();
    
    abstract function append();
    
    abstract function add(OSDN_Cron_Unix_Interface $type);
    
    abstract function addMultiple(array $tasks);
    
    abstract function deleteById($id);
    
    abstract function clear();
}