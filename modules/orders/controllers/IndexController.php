<?php

class Orders_IndexController extends OSDN_Controller_Action
{
	/**
	 * @var PMS_Orders
	 */
	protected $_class;
	
	public function init()
	{
		$this->_class = new PMS_Orders();
		parent::init();
	}
	
    public function permission(OSDN_Controller_Action_Helper_Acl $acl)
    {
        $acl->setResource(OSDN_Acl_Resource_Generator::getInstance()->admin);
        $acl->isAllowed(OSDN_Acl_Privilege::UPDATE, 'change-user');
        
        $acl->setResource(OSDN_Acl_Resource_Generator::getInstance()->archive);
        $acl->isAllowed(OSDN_Acl_Privilege::VIEW, 'get-archive-list');
        $acl->isAllowed(OSDN_Acl_Privilege::UPDATE, 'archive');
        $acl->isAllowed(OSDN_Acl_Privilege::UPDATE, 'un-archive');
        
        $acl->setResource(OSDN_Acl_Resource_Generator::getInstance()->orders);
        $acl->isAllowed(OSDN_Acl_Privilege::VIEW,   'get-list');
        $acl->isAllowed(OSDN_Acl_Privilege::VIEW,   'get');
        $acl->isAllowed(OSDN_Acl_Privilege::UPDATE,    'add');
        $acl->isAllowed(OSDN_Acl_Privilege::UPDATE, 'update');
        $acl->isAllowed(OSDN_Acl_Privilege::UPDATE, 'delete');
        $acl->isAllowed(OSDN_Acl_Privilege::VIEW, 'get-notes');
        $acl->isAllowed(OSDN_Acl_Privilege::UPDATE, 'add-note');
        
        $acl->setResource(OSDN_Acl_Resource_Generator::getInstance()->suppliers);
        $acl->isAllowed(OSDN_Acl_Privilege::VIEW,   'get-suppliers');
        $acl->isAllowed(OSDN_Acl_Privilege::UPDATE, 'attach-supplier');
        $acl->isAllowed(OSDN_Acl_Privilege::UPDATE, 'remove-supplier');
        $acl->isAllowed(OSDN_Acl_Privilege::UPDATE, 'check-supplier');
        $acl->isAllowed(OSDN_Acl_Privilege::UPDATE, 'update-supplier');
    }
    
	public function getListAction()
    {
    	$response = $this->_class->getList($this->_getAllParams());
    	if ($response->isSuccess()) {
    		$this->view->succces = true;
    	    $this->view->data = $response->getRowset();
    	    $this->view->totalCount = $response->totalCount;
    	} else {
    		$this->_collectErrors($response);
    	}
    }
    
    public function getAction()
    {
    	$response = $this->_class->get($this->_getParam('id'));
    	if ($response->isSuccess()) {
    	    $this->view->success = true;
    	    $this->view->data = $response->getRow();
    	} else {
    	   $this->_collectErrors($response);
    	}
    }
    

    public function getInfoAction()
    {
        $response = $this->_class->getInfo($this->_getParam('id'));
        if ($response->isSuccess()) {
            $this->view->success = true;
            $this->view->data = $response->getRow();
        } else {
           $this->_collectErrors($response);
        }
    }
    
    public function addAction()
    {
        $response = $this->_class->add($this->_getAllParams());
        if ($response->isSuccess()) {
            $this->view->success = true;
            $this->view->id = $response->id;
            $this->sendEmailOrderProcessed('added', $response->id);
        } else {
           $this->_collectErrors($response);
        }
    }
    
    public function updateAction()
    {
    	$data = $this->_getAllParams();
        $response = $this->_class->update($data);
        if ($response->isSuccess()) {
        	if (empty($data['success_date_fact'])) {
                $this->sendEmailOrderProcessed('updated', $this->_getParam('id'));
        	} else {
        		$this->sendEmailOrderSuccess($this->_getParam('id'));
        	}
            $this->view->success = true;
        } else {
           $this->_collectErrors($response);
        }
    }
    
