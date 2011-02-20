<?php

class PMS_Storage_Assets
{
	protected $_table;

    public function __construct()
    {
        $this->_table = new PMS_Storage_Assets_Table();
    }

    public function getList($params)
    {
        $response = new OSDN_Response();

        $select = $this->_table->getDefaultAdapter()->select()
            ->from(array('a' => $this->_table->getTableName()));

        if (isset($params['categoryId']) && intval($params['categoryId']) > 0) {
            $tableAC = new PMS_Storage_Assets_Categories_Table();
            $select->join(array('c' => $tableAC->getTableName()),
                $tableAC->getAdapter()->quoteInto(
                    'c.asset_id = a.id AND c.category_id = ?', $params['categoryId']
                ),
            null);
        }
        $plugin = new OSDN_Db_Plugin_Select($this->_table, $select);
        $plugin->setSqlCalcFoundRows(true);
        $plugin->parse($params);

        //die($select);

        try {
            $rows = $select->query();
            $response->totalCount = $plugin->getTotalCountSql();
            $response->setRowset($rows->fetchAll());
            $status = PMS_Status::OK;
        } catch (Exception $e) {
            if (OSDN_DEBUG) {
                throw $e;
            }
            $status = PMS_Status::DATABASE_ERROR;
        }
        return $response->addStatus(new PMS_Status($status));
    }

    public function add(array $params)
    {
        $response = new OSDN_Response();

        $f = new OSDN_Filter_Input(array(
            'qty'           => 'Int',
            '*'             => 'StringTrim'
        ), array(
            'name'          => array(array('StringLength', 1, 250), 'presence' => 'required'),
            'measure'       => array(array('StringLength', 1, 50), 'presence' => 'required'),
            'qty'           => array('Int', 'allowEmpty' => true),
            'unit_price'    => array(array('Float', 'en'), 'allowEmpty' => true),
            'categories'    => array(array('StringLength', 0, 1000), 'presence' => 'required')
            // Here we use en locale to set "."(point) as deciminal separator
        ), $params);
        $response->addInputStatus($f);
        if ($response->hasNotSuccess()) {
            return $response;
        }

        $data = $f->getData();

        try {
            $id = $this->_table->insert($data);
            $status = $id ? PMS_Status::OK : PMS_Status::FAILURE;
            $response->id = $id;
            if ($id && !empty($f->categories)) {
                $categories = array_map('intval', split(',', $f->categories));
                $ac = new PMS_Storage_Assets_Categories();
                $resp = $ac->setAssetCategories($id, $categories);
                if ($resp->hasNotSuccess()) {
                    return $response->importStatuses($resp->getStatusCollection());
                }
            }
        } catch (Exception $e) {
            if (OSDN_DEBUG) {
                throw $e;
            }
            $status = PMS_Status::DATABASE_ERROR;
        }

        return $response->addStatus(new PMS_Status($status));
    }

    public function update(array $params)
    {
        $response = new OSDN_Response();

        $f = new OSDN_Filter_Input(array(
            'id'            => 'Int',
            'qty'           => 'Int',
            '*'             => 'StringTrim'
        ), array(
            'id'            => array(array('Id', true)),
            'name'          => array(array('StringLength', 1, 250), 'presence' => 'required'),
            'measure'       => array(array('StringLength', 1, 50), 'presence' => 'required'),
            'qty'           => array('Int', 'allowEmpty' => true),
            'unit_price'    => array(array('Float', 'en'), 'allowEmpty' => true),
            'categories'    => array(array('StringLength', 0, 1000), 'presence' => 'required')
        ), $params);
        $response->addInputStatus($f);
        if ($response->hasNotSuccess()) {
            return $response;
        }

        try {
            $this->_table->updateByPk($f->getData(), $f->id);
            if (!empty($f->categories)) {
                $categories = array_map('intval', split(',', $f->categories));
                $ac = new PMS_Storage_Assets_Categories();
                $resp = $ac->setAssetCategories($f->id, $categories);
                if ($resp->hasNotSuccess()) {
                    return $response->importStatuses($resp->getStatusCollection());
                }
            }
            $status = PMS_Status::OK;
        } catch (Exception $e) {
            if (OSDN_DEBUG) {
                throw $e;
            }
            $status = PMS_Status::DATABASE_ERROR;
        }

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
        // TODO: check relations
        try {
            $this->_table->deleteByPk($id);
            $status = PMS_Status::OK;
        } catch (Exception $e) {
            if (OSDN_DEBUG) {
                throw $e;
            }
            $status = PMS_Status::DATABASE_ERROR;
        }
        return $response->addStatus(new PMS_Status($status));
    }

    public function check($params)
    {
        $id = intval($params['id']);
        $value = intval($params['value']);
        $response = new OSDN_Response();
        if ($id == 0) {
            return $response->addStatus(new PMS_Status(
                PMS_Status::INPUT_PARAMS_INCORRECT, 'id'));
        }
        try {
            $this->_table->updateByPk(array('checked' => $value), $id);
            $status = PMS_Status::OK;
        } catch (Exception $e) {
            if (OSDN_DEBUG) {
                throw $e;
            }
            $status = PMS_Status::DATABASE_ERROR;
        }
        return $response->addStatus(new PMS_Status($status));
    }

    public function resetChecks()
    {
        $response = new OSDN_Response();
        try {
            $this->_table->update(array('checked' => 0), '');
            $status = PMS_Status::OK;
        } catch (Exception $e) {
            if (OSDN_DEBUG) {
                throw $e;
            }
            $status = PMS_Status::DATABASE_ERROR;
        }
        return $response->addStatus(new PMS_Status($status));
    }
}