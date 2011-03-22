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
     * Destroy account session and redirect on base site url.
     *
     * @todo Very often we got an error the
     *  Warning: session_destroy() [function.session-destroy]:
     *  Session object destruction failed in D:\www\CATALOQUE\library\Zend\Session.php on line 676
     *
     * Try fix in future release
     *  PHP bug: http://bugs.php.net/bug.php?id=29419&edit=1
     *  current PHP version:
     *      PHP Version 5.2.6
     *      May 2 2008 18:01:20
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
}