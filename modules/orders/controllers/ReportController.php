<?php

/**
 * Reports conroller
 * @version $Id: IndexController.php 10173 2009-07-03 13:28:06Z uerter $
 */
class Orders_ReportController extends OSDN_Controller_Action
{
    protected $_reports;
	
	public function init()
	{
		$this->_reports = new PMS_Reports();
        $this->_helper->viewRenderer->setNoRender(true);
        $this->_helper->layout->setLayout('report');
	}
	
    public function permission(OSDN_Controller_Action_Helper_Acl $acl)
    {
        $acl->setResource(OSDN_Acl_Resource_Generator::getInstance()->orders);
        $acl->isAllowed(OSDN_Acl_Privilege::VIEW, 'schedule-mount');
        $acl->isAllowed(OSDN_Acl_Privilege::VIEW, 'schedule-production');
        $acl->isAllowed(OSDN_Acl_Privilege::VIEW, 'planning');
    }
	
    public function scheduleMountAction()
    {
    	$response = $this->_reports->generateSchedule('mount');
    	if ($response->isSuccess()) {
	    	$this->view->data = $response->data;
	        $this->view->content = $this->view->render('report/schedule.phtml');
    	} else {
    		$this->_collectErrors($response);
    	}
    }

    public function scheduleProductionAction()
    {
    	$response = $this->_reports->generateSchedule('production');
    	if ($response->isSuccess()) {
	    	$this->view->data = $response->data;
	        $this->view->content = $this->view->render('report/schedule.phtml');
    	} else {
    		$this->_collectErrors($response);
    	}
    }
	
    public function planningAction()
    {
    	$response = $this->_reports->generatePlanning();
    	if ($response->isSuccess()) {
	    	$this->view->data = $response->data;
	        $this->view->content = $this->view->render('report/planning.phtml');
    	} else {
    		$this->_collectErrors($response);
    	}
    }
}