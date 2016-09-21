<?php

class Orders_ExpencesController extends OSDN_Controller_Action
{
    public function permission(OSDN_Controller_Action_Helper_Acl $acl)
    {
        $acl->setResource(OSDN_Acl_Resource_Generator::getInstance()->orders);
        $acl->isAllowed(OSDN_Acl_Privilege::VIEW, 'get-list');
    }

	public function getListAction()
    {
    	$orderId = $this->_getParam('order_id');
        $table = new PMS_Storage_History_Table();

    	$select = $table->getAdapter()->select();
    	$select->from(array('sh' => $table->getTableName()),
	               array('created',
	                   'sa.name', 'sa.measure',
	                   'qty'  => new Zend_Db_Expr('sh.qty  * -1'),
	                   'price' => 'sa.unit_price',
	                   'summ' => new Zend_Db_Expr('sa.unit_price * sh.qty  * -1')))
    	   ->join(array('sa' => 'storage_assets'), 'sh.asset_id=sa.id', array())
           ->where('order_id = ?', $orderId);

        try {
            $rows = $select->query()->fetchAll();
            $this->view->data = $rows;
        } catch (Exception $e) {
            if (OSDN_DEBUG) {
                throw $e;
            }
            $status = PMS_Status::DATABASE_ERROR;
        }
    }

}