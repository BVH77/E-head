<?php

class OSDN_Workflow_Execution_Plugin_History extends OSDN_Workflow_Execution_Plugin_Abstract
{
    public function beforeExecutionStarted(OSDN_Workflow_Execution $execution)
    {
        var_dump($execution->getCurrentStep());
    }
    
    public function afterExecutionStarted( ezcWorkflowExecution $execution )
    {
        var_dump($execution->getCurrentStep());
    }
    
    public function afterExecutionSuspended( ezcWorkflowExecution $execution )
    {
        var_dump($execution->getCurrentStep());
    }
    
    public function afterExecutionResumed( ezcWorkflowExecution $execution )
    {
        var_dump($execution->getCurrentStep());
    }
    
    public function afterExecutionCancelled( ezcWorkflowExecution $execution )
    {
        var_dump($execution->getCurrentStep());
    }
    
    public function afterExecutionEnded( ezcWorkflowExecution $execution )
    {
        var_dump($execution->getCurrentStep());
    }
    
    public function beforeNodeActivated( ezcWorkflowExecution $execution, ezcWorkflowNode $node )
    {
        var_dump($execution->getCurrentStep());
    }
    
    public function afterNodeActivated( ezcWorkflowExecution $execution, ezcWorkflowNode $node )
    {
        var_dump($execution->getCurrentStep());
    }
    
    public function afterThreadStarted( ezcWorkflowExecution $execution, $threadId, $parentId, $numSiblings )
    {
        var_dump($execution->getCurrentStep());
    }
    
    public function afterThreadEnded( ezcWorkflowExecution $execution, $threadId )
    {
        var_dump($execution->getCurrentStep());
    }
}