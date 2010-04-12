<?php

/**
 * Workflow executer that suspends and resumes workflow
 * execution states to and from a database.
 *
 * @package OSDN_Workflow_Database
 * @version $Id: Execution.php 9150 2009-05-29 07:29:35Z yaroslav $
 */
class OSDN_Workflow_Database_Execution extends OSDN_Workflow_Execution
{
    
    
    /**
     * Zend_Db_Adapter_Abstract instance to be used.
     *
     * @var Zend_Db_Adapter_Abstract
     */
    protected $_db;
    
    /**
     * Flag that indicates whether the execution has been loaded.
     *
     * @var boolean
     */
    protected $loaded = false;

    /**
     * Definition storage object
     *
     * @var OSDN_Workflow_Database_Definition
     */
    protected $_definition;
    
    protected $_prefix = '';
    
    /**
     * Construct a new database execution.
     *
     * This constructor is a tie-in.
     *
     * @param  Zend_Db_Adapter_Abstract $db
     * @param  int                      $executionId
     * @throws ezcWorkflowExecutionException
     */
    public function __construct(Zend_Db_Adapter_Abstract $db, $executionId = null)
    {
        if ($executionId !== null && !is_int($executionId)) {
            throw new OSDN_Workflow_Database_Exception("$executionId must be an integer.");
        }

        $this->_db = $db;
        
        $this->_definition = new OSDN_Workflow_Database_Definition($db);
        $this->_prefix = OSDN_Db_Table_Abstract::getDefaultPrefix();

        if (is_int($executionId)) {
            $this->_loadExecution($executionId);
        }
        
        parent::__construct();
    }
    
    
    /**
     * Start workflow execution.
     *
     * @param  int $parentId
     */
    protected function doStart($parentId)
    {
        $this->_db->beginTransaction();
        
        $this->_db->insert($this->_prefix . 'workflow_execution', array(
            'workflow_id'   => (int) $this->workflow->id,
            'parent_id'     => !empty($parentId)? (int) $parentId: new Zend_Db_Expr('NULL'),
            'started'       => time(),
            'variables'     => OSDN_Workflow_Database_Utils::serialize($this->variables),
            'waiting_for'   => OSDN_Workflow_Database_Utils::serialize($this->waitingFor),
            'threads'       => OSDN_Workflow_Database_Utils::serialize($this->threads),
            'next_thread_id'=> (int) $this->nextThreadId
        ));
        $this->id = (int) $this->_db->lastInsertId($this->_prefix . 'workflow_execution', 'id');
        
        $startWorkflowStep = new OSDN_Workflow_Step_Start($this);
        $startWorkflowStep->getId();
        
        $endWorkflowStep = new OSDN_Workflow_Step_End($this);
        $endWorkflowStep->getId();
    }

    /**
     * Suspend workflow execution.
     *
     * @throws OSDN_Workflow_Database_Exception
     */
    protected function doSuspend()
    {
        $this->_db->delete(
            $this->_prefix . 'workflow_execution_steps',
            $this->_db->quoteInto('execution_id = ?', (int) $this->id)
        );
        
        if (!empty($this->variables[$this->_stepName]) && is_array($this->variables[$this->_stepName])) {
            
            $workflowStep = new OSDN_Workflow_Step($this);
            
            foreach ($this->variables[$this->_stepName] as $step => $variableValue) {
                
                if (!empty($variableValue)) {
                    
                    // fetch step id
                    $stepId = $workflowStep->getIdByName($step);
                    
                    $this->_db->insert($this->_prefix . 'workflow_execution_steps', array(
                        'execution_id'  => (int) $this->id,
                        'step_id'       => $stepId
                    ));
                }
            }
        }
        
        $this->_db->update($this->_prefix . 'workflow_execution', array(
            'variables'     => OSDN_Workflow_Database_Utils::serialize($this->variables),
            'waiting_for'   => OSDN_Workflow_Database_Utils::serialize($this->waitingFor),
            'threads'       => OSDN_Workflow_Database_Utils::serialize($this->threads),
            'next_thread_id'=> (int) $this->nextThreadId
        ), $this->_db->quoteInto('id = ?',(int) $this->id));
        
        foreach ($this->activatedNodes as $node) {
            $this->_db->insert($this->_prefix . 'workflow_execution_state', array(
                'execution_id'          => (int) $this->id,
                'node_id'               => (int) $node->getId(),
                'node_state'            => OSDN_Workflow_Database_Utils::serialize($node->getState()),
                'node_activated_from'   => OSDN_Workflow_Database_Utils::serialize($node->getActivatedFrom()),
                'node_thread_id'        => (int) $node->getThreadId()
            ));
        }

        $this->_db->commit();
    }

