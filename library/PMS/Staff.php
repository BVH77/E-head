<?php

class PMS_Staff
{
	protected $_table;

	static $PAY_PERIODS = array('hour', 'day', 'month');

    public function __construct()
    {
        $this->_table = new PMS_Staff_Table();
    }

    public function getList($params)
    {
        $response = new OSDN_Response();

        $currentAccountId = OSDN_Accounts_Prototype::getId();

        $select = $this->_table->getAdapter()->select();
        $select->from($this->_table->getTableName());

        $plugin = new OSDN_Db_Plugin_Select($this->_table, $select);
        $plugin->parse($params);
        try {
            $rows = $select->query()->fetchAll();
            $response->setRowset($rows);
            $response->totalCount = $plugin->getTotalCount();
            $status = PMS_Status::OK;
        } catch (Exception $e) {
            if (OSDN_DEBUG) {
                throw $e;
            }
            $status = PMS_Status::DATABASE_ERROR;
        }
        return $response->addStatus(new PMS_Status($status));
    }

    public function get($id)
    {
        $id = intval($id);
        $response = new OSDN_Response();
        if ($id == 0) {
            return $response->addStatus(new PMS_Status(
                PMS_Status::INPUT_PARAMS_INCORRECT, 'id'));
        }
        $row = $this->_table->findOne($id);
        if (!$row) {
            return $response->addStatus(new PMS_Status(PMS_Status::DATABASE_ERROR));
        }
        $response->setRow($row->toArray());
        return $response->addStatus(new PMS_Status(PMS_Status::OK));
    }

    public function add(array $params)
    {
        $f = new OSDN_Filter_Input(array(
            'pay_rate'      => 'Int',
            '*'             => 'StringTrim'
        ), array(
            'pay_period'    => array(array('InArray', self::$PAY_PERIODS), 'presence' => 'required'),
            'name'          => array(array('StringLength', 0, 250), 'presence' => 'required'),
            'function'      => array(array('StringLength', 0, 250), 'presence' => 'required'),
            'hire_date'     => array(array('StringLength', 0, 10), 'presence' => 'required')
        ), $params);

        $response = new OSDN_Response();

        $response->addInputStatus($f);
        if ($response->hasNotSuccess()) {
            return $response;
        }

        $file = $_FILES['cv_file'];

        if ($file['error'] != UPLOAD_ERR_NO_FILE) {

            if ($file['error'] > 0) {
                $response->addStatus(new PMS_Status(
                    PMS_Status::INPUT_PARAMS_INCORRECT, 'file'));
                return $response;
            }

            $filenameArray = split('\.', $file['name']);
            $ext = array_pop($filenameArray);
            $filename = uniqid() . '.' . $ext;
            $filepath = FILES_DIR . DIRECTORY_SEPARATOR . $filename;

            if (move_uploaded_file($file['tmp_name'], $filepath)) {
                $data = $f->getData();
                $data['cv_file'] = $filename;
                $f->setData($data);
            } else {
                return $response->addStatus(new PMS_Status(PMS_Status::FAILURE));
            }
        }

        $id = $this->_table->insert($f->getData());
        if (!$id) {
            if (isset($filepath) && is_file($filepath)) {
                unlink($filepath);
            }
            return $response->addStatus(new PMS_Status(PMS_Status::DATABASE_ERROR));
        }

        $response->id = $id;
        return $response->addStatus(new PMS_Status(PMS_Status::OK));
    }

    public function update(array $params)
    {
        $f = new OSDN_Filter_Input(array(
            'id'            => 'Int',
            'pay_rate'      => 'Int',
            '*'             => 'StringTrim'
        ), array(
            'id'            => array('Id', 'presence' => 'required'),
            'pay_period'    => array(array('InArray', self::$PAY_PERIODS), 'presence' => 'required'),
            'name'          => array(array('StringLength', 0, 250), 'presence' => 'required'),
            'function'      => array(array('StringLength', 0, 250), 'presence' => 'required'),
            'hire_date'     => array(array('StringLength', 0, 10), 'presence' => 'required')
        ), $params);

        $response = new OSDN_Response();

        $response->addInputStatus($f);
        if ($response->hasNotSuccess()) {
            return $response;
        }

        $file = $_FILES['cv_file'];

        if ($file['error'] != UPLOAD_ERR_NO_FILE) {

            if ($file['error'] > 0) {
                $response->addStatus(new PMS_Status(
                    PMS_Status::INPUT_PARAMS_INCORRECT, 'file'));
                return $response;
            }

            $resp = $this->get($f->id);
            if ($resp->hasNotSuccess()) {
                return $response->importStatuses($resp->getStatusCollection());
            }
            $row = $resp->getRow();

            $filenameArray = split('\.', $file['name']);
            $ext = array_pop($filenameArray);
            $filename = uniqid() . '.' . $ext;
            $filepath = FILES_DIR . DIRECTORY_SEPARATOR . $filename;

            if (move_uploaded_file($file['tmp_name'], $filepath)) {
                $data = $f->getData();
                $data['cv_file'] = $filename;
                $f->setData($data);
                if (!empty($row['cv_file'])
                && is_file(FILES_DIR . DIRECTORY_SEPARATOR . $row['cv_file'])) {
                    unlink(FILES_DIR . DIRECTORY_SEPARATOR . $row['cv_file']);
                }
            } else {
                return $response->addStatus(new PMS_Status(PMS_Status::FAILURE));
            }
        }

        $rows = $this->_table->updateByPk($f->getData(), $f->id);
        $status = PMS_Status::retrieveAffectedRowStatus($rows);
        return $response->addStatus(new PMS_Status($status));
    }

    public function delete($id)
    {
        $id = intval($id);
        $response = new OSDN_Response();
        if ($id == 0) {
            return $response->addStatus(new PMS_Status(
                PMS_Status::INPUT_PARAMS_INCORRECT, 'id'));
        }

        $resp = $this->get($id);
        if ($resp->hasNotSuccess()) {
            return $response->importStatuses($resp->getStatusCollection());
        }
        $row = $resp->getRow();

        $res = $this->_table->deleteByPk($id);
        if (false === $res) {
            return $response->addStatus(new PMS_Status(PMS_Status::DATABASE_ERROR));
        }

        if (!empty($row['cv_file'])
        && is_file(FILES_DIR . DIRECTORY_SEPARATOR . $row['cv_file'])) {
            unlink(FILES_DIR . DIRECTORY_SEPARATOR . $row['cv_file']);
        }
        return $response->addStatus(new PMS_Status(PMS_Status::OK));
    }
}