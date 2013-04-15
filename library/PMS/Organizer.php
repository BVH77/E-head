<?php

class PMS_Organizer
{
	protected $_table;

    public function __construct()
    {
        $this->_table = new PMS_OrganizerTable();
    }

    public function add(array $params)
    {
        $f = new OSDN_Filter_Input(array(
        ), array(
            'ondate'    => array('Date', 'presence' => 'required'),
            'ontime'    => array(array('StringLength', 1, 5), 'presence' => 'required'),
            'text'      => array(array('StringLength', 1, 4096), 'presence' => 'required')
        ), $params);

        $response = new OSDN_Response();
        $response->addInputStatus($f);
        if ($response->hasNotSuccess()) {
            return $response;
        }

        $data = $f->getData();
        $data['account_id'] = OSDN_Accounts_Prototype::getId();

        try {
            $id = $this->_table->insert($data);
            $status = $id ? PMS_Status::OK : PMS_Status::FAILURE;
        } catch (Exception $e) {
            $response->addStatus(new PMS_Status(PMS_Status::DATABASE_ERROR));
            return $response;
        }

        $response->addStatus(new PMS_Status($status));
        $response->id = $id;
        return $response;
    }

    public function update(array $params)
    {
        $f = new OSDN_Filter_Input(array(
        ), array(
            'id'        => array('int', 'presence' => 'required'),
            'ondate'    => array('Date', 'presence' => 'required'),
            'ontime'    => array(array('StringLength', 1, 5), 'presence' => 'required'),
            'text'      => array(array('StringLength', 1, 4096), 'presence' => 'required')
        ), $params);

        $response = new OSDN_Response();
        $response->addInputStatus($f);
        if ($response->hasNotSuccess()) {
            return $response;
        }

        try {
            $updatedRows = $this->_table->updateByPk($f->getData(), $f->getEscaped('id'));
	        if ($updatedRows > 0) {
	            $status = PMS_Status::UPDATED;
	        } else if ($updatedRows === 0) {
	            $status = PMS_Status::UPDATED_NO_ONE_ROWS_UPDATED;
	        } else {
	            $status = PMS_Status::FAILURE;
	        }
        } catch (Exception $e) {
            if (OSDN_DEBUG) {
                throw $e;
            }
            return $response->addStatus(new PMS_Status(PMS_Status::DATABASE_ERROR));
        }

        return $response->addStatus(new PMS_Status($status));
    }

    public function delete($id)
    {
        $response = new OSDN_Response();
        $validate = new OSDN_Validate_Id();
        if (!$validate->isValid($id)) {
            return $response->addStatus(new PMS_Status(PMS_Status::INPUT_PARAMS_INCORRECT, 'id'));
        }
        try {
            $affectedRows = $this->_table->deleteByPk($id);
            $status = PMS_Status::retrieveAffectedRowStatus($affectedRows);
        } catch (Exception $e) {
        	if (OSDN_DEBUG) {
                throw $e;
            }
            $status = PMS_Status::DATABASE_ERROR;
        }
        return $response->addStatus(new PMS_Status($status));
    }

    public function closeTask($id)
    {
        $response = new OSDN_Response();
        $validate = new OSDN_Validate_Id();
        if (!$validate->isValid($id)) {
            return $response->addStatus(new PMS_Status(PMS_Status::INPUT_PARAMS_INCORRECT, 'id'));
        }
        try {
            $affectedRows = $this->_table->updateByPk(array(
                'closed' => new Zend_Db_Expr('NOW()')), $id);
            $status = PMS_Status::retrieveAffectedRowStatus($affectedRows);
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
        $response = new OSDN_Response();
        $validate = new OSDN_Validate_Id();
        if (!$validate->isValid($id)) {
            $response->addStatus(new PMS_Status(PMS_Status::INPUT_PARAMS_INCORRECT, 'id'));
            return $response;
        }
        $select = $this->_table->getAdapter()->select()
            ->from($this->_table->getTableName())
            ->where("id = ? ", $id);
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

    /**
     * Retrieve orders
     *
     * @param array $params
     * The param examples<code>
     *      sort    => 'name'
     *      dir     => 'ASC'
     *      limit   => 20
     *      start   => 1
     *      ...
     *      filter[0][data][type]   string
     *      filter[0][data][value]  1
     *      filter[0][field]        alias
     * </code>
     * @param array $where      The array of where clauses<code>
     *  array(
     *      array('name = ?' => test),
     *      array('id' => 1)
     *  );</code>
     *
     * @return OSDN_Response
     * Details of contain data
     * <code>
     *      rows array  the rows collection
     *      total int   the total count of rows
     * </code>
     */
    public function getList(array $params, array $where = array())
    {
        $response = new OSDN_Response();
        $accounts = new OSDN_Accounts_Table_Accounts();
        $select = $this->_table->getAdapter()->select();

        $select->from(array('o' => $this->_table->getTableName()), '*');
        $select->joinLeft(array(
            'a' => $accounts->getTableName()),
            'o.account_id=a.id',
            array('account_name' => 'a.name')
        );
        if (OSDN_Accounts_Prototype::getRoleId() !== ADMIN_ROLE) {
            $select->where('account_id = ?', OSDN_Accounts_Prototype::getId());
        }
        $plugin = new OSDN_Db_Plugin_Select($this->_table, $select);
        $plugin->parse($params);
        $status = null;
        $select->order('ondate DESC');
        $select->order('ontime DESC');
        $select->order('closed DESC');
        try {
            $response->setRowset($select->query()->fetchAll());
            $response->totalCount = $plugin->getTotalCount();
            $status = PMS_Status::OK;
        } catch (Exception $e) {
            $status = PMS_Status::DATABASE_ERROR;
            if (OSDN_DEBUG) {
                throw $e;
            }
        }
        return $response->addStatus(new PMS_Status($status));
    }
}