    /**
     * Resume workflow execution.
     */
    protected function doResume()
    {
        $this->_db->beginTransaction();
        $this->_db->delete($this->_prefix . 'workflow_execution_state', array(
            $this->_db->quoteInto('execution_id = ?', (int) $this->id)
        ));
    }

    /**
     * End workflow execution.
     */
    protected function doEnd()
    {
        $this->_db->delete($this->_prefix . 'workflow_execution', array(
            $this->_db->quoteInto('id = ?', (int) $this->id)
        ));
        
        $this->_db->delete($this->_prefix . 'workflow_execution_state', array(
            $this->_db->quoteInto('execution_id = ?', (int) $this->id)
        ));

        if (!$this->isCancelled()) {
            $this->_db->commit();
        }
    }

    /**
     * Returns a new execution object for a sub workflow.
     *
     * @param  int $id
     * @return OSDN_Workflow_Database_Execution
     */
    protected function doGetSubExecution($id = null)
    {
        return new OSDN_Workflow_Database_Execution($this->_db, $id);
    }

    /**
     * Load execution state.
     *
     * @param int $executionId  ID of the execution to load.
     * @throws ezcWorkflowExecutionException
     */
    protected function _loadExecution($executionId)
    {
        
        $select = $this->_db->select()
            ->from($this->_prefix . 'workflow_execution', array(
                'workflow_id', 'variables', 'threads', 'next_thread_id', 'waiting_for'
            ))
            ->where('id = ?', (int) $executionId);

            
        try {
            $row = $select->query()->fetch();
        } catch(Exception $e) {
            throw new OSDN_Workflow_Database_Exception($e->getMessage(), $e->getCode());
        }
        
        if (empty($row)) {
            throw new OSDN_Workflow_Database_Exception('Could not load execution state.');
        }
        
        $this->id = $executionId;
        $this->nextThreadId = $row['next_thread_id'];

        $this->threads      = OSDN_Workflow_Database_Utils::unserialize($row['threads']);
        $this->variables    = OSDN_Workflow_Database_Utils::unserialize($row['variables']);
        $this->waitingFor   = OSDN_Workflow_Database_Utils::unserialize($row['waiting_for']);
                
        $workflowId     = $row['workflow_id'];
        
        $this->workflow = $this->_definition->loadById($workflowId);
 
        $select = $this->_db->select()
            ->from($this->_prefix . 'workflow_execution_state', array(
                'node_id', 'node_state', 'node_activated_from', 'node_thread_id'
            ))
            ->where('execution_id = ?', (int) $executionId);

        $rowset = $select->query()->fetchAll();
        
        $activatedNodes = array();

        foreach ($rowset as $row) {
            $activatedNodes[$row['node_id']] = array(
              'state'           => $row['node_state'],
              'activated_from'  => $row['node_activated_from'],
              'thread_id'       => $row['node_thread_id']
            );
        }

        foreach ($this->workflow->nodes as $node) {
            $nodeId = $node->getId();

            if (isset($activatedNodes[$nodeId])) {
                $node->setActivationState(ezcWorkflowNode::WAITING_FOR_EXECUTION);
                $node->setThreadId($activatedNodes[$nodeId]['thread_id']);
                $node->setState(OSDN_Workflow_Database_Utils::unserialize($activatedNodes[$nodeId]['state'], null));
                $node->setActivatedFrom(OSDN_Workflow_Database_Utils::unserialize($activatedNodes[$nodeId]['activated_from']));
                $this->activate($node, false);
            }
        }

        $this->cancelled = false;
        $this->ended     = false;
        $this->loaded    = true;
        $this->resumed   = false;
        $this->suspended = true;
    }
}