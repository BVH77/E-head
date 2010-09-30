<?php

/**
 * General class for manipulate accounts
 *
 * @category		OSDN
 * @package		OSDN_Accounts
 * @version		$Id: Accounts.php 8098 2009-04-16 07:08:48Z flash $
 */
class OSDN_Accounts
{
    /**
     * The accounts table
     *
     * @var OSDN_Accounts_Table_Accounts
     */
    protected $_tableAccounts;

    /**
     * Constructor
     *
     */
    public function __construct()
    {
        $this->_tableAccounts = new OSDN_Accounts_Table_Accounts();
    }

    /**
     * Fetch account information by id
     *
     * @param int $accountId    The account id
     * @return OSDN_Response
     * <code> array(
     *     'rowset' => Zend_Db_Table_Row | null
     * )
     * </code>
     */
    public function fetchAccount($accountId)
    {
        $response = new OSDN_Response();
        $validate = new OSDN_Validate_Id();
        if (!$validate->isValid($accountId)) {
            $response->addStatus(new OSDN_Accounts_Status(OSDN_Accounts_Status::INPUT_PARAMS_INCORRECT, 'account_id'));
            return $response;
        }

        $rowset = $this->_tableAccounts->findOne($accountId);
        $response->addStatus(new OSDN_Accounts_Status(OSDN_Accounts_Status::OK));
        if (!is_null($rowset)) {
            $rowset = $rowset->toArray();
        } elseif (empty($rowset)) {
            $rowset = array();
        }
        $response->rowset = $rowset;
        return $response;
    }

    /**
     * Retrieve account information by login and password
     *
     * @param string $login         The account login
     * @param string $password      The account password
     * @return OSDN_Response
     */
    public function fetchByLoginPassword($login, $password)
    {
        $response = new OSDN_Response();

        try {
            $row = $this->_tableAccounts->fetchRow(array(
                'login = ?'     => $login,
                'password = ?'  => $password
            ));

            if (!is_null($row)) {
                $row = $row->toArray();
                unset($row['state']);
            }

            $response->row = $row;

        } catch (Exception $e) {
            $row = null;
            $status = OSDN_Accounts_Status::DATABASE_ERROR;
        }

        if (is_null($row)) {
            $status = OSDN_Accounts_Status::FAILURE;
        } else {
            $status = OSDN_Accounts_Status::OK;
        }

        $response->addStatus(new OSDN_Accounts_Status($status));
        return $response;
    }

    /**
     * Fetch accounts by role
     * @see _fetchAll()
     *
     * @param int $roleId       The account role
     * @param array $params
     *
     * @return OSDN_Response
     */
    public function fetchByRole($roleId, array $params = array())
    {
        $validate = new OSDN_Validate_Id(true);
        if (!$validate->isValid($roleId)) {
            return new OSDN_Response(new OSDN_Acl_Status(OSDN_Acl_Status::INPUT_PARAMS_INCORRECT, 'role_id'));
        }

        $clause = array();
        if (!empty($roleId)) {
            $clause = array('role_id = ?' => $roleId);
        }
        return $this->_fetchAll($clause, $params);
    }


    /**
     * Fetches all rows
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
     *      array('company_id = ?' => 1)
     *  );</code>
     *
     * @return OSDN_Response
     * Details of contain data <code>
     *      rows array          The modules collection
     *      total int           The total count of rows
     * </code>
     */
    protected function _fetchAll($where, array $params = array())
    {
        $response = new OSDN_Response();
        $select = $this->_tableAccounts->getAdapter()->select();
        $select->from(array('a' => $this->_tableAccounts->getTableName()));

        $plugin = new OSDN_Db_Plugin_Select($this->_tableAccounts, $select);
        $plugin->parse($params);

        if (!empty($where)) {
            foreach ($where as $key => $value) {
                $select->where($key, $value);
            }
        }

        $status = null;
        try {
            $rowset = $select->query()->fetchAll();
            $response->rows = $rowset;
            $response->setRowset($rowset);
            $response->total = $plugin->getTotalCount();
            $status = OSDN_Acl_Status::OK;

        } catch (Exception $e) {
            if (OSDN_DEBUG) {
                throw $e;
            }

            $status = OSDN_Acl_Status::DATABASE_ERROR;
        }

        $response->addStatus(new OSDN_Acl_Status($status));
        return $response;
    }

    /**
     * @see _fetchAll()
     *
     * @return OSDN_Response
     */
    public function fetchAll(array $params = array())
    {
        return $this->_fetchAll(array(), $params);
    }

