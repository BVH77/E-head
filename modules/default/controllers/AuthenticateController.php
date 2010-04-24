<?php

/**
 * Default authenticate controller
 *
 * @category		OSDN
 * @package		OSDN
 * @version		$Id: AuthenticateController.php 8509 2009-05-04 12:41:31Z vasya $
 */
class AuthenticateController extends OSDN_Controller_Action
{
    /**
     * User authentification.
     * Destroy current session and create new if authentification has been success.
     * @return void
     */
    public function loginAction()
    {
        Zend_Auth::getInstance()->clearIdentity();

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
        $this->view->message = '';
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