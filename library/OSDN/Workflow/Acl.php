<?php

/**
 * Simple workflow ACL
 *
 * @category		OSDN
 * @package		OSDN_Workflow
 * @version		$Id: Acl.php 8879 2009-05-21 15:00:08Z yaroslav $
 */
class OSDN_Workflow_Acl
{
    protected $_executionId;
    
    public function __construct($executionId)
    {
        if (empty($executionId) || !is_int($executionId)) {
            throw new OSDN_Workflow_Exception('The execution id is empty.');
        }
        
        $this->_executionId = $executionId;
    }
    
    public function isAllowed($stepId)
    {
        $prefix = OSDN_Db_Table_Abstract::getDefaultPrefix();
        $adapter = OSDN_Db_Table_Abstract::getDefaultAdapter();
        
        $select = $adapter->select()
            ->from(array('we'  => $prefix . 'workflow_execution'), array())
            ->join(
                array('ws'   => $prefix . 'workflow_steps'),
                '`ws`.`workflow_id` = `we`.`workflow_id`',
                array()
            )
            ->joinLeft(
                array('wap_roles'    => $prefix . 'workflow_acl_permissions_roles'),
                '`ws`.`id` = `wap_roles`.`ws_id`',
                array()
            )
            ->joinLeft(
                array('wap_accounts'  => $prefix . 'workflow_acl_permissions_accounts'),
                '`ws`.`id` = `wap_accounts`.`ws_id`',
                array()
            )
            ->where('we.id = ?', $this->_executionId)
            ->where('ws.id = ?', $stepId);
            
        $select
            ->where('(`wap_roles`.`role_id` = ?', OSDN_Accounts_Prototype::getRoleId())
            ->orWhere('`wap_accounts`.`account_id` = ?)', OSDN_Accounts_Prototype::getId());
            
        $select->columns(array('count'  => new Zend_Db_Expr('COUNT(*)')));
        
        try {
            $count = $select->query()->fetchColumn(0);
        } catch (Exception $e) {
            return false;
        }

        return $count > 0;
    }
}