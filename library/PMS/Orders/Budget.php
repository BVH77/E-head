<?php

class PMS_Orders_Budget
{
	protected $_table;

    public function __construct()
    {
        $this->_table = new PMS_Orders_Budget_Table();
    }

    public function save(array $params)
    {

        $f = new OSDN_Filter_Input(array(
            'id'            => 'int',
            'order_id'      => 'int'
        ), array(
            'id'            => array('int', 'presence' => 'required'),
            'order_id'      => array('int', 'presence' => 'required'),
            'f1_qty'        => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f1_price'      => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f2_dest'       => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f2_distance'   => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f2_qty'        => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f2_price'      => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f3_transport'  => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f3_people'     => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f3_qty'        => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f3_price'      => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f4_people'     => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f4_days'       => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f4_qty'        => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f4_price'      => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f5_people'     => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f5_days'       => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f5_qty'        => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f5_price'      => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f6_params'     => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f6_qty'        => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f6_price'      => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f7_params'     => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f7_qty'        => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f7_price'      => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f8_people'     => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f8_days'       => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f8_qty'        => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f8_price'      => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f9_params'     => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f9_qty'        => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f9_price'      => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f10_qty'       => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f10_price'     => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f11_dest'      => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f11_distance'  => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f11_qty'       => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f11_price'     => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f12_people'    => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f12_days'      => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f12_qty'       => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f12_price'     => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f13_people'    => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f13_days'      => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f13_qty'       => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f13_price'     => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f14_qty'       => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f14_price'     => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f15_descr'     => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f15_qty'       => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f15_price'     => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f16_descr'     => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f16_qty'       => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f16_price'     => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f17_descr'     => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f17_qty'       => array(array('StringLength', 0, 255), 'presence' => 'required'),
            'f17_price'     => array(array('StringLength', 0, 255), 'presence' => 'required')
        ), $params);

        $response = new OSDN_Response();
        $response->addInputStatus($f);
        if ($response->hasNotSuccess()) {
            return $response;
        }

        try {
            if ($f->id > 0) {
                $res = $this->_table->updateByPk($f->getData(), $f->id);
            } else {
                $res = $this->_table->insert($f->getData());
            }
            $status = $res !== false ? PMS_Status::OK : PMS_Status::DATABASE_ERROR;
        } catch (Exception $e) {
            if (OSDN_DEBUG) {
                throw $e;
            }
            return $response->addStatus(new PMS_Status(PMS_Status::DATABASE_ERROR));
        }

        return $response->addStatus(new PMS_Status($status));
    }

    public function get($orderId)
    {
        $response = new OSDN_Response();
        $validate = new OSDN_Validate_Id();
        if (!$validate->isValid($orderId)) {
            $response->addStatus(new PMS_Status(PMS_Status::INPUT_PARAMS_INCORRECT, 'order_id'));
            return $response;
        }
        $select = $this->_table->getAdapter()->select()
            ->from($this->_table->getTableName())
            ->where("order_id = ? ", $orderId)
            ->limit(1);
        try {
            $response->setRow($select->query()->fetch());
            $status = PMS_Status::OK;
        } catch (Exception $e) {
            if (OSDN_DEBUG) {
                throw $e;
            }
            $status = PMS_Status::DATABASE_ERROR;
        }

        $response->addStatus(new PMS_Status($status));
        return $response;
    }
}