    /**
     * Change account role
     *
     * @param int|array $accountId        The account id
     * @param int $roleId                 The role id
     * @return OSDN_Response
     */
    public function changeRole($accountIds, $roleId)
    {
        $response = new OSDN_Response();
        $validateRole = new OSDN_Validate_Id(true);
        if (!$validateRole->isValid($roleId)) {
            $response->addStatus(new OSDN_Acl_Status(OSDN_Acl_Status::INPUT_PARAMS_INCORRECT, 'role_id'));
            return $response;
        }

        if (!is_array($accountIds)) {
            $accountIds = array($accountIds);
        }

        $validateAccount = new OSDN_Validate_Id();
        foreach ($accountIds as $accountId) {
            if (!$validateAccount->isValid($accountId)) {
                $response->addStatus(new OSDN_Acl_Status(OSDN_Acl_Status::INPUT_PARAMS_INCORRECT, 'account_id'));
                return $response;
            }

            $affectedRows = $this->_tableAccounts->updateByPk(array(
                'role_id'   => $roleId
            ), $accountId);

            if (false === $affectedRows) {
                $response->addStatus(new OSDN_Acl_Status(OSDN_Acl_Status::DATABASE_ERROR));
                return $response;
            }
        }

        $response->addStatus(new OSDN_Acl_Status(OSDN_Acl_Status::OK));
        return $response;
    }

    /**
     * Update account
     *
     * @param int $id       The account id
     * @param array $data   Update data
     */
    public function update($id, array $data = array())
    {
        $response = new OSDN_Response();
        $data['id'] = $id;
        $f = new OSDN_Filter_Input(array(
            'id'        => 'int'
        ), array(
            'id'        => array('id', 'presense' => 'required'),
            'email'     => array('EmailAddress', 'presense' => 'required'),
            'radius'    => array('boolean'),
            'active'    => array('boolean')
        ), $data);

        $response->addInputStatus($f);
        if ($response->hasNotSuccess()) {
            return $response;
        }

        $affectedRows = $this->_tableAccounts->updateByPk(array(
            'email'     => $f->email,
            'phone'     => $f->phone,
            'name'      => $f->name,
            'radius'    => $f->radius,
            'active'    => $f->active
        ), $f->id);

        $response->addStatus(new OSDN_Accounts_Status(OSDN_Accounts_Status::retrieveAffectedRowStatus($affectedRows)));
        $response->affectedRows = $affectedRows;
        return $response;
    }

    /**
     * Update personal information account
     *
     * @param int $id       The account id
     * @param array $data   Updated personal data
     * @return OSDN_Response
     * <data>
     * array(
     *  affectedRows: int
     * )
     * </data>
     */
    public function updatePersonalInformation($id, array $data = array())
    {
        $response = new OSDN_Response();
        $data['id'] = $id;
        $f = new OSDN_Filter_Input(array(
            'id'    => 'int'
        ), array(
            'id'    => array('id', 'presense' => 'required'),
            'email' => array('EmailAddress', 'presense' => 'required')
        ), $data);

        $response->addInputStatus($f);
        if ($response->hasNotSuccess()) {
            return $response;
        }

        $affectedRows = $this->_tableAccounts->updateByPk(array(
            'email' => $f->email,
            'phone' => $f->phone,
            'name'  => $f->name
        ), $f->id);

        $response->addStatus(new OSDN_Accounts_Status(OSDN_Accounts_Status::retrieveAffectedRowStatus($affectedRows)));
        $response->affectedRows = $affectedRows;
        return $response;
    }

    /**
     * Update account field by name
     *
     * @param int $id           The account id
     * @param string $field     Available field in database
     * @param mixed $value      Field value
     * @return OSDN_Response
     */
    public function updateByField($id, $field, $value)
    {
        $response = new OSDN_Response();
        $validate = new OSDN_Validate_Id();
        if (!$validate->isValid($id)) {
            $response->addStatus(new OSDN_Acl_Status(OSDN_Acl_Status::INPUT_PARAMS_INCORRECT, 'id'));
            return $response;
        }

        $fieldValidate = null;
        $field = strtolower($field);

        switch ($field) {
            case 'name':
                $fieldValidate = new Zend_Validate_NotEmpty();
                break;

            case 'email':
                $fieldValidate = new Zend_Validate_EmailAddress();
                break;

            case 'active':
            case 'radius':
                $fieldValidate = new OSDN_Validate_Boolean();
                break;

            case 'phone':
                break;

            default:
                $response->addStatus(new OSDN_Acl_Status(OSDN_Acl_Status::INPUT_PARAMS_INCORRECT, 'id'));
                return $response;
        }

        if ($fieldValidate instanceof Zend_Validate_Interface) {
            if (!$fieldValidate->isValid($value) || !$this->_tableAccounts->isAllowedField($field)) {
                $response->addStatus(new OSDN_Acl_Status(OSDN_Acl_Status::INPUT_PARAMS_INCORRECT, $field));
                return $response;
            }
        }
        $affectedRows = false;

        // try to set method catcher before common method
        $method = '_set' . ucfirst($field) . 'Account';
        if (method_exists($this, $method)) {
            $affectedRows = $this->{$method}($id);
        } else {
            $affectedRows = $this->_tableAccounts->updateByPk(array(
                $field  => $value
            ), $id);
        }

        $response->addStatus(new OSDN_Acl_Status(OSDN_Acl_Status::retrieveAffectedRowStatus($affectedRows)));
        return $response;
    }

