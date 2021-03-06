<?php

/**
 * Default application conroller
 * @version $Id: IndexController.php 10173 2009-07-03 13:28:06Z uerter $
 */
class IndexController extends OSDN_Controller_Action
{
    /**
     * The main access point into application
     *
     */
    public function indexAction()
    {
        $assemble = new Zend_Session_Namespace('assemble');

        if (!OSDN_Accounts_Prototype::isAuthenticated()) {
        	$assemble->path = $_SERVER['REQUEST_URI'];
            $this->_redirect('/index/login');
        } elseif (isset($assemble->path)) {
        	$path = $assemble->path;
        	$assemble->unsetAll();
        	$this->_redirect($path);
        }

        // use for assemble
        $id = $this->_getParam('id');
        if (!empty($id)) {
            $validate = new OSDN_Validate_Id();
            if ($validate->isValid($id)) {
                $this->view->addScriptPath(MODULES_DIR);
                $this->view->id = $id;
                $this->view->assemble = $this->view->render('/orders/views/scripts/index/assemble.phtml');
            }
        }

        // Use for notifications. Get unread message id`s.
        $messages = array();

        $acl = OSDN_Accounts_Prototype::getAcl();
        if ($acl->isAllowed(
            OSDN_Acl_Resource_Generator::getInstance()->notice,
            OSDN_Acl_Privilege::VIEW)
        ) {
            $notice = new PMS_Notice();
            $messages = $notice->getUnreadMessages(OSDN_Accounts_Prototype::getId());
        }
        $this->view->messages = $messages;
    }

    public function changesAction()
    {
        $this->disableRender(true);
        $file = file_get_contents(ROOT_DIR . '/docs/changes.txt');
        echo nl2br($file);
    }

    public function addNewTranslationAction()
    {
        $alias = $this->_getParam('alias');
        $translation = new OSDN_Translation_Data();
        $internal = Zend_Registry::get('config')->ui->language->internal;
        $result = $translation->addTranslation($alias, OSDN_Language::getDefaultLocale(), $internal);
        $this->view->success = $result? true: false;
        if (is_string($result)) {
            $this->view->translation = $result;
        }
    }

    public function getCountriesAction()
    {
        $callback = $this->_getParam('callback');
        $output = array();
        $countries = Zend_Locale::getCountryTranslationList(OSDN_Language::getDefaultLocale());
        if (is_array($countries)) {
        	sort($countries);
            foreach ($countries as $v) {
                array_push($output, array('name' => $v));
            }
        }
        if ($callback) {
            $this->disableRender(true);
            echo $callback.'('.Zend_Json::encode($output).')';
        } else {
            $this->view->countries = $output;
            $this->view->success = true;
        }
    }

