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
        $config = Zend_Registry::get('config');
        if ($config->debug) {
	        $this->view->auth = $config->auth->default->toArray();
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

    public function getJsContentAction()
    {
        ob_start ("ob_gzhandler");
        header('Content-type: text/javascript; charset: UTF-8');
        echo OSDN_Script::factory()->get();
        exit;
    }

    public function getCssContentAction()
    {
        header("Content-type: text/css; charset: UTF-8");
        echo OSDN_Script::factory("Css")->get();
        exit;
    }

    public function getMenuAction()
    {
        $config = Zend_Registry::get('config');

        if (file_exists(ROOT_DIR . $config->layout->layoutPath . '/menu.xml')) {
            $xmlConfig = new Zend_Config_Xml(ROOT_DIR . $config->layout->layoutPath . '/menu.xml');
        } else {
            $xmlConfig = new Zend_Config_Xml(ROOT_DIR . '/html/layouts/menu.xml');
        }

        $cfg = $xmlConfig->toArray();
        $this->view->assign($this->correct($cfg['menu']['item']));
    }
}