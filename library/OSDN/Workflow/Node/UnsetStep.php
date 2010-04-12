<?php

/**
 * OSDN_Workflow_Node_UnsetStep
 *
 * @category OSDN_Workflow
 * @package OSDN_Workflow_Node
 */
class OSDN_Workflow_Node_UnsetStep extends ezcWorkflowNode
{
     /**
     * Executes this node.
     *
     * @param ezcWorkflowExecution $execution
     * @return boolean true when the node finished execution,
     *                 and false otherwise
     * @ignore
     */
    public function execute( ezcWorkflowExecution $execution )
    {
        $execution->unsetActiveStep(isset($this->configuration['step'])? $this->configuration['step']: null);
        if (isset($this->configuration['unset'])) {
            foreach ((array)$this->configuration['unset'] as $variable)
            {
                $execution->unsetVariable( $variable );
            }
        }
        $this->activateNode($execution, $this->outNodes[0]);
        return parent::execute( $execution );
    }
}

