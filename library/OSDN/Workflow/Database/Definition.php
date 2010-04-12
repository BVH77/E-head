<?php

/**
 * Workflow definition storage handler that saves and loads workflow
 * definitions to and from a database.
 *
 * @package WorkflowDatabaseTiein
 * @version $Id: Definition.php 9870 2009-06-26 05:28:51Z yaroslav $
 */
class OSDN_Workflow_Database_Definition implements ezcWorkflowDefinitionStorage
{
    /**
     * Zend_Db_Adapter_Abstract instance to be used.
     *
     * @var Zend_Db_Adapter_Abstract
     */
    protected $_db;
    
    /**
     * Default table prefix
     *
     * @var string
     */
    protected $_prefix = '';
    
    /**
     * Construct a new database definition handler.
     *
     * This constructor is a tie-in.
     *
     * @param ezcDbHandler $db
     */
    public function __construct(Zend_Db_Adapter_Abstract $db)
    {
        $this->_db = $db;
        $this->_prefix = OSDN_Db_Table_Abstract::getDefaultPrefix();
    }

    /**
     * Load a workflow definition by ID.
     *
     * Providing the name of the workflow that is to be loaded as the
     * optional second parameter saves a database query.
     *
     * @param  int $workflowId
     * @param  string  $workflowName
     * @param  int $workflowVersion
     * @return ezcWorkflow
     * @throws ezcWorkflowDefinitionStorageException
     * @throws ezcDbException
     */
    public function loadById($workflowId, $workflowName = '', $workflowVersion = 0)
    {
        // Query the database for the name and version of the workflow.
        //if (empty($workflowName) || $workflowVersion == 0) {
        $select = $this->_db->select()
            ->from($this->_prefix . 'workflow', array(
                'name', 'title', 'version', 'plugins'
            ))
            ->where('id = ?', (int) $workflowId);
            
        $row = $select->query()->fetch();
        
        if (empty($row)) {
            throw new OSDN_Workflow_Database_Exception('Could not load workflow definition.');
        }
        
        $workflowName    = $row['name'];
        $workflowVersion = $row['version'];
        $workflowTitle   = $row['title'];
        $workflowPlugins = OSDN_Workflow_Database_Utils::unserialize($row['plugins'], array());
        
        //}
        
        $select = $this->_db->select()
            ->from($this->_prefix . 'workflow_node', array(
                'id', 'node_class', 'node_configuration'
            ))
            ->where('workflow_id = ?', (int) $workflowId);
            
        $rowset = $select->query()->fetchAll();
        
        $nodes  = array();
        $finallyNode = null;
        $defaultEndNode = null;
        $startNode = null;
        
        foreach ($rowset as $node) {
            $configuration = OSDN_Workflow_Database_Utils::unserialize($node['node_configuration'], null);

            if (is_null($configuration)) {
                $configuration = ezcWorkflowUtil::getDefaultConfiguration($node['node_class']);
            }
            
            $nodes[$node['id']] = new $node['node_class']($configuration);

            $nodes[$node['id']]->setId($node['id']);

            if ($nodes[$node['id']] instanceof ezcWorkflowNodeFinally && !isset($finallyNode)) {
                $finallyNode = $nodes[$node['id']];
            } else if ($nodes[$node['id']] instanceof ezcWorkflowNodeEnd && !isset($defaultEndNode)) {
                $defaultEndNode = $nodes[$node['id']];
            } else if ($nodes[$node['id']] instanceof ezcWorkflowNodeStart && !isset($startNode)) {
               $startNode = $nodes[$node['id']];
            }
        }
        
        if (!isset($startNode) || !isset($defaultEndNode)) {
            throw new OSDN_Workflow_Database_Exception('Could not load workflow definition.');
        }

        $select = $this->_db->select()
            ->from(array('nc' => $this->_prefix . 'workflow_node_connection'))
            ->join(
                array('n' => $this->_prefix . 'workflow_node'),
                'nc.incoming_node_id = n.id'
            )
            ->where('n.workflow_id = ?', (int) $workflowId);
        
        $connections = $select->query()->fetchAll();

        foreach ($connections as $connection) {
            $nodes[$connection['incoming_node_id']]->addOutNode($nodes[$connection['outgoing_node_id']]);
        }

        if (!isset($finallyNode) || count($finallyNode->getInNodes()) > 0) {
            $finallyNode = null;
        }
        
        $select = $this->_db->select()
            ->from(array('w' => $this->_prefix . 'workflow_steps'))
            ->where('w.workflow_id = ?', (int) $workflowId);
        
        $steps = $select->query()->fetchAll();
        $stepsData = array();
        foreach ($steps as &$step) {
            $stepsData[$step['name']] = array(
                'id'            => $step['id'],
                'configuration' => OSDN_Workflow_Database_Utils::unserialize($step['configuration'])
            );
        }
        
        // Create workflow object and add the node objects to it.
        $workflow = new OSDN_Workflow($workflowName, $startNode, $defaultEndNode, $finallyNode);
        $workflow->definitionStorage = $this;
        $workflow->id           = (int) $workflowId;
        $workflow->version      = (int) $workflowVersion;
        $workflow->title        = $workflowTitle;
        $workflow->steps        = $stepsData;
        
        if (is_array($workflowPlugins)) {
            $workflow->plugins      = $workflowPlugins;
        }
        
        // Query the database for the variable handlers.
        $select = $this->_db->select()
            ->from($this->_prefix . 'workflow_variable_handler', array(
                'variable', 'class'
            ))
            ->where('workflow_id =?', (int) $workflowId);
        
        $result = $select->query()->fetchAll();
        $nodes  = array();

        if (!empty($result)) {
            foreach ($result as $variableHandler) {
                $workflow->addVariableHandler($variableHandler['variable'], $variableHandler['class']);
            }
        }

        // Verify the loaded workflow.
        $workflow->verify();
        return $workflow;
    }

