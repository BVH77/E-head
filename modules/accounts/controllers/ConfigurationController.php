<?php

class Accounts_ConfigurationController extends OSDN_Configuration_Controllers_Abstract
{
    public function permission(OSDN_Controller_Action_Helper_Acl $acl)
    {
        $acl->setResource(OSDN_Acl_Resource_Generator::getInstance()->accounts->configuration);
        $acl->isAllowed(OSDN_Acl_Privilege::VIEW, 'load-profile-settings');
        $acl->isAllowed(OSDN_Acl_Privilege::UPDATE, 'save-profile-settings');
    }
}
