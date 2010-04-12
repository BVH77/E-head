<?php

/**
 * @category OSDN
 * @package OSDN_Controller
 */
class OSDN_Controller_Assemble_Status extends OSDN_Response_Status_Storage_Abstract     
{
    protected $_moduleCode = OSDN_EntityTypes::SYSTEM;

    protected $_moduleName = 'System';
    
    protected $_storage = array();
}
