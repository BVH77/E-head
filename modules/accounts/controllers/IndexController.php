<?php

class Accounts_IndexController extends OSDN_Controller_Action
{
    public function permission(OSDN_Controller_Action_Helper_Acl $acl)
    {
        $acl->setResource(OSDN_Acl_Resource_Generator::getInstance()->accounts);
        $acl->isAllowed(OSDN_Acl_Privilege::VIEW, 'get-accounts');
    }
    
    /**
     * Retrieve the users list
     * @deprecated
     *
     * temporary using for osdn.users.combolist widget
     */
    public function getAccountsAction()
    {
        $accounts = new OSDN_Accounts();
        $response = $accounts->fetchAll();
        if ($response->isError()) {
            $this->_collectErrors($response);
            return;
        }
        
        $output = array();
        foreach ($response->rows as $row) {
            $output[] = array(
                'id'    => $row['id'],
                'name'  => $row['name'],
                'email' => $row['email']
            );
        }
        
        $this->view->accounts = $output;
    }
}