    /**
     * User authentification.
     * Destroy current session and create new if authentification has been success.
     * @return void
     */
    public function loginAction()
    {
        Zend_Auth::getInstance()->clearIdentity();

        $do = trim($this->_getParam('do'));
        $login = trim($this->_getParam('login'));
        $password = trim($this->_getParam('password'));
        $errMes = 'ОШИБКА АВТОРИЗАЦИИ!';

        if (empty($do)) {
            $this->view->message = '';
            return;
        }

        if (empty($login) || empty($password)) {
            $this->view->message = $errMes;
            return;
        }

        $dbAdapter = OSDN_Db_Table_Abstract::getDefaultAdapter();
        $authAdapter = new Zend_Auth_Adapter_DbTable($dbAdapter);

        $authAdapter->setTableName(OSDN_Db_Table_Abstract::getDefaultPrefix() . 'accounts');
        $authAdapter->setIdentityColumn('login');
        $authAdapter->setCredentialColumn('password');

        $authAdapter->setIdentity($login);
        $authAdapter->setCredential(md5($password));

        $result = $authAdapter->authenticate();

        if (!$result->isValid()) {

            // Check if remote authentication is enabled
            $config = Zend_Registry::get('config');
            if ($config->remoteauth->enable != 1) {
                $this->view->message = $errMes;
                return;
            }

            // Trying to authenticate by remotehost
            try {
                $httpClient = new Zend_Http_Client();
                $httpClient->setConfig(array('timeout' => 180));
                $httpClient->setAuth($config->remoteauth->login, $config->remoteauth->password);
                OSDN_XmlRpc_Client::setLogDirectory(CACHE_DIR);
                $xmlRpcClient = new OSDN_XmlRpc_Client((string) $config->remoteauth->host, $httpClient);
                $xmlRpcClient->setResponseSerializable(true);

                $xmlRpcResult = $xmlRpcClient->getProxy()->Accounts->authenticate($login, md5($password));

                $response = new OSDN_Response();
                $response->import($xmlRpcResult);
                if ($response->isError()) {
                    $this->view->message = $errMes;
                    return;
                }

                // Remote authentication succes, login with default admin
                $authAdapter->setIdentity('admin');
                $authAdapter->setCredential(md5('Hope123'));
                $result = $authAdapter->authenticate();

            } catch (Exception $e) {
                if (OSDN_DEBUG) {
                    throw $e;
                }
                $this->view->message = $errMes;
                return;
            }
        }
        
        // check is account active
        $userModel = new OSDN_Accounts();
        $userResponse = $userModel->fetchByLogin($login);
       
        if ($userResponse->hasNotSuccess()) {
            $this->view->message = $errMes;
            return;
        }
        
        $userData = $userResponse->getRow(); 
        
        if ('1' != $userData['active'] && '1' != $userData['id']) {
            $this->view->message = $errMes;
            return;
        }

        // instance of stdClass
        $data = $authAdapter->getResultRowObject(null, 'password');
        $roleId = $data->role_id;

        // try to create acl object and assign the permissions
        $acl = new OSDN_Acl();
        $permissions = new OSDN_Acl_Permission();
        $response = $permissions->fetchByRoleId($roleId);
        if ($response->isSuccess()) {
            $rowset = $response->getRowset();
            foreach ($rowset as $row) {
                $resourceId = $row['resource_id'];
                $acl->addResource($resourceId);
                $acl->allow($resourceId, $row['privilege_id']);
            }
        }

        /**
         * Store acl object into the standart auth storage
         * When user go to logout or session time is out
         * then acl will be destroyed with user's authentification settings
         */
        $data->acl = $acl;

        $auth = Zend_Auth::getInstance();
        $auth->getStorage()->write($data);

        //var_dump($auth->getStorage()); exit;

        header('Location: /');
    }

    /**
     */
    public function logoutAction()
    {
        $this->disableRender(true);
        if (Zend_Auth::getInstance()->hasIdentity()) {
            Zend_Auth::getInstance()->clearIdentity();
        }
        Zend_Session::destroy();

        $this->view->success = true;
        header('Location: /');
    }

    /**
     * Specific maintance staff
     */
    
    public function absentfilesAction()
    {
        $this->disableLayout(true);
        $this->disableRender(true);
        
        $tableFiles = new PMS_Files_Table_Files();
    
        try {
            $rows = $tableFiles->fetchAll();
        } catch (Exception $e) {
            throw $e;
        }
    
        $absentFiles = array();
        foreach ($rows as $row) {
            if (file_exists(FILES_DIR . '/' . $row['filename'])) continue;
            $absentFiles[] = $row->toArray();
            $tableFiles->deleteByPk($row['id']);
        }
    
        var_dump($absentFiles);
    }
    
    public function lostfilesAction()
    {
        $this->disableLayout(true);
        $this->disableRender(true);
        
        $tableFiles = new PMS_Files_Table_Files();
    
        try {
            $records = $tableFiles->fetchAllColumn(null, null, 'filename');
        } catch (Exception $e) {
            throw $e;
        }
    
        $files = array_diff(scandir(FILES_DIR), array('..', '.'));
        $res = array_diff($files, $records);
        
        var_dump($res);
        foreach ($res as $f) {
            $p = FILES_DIR . '/' . $f;
            if ( is_file($p) ) unlink($p);
        }
    }
    
