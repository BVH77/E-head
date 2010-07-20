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
        if(!OSDN_Accounts_Prototype::isAuthenticated()) {
            $this->_redirect('/index/login');
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
        if (empty($do)) {
            $this->view->message = '';
            return;
        }
            
        $login = trim($this->_getParam('login'));
        $password = md5(trim($this->_getParam('password')));
        $dbAdapter = OSDN_Db_Table_Abstract::getDefaultAdapter();
        $authAdapter = new Zend_Auth_Adapter_DbTable($dbAdapter);
        
        $errMes = 'ОШИБКА АВТОРИЗАЦИИ!';
        
        if (empty($login) || empty($password)) {
            $this->view->message = $errMes;
            return;
        }

        $authAdapter->setTableName(OSDN_Db_Table_Abstract::getDefaultPrefix() . 'accounts');
        $authAdapter->setIdentityColumn('login');
        $authAdapter->setCredentialColumn('password');
        
        $authAdapter->setIdentity($login);
        $authAdapter->setCredential($password);
        
        $auth = Zend_Auth::getInstance();
        $result = $authAdapter->authenticate();

        if (!$result->isValid()) {
            $this->view->message = $errMes;
            return;
        }
            
        // instance of stdClass
        $data = $authAdapter->getResultRowObject(null, 'password');
        $config = Zend_Registry::get('config');

        // try to create acl object and assign the permissions
        $acl = new OSDN_Acl();
        $roleId = $data->role_id;
        
        $permissions = new OSDN_Acl_Permission();
        $response = $permissions->fetchByRoleId($roleId);
        if ($response->isSuccess()) {
            $rows = $response->rows;
            foreach ($rows as $row) {
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
        
        /**
         * Apply account locale
         */
//        $locale = $this->_getParam('locale');
//        $language = new OSDN_Language();
//        if ($language->isAvailableLocale($locale)) {
//            OSDN_Language::setDefaultLocale($locale, true);
//        }
        
        $auth->getStorage()->write($data);
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