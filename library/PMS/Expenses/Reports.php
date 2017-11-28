<?php

class PMS_Expenses_Reports
{
    public function get(array $params)
    {
        $response = new OSDN_Response();

        $f = new OSDN_Filter_Input(array(
            '*' => 'StringTrim'
        ), array(
            'start'  => array('Date', 'allowEmpty' => false, 'presence' => 'required'),
            'end'    => array('Date', 'allowEmpty' => false, 'presence' => 'required')
        ), $params);

        $response->addInputStatus($f);
        if ($response->hasNotSuccess()) return $response;

        $table = new PMS_Expenses_Table();
        $select = $table->getAdapter()->select()
        ->from($table->getTableName())
        ->where('date >= ?', $f->start)
        ->where('date <= ?', $f->end);

        try {
            $rows = $select->query()->fetchAll();
        } catch (Exception $e) {
            if (OSDN_DEBUG) throw $e;
            return $response->addStatus(new PMS_Status(PMS_Status::DATABASE_ERROR));
        }

        $response->data = array(
            'rows'  => $rows,
            'start' => $f->start,
            'end'   => $f->end
        );
        return $response->addStatus(new PMS_Status(PMS_Status::OK));
    }
}