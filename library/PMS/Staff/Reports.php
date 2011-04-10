<?php

class PMS_Staff_Reports
{
	protected $_tableHr, $_tableStaff;

    public function __construct()
    {
        $this->_tableHr = new PMS_Staff_Table();
        $this->_tableStaff = new PMS_Staff_Hr_Table();
    }

    public function generateStaff(array $params)
    {
        $response = new OSDN_Response();

        $f = new OSDN_Filter_Input(array(
            '*' => 'StringTrim'
        ), array(
            'start'  => array('Date', 'allowEmpty' => true),
            'end'    => array('Date', 'allowEmpty' => true)
        ), $params);

        $response->addInputStatus($f);
        if ($response->hasNotSuccess()) {
            return $response;
        }

        /*
        $select = $this->_tableOrders->getAdapter()->select()
        ->from(array('o' => $this->_tableOrders->getTableName()),
            array(
                'summ_total'    => new Zend_Db_Expr('SUM(`cost`)'),
                'summ_success'  => new Zend_Db_Expr('SUM(
                    IF(`success_date_fact` IS NOT NULL,`cost`,0))'),
                'failed_orders_count'  => new Zend_Db_Expr('SUM(
                    IF(`success_date_planned` < NOW()
                        AND `success_date_fact` IS NOT NULL,
                    0,1))')
            )
        )
        ->joinLeft(array('a' => $this->_tableAccounts->getTableName()),
            'o.creator_id=a.id', 'name')
        ->group('creator_id')
        ;
        if (!empty($f->start)) {
            $select->where('created >= ?', $f->start);
        }
        if (!empty($f->end)) {
            $select->where('created <= ?', $f->end);
        }
        try {
            $rows = $select->query()->fetchAll();
        } catch (Exception $e) {
            //throw $e;
            return $response->addStatus(new PMS_Status(PMS_Status::DATABASE_ERROR));
        }
        */
        $result = array(
            //'rows'  => $rows,
            'start' => $f->start,
            'end'   => $f->end
        );
        $response->data = $result;
        return $response->addStatus(new PMS_Status(PMS_Status::OK));
    }
}