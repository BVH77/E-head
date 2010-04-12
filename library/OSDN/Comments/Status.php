<?php

/**
 * Comments status constant
 * 
 * @category OSDN
 * @package OSDN_Comments
 */
class OSDN_Comments_Status extends OSDN_Response_Status_Storage_Abstract     
{
    /**
     * Module code
     *
     * @var int
     */
    protected $_moduleCode = OSDN_EntityTypes::COMMENT;
    
    /**
     * Module name
     *
     * @var int
     */
    protected $_moduleName = 'Comment';
    
    const DELETE_REPLY_IS_ALREADY_MADE = -21;
    const DELETE_RESPONSE_IS_NEED = -22;
    const DELETE_CONNECTION_ARE_PRESENT = -23;
    
    const UPDATED_REPLY_IS_ALREADY_MADE = -32;
    const UPDATED_RESPONSE_IS_NEED = -33;
    
    const REPLY_PARENT_NOT_EXISTS = -40;
    
    const REACTION_FROM_USER_BEFORE = -50;
    
    const COMMENTARY_IS_MISSING = -51;
    
    /**
     * Description storage
     *
     * @var array
     */
    protected $_storage = array(
        self::ADDED                         => 'Comment has been added',
        self::ADD_FAILED                    => 'Comment addition failed',
        
        self::DELETED                       => 'Comment has been deleted',
        self::DELETE_FAILED                 => 'Comment deleting failed',
        self::DELETE_REPLY_IS_ALREADY_MADE  => 'Deleting failed. Reply had been already made.',
        self::DELETE_RESPONSE_IS_NEED       => 'Deleting failed. Response is needed.',
        self::DELETE_CONNECTION_ARE_PRESENT => 'Deleting failed. Connection is present.',
        
        self::UPDATED                       => 'Comment has been successfully updated',
        self::UPDATED_FAILURE               => 'Comment update failed',
        self::UPDATED_NO_ONE_ROWS_UPDATED   => 'No rows were updated',
        self::UPDATED_REPLY_IS_ALREADY_MADE => 'Comment update failed. Reply had been already made.',
        self::UPDATED_RESPONSE_IS_NEED      => 'Update failed. Response is needed.',
        
        self::REPLY_PARENT_NOT_EXISTS       => 'Reply parent does not exist',
        
        self::REACTION_FROM_USER_BEFORE     => 'The date reaction from user before is incorrect',
        self::COMMENTARY_IS_MISSING         => 'The commentary is missing'
    );
}
