<?php

/**
 * OSDN_Workflow_Node_SetStep
 *
 * @category OSDN_Workflow
 * @package OSDN_Workflow_Node
 */
class OSDN_Workflow_Node_SetStep extends ezcWorkflowNode
{
    /**
     * Executes this node.
     *
     * @param ezcWorkflowExecution $execution
     * @return boolean true when the node finished execution,
     *                 and false otherwise
     * @ignore
     */
    public function execute(ezcWorkflowExecution $execution)
    {
        $canExecute = true;
        $currentStep = $execution->getCurrentStep();
        
        if (!isset($this->configuration['step'])) {
            throw new OSDN_Workflow_Xml_Exception('Step was missed');
        }
        $execution->setActiveStep($this->configuration['step']);
        
        if (isset($this->configuration['unset'])) {
            foreach ((array)$this->configuration['unset'] as $variable)
            {
                $execution->unsetVariable( $variable );
            }
        }
        
        $this->activateNode($execution, $this->outNodes[0]);
        $result = parent::execute($execution);
        
        $history = new OSDN_Workflow_History();
        $previous = null;
        if (false !== $currentStep) {
            $previous = $currentStep->getId();
        }

        $current = null;
        $currentStep = $execution->getCurrentStep();
        if (false !== $currentStep) {
            $current = $currentStep->getId();
        }

        $history->add(array(
            'execution_id'      => $execution->getId(),
            'account_id'        => OSDN_Accounts_Prototype::getId(),
            'previous_step_id'  => $previous,
            'current_step_id'   => $current,
            'variables'         => $execution->getVariables()
        ));

        return $result;
    }
}

