<?php

/**
 * Class for manipulation workflow permissions
 *
 * @category		OSDN
 * @package		OSDN_Workflow
 * @version		$Id: Permission.php 8965 2009-05-26 12:22:06Z yaroslav $
 */
class OSDN_Workflow_Acl_Permission
{
    public function fetchAll($accountId, $roleId)
    {
        $response = new OSDN_Response();
        
        $f = new OSDN_Filter_Input(array(
            '*' => 'int'
        ), array(
            '*' => 'id'
        ), array(
            'accountId' => $accountId,
            'roleId'    => $roleId
        ));
        
        $response->addInputStatus($f);
        if ($response->hasNotSuccess()) {
            return $response;
        }
        
        $prefix = OSDN_Db_Table_Abstract::getDefaultPrefix();
        $adapter = OSDN_Db_Table_Abstract::getDefaultAdapter();
        $select = $adapter->select()
            ->from(
                array('ws'  =>  $prefix . 'workflow_steps'),
                array('step' => 'name')
            )
            ->join(
                array('w'   => $prefix . 'workflow'),
                'ws.workflow_id = w.id',
                array('workflow' => 'name')
            )
            ->joinLeft(
                array('wap_roles' => $prefix . 'workflow_acl_permissions_roles'),
                'wap_roles.ws_id = ws.id',
                array()
            )
            ->joinLeft(
                array('wap_accounts' => $prefix . 'workflow_acl_permissions_accounts'),
                'wap_accounts.ws_id = ws.id',
                array()
            );
        
        $select
            ->where('(`wap_roles`.`role_id` = ?', $f->roleId)
            ->orWhere('`wap_accounts`.`account_id` = ?)', $f->accountId);
        
        try {
            $rowset = $select->query()->fetchAll();
            $response->setRowset($rowset);
            $response->addStatus(new CA_Student_Status(CA_Student_Status::OK));
        } catch (Exception $e) {
            if (OSDN_DEBUG) {
                throw $e;
            }
            
            $response->addStatus(new CA_Student_Status(CA_Student_Status::DATABASE_ERROR));
            return $response;
        }
        
        return $response;
    }
}