<?php

class PMS_Staff_Reports
{
	protected $_tableHr, $_tableStaff;

    public function __construct()
    {
        $this->_tableHr = new PMS_Staff_Hr_Table();
        $this->_tablePayments = new PMS_Staff_Payments_Table();
        $this->_tableStaff = new PMS_Staff_Table();
    }

    public function generateStaff(array $params)
    {
        $response = new OSDN_Response();

        $f = new OSDN_Filter_Input(array(
            '*' => 'StringTrim'
        ), array(
            'start'  => array('Date', 'allowEmpty' => false, 'presence' => 'required'),
            'end'    => array('Date', 'allowEmpty' => false, 'presence' => 'required')
        ), $params);

        $response->addInputStatus($f);
        if ($response->hasNotSuccess()) {
            return $response;
        }

        $rowsMerged     = array();
        $rowStructure   = array(
            'hours_total'   => 0,
            'summ_total'    => 0,
            'pays_total'    => 0,
            'rate'          => 0,
            'period'        => 0,
            'name'          => '',
            'function'      => ''
        );

        // Get total summ of working hours by person for given period
        $select = $this->_tableHr->getAdapter()->select()
        ->from(array('s' => $this->_tableStaff->getTableName()),
            array(
                'id', 'name', 'function',
                'rate' => 's.pay_rate',
                'period' => 's.pay_period',
                'hours_total'   => new Zend_Db_Expr('SUM(h.value)'),
                'summ_total'    => new Zend_Db_Expr('IF(s.pay_period = "month",
                    s.pay_rate,SUM(h.value*s.pay_rate))')
            )
        )
        ->joinLeft(array('h' => $this->_tableHr->getTableName()),
            'h.staff_id=s.id', array()
        )
        ->group('s.id')
        ->where('archive = 0')
        ->where('h.date >= ?', $f->start)
        ->where('h.date <= ?', $f->end)
        ;

        try {
            $rows = $select->query()->fetchAll();
        } catch (Exception $e) {
            if (OSDN_DEBUG) {
                throw $e;
            }
            return $response->addStatus(new PMS_Status(PMS_Status::DATABASE_ERROR));
        }

        // Parse result rows into one merged array
        foreach ($rows as $row) {
            $rowsMerged[$row['id']] = $rowStructure;
            $rowsMerged[$row['id']]['name'] = $row['name'];
            $rowsMerged[$row['id']]['function'] = $row['function'];
            $rowsMerged[$row['id']]['rate'] = $row['rate'];
            $rowsMerged[$row['id']]['period'] = $row['period'];
            $rowsMerged[$row['id']]['hours_total'] = $row['hours_total'];
            $rowsMerged[$row['id']]['summ_total'] = $row['summ_total'];
        }

        // Get total summ of payments by person for given period
        $select = $this->_tableHr->getAdapter()->select()
        ->from(array('s' => $this->_tableStaff->getTableName()),
            array(
                'id', 'name', 'function',
                'rate' => 's.pay_rate',
                'period' => 's.pay_period',
                'pays_total'   => new Zend_Db_Expr('SUM(p.value)')
            )
        )
        ->joinLeft(array('p' => $this->_tablePayments->getTableName()),
            'p.staff_id=s.id', array()
        )
        ->group('s.id')
        ->where('archive = 0')
        ->where('p.date >= ?', $f->start)
        ->where('p.date <= ?', $f->end)
        ;

        try {
            $rows = $select->query()->fetchAll();
        } catch (Exception $e) {
            if (OSDN_DEBUG) {
                throw $e;
            }
            return $response->addStatus(new PMS_Status(PMS_Status::DATABASE_ERROR));
        }

        // Parse result rows into one merged array
        foreach ($rows as $row) {
            if (isset($rowsMerged[$row['id']])) {
                $rowsMerged[$row['id']]['pays_total'] = $row['pays_total'];
            } else {
                $rowsMerged[$row['id']] = $rowStructure;
                $rowsMerged[$row['id']]['name'] = $row['name'];
                $rowsMerged[$row['id']]['function'] = $row['function'];
                $rowsMerged[$row['id']]['rate'] = $row['rate'];
                $rowsMerged[$row['id']]['period'] = $row['period'];
                $rowsMerged[$row['id']]['pays_total'] = $row['pays_total'];
            }
        }

        $response->data = array(
            'rows'  => array_values($rowsMerged),
            'start' => $f->start,
            'end'   => $f->end
        );
        return $response->addStatus(new PMS_Status(PMS_Status::OK));
    }
}