<?php

/**
 * Class for manipulation workflow resources
 *
 * @category		OSDN
 * @package		OSDN_Workflow
 * @version		$Id: Resource.php 8879 2009-05-21 15:00:08Z yaroslav $
 */
class OSDN_Workflow_Acl_Resource
{
    /**
     * Table object
     *
     * @var OSDN_Workflow_Acl_Resource_Table
     */
    protected $_table;
    
    protected $_workflowId;
    
    /**
     * The constructor
     *
     */
    public function __construct($workflowId)
    {
        $this->_workflowId = $workflowId;
        $this->_table = new OSDN_Workflow_Step_Table();
    }
    
    public function fetchIdByStep($step)
    {
        if (empty($step)) {
            return false;
        }
        
        $row = $this->_table->fetchRow(array(
            'name = ?'          => $step,
            'workflow_id = ?'   => $this->_workflowId
        ));
        
        if (!empty($row)) {
            return (int) $row->id;
        }
        
        $id = $this->_table->insert(array(
            'step'          => $step,
            'workflow_id'   => $this->_workflowId
        ));
        
        return (int) $id;
    }
}