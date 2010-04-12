<?php
class OSDN_DocumentTypes extends OSDN_Documents_TypesAbstract
{
    public function __construct($entityType = null, $allowedDocumentTypes = null, $allowedFileExtensions = null)
    {
        if (!isset($allowedDocumentTypes)) {
            $this->_allowedDocumentTypes = Zend_Registry::get('config')->file->upload->types->toArray();
        }
        if (!isset($allowedFileExtensions)) {
            $this->_allowedFileExtensions = Zend_Registry::get('config')->file->upload->extensions->toArray();
        }
        parent::__construct($entityType, $allowedDocumentTypes, $allowedFileExtensions);
    }
}