    public function getArchiveListAction()
    {
        $response = $this->_class->getList($this->_getAllParams(), array(), 1);
        if ($response->isSuccess()) {
            $this->view->succces = true;
            $this->view->data = $response->getRowset();
            $this->view->totalCount = $response->totalCount;
        } else {
            $this->_collectErrors($response);
        }
    }
    
    public function archiveAction()
    {
        $response = $this->_class->archive($this->_getAllParams());
        if ($response->isSuccess()) {
            $this->view->success = true;
        } else {
           $this->_collectErrors($response);
        }
    }
    
    public function unArchiveAction()
    {
        $response = $this->_class->archive(array('id' => $this->_getParam('id')), false);
        if ($response->isSuccess()) {
            $this->view->success = true;
        } else {
           $this->_collectErrors($response);
        }
    }
    
    public function deleteAction()
    {
        $response = $this->_class->delete($this->_getParam('id'));
        if ($response->isSuccess()) {
            $this->view->success = true;
        } else {
           $this->_collectErrors($response);
        }
    }
    
    public function changeUserAction()
    {
        $response = $this->_class->changeUser($this->_getParam('orderId'), $this->_getParam('userId'));
        if ($response->isSuccess()) {
            $this->view->success = true;
        } else {
           $this->_collectErrors($response);
        }
    }
    
    
    // -------------------------------------------------------------------------
    
    public function getSuppliersAction()
    {
    	$suppliers = new PMS_Suppliers();
        $response = $suppliers->getByOrderId($this->_getParam('orderId'));
        if ($response->isSuccess()) {
            $this->view->success = true;
            $this->view->suppliers = $response->getRowset();
        } else {
           $this->_collectErrors($response);
        }
    }
    
    public function attachSupplierAction()
    {
        $suppliers = new PMS_Suppliers();
        $response = $suppliers->attach(
            $this->_getParam('supplier_id'), 
            $this->_getParam('order_id')
        );
        if ($response->isSuccess()) {
            $this->view->success = true;
        } else {
           $this->_collectErrors($response);
        }
    }
    
    public function removeSupplierAction()
    {
        $suppliers = new PMS_Suppliers();
        $response = $suppliers->remove($this->_getParam('id'));
        if ($response->isSuccess()) {
            $this->view->success = true;
        } else {
           $this->_collectErrors($response);
        }
    }
    
    public function checkSupplierAction()
    {
        $suppliers = new PMS_Suppliers();
        $response = $suppliers->check(
            intval($this->_getParam('id')), 
            intval($this->_getParam('success'))
        );
        if ($response->isSuccess()) {
            $this->view->success = true;
        } else {
           $this->_collectErrors($response);
        }
    }
    
    public function updateSupplierAction()
    {
        $suppliers = new PMS_Suppliers();
        $response = $suppliers->updateByOrdersSuppliersId(array(
            'id'   => $this->_getParam('id'), 
            'cost' => $this->_getParam('cost'),
            'note' => $this->_getParam('note')
        ));
        if ($response->isSuccess()) {
            $this->view->success = true;
        } else {
           $this->_collectErrors($response);
        }
    }
    
    // --------------------------------------------------
    
    public function getNotesAction()
    {
        $response = $this->_class->getNotes($this->_getParam('orderId'));
        if ($response->isSuccess()) {
            $this->view->success = true;
            $this->view->rows = $response->getRowset();
        } else {
           $this->_collectErrors($response);
        }
    }
    
    public function addNoteAction()
    {
        $response = $this->_class->addNote($this->_getParam('orderId'), $this->_getParam('text'));
        if ($response->isSuccess()) {
            $this->view->success = true;
        } else {
           $this->_collectErrors($response);
        }
    }
    
