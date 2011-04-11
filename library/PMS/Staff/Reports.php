<?php

class PMS_Staff_Reports
{
	protected $_tableHr, $_tableStaff;

    public function __construct()
    {
        $this->_tableHr = new PMS_Staff_Hr_Table();
        $this->_tableStaff = new PMS_Staff_Table();
    }

    public function generateStaff(array $params)
    {
        $response = new OSDN_Response();

        $f = new OSDN_Filter_Input(array(
            '*' => 'StringTrim'
        ), array(
            'start'  => array('Date', 'allowEmpty' => false),
            'end'    => array('Date', 'allowEmpty' => false)
        ), $params);

        $response->addInputStatus($f);
        if ($response->hasNotSuccess()) {
            return $response;
        }

        $select = $this->_tableHr->getAdapter()->select()
        ->from(array('hr' => $this->_tableHr->getTableName()),
            array(
                'hours_total'   => new Zend_Db_Expr('SUM(value)'),
                'summ_total'    => new Zend_Db_Expr('IF(s.pay_period = "month",
                    s.pay_rate,SUM(value*s.pay_rate))'),
            )
        )
        ->joinLeft(array('s' => $this->_tableStaff->getTableName()),
            'hr.staff_id=s.id', array(
                'name', 'function',
                'rate' => 's.pay_rate',
                'period' => 's.pay_period',
            )
        )
        ->group('staff_id')
        ->where('date >= ?', $f->start)
        ->where('date <= ?', $f->end)
        ;

        try {
            $rows = $select->query()->fetchAll();
        } catch (Exception $e) {
            if (OSDN_DEBUG) {
                throw $e;
            }
            return $response->addStatus(new PMS_Status(PMS_Status::DATABASE_ERROR));
        }
        $result = array(
            'rows'  => $rows,
            'start' => $f->start,
            'end'   => $f->end
        );
        $response->data = $result;
        return $response->addStatus(new PMS_Status(PMS_Status::OK));
    }
}