<?php

abstract class OSDN_Workflow_Execution_Plugin_Abstract extends ezcWorkflowExecutionPlugin
{
    public function beforeExecutionStarted(OSDN_Workflow_Execution $execution)
    {}
    
    public function beforeStepChange(OSDN_Workflow_Execution $execution)
    {}
    
    public function afterStepChange(OSDN_Workflow_Execution $execution)
    {}
    
    
}