    /*
     * =========================================================================
     * 
     * Private methods
     * 
     * =========================================================================
     */
    private function sendEmailOrderProcessed($type = '', $orderId)
    {
        if (!in_array($type, array('updated', 'added'))) {
            return;
    	}
        $response = $this->_class->get($orderId);
        if ($response->hasNotSuccess()) {
        	return;
        }
        $order = $response->getRow();
        if (empty($order) || empty($order['created'])) {
        	return;
        }
        
        // check if order is younger than 1 hour, when return - no message
        if ($type == 'updated') {
	        $now = new Zend_Date();
	        $created = new Zend_date($order['created']);
	        $diff = $now->getTimestamp() - $created->getTimestamp(); 
	        if ($diff < 60*60) {
	        	return;
	        }
        }
        
        $orderAddress = $order['address'];
        $customer = $order['customer_name'];
        
    	$currentPerson = OSDN_Accounts_Prototype::getInformation();
    	$username = $currentPerson->name;
    	
    	$persons = array();
    	
    	$accounts = new OSDN_Accounts();
    	$response = $accounts->fetchByRole(4); // 4 = production
    	if ($response->isSuccess()) {
            $rows = $response->getRowset();
    		foreach ($rows as $row) {
    			if ($currentPerson->email != $row['email'] && $row['active'] == 1) {
                    $persons[] = array('email' => $row['email'], 'name' => $row['name']);
    			}
    		}
    	}
    	$response = $accounts->fetchByRole(5); // 5 = mount
    	if ($response->isSuccess()) {
            $rows = $response->getRowset();
            foreach ($rows as $row) {
                if ($currentPerson->email != $row['email'] && $row['active'] == 1) {
                    $persons[] = array('email' => $row['email'], 'name' => $row['name']);
                }
    		}
    	}
    	$response = $accounts->fetchByRole(1); // 1 = director
    	if ($response->isSuccess()) {
    	    $rows = $response->getRowset();
            foreach ($rows as $row) {
                if ($row['email'] != $currentPerson->email && $row['active'] == 1) {
                    $persons[] = array('email' => $row['email'], 'name' => $row['name']);
                }
    		}
    	}
    	if ($currentPerson->role_id != 3) { // 3 = manager
    		$creator_id = $order['creator_id'];
    		$response = $accounts->fetchAccount($creator_id);
    		if ($response->isSuccess()) {
	            $row = $response->rowset;
	            if (!empty($row) && $row['active'] == 1) {
                    $persons[] = array('email' => $row['email'], 'name' => $row['name']);
	            }
    		}
    	}
    	
    	$config = Zend_Registry::get('config');
    	$server = $config->mail->SMTP;
        $mail = new Zend_Mail('UTF-8');
    	foreach ($persons as $person) {
            $mail->addTo($person['email'], $person['name']);
    	}
        $mail->setFrom($config->mail->from->address, $config->mail->from->caption);
        switch ($type) {
            case 'added':
                $mail->setSubject("Новый заказ №$orderId");
                $mail->setBodyHtml("Новый заказ №$orderId, заказчик: $customer, 
                                   адрес: $orderAddress, был добавлен.\n\n  
                                   Автор: $username.\n\n http://$server/?id=$orderId");
                break;
            case 'updated':
                $mail->setSubject("Изменения в заказе №$orderId");
                $mail->setBodyHtml("В заказ №$orderId, заказчик: $customer, 
                                   адрес: $orderAddress были внесены изменения.\n\n  
                                   Автор: $username.\n\n http://$server/?id=$orderId");
                break;
        }
        try {
            @$mail->send();
        } catch (Exception $e) {
            //echo $e->getMessage();
        }    	
    }
    
    private function sendEmailOrderSuccess($orderId)
    {
    	$accounts = new OSDN_Accounts();
    	$response = $accounts->fetchByRole(7); // 7 = bookkeepers
    	if ($response->isSuccess()) {
	    	$config = Zend_Registry::get('config');
	    	$server = $config->mail->SMTP;
	        $mail = new Zend_Mail('UTF-8');
	        $rows = $response->getRowset();
            foreach ($rows as $row) {
                $mail->addTo($row['email'], $row['name']);
    		}
	        $mail->setFrom($config->mail->from->address, $config->mail->from->caption);
	        $mail->setSubject("Выполнен заказ №$orderId");
	        $mail->setBodyHtml("Подробности здесь: http://$server/?id=$orderId");
	        try {
	            @$mail->send();
	        } catch (Exception $e) {
	            //echo $e->getMessage();
	        }    	
    	}
    }
}