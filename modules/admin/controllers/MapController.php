<?php

class Admin_MapController extends OSDN_Controller_Action
{
    public function permission(OSDN_Controller_Action_Helper_Acl $acl)
    {
        $acl->setResource(OSDN_Acl_Resource_Generator::getInstance()->admin);
        $acl->isAllowed(OSDN_Acl_Privilege::VIEW, 'open');
    }

	public function openAction()
    {
        $this->disableLayout(true);
    }
}