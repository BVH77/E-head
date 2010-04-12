<?php

class OSDN_Files extends OSDN_Files_Abstract
{
    const DB = 'db';
    
    const FILESYSTEM = 'filesystem';
    
    public function __construct($allowedFileTypes = null, $allowedFileExtensions = null)
    {
        if (!isset($allowedFileTypes)) {
            $this->_allowedFileTypes = Zend_Registry::get('config')->file->upload->types->toArray();
        }
        if (!isset($allowedFileExtensions)) {
            $this->_allowedFileExtensions = Zend_Registry::get('config')->file->upload->extensions->toArray();
        }
        parent::__construct($allowedFileTypes, $allowedFileExtensions);
    }
    
    /**
     * Create file storage adapter
     * 
     * @param string $adapter   The file storage adapter type
     * @param array  $config    The configuration of adapter 
     * 
     * @return OSDN_Files_Adapter_Abstract
     */
    public static function factory($adapter = self::DB, array $config = array())
    {
        if (empty($adapter)) {
            throw new OSDN_Exception('The adapter cannot be empty.');
        }
            
        if (!in_array($adapter, array(self::DB, self::FILESYSTEM))) {
            throw new OSDN_Exception('The adapter is not allowed.');    
        }
        
        $adapterCls = 'OSDN_Files_Adapter_' . ucfirst($adapter);
        return new $adapterCls;
    }
}
