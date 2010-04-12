<?php

class OSDN_Workflow_Node_Action extends ezcWorkflowNodeAction
{
    public function execute(ezcWorkflowExecution $execution)
    {
        $acl = new OSDN_Workflow_Acl($execution->getId());
        
        $workflowStep = new OSDN_Workflow_Step();
        $id = $workflowStep->getIdByName($execution->getCurrentStep()->getName());
        if (true !== $acl->isAllowed($id)) {
            return false;
        }
        return parent::execute($execution);
    }
}