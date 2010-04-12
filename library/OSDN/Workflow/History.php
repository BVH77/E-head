<?php

/**
 * Workflow history manager
 *
 * @category		OSDN
 * @package		OSDN_Workflow
 * @version		$Id: History.php 9159 2009-05-29 07:53:49Z vasya $
 */
class OSDN_Workflow_History
{
    /**
     * Table object
     *
     * @var OSDN_Workflow_History_Table
     */
    protected $_table;
    
    /**
     * The constructor
     *
     */
    public function __construct()
    {
        $this->_table = new OSDN_Workflow_History_Table();
        $this->_db = Zend_Registry::get('db');
        $this->_prefix = OSDN_Db_Table_Abstract::getDefaultPrefix();
    }
    
    /**
     * Add new history event
     *
     * @param array $data
     * @return boolean
     */
    public function add(array $data)
    {
        $f = new OSDN_Filter_Input(array(), array(
            'execution_id'      => array('id', 'presense' => 'required'),
            'account_id'        => array('id', 'presense' => 'required'),
            'previous_step_id'  => array('id', 'presense' => 'required', 'allowEmpty' => true),
            'current_step_id'   => array('id', 'presense' => 'required', 'allowEmpty' => true)
        ), $data);
        
        if ($f->hasInvalid()) {
            throw new OSDN_Workflow_Exception('Some fields are incorrect.');
        }
        
        $previous = $f->previous_step_id;
        $current = $f->current_step_id;
        if (empty($previous) && empty($current)) {
            throw new OSDN_Workflow_Exception('The both steps are empty.');
        }
        
        if (empty($previous)) {
            $previous = new Zend_Db_Expr('NULL');
        }
        
        if (empty($current)) {
            $current = new Zend_Db_Expr('NULL');
        }
        
        $id = $this->_table->insert(array(
            'execution_id'      => $f->execution_id,
            'account_id'        => $f->account_id,
            'previous_step_id'  => $previous,
            'current_step_id'   => $current,
            'variables'         => OSDN_Workflow_Database_Utils::serialize($f->variables)
        ));
        
        return $id > 0;
    }
    
    /**
     * Fetch all workflow execution history ordered by date
     *
     * @param struct $params
     *
     * @return OSDN_Response
     */
    public function fetchAll(array $params = array())
    {
        $response = new OSDN_Response();
        $validate = new OSDN_Validate_Id();
        if (isset($params['execution_id']) && !$validate->isValid($params['execution_id'])) {
            return $response->addStatus(new CA_Workflow_Status(CA_Workflow_Status::INPUT_PARAMS_INCORRECT, 'execution_id'));
        }
        $select = $this->_db->select();
        $select->from(
            array('wh' =>  $this->_table->getTableName())
        );
        $select->join(
            array('a' => $this->_prefix . 'accounts'),
            'a.id = wh.account_id'
        );
        $select->join(
            array('ws2' => $this->_prefix . 'workflow_steps'),
            'ws2.id = wh.current_step_id',
            array(
                'current_step_name' => 'name'
            )
        );
        $select->joinLeft(
            array('ws1' => $this->_prefix . 'workflow_steps'),
            'ws1.id = wh.previous_step_id',
            array(
                'previous_step_name' => 'name'
            )
        );
        $select->order('date ASC');
        
        if (isset($params['execution_id'])) {
            $select->where('wh.execution_id = ?', $params['execution_id']);
        }
        
        $plugin = new OSDN_Db_Plugin_Select(null, $select);
        $select = $plugin->parse($params);
        
        try {
            $query = $select->query();
        } catch (Exception $e) {
            if (OSDN_DEBUG) {
                throw $e;
            }
            $response->addStatus(new CA_Workflow_Status(CA_Workflow_Status::DATABASE_ERROR));
            return $response;
        }
        
        $rowset = array();
        $steps = array();
        
        while($row = $query->fetch()) {
            if (!array_key_exists($row['previous_step_name'], $steps) && !empty($row['previous_step_name'])) {
                $steps[$row['previous_step_name']] = CA_Workflow_Step_Collection::factory($row['previous_step_name']);
            }
            if (!array_key_exists($row['current_step_name'], $steps)) {
                $steps[$row['current_step_name']] = CA_Workflow_Step_Collection::factory($row['current_step_name']);
            }
            
            if (!empty($row['previous_step_name'])) {
                $row['previous_step_default_title'] = $steps[$row['previous_step_name']]->getDefaultTitle();
            }
            $row['current_step_default_title'] = $steps[$row['current_step_name']]->getDefaultTitle();
            $rowset[] = $row;
        }
            
        $response->data = $rowset;
        $response->totalCount = $plugin->getTotalCount();
        $response->addStatus(new CA_Student_Status(CA_Student_Status::OK));
        
        return $response;
    }
}