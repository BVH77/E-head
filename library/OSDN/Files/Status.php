<?php

/**
 * Files status constants
 *
 * @category OSDN
 * @package OSDN_Files
 */
class OSDN_Files_Status extends OSDN_Response_Status_Storage_Abstract
{
    /**
     * Module code
     *
     * @var int
     */
    protected $_moduleCode = 112;
    
    /**
     * Module name
     *
     * @var int
     */
    protected $_moduleName = 'Files';
       
    const DELETE_NO_ONE_ROWS_DELETED = 21;
    const DELETE_FAILED_CONNECTION_ARE_PRESENT = -22;
    const WRONG_FILE_FORMAT = -31;
    
    /**
     * Description storage
     *
     * @var array
     */
    protected $_storage = array(
        self::ADDED                         => 'Added',
        self::ADD_FAILED                    => 'Addition failed',
        
        self::DELETED                       => 'Deleted',
        self::DELETE_FAILED                 => 'Deletion failed',
        self::DELETE_FAILED_CONNECTION_ARE_PRESENT => 'Deletion failed. File connection is present',
        self::DELETE_NO_ONE_ROWS_DELETED    => 'Deleted. No one affected the rows',
        
        self::UPDATED                       => 'Updated successfully',
        self::UPDATED_FAILURE               => 'Update failed',
        self::UPDATED_NO_ONE_ROWS_UPDATED   => 'No rows were updated',
        
        self::WRONG_FILE_FORMAT             => 'Wrong file format'
    );
}
