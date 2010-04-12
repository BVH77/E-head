<?php

/**
 * Documents status constants
 *
 * @category OSDN
 * @package OSDN_Documents
 */
class OSDN_Documents_Status extends OSDN_Response_Status_Storage_Abstract
{
    /**
     * Module code
     *
     * @var int
     */
    protected $_moduleCode = 113;

    /**
     * Module name
     *
     * @var int
     */
    protected $_moduleName = 'Documents';

    const DELETE_NO_ONE_ROWS_DELETED = 21;
    const DELETE_FAILED_CONNECTION_ARE_PRESENT = -22;
    const CANNOT_BE_DELETED_BECAUSE_ITS_USING_ALREADY = -23;

    const MISSING_DOCUMENT = -72;

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
        self::DELETE_FAILED                 => 'Deleting failed',
        self::DELETE_FAILED_CONNECTION_ARE_PRESENT => 'Deleting failed. File connection is present',
        self::DELETE_NO_ONE_ROWS_DELETED    => 'Deleted. No one affected the rows',

        self::UPDATED                       => 'Updated successfully',
        self::UPDATED_FAILURE               => 'Update failed',
        self::UPDATED_NO_ONE_ROWS_UPDATED   => 'No rows were updated',

        self::CANNOT_BE_DELETED_BECAUSE_ITS_USING_ALREADY => 'Cannot be deleted because it is in use already',

        self::WRONG_FILE_FORMAT             => 'Wrong file format',

        self::MISSING_DOCUMENT              => 'Missing document'
    );
}
