<?php

/**
 * Reports conroller
 * @version $Id: $
 */
class Expenses_ReportController extends OSDN_Controller_Action
{
    protected $_reports;

	public function init()
	{
		$this->_reports = new PMS_Expenses_Reports();
        $this->_helper->viewRenderer->setNoRender(true);
        $this->_helper->layout->setLayout('report');
	}

    public function permission(OSDN_Controller_Action_Helper_Acl $acl)
    {
        $acl->setResource(OSDN_Acl_Resource_Generator::getInstance()->expenses);
        $acl->isAllowed(OSDN_Acl_Privilege::UPDATE, 'index');
        $acl->isAllowed(OSDN_Acl_Privilege::UPDATE, 'vacations');
        $acl->isAllowed(OSDN_Acl_Privilege::UPDATE, 'pays');
    }

    public function indexAction()
    {
    	$response = $this->_reports->get($this->_getAllParams());
    	if ($response->isSuccess()) {
	    	$this->view->data = $response->data;
	        $this->view->content = $this->view->render('report/index.phtml');
    	} else {
    		$this->_collectErrors($response);
    	}
    }
}
