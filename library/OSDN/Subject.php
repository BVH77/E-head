<?php

/**
 * OSDN_Subject
 *
 * @category OSDN
 * @package OSDN
 */
class OSDN_Subject extends OSDN_Subject_Abstract 
{
    /**
	 * constructor - init observer store
	 */
    public function __construct() {
        $this->_observers = array();
        $subName = get_class($this);
        $folder = API_DIR . "/" . str_replace("_", "/", $subName) . "/Observers/";
        if (!is_file($folder . "Abstract.php") || 'file' !== filetype($folder . "Abstract.php")) {
            return;
        }
        if (is_dir($folder)) {
            if ($dh = opendir($folder)) {
                while (false !== ($file = readdir($dh))) {
                    if ('file' == filetype($folder . $file)) {
                        if ($file != 'Abstract.php' && substr($file, -4) == '.php') {
                            $className = $subName . "_Observers_" . substr($file, 0, strlen($file) - 4);
                            $this->attachEvent(new $className());
                        }
                    }
                }
                closedir($dh);
            }
        }
        if (method_exists($this, 'init')) {
            $this->init();
        }
    }
    
    /**
	 * add observer object to store
	 * 
	 * @return boolean
	 */
    public function attachEvent($observer_in) {
        if (isset($this->_observers["$observer_in"])) {
            return true;
        }
        if ($observer_in instanceof OSDN_Subject_Observer_Abstract) {
            $this->_observers["$observer_in"] = $observer_in;
        } else {
            $this->_observers["$observer_in"] = new $observer_in();
        }
        return true;
    }
    
    /**
	 * remove observer object from store
	 * 
	 * @return boolean
	 */
    public function detachEvent($observer_in) {
        unset($this->_observers["$observer_in"]);
        return true;
    }
    
    /**
	 * fire event
	 * 
	 * @return OSDN_Response
	 */
    public function fireEvent($eventName) {
        $runned = false;
        $response = new OSDN_Response();
        if ($this->_observers) {
            foreach((array)$this->_observers as $obs) {
                if (method_exists($obs, $eventName)) {
                    $runned = true;
                    $args = func_get_args();
                    array_shift($args);
                    $res = call_user_func_array(array($obs, $eventName), $args);
                    if ($res instanceof OSDN_Response) {
                        $response->importStatuses($res->getStatusCollection());
                    } elseif ($res === false) {
                        return false;
                    }
                }
            }
        }
        if (!$runned) {
            $response->addStatus(new OSDN_Response_Status_Storage(OSDN_Response_Status_Storage::OK));
        }
        return $response;
    }
}