    /**
     * Set anonymous account
     *
     * @param int $id           The account id
     * @return int              The affected rows
     */
    protected function _setAnonymousAccount($id)
    {
        // if anonymous is present = return
        $anonymousPresent = $this->_tableAccounts->count(array('anonymous = ?' => 1));
        if ($anonymousPresent) {
            return false;
        }

        $this->_tableAccounts->updateQuote(
            array('anonymous'   => new Zend_Db_Expr('NULL')),
            array('anonymous ?' => new Zend_Db_Expr('IS NOT NULL'))
        );

        $affecteRows = $this->_tableAccounts->updateByPk(array(
            'anonymous'  => 1
        ), $id);
        return $affecteRows;
    }

    /**
     * Fetch anonymous account
     *
     * @return OSDN_Response
     * <code>
     * array(
     *      'row' => array
     * )</code>
     */
    public function fetchAnonymousAccount()
    {
        $rowset = $this->_tableAccounts->fetchRow(array(
            'anonymous = ?' => 1
        ));
        $response = new OSDN_Response();
        $status = null;

        if (!is_null($rowset)) {
            $response->row = $rowset->toArray();
            $status = OSDN_Acl_Status::OK;
        } else {
            $status = OSDN_Acl_Status::FAILURE;
        }

        $response->addStatus(new OSDN_Acl_Status($status));
        return $response;
    }

    /**
     * Create new account
     *
     * @param array $data
     * <code>
     *  login       string  REQUIRED
     *  password    string  REQUIRED
     * </code>
     * @return OSDN_Response
     * <code>
     *  id: int
     * </code>
     */
    public function createAccount(array $data)
    {
        $f = new OSDN_Filter_Input(array(
            '*'     => array('StringTrim')
        ), array(
            'login'     => array('login', 'presense' => 'required'),
            'password'  => array('password', 'presense' => 'required'),
            'roleId'    => array(array('Id', array(true)))
        ), $data);

        $response = new OSDN_Response();
        $response->addInputStatus($f);
        if ($response->hasNotSuccess()) {
            return $response;
        }

        $login = $f->login;
        $password = $f->password;
        $roleId = $f->roleId;
        $existsResponse = $this->accoutExists($login);
        if ($existsResponse->isError()) {
            return $existsResponse;
        }

        $id = $this->_tableAccounts->insert(array(
            'login'     => $login,
            'password'  => md5($password),
            'role_id'   => $roleId
        ));

        $status = OSDN_Accounts_Status::FAILURE;
        if ($id > 0) {
            $status = OSDN_Accounts_Status::OK;
            $response->id = $id;
        }

        $response->addStatus(new OSDN_Accounts_Status($status));
        return $response;
    }

    /**
     * Check if present account
     *
     * @param string $login
     * @return OSDN_Response
     * <code>
     *  exists: bool
     * </code>
     */
    public function accoutExists($login)
    {
        $f = new Zend_Filter_StringTrim();
        $login = $f->filter($login);

        $stringLengthValidator = new Zend_Validate_StringLength(3, 50);
        $loginValidator = new OSDN_Validate_Login();
        $response = new OSDN_Response();
        if (!$stringLengthValidator->isValid($login) || !$loginValidator->isValid($login)) {
            $response->addStatus(new OSDN_Accounts_Status(OSDN_Accounts_Status::INPUT_PARAMS_INCORRECT, 'login'));
            return $response;
        }

        $count = $this->_tableAccounts->count(array('login = ?' => $login));
        $status = null;
        $exists = true;

        if (0 === $count) {
            $status = OSDN_Accounts_Status::OK;
            $exists = false;
        } elseif (false === $count) {
            $status = OSDN_Accounts_Status::DATABASE_ERROR;
        } else {
            $status = OSDN_Accounts_Status::ACCOUNT_IS_ALREADY_EXISTS;
        }

        $response->addStatus(new OSDN_Accounts_Status($status));
        $response->exists = $exists;
        return $response;
    }

    /**
     * Delete account by id
     *
     * @param int $id
     * @return OSDN_Response
     */
    public function deleteAccount($id)
    {
        $validate = new OSDN_Validate_Id();
        $response = new OSDN_Response();
        if (!$validate->isValid($id)) {
            $response->addStatus(new OSDN_Accounts_Status(OSDN_Accounts_Status::INPUT_PARAMS_INCORRECT, 'id'));
            return $response;
        }

        try {
            $affectedRows = $this->_tableAccounts->deleteByPk($id);
            $status = OSDN_Accounts_Status::retrieveAffectedRowStatus($affectedRows);
        } catch (Exception $e) {
            if (OSDN_DEBUG) {
                throw $e;
            }
            $status = OSDN_Accounts_Status::DATABASE_ERROR;
        }

        $response->addStatus(new OSDN_Accounts_Status($status));
        return $response;
    }

    /**
     * Change account password
     *
     * @param int $id           The account id
     * @param string $password  The account password
     * @return OSDN_Response
     */
    public function changePassword($id, $password)
    {
        $f = new OSDN_Filter_Input(array(
            'id'    => 'int'
        ), array(
            'id'        => array('id', 'presense'   => 'required'),
            'password'  => array('password', 'presense' => 'required')
        ), array(
            'id'        => $id,
            'password'  => $password
        ));

        $response = new OSDN_Response();
        $response->addInputStatus($f);
        if ($response->hasNotSuccess()) {
            return $response;
        }

        $affectedRow = $this->_tableAccounts->updateByPk(array(
            'password'  => md5($password),
        ), $id);

        $response->addStatus(new OSDN_Accounts_Status(OSDN_Accounts_Status::retrieveAffectedRowStatus($affectedRow)));
        return $response;
    }

    /**
     * Change password
     *
     * @param int $id       The account id
     * @param array $data   contains old password and new one (old_password, new_password1, new_password2)
     * @return OSDN_Response
     * <data>
     * array(
     *  affectedRows: int
     * )
     * </data>
     */
    public function chPassword($id, array $data)
    {
        $response = new OSDN_Response();
        $data['id'] = $id;

        $f = new OSDN_Filter_Input(array(
            '*'     => array('StringTrim')
        ), array(
            'old_password'  => array('password', 'presense' => 'required'),
            'new_password1'  => array('password', 'presense' => 'required'),
            'new_password2'  => array('password', 'presense' => 'required')
        ), $data);

        $response->addInputStatus($f);
        if ($response->hasNotSuccess()) {
            return $response;
        }

        $password = $this->_tableAccounts->fetchPassword($id);

        if ($password !== md5($f->old_password)) {
            return $response->addStatus(new OSDN_Accounts_Status(OSDN_Accounts_Status::WRONG_PASSWORD, 'old_password'));
        }

        if ($f->new_password1 !== $f->new_password2) {
            return $response->addStatus(new OSDN_Accounts_Status(OSDN_Accounts_Status::UNCORRECT_NEW_PASSWORD, 'new_password2'));
        }

        $affectedRows = $this->_tableAccounts->updateByPk(array(
            'password' => md5($f->new_password1)
        ), $id);

        $response->addStatus(new OSDN_Accounts_Status(OSDN_Accounts_Status::retrieveAffectedRowStatus($affectedRows)));
        $response->affectedRows = $affectedRows;
        return $response;
    }

    /**
     * Retrieve account state
     *
     * @param int $id       The account id
     * @return OSDN_Response
     */
    public function getState($id)
    {
        $response = new OSDN_Response();
        $validate = new OSDN_Validate_Id();
        if (!$validate->isValid($id)) {
            $response->addStatus(new OSDN_Accounts_Status(OSDN_Accounts_Status::INPUT_PARAMS_INCORRECT, 'id'));
            return $response;
        }

        $row = $this->_tableAccounts->findOne($id);
        if (is_null($row)) {
            $response->addStatus(new OSDN_Accounts_Status(OSDN_Accounts_Status::NO_ONE_ROWS_AFFECTED));
            return $response;
        }


        if (false !== ($state = @unserialize($row->state))) {
            $response->rows = $state;
            $response->addStatus(new OSDN_Accounts_Status(OSDN_Accounts_Status::OK));
        } else {
            $response->addStatus(new OSDN_Accounts_Status(OSDN_Accounts_Status::FAILURE));
        }
        return $response;
    }

    /**
     * Update account state
     *
     * @param int $id           The account id
     * @param array $state      The state storage
     * @return OSDN_Response
     */
    public function saveState($id, array $state = array())
    {
        $response = new OSDN_Response();
        $validate = new OSDN_Validate_Id();
        if (!$validate->isValid($id)) {
            $response->addStatus(new OSDN_Accounts_Status(OSDN_Accounts_Status::INPUT_PARAMS_INCORRECT, 'id'));
            return $response;
        }

        $affectedRows = $this->_tableAccounts->updateByPk(array(
            'state' => serialize($state)
        ), $id);

        $response->addStatus(new OSDN_Accounts_Status(OSDN_Accounts_Status::retrieveAffectedRowStatus($affectedRows)));
        return $response;
    }
}