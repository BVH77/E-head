<?php

class ConfigController extends OSDN_Controller_Action
{

    public function getTranslationAction()
    {
    	$this->disableRender(true);
    	echo new OSDN_Translation_Output_JsObject('OSDN.Translation.Storage');
    }

    public function setLocaleAction()
    {
        $locale = $this->_getParam('locale');
        OSDN_Language::setDefaultLocale($locale, true);
        $this->_redirect(Zend_Controller_Front::getInstance()->getBaseUrl() . '/');
    }

    public function getPermissionsAction()
    {
        $this->disableLayout(true);

        $isSuperAdministrator = OSDN_Accounts_Prototype::isSuperAdministrator();
        $this->view->isSuperAdministrator = $isSuperAdministrator;

        /**
         * Super administrator has access to all
         */
        if ($isSuperAdministrator) {
            $this->view->acl = array();
            $this->view->workflowPermissions = array();
            $this->view->resources = new stdClass();
            $this->view->privileges = new stdClass();
            return;
        }

        $acl = OSDN_Accounts_Prototype::getAcl();
        $aclCollection = array();
        if (!empty($acl)) {
            $aclCollection = (object) $acl->toArray();
        };
        $this->view->acl = $aclCollection;

        $resourceCollection = array();
        $resource = new OSDN_Acl_Resource();
        $response = $resource->fetchAll();
        if ($response->isSuccess()) {
            foreach (@$response->rows as $row) {
                $resourceCollection[] = array($row['id'], strtolower($row['name']), $row['parent_id']);
            }
        }

        $this->view->resources = $resourceCollection;
        $privilege = OSDN_Acl_Privilege::fetchAll();
        $this->view->privileges = (object) $privilege;
    }
}