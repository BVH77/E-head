<?php

/**
 * Allow edit account personal information
 *
 * @version		$Id: PersonalController.php 7946 2009-04-10 07:36:44Z vasya $
 */
class Accounts_PersonalController extends OSDN_Controller_Action
{
    public function permission(OSDN_Controller_Action_Helper_Acl $acl)
    {
        $acl->setResource(OSDN_Acl_Resource_Generator::getInstance()->accounts->personal);
        $acl->isAllowed(OSDN_Acl_Privilege::VIEW, 'fetch');
        $acl->isAllowed(OSDN_Acl_Privilege::UPDATE, 'update');
        $acl->isAllowed(OSDN_Acl_Privilege::UPDATE, 'change-password');
        $acl->isAllowed(OSDN_Acl_Privilege::VIEW, 'get-scan-config');
    }
    
    public function getScanConfigAction()
    {
        $this->view->data = array(
            'imageType'         => OSDN_Config::get('scanner_imageType'),
            'pixelType'         => OSDN_Config::get('scanner_pixelType'),
            'ifShowUI'          => OSDN_Config::get('scanner_ifShowUI'),
            'IfFeederEnabled'   => OSDN_Config::get('scanner_IfFeederEnabled'),
            'IfDuplexEnabled'   => OSDN_Config::get('scanner_IfDuplexEnabled'),
            'Resolution'        => OSDN_Config::get('scanner_Resolution'),
            'ScanSource'        => OSDN_Config::get('scanner_ScanSource')
        );
    }

    public function fetchAction()
    {
        $id = OSDN_Accounts_Prototype::getId();
        $accounts = new OSDN_Accounts();
        $response = $accounts->fetchAccount($id);
        if ($response->isError()) {
            $this->_collectErrors($response);
            return;
        }
        
        $this->view->rows = array($response->rowset);
        $this->view->success = true;
    }
    
    public function updateAction()
    {
        $accounts = new OSDN_Accounts();
        $id = OSDN_Accounts_Prototype::getId();
        $response = $accounts->updatePersonalInformation($id, $this->_getAllParams());
        if ($response->isError()) {
            $this->_collectErrors($response);
            return;
        }
        
        $this->view->success = true;
    }
    
    public function changePasswordAction()
    {
        $accounts = new OSDN_Accounts();
        $id = OSDN_Accounts_Prototype::getId();
        $response = $accounts->chPassword($id, $this->_getAllParams());
        if ($response->isError()) {
            $this->_collectErrors($response);
            return;
        }
        $this->view->success = true;
    }
}