    /**
     * Load a workflow definition by name.
     *
     * @param  string  $workflowName
     * @param  int $workflowVersion
     * @return ezcWorkflow
     * @throws OSDN_Workflow_Database_Exception
     */
    public function loadByName($workflowName, $workflowVersion = 0)
    {
        // Load the current version of the workflow.
        if ($workflowVersion == 0) {
            $workflowVersion = $this->getCurrentVersionNumber($workflowName);
        }

        // Query the database for the workflow ID.
        $select = $this->_db->select()
            ->from($this->_prefix . 'workflow', array('id'))
            ->where('name = ?', $workflowName)
            ->where('version = ?', (int) $workflowVersion);

        $row = $select->query()->fetch();
        
        if (empty($row)) {
            throw new OSDN_Workflow_Database_Exception('Could not load workflow definition.');
        }
        
        return $this->loadById($row['id'], $workflowName, $workflowVersion);
    }

    /**
     * Save a workflow definition to the database.
     *
     * @param  ezcWorkflow $workflow
     * @throws ezcWorkflowDefinitionStorageException
     * @throws ezcDbException
     */
    public function save(ezcWorkflow $workflow)
    {
        // Verify the workflow.
        $workflow->verify();
        $this->_db->beginTransaction();
        
        // Calculate new version number.
        $workflowVersion = $this->getCurrentVersionNumber($workflow->name) + 1;
        $workflowTitle = $workflow->title;

        $this->_db->insert($this->_prefix . 'workflow', array(
            'name'      => $workflow->name,
            'title'     => $workflowTitle,
            'version'   => (int) $workflowVersion,
            'created'   => time(),
            'plugins'   => OSDN_Workflow_Database_Utils::serialize($workflow->plugins)
        ));
        
        $workflow->id = (int)$this->_db->lastInsertId($this->_prefix . 'workflow', 'id');
        
        $workflow->definitionStorage = $this;
        $workflow->version = (int) $workflowVersion;

        // Write node table rows.
        $nodes    = $workflow->nodes;
        $keys     = array_keys( $nodes );
        $numNodes = count( $nodes );
        
        for ($i = 0; $i < $numNodes; $i++) {
            $id   = $keys[$i];
            $node = $nodes[$id];
        
            $this->_db->insert($this->_prefix . 'workflow_node', array(
                'workflow_id'       => (int) $workflow->id,
                'node_class'        => get_class($node),
                'node_configuration'=> OSDN_Workflow_Database_Utils::serialize($node->getConfiguration())
            ));
            
            $node->setId($this->_db->lastInsertId($this->_prefix . 'workflow_node', 'id'));
        }

        // Connect node table rows.
        for ($i = 0; $i < $numNodes; $i++) {
            $id   = $keys[$i];
            $node = $nodes[$id];

            foreach ($node->getOutNodes() as $outNode) {
                $this->_db->insert($this->_prefix . 'workflow_node_connection', array(
                    'incoming_node_id'  => (int) $node->getId(),
                    'outgoing_node_id'  => (int) $outNode->getId()
                ));
            }
        }

        // Write variable handler rows.
        foreach ($workflow->getVariableHandlers() as $variable => $class) {
            
            $this->_db->insert($this->_prefix . 'workflow_variable_handler', array(
                'workflow_id'   => (int) $workflow->id,
                'variable'      => $variable,
                'class'         => $class
            ));
        }

        $this->_db->commit();
    }

    /**
     * Returns the current version number for a given workflow name.
     *
     * @param  string $workflowName
     * @return int
     * @throws ezcDbException
     */
    public function getCurrentVersionNumber($workflowName)
    {
        $select = $this->_db->select()
            ->from($this->_prefix . 'workflow', array(
                'v' => new Zend_Db_Expr('MAX(version)')
            ))
            ->where('name = ?', $workflowName);
        $row = $select->query()->fetch();
        
        if (empty($row) || empty($row['v'])) {
            return 0;
        }
        
        return $row['v'];
    }
}