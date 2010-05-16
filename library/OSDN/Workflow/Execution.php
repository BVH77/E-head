<?php

/**
 *
 * @category OSDN
 * @package OSDN
 */
abstract class OSDN_Workflow_Execution extends ezcWorkflowExecution
{
    /**
     * step varible name
     *
     * @var string
     */
    protected $_stepName = 'step';
    
    /**
     * step varible name
     *
     * @var string
     */
    protected $_currentStepName = 'currentStep';
    
    /**
     * @var OSDN_Response
     */
    protected $_response;
    
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->_response = new OSDN_Response();
    }
    
    /**
     * Starts the execution of the workflow and returns the execution id.
     *
     * $parentId is used to specify the execution id of the parent workflow
     * when executing subworkflows. It should not be used when manually
     * starting workflows.
     *
     * Calls doStart() right before the first node is activated.
     *
     * @param int $parentId
     * @return mixed Execution ID if the workflow has been suspended,
     *               null otherwise.
     * @throws ezcWorkflowExecutionException
     *         If no workflow has been set up for execution.
     */
    public function start($parentId = 0)
    {
        foreach ($this->plugins as $plugin) {
            if (false === $plugin->beforeExecutionStarted($this)) {
                return false;
            }
        }
        
        return parent::start($parentId);
    }
    
    /**
     * Return response object
     *
     * @return OSDN_Response
     */
    public function getResponse()
    {
        return $this->_response;
    }
    
    /**
     * Set active step
     *
     * @return string
     */
    public function setActiveStep($value)
    {
        $stepName = $this->_stepName;
        if ($this->hasVariable($stepName)) {
            $steps = $this->getVariable($stepName);
        } else {
            $steps = array();
        }
        $steps[$value] = true;
        $this->setCurrentStep($value);
        $this->setVariable($stepName, $steps);
        return $this;
    }
    
    /**
     * unset active step
     *
     * @return string
     */
    public function unsetActiveStep($value)
    {
        $stepName = $this->_stepName;
        if ($this->hasVariable($stepName)) {
            $steps = $this->getVariable($stepName);
        } else {
            $steps = array();
        }
        $steps[$value] = false;
//        $this->setCurrentStep(false);
        $this->setVariable($stepName, $steps);
        return $this;
    }
    
    /**
     * get active steps
     *
     * @return boolean
     */
    public function getActiveSteps($value)
    {
        $stepName = $this->_stepName;
        if ($this->hasVariable($stepName)) {
            $steps = $this->getVariable($stepName);
        } else {
            $steps = array();
        }
        return isset($steps[$value])? $steps[$value]: false;
    }
    
    /**
     * set step active
     *
     * @return string
     */
    public function setCurrentStep($value)
    {
        $this->setVariable($this->_currentStepName, $value);
        return $this;
    }
    
    /**
     * get step status
     *
     * @return OSDN_Workflow_Step_Abstract | false
     */
    public function getCurrentStep()
    {
        if (!$this->hasVariable($this->_currentStepName)) {
            return false;
        }
        
        $step = false;
        $stepName = $this->getVariable($this->_currentStepName);
        if (!empty($stepName)) {
            $step = CA_Workflow_Step_Collection::factory($stepName, $this);
        }
        
        return $step;
    }
    
    /**
     * return name of variable step
     *
     * @return string
     */
    public function getStepName()
    {
        return $this->_stepName;
    }

    /**
     * return name of variable current step
     *
     * @return string
     */
    public function getCurrentStepName()
    {
        return $this->_currentStepName;
    }
    
    /**
     * Retrive the workflow object
     *
     * @return ezcWorkflow
     */
    public function getWorkflow()
    {
        return $this->workflow;
    }
}

