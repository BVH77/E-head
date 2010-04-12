<?php

/**
 * OSDN_Workflow_Node_InputAction
 *
 * @category OSDN_Workflow
 * @package OSDN_Workflow_Node
 */
class OSDN_Workflow_Node_InputAction extends ezcWorkflowNodeAction
{
    
    /**
     * Constructs a new action node with the configuration $configuration.
     *
     * Configuration format
     * <ul>
     * <li>
     *   <b>String:</b>
     *   The class name of the service object. Must implement ezcWorkflowServiceObject. No
     *   arguments are passed to the constructor.
     * </li>
     *
     * <li>
     *   <b>Array:</b>
     *   <ul>
     *     <li><i>variables:</i> Variables which has to be waited for 
     *     <li><i>class:</i> The class name of the service object. Must implement ezcWorkflowServiceObject.</li>
     *     <li><i>arguments:</i> Array of values that are passed to the constructor of the service object.</li>
     *   </ul>
     * <li>
     * </ul>
     *
     * @param mixed $configuration
     * @throws ezcWorkflowDefinitionStorageException
     */
    public function __construct($configuration)
    {
        if (is_string($configuration))
        {
            $configuration = array(
                'class' => $configuration,
                'variables' => array()
            );
        }
        
        $tmp = array();
        foreach ($configuration['variables'] as $key => $value)
        {
            if (is_int($key)) {
                if (!is_string($value)) {
                    throw new ezcBaseValueException(
                      'workflow variable name', $value, 'string'
                    );
                }
                $variable  = $value;
                $condition = new ezcWorkflowConditionIsAnything;
            } else {
                if (!is_object($value) || !$value instanceof ezcWorkflowCondition) {
                    throw new ezcBaseValueException(
                        'workflow variable condition', $value, 'ezcWorkflowCondition'
                    );
                }
                $variable  = $key;
                $condition = $value;
            }
            $tmp[$variable] = $condition;
        }
        $configuration['variables'] = $tmp;
         
        if (!isset($configuration['arguments']))
        {
            $configuration['arguments'] = array();
        }
        parent::__construct($configuration);
    }
    
    
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
        $variables  = $execution->getVariables();
        $canExecute = true;
        $errors     = array();

        foreach ($this->configuration['variables'] as $variable => $condition) {
            if (!isset($variables[$variable])) {
                $execution->addWaitingFor( $this, $variable, $condition );
                $canExecute = false;
            } else if (!$condition->evaluate($variables[$variable])) {
                $errors[$variable] = (string)$condition;
            }
        }

        if (!empty($errors)) {
            throw new ezcWorkflowInvalidInputException( $errors );
        }
        

        if ($canExecute) {
//            $acl = new OSDN_Workflow_Acl($execution->getId());
//            $workflowStep = new OSDN_Workflow_Step();
//            $id = $workflowStep->getIdByName($execution->getCurrentStep()->getName());
//            if (true !== $acl->isAllowed($id)) {
//                return false;
//            }
            $object   = $this->createObject();
            $finished = $object->execute($execution);
        
            // Execution of the Service Object has finished.
            if ($finished !== false) {
                $this->activateNode($execution, $this->outNodes[0]);
                
                return parent::execute($execution);
            // Execution of the Service Object has not finished.
            } else {
                return false;
            }
            $this->activateNode($execution, $this->outNodes[0]);
            return parent::execute($execution);
        } else {
            return false;
        }
    }
}

