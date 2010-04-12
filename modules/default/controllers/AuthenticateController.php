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
     * User authentification
     *
     * if user go to this action
     * then he wants to login on another entity
     * then we destroy current session
     * and create new if authentification will be success
     *
     * @return void
     */
    public function loginAction()
    {
        Zend_Auth::getInstance()->clearIdentity();
            
        $login = trim($this->_getParam('username'));
        $password = md5(trim($this->_getParam('password')));
        $digipass = trim($this->_getParam('digipass'));
        
        $dbAdapter = OSDN_Db_Table_Abstract::getDefaultAdapter();
        $authAdapter = new Zend_Auth_Adapter_DbTable($dbAdapter);
        
        $authAdapter->setTableName(OSDN_Db_Table_Abstract::getDefaultPrefix() . 'accounts');
        $authAdapter->setIdentityColumn('login');
        $authAdapter->setCredentialColumn('password');
        
        $authAdapter->setIdentity($login);
        $authAdapter->setCredential($password);
        
        $authenticated = false;
        $message = "";
        
        do {
            
            $auth = Zend_Auth::getInstance();
            $result = $authAdapter->authenticate();

            if (!$result->isValid()) {
                $message = lang('Login or password is incorrect');
                break;
            }
            
            // instance of stdClass
            $data = $authAdapter->getResultRowObject(null, 'password');
            $config = Zend_Registry::get('config');
            
            // checking superadmin
            $superAdminOptions = $config->auth->superadmin;
            if ($superAdminOptions->enable) {
                $superAdministratorLogin = $config->auth->superadmin->login;
                $superAdministratorPassword = $config->auth->superadmin->password;
                
                if (!empty($superAdministratorLogin) && !empty($superAdministratorPassword)) {
                    if (
                        $superAdministratorLogin == $login &&
                        md5($superAdministratorPassword) == $password
                    ) {
                        $data->superadmin = true;
                        $authenticated = true;
                        break;
                    }
                }
            }
            
            // If radius enabled in system and allowed to user
//            $radius = $config->radius;
//            if (
//                $radius->enabled &&
//                ($radius->mandatory || $data->radius)
//            ) {
//    
//                if (!preg_match('/^[\d]{6}$/', $digipass)) {
//                    $message = 'Digipass must contain 6 digits [XXXXXX]';
//                    break;
//                }
//                
//                if (!extension_loaded('radius')) {
//                    $message = 'Radius extension is not installed';
//                    break;
//                }
//                
//                $radiusAdapter = OSDN_Auth_Adapter_Radius::factory($radius->adapter, $radius->options);
//                $radiusAdapter->setUsername($login);
//                $radiusAdapter->setPassword($digipass);
//                $result = null;
//                
//                try {
//                    $result = $radiusAdapter->authenticate();
//                } catch (Exception $e) {
//                    $message = 'Radius exception throwed';
//                    break;
//                }
//                
//                if (!$result->isValid()) {
//                    $message = 'Digipass is not correct';
//                    break;
//                }
//            }
            
            $authenticated = true;
            
        } while(false);
        
        if (!$authenticated) {
            $this->view->message = $message;
            return false;
        }

        if (!property_exists($data, 'superadmin') || true !== $data->superadmin) {
            
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
            $locale = $this->_getParam('locale');
            $language = new OSDN_Language();
            if ($language->isAvailableLocale($locale)) {
                OSDN_Language::setDefaultLocale($locale, true);
            }
        }
        
        // copy all predefined anonymous account settings to regular account
        //$locale = OSDN_Language::getDefaultLocale();
        
        $auth->getStorage()->write($data);
        $this->view->success = true;
        
        //OSDN_Language::setDefaultLocale($locale);
        
        /**
         * Synchronize all data with main catalogue storage
         */
        
        
//        $synchronization = new CA_Synchronization();
//        $synchronization->runAll(false);
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