<?php

/**
 * Workflow exteption
 *
 * @category    OSDN
 * @package     OSDN_Workflow
 * @version     $Id: Exception.php 8819 2009-05-19 13:40:00Z yaroslav $
 */
abstract class OSDN_Workflow_Step_Abstract
{
    /**
     * required parameters
     *
     * @var array
     */
    protected $_requiredParameters = array();
    
    /**
     * OSDN_Workflow_Execution object
     *
     * @var OSDN_Workflow_Execution
     */
    protected $_execution;
    
    protected $_params = array();
    
    /**
     * Cunstructor.
     *
     * @param  OSDN_Workflow_Execution $directory
     */
    public function __construct(OSDN_Workflow_Execution $execution = null)
    {
        $this->_execution = $execution;
    }
    
    public function setParams(array $params, $applyOnly = true) {
        
        if ($applyOnly) {
            $this->_params = array_merge($this->_params, $params);
        } else {
            $this->_params = $params;            
        }
        
        return $this;
    }
    
    protected function _getParam($paramName)
    {
        if (!empty($this->_params[$paramName])) {
            return $this->_params[$paramName];
        }
        
        return $this->getExecution()->getVariable($paramName);
    }
    
    /**
     * Return name of step
     *
     * @return string|false
     */
    public function getName()
    {
        $classname = get_class($this);
        $classname = str_replace('CA_Workflow_Step_', '', $classname);
        $classname = str_replace('OSDN_Workflow_Step_', '', $classname);
        if ($classname) {
            return $classname;
        }
        
        return false;
    }
    
    /**
     * Fetch step id
     *
     * Try to fetching step id.
     * If step is not found try to add the new one.
     *
     * @return int
     */
    public function getId()
    {
        if (!empty($this->_id)) {
            return (int) $this->_id;
        }
        
        $name = $this->getName();
        $this->_id = $this->_getId($name);
        return $this->_id;
    }
    
    /**
     * Return configuration of step
     *
     * @return return
     */
    public function getConfiguration($name = null)
    {
        if (!$this->_execution) {
            return null;
        }
        if (!$this->_execution || !$this->_execution->workflow) {
            throw new OSDN_Workflow_Exception("Execution or workflow is not set");
        }
        if (isset($this->_execution->workflow->steps)
            && isset($this->_execution->workflow->steps[$this->getName()])
            && $this->_execution->workflow->steps[$this->getName()]['configuration']
            ) {
            $configuration = $this->_execution->workflow->steps[$this->getName()]['configuration'];
        } else {
            $configuration = array();
        }
        if (isset($name)) {
            return isset($configuration[$name])? $configuration[$name]: array();
        }
        return $configuration;
    }
    
    protected function _getId($name)
    {
        $workflowId = $this->getExecution()->getWorkflow()->id;
        $row = $this->_getTable()->fetchRow(array(
            'name = ?'          => $name,
            'workflow_id = ?'   => $workflowId
        ));
        if (!empty($row)) {
            return (int) $row->id;
        }
        
        $id = $this->_getTable()->insert(array(
            'name'              => $name,
            'workflow_id'   => $workflowId
        ));
        
        if (empty($id)) {
            return false;
        }
        
        return (int) $id;
    }
    
    /**
     * Retrieve the table object
     *
     * @return OSDN_Workflow_Step_Table
     */
    protected function _getTable()
    {
        if (empty($this->_table)) {
            $this->_table = new OSDN_Workflow_Step_Table();
        }
        
        return $this->_table;
    }
    
    /**
     * Return execution object
     *
     * @param  OSDN_Workflow_Execution $directory
     *
     * @return OSDN_Workflow_Execution
     */
    public function setExecution($execution)
    {
        $this->_execution = $execution;
    }
    
    /**
     * Return execution object
     *
     * @return OSDN_Workflow_Execution
     */
    public function getExecution()
    {
        if (empty($this->_execution)) {
            throw new OSDN_Workflow_Exception("The execution is empty");
        }
        
//        if (!$this->_execution instanceof OSDN_Workflow_Execution) {
//            throw new OSDN_Workflow_Exception("$this->_execution must be instance of OSDN_Workflow_Execution")
//        }
        
        return $this->_execution;
    }
    
    /**
     * Return required parameters
     *
     * @return array
     */
    public function getRequiredParameters()
    {
        return $this->_requiredParameters;
    }
    
    /**
     * Return title of step
     *
     * @return string
     */
    public function getTitle()
    {
        return '';
    }
    
    /**
     * Return default title of step
     *
     * @return string
     */
    public function getDefaultTitle()
    {
        return '';
    }
}