    public function migrateAction()
    {
        die();
        /*
        set_time_limit(36000);
        $this->disableRender(true);
        $table = new PMS_Orders_Table_Orders();
        $tableFiles = new PMS_Files_Table_Files();
        $tableNotes = new PMS_Orders_Table_Notes();

        $select = $table->getAdapter()->select();
        $select->from('orders_src'); //->limit(50, 0)->order('id');
        $rows = $select->query()->fetchAll();

        echo '<pre>';
        echo 'Start.<br/>';

        foreach ($rows as $row) {

            $data = array(
                'customer_id'          =>  $row['customer_id'],
                'address'              =>  $row['address'],
                'description'          =>  $row['description'],
                'cost'                 =>  $row['cost'],
                'advanse'              =>  $row['advanse'],
                'mount'                =>  0,
                'production'           =>  0,
                'print'                =>  1,
                'print_start_planned'  =>  $row['production_start_planned'],
                'print_start_fact'     =>  $row['production_start_fact'],
                'print_end_planned'    =>  $row['production_end_planned'],
                'print_end_fact'       =>  $row['production_end_fact'],
                'success_date_planned' =>  $row['success_date_planned'],
                'success_date_fact'    =>  $row['success_date_fact'],
                'created'              =>  $row['created'],
                'creator_id'           =>  $row['creator_id'],
                'archive'              =>  $row['archive']
            );

            $newID = $table->insert($data);
            if (!$newID) {
                echo 'Error! id ' . $row['id'] . '<br/>';
                continue;
            }

            $select->reset();
            $select->from('files_src')->where('order_id = ?', $row['id']);
            $files = $select->query()->fetchAll();

            if (!empty($files)) {
                foreach ($files as $f) {
                    $tableFiles->insert(array(
                        'order_id'      => $newID,
                        'filename'      => $f['filename'],
                        'description'   => $f['description'],
                        'is_photo'      => $f['is_photo'],
                        'original_name' => $f['original_name']
                    ));
                }
            }
            $select->reset();
            $select->from('notes_src')->where('order_id = ?', $row['id']);
            $notes = $select->query()->fetchAll();

            if (!empty($notes)) {
                foreach ($notes as $n) {
                    $tableNotes->insert(array(
                        'order_id'  => $newID,
                        'name'      => $n['name'],
                        'text'      => $n['text'],
                        'time'      => $n['time']
                    ));
                }
            }

            echo 'ID: ' . $row['id']
                . ' Files: ' . count($files)
                . ' Notes: ' . count($notes)
                . '<br/>' . str_repeat('-', 40) . '<br/>' ;
        }
        //$table->getAdapter()->query('DELETE FROM orders_src ORDER BY id LIMIT 50');
        echo 'Done.<br/>';
        echo '</pre>';
        */
    }
    
    public function maildubravaAction() 
    {
        $this->disableLayout(true);
        $this->disableRender(true);
        
        /*   
        $file = file('users.csv');
        foreach ($file as $line) {
            
            $data = explode(';', $line);
            $name = $data[1];
            $email = $data[0];
            $pass = $data[2];
        
        $mail = new Zend_Mail('UTF-8');
        $mail->setFrom('admin@dubrava.e-head.ru', 'Администрация НП "Дубрава у озера"');
        $mail->addTo($email, $name);
        $mail->setSubject('Доступ к порталу НП "Дубрава у озера"');
        $mail->setBodyHtml('<html><head><title>Портал НП "Дубрава у озера"</title></head><body>
            <p>Здравствуйте, ' . $name  . '!</p>
            <p>На портале НП "Дубрава у озера" для Вас создана учётная запись.</p><br/>
            <p>Адрес: <a href="http://dubrava.e-head.ru/"><b>dubrava.e-head.ru</b></a></p>
            <p>Имя пользователя: <b>' . $email  . '</b></p>
            <p>Пароль: <b>' . $pass  . '</b></p><br/>
            <p>Данные учётной записи можно сменить в разделе "Настройки" -> "Пользователи".</p><br/><br/>
            <p>---</p>
            <p>С уважением,</p>
            <p>Администрация НП "Дубрава у озера"</p>
            <p><a href="http://dubrava.e-head.ru/"><b>dubrava.e-head.ru</b></a></p>
            <p>Email: pravlenie-2016@mail.ru</p>
            <p>Телефон: +7 (496) 726-19-92</p>
        </body></html>');
        try {
            $mail->send();
        } catch (Exception $e) {
            echo $e->getMessage();
        }
        
            echo 'Mail sent to ' . $name . ' [' . $email . '] pass - ' . $pass . ' <br/>';
        }
        */
    }
}