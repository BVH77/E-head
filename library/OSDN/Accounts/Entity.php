<?php
 
/**
 * General class for manipulate accounts
 *
 * @category        OSDN
 * @package     OSDN_Accounts
 * @version     $Id: Accounts.php 8098 2009-04-16 07:08:48Z flash $
 */
class OSDN_Accounts_Entity
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
        $this->_tableAccounts = new OSDN_Accounts_Entity_Table_Entity();
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
     * Fetch account information by entity id
     *
     * @param int $entity_id    The entity id
     * @param int $entitytype_id    The entitytype id
     *
     * @return OSDN_Response
     * <code> array(
     *     'rowset' => Zend_Db_Table_Row | null
     * )
     * </code>
     */
    public function fetchAccountByEntityId($entity_id, $entitytype_id)
    {
        $response = new OSDN_Response();
        $validate = new OSDN_Validate_Id();
        if (!$validate->isValid($entity_id)) {
            return $response->addStatus(new OSDN_Accounts_Status(OSDN_Accounts_Status::INPUT_PARAMS_INCORRECT, 'entity_id'));
        }
        if (!$validate->isValid($entity_id)) {
            return $response->addStatus(new OSDN_Accounts_Status(OSDN_Accounts_Status::INPUT_PARAMS_INCORRECT, 'entity_id'));
        }
        
        $rowset = $this->_tableAccounts->fetchRow(array(
            "entitytype_id = ? "    => $entitytype_id,
            "entity_id = ? "        => $entity_id
        ));
        
        if (!is_null($rowset)) {
            $rowset = $rowset->toArray();
        } elseif (empty($rowset)) {
            $rowset = array();
        }
        $response->addStatus(new OSDN_Accounts_Status(OSDN_Accounts_Status::OK));
        $response->rowset = $rowset;
        return $response;
    }
    
     /**
     * Retrieve account information by email and password
     *
     * @param string $email         The account email
     * @param string $password      The account password
     * @return OSDN_Response
     */
    public function loginByEmailAndPassword($email, $password, $entitytype_id = null)
    {
        $response = new OSDN_Response();
        try {
            $foundAccounts = array();
            $where = array(
                'email = ?'         => $email,
                'password = ?'      => $password
            );
            if (isset($entitytype_id)) {
                $where['entitytype_id = ?'] = $entitytype_id;
            }
            $rows = $this->_tableAccounts->fetchAll($where);
            if ($rows) {
                foreach ($rows as $row) {
                    $element = $this->_getEntityData($row->entity_id, $row->entitytype_id);
                    if ($element) {
                        $element['account_id'] = $row->id;
                        $element['account_email'] = $row->email;
                        $element['account_entitytype_id'] = $row->entitytype_id;
                        $foundAccounts[] = $element;
                    }
                }
                $rows = $rows->toArray();
            } else {
                $rows = array();
            }
            $response->foundAccounts = $foundAccounts;
        } catch (Exception $e) {
            $rows = null;
            $status = OSDN_Accounts_Status::DATABASE_ERROR;
        }
        if (is_null($rows)) {
            $status = OSDN_Accounts_Status::FAILURE;
        } elseif (empty($rows)) {
            $status = OSDN_Accounts_Status::ACCOUNT_IS_NOT_EXISTS;
        } else {
            $status = OSDN_Accounts_Status::OK;
        }
        $response->addStatus(new OSDN_Accounts_Status($status));
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
            'email'             => array('EmailAddress', 'presense' => 'required'),
            'password'          => array('password', 'presense' => 'required'),
            'entitytype_id'     => array(array('InArray', array(OSDN_EntityTypes::STUDENT, OSDN_EntityTypes::TEACHER)), 'presense' => 'required'),
            'entity_id'         => array('Id',  'presense' => 'required')
        ), $data);
        
        $response = new OSDN_Response();
        $response->addInputStatus($f);
        if ($response->hasNotSuccess()) {
            return $response;
        }
        
        $id = $this->_tableAccounts->insert(array(
            'email'         => $f->email,
            'password'      => md5($f->password),
            'entitytype_id' => $f->entitytype_id,
            'entity_id'     => $f->entity_id
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
     * Delete account by entity_id and entity_type_id
     *
     * @param int $entity_id
     * @param int $entity_type_id
     * 
     * @return OSDN_Response
     */
    public function deleteAccountByEntityId($entity_id, $entity_type_id)
    {
        $validate = new OSDN_Validate_Id();
        $response = new OSDN_Response();
        if (!$validate->isValid($entity_id)) {
            return $response->addStatus(new OSDN_Accounts_Status(OSDN_Accounts_Status::INPUT_PARAMS_INCORRECT, 'entity_id'));
        }
        if (!$validate->isValid($entity_type_id)) {
            return $response->addStatus(new OSDN_Accounts_Status(OSDN_Accounts_Status::INPUT_PARAMS_INCORRECT, 'entity_type_id'));
        }
        
        try {
            $affectedRows = $this->_tableAccounts->deleteQuote(array(
                'entity_id = ?'      => $entity_id,
                'entitytype_id = ?' => $entity_type_id,
            ));
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
     * Change password by ID
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
    public function chPasswordById($id, array $data)
    {
        $response = new OSDN_Response();
        $data['id'] = $id;
        
        $f = new OSDN_Filter_Input(array(
            '*'     => array('StringTrim')
        ), array(
            'old_password'   => array('password', 'presense' => 'required'),
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
     * Check email
     *
     * @param string $email
     * @param int $entitytype_id
     * @param int $entity_id
     *
     * @return OSDN_Response
     */
    public function checkEmail($email, $entitytype_id, $entity_id = null)
    {
        if (!$email) {
            return 0;
        }
        $where = array(
            "email = ?"             => $email,
            "entitytype_id = ?"     => $entitytype_id
        );
        if (isset($entity_id)) {
            $where["entity_id != ?"] = $entity_id;
        }
        return $this->_tableAccounts->count($where);
    }
    
    /**
     * start restoring password
     *
     * @param int $email
     * @param int $entitytype_id
     *
     * @return OSDN_Response
     */
    public function startRestorePassword($email, $entitytype_id)
    {
        $config = Zend_Registry::get('config');
        
        $row = $this->_tableAccounts->fetchRow(array(
            "email = ?"             => $email,
            "entitytype_id = ?"     => $entitytype_id
        ));
        
        $response = new OSDN_Response();
        if (!row) {
            $response->email_does_not_exist;
            return $response->addStatus(new OSDN_Accounts_Status(OSDN_Accounts_Status::EMAIL_DOES_NOT_EXIST, 'email'));
        }
        $entityData = $this->_getEntityData($row->entity_id, $row->entitytype_id);
        
        $mail = new Zend_Mail('UTF-8');
        $mail->addTo($row->email, $entityData['fullname']);
        $mail->setFrom($config->mail->from->address, $config->mail->from->caption);
        $mail->setSubject($subject);
        $mail->setBodyHtml($template_final);
        /**
         * @todo: we have a problem when we are sending email
         */
        try{
            $mail->send();
        }catch (Exception $e){

        }
    }
    
    /**
     * Change login info by entity_id
     *
     * @param int $entity_id       The $entity_id
     * @param int $entitytype_id       The $entitytype_id
     * @param array $data   contains old password and new one (old_password, new_password1, new_password2)
     * @return OSDN_Response
     * <data>
     * array(
     *  affectedRows: int
     * )
     * </data>
     */
    public function chPasswordEntity($entity_id, $entitytype_id, array $data)
    {
        $response = new OSDN_Response();
        
        $validate = new OSDN_Validate_Id();
        if (!$validate->isValid($entity_id)) {
            return $response->addStatus(new OSDN_Accounts_Status(OSDN_Accounts_Status::INPUT_PARAMS_INCORRECT, 'entity_id'));
        }
        if (!$validate->isValid($entitytype_id)) {
            return $response->addStatus(new OSDN_Accounts_Status(OSDN_Accounts_Status::INPUT_PARAMS_INCORRECT, 'entitytype_id'));
        }
        
        $row = $this->_tableAccounts->fetchRow(array(
            'entity_id = ?' => $entity_id,
            'entitytype_id = ?' => $entitytype_id
        ));
        
        $exist = $row? true: false; 
        
        if ($exist) {
            $id = $row->id;
        }
        
        $f = new OSDN_Filter_Input(array(
            '*'     => array('StringTrim')
        ), array(
            'old_password'   => array(array('StringLength', 0, 35), 'presense' => 'required'),
            'new_password1'  => array('password', 'presense' => 'required'),
            'new_password2'  => array('password', 'presense' => 'required')
        ), $data);
        
        $response->addInputStatus($f);
        if ($response->hasNotSuccess()) {
            return $response;
        }
        
        if ($exist) {
            $password = $this->_tableAccounts->fetchPassword($id);
            if ($password !== md5($f->old_password)) {
                return $response->addStatus(new OSDN_Accounts_Status(OSDN_Accounts_Status::WRONG_PASSWORD, 'old_password'));
            }
        }
        
        if ($f->new_password1 !== $f->new_password2) {
            return $response->addStatus(new OSDN_Accounts_Status(OSDN_Accounts_Status::UNCORRECT_NEW_PASSWORD, 'new_password2'));
        }

        if ($exist) {
            $affectedRows = $this->_tableAccounts->updateByPk(array(
                'password'      => md5($f->new_password1)
            ), $id);
            $response->addStatus(new OSDN_Accounts_Status(OSDN_Accounts_Status::retrieveAffectedRowStatus($affectedRows)));
        } else {
            $id = $this->_tableAccounts->insert(array(
                'password'          => md5($f->new_password1),
                'entity_id'         => $entity_id,
                'entitytype_id'     => $entitytype_id
            ));
            if ($id > 0) {
                $response->id = $id;
                $response->addStatus(new OSDN_Accounts_Status(OSDN_Accounts_Status::OK));
            } else {
                $response->addStatus(new OSDN_Accounts_Status(OSDN_Accounts_Status::FAILURE));
            }
        }
        return $response;
    }
    
    /**
     * Set password by entity_id
     *
     * @param int $entity_id       The $entity_id
     * @param int $entitytype_id       The $entitytype_id
     * @param array $data   contains old password and new one (new_password1, new_password2)
     * @return OSDN_Response
     * <data>
     * array(
     *  affectedRows: int
     * )
     * </data>
     */
    public function setLoginInformationForEntity($entity_id, $entitytype_id, array $data)
    {
        $response = new OSDN_Response();
        $validate = new OSDN_Validate_Id();
        if (!$validate->isValid($entity_id)) {
            $response->addStatus(new OSDN_Accounts_Status(OSDN_Accounts_Status::INPUT_PARAMS_INCORRECT, 'entity_id'));
            return $response;
        }
        if (!$validate->isValid($entitytype_id)) {
            $response->addStatus(new OSDN_Accounts_Status(OSDN_Accounts_Status::INPUT_PARAMS_INCORRECT, 'entitytype_id'));
            return $response;
        }
        
        $exist = ($row = $this->_tableAccounts->fetchRow(array(
            'entity_id = ?' => $entity_id,
            'entitytype_id = ?' => $entitytype_id
        )))? true: false;
        
        if ($exist) {
            $id = $row->id;
            $f = new OSDN_Filter_Input(array(
                '*'     => array('StringTrim')
            ), array(
                'new_password1'  => array('password', 'allowEmpty' => true),
                'new_password2'  => array('password', 'allowEmpty' => true)
            ), $data);
        } else {
            $f = new OSDN_Filter_Input(array(
                '*'     => array('StringTrim')
            ), array(
                'new_password1'  => array('password', 'presense' => 'required'),
                'new_password2'  => array('password', 'presense' => 'required')
            ), $data);
        }
        $response->addInputStatus($f);
        if ($response->hasNotSuccess()) {
            return $response;
        }
        
        if ($f->new_password1 !== $f->new_password2) {
            return $response->addStatus(new OSDN_Accounts_Status(OSDN_Accounts_Status::PASSWORD_HAS_BE_SAME_IN_BOSS_FIELDS, 'new_password2'));
        }
        
        if ($exist) {
            $affectedRows = $this->_tableAccounts->updateByPk(array(
                'email'             => $f->email,
                'password'          =>
                    (
                        isset($data['new_password1']) && $data['new_password1']
                     && isset($data['new_password2']) && $data['new_password2']
                    )
                        ? md5($f->new_password1)
                        : $row->password
            ), $id);
            $response->addStatus(new OSDN_Accounts_Status(OSDN_Accounts_Status::retrieveAffectedRowStatus($affectedRows)));
            $response->affectedRows = $affectedRows;
        } else {
            $id = $this->_tableAccounts->insert(array(
                'email'             => $f->email,
                'password'          => md5($f->new_password1),
                'entity_id'         => $entity_id,
                'entitytype_id'     => $entitytype_id
            ));
            if ($id > 0) {
                $response->addStatus(new OSDN_Accounts_Status(OSDN_Accounts_Status::OK));
                $response->id = $id;
            }
        }
        return $response;
    }
    
    /**
     * Retrieve entity data
     *
     * @param int $entity_id         Entity id
     * @param int $entitytype_id     Entitytype id
     *
     * @return false|array
     */
    protected function _getEntityData($entity_id, $entitytype_id)
    {
        $element = array();
        switch ($entitytype_id) {
            case OSDN_EntityTypes::STUDENT:
                $student = new CA_Student_Table_Student();
                $studentRow = $student->fetchRow(array(
                    'id = ? ' => $entity_id
                ));
                if (!$studentRow) {
                    return false;
                }
                $element = $studentRow->toArray();
                $element['fullname'] =
                      $element['prefix']
                    . ' '
                    . $element['firstname']
                    . ' '
                    . $element['lastname'];
                
            break;
            case OSDN_EntityTypes::TEACHER:
                $teacher = new CA_Teacher_Table_Teacher();
                $teacherRow = $teacher->fetchRow(array(
                    'id = ? ' => $entity_id
                ));
                if (!$teacherRow) {
                    return false;
                }
                $element = $teacherRow->toArray();
                $element['fullname'] =
                      $element['prefix']
                    . ' '
                    . $element['firstname']
                    . ' '
                    . $element['lastname'];
            break;
        }
        return $element;
    }
}