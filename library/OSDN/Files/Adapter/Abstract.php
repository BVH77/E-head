<?php

/**
 * Abstract class for manipulate with files
 * 
 * @category    OSDN
 * @package     OSDN_Files
 * @version     $Id: $
 */
abstract class OSDN_Files_Adapter_Abstract
{
    /**
     * Create new file
     * 
     * @param array $data
     * @return OSDN_Response
     */
    public function insert(array $data)
    {}
    
    /**
     * Update file
     * 
     * @param int   $id     The file id
     * @param array $data   The file options
     * @return OSDN_Response
     */
    public function update($id, array $data)
    {}
    
    /**
     * Delete file
     * 
     * @param int $id   The file id
     * @return OSDN_Response
     */
    public function delete($id)
    {}
    
    public static function setDefaultAllowedTypes(array $types)
    {}
    
    public static function setDefaultAllowedExtensions(array $extensions)
    {}
    
    public function setAllowedTypes(array $types)
    {}
    
    public function setAllowedExtensions(array $extensions)
    {}
}