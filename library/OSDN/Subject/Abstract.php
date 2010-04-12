<?php

/**
 * OSDN_Subject_Abstract
 *
 * @category OSDN
 * @package OSDN_Subject
 */
abstract class OSDN_Subject_Abstract {
    
    /**
	 * store of observer objects
	 */
    protected $_observers;
    
    /**
	 * add observer object to store
	 * 
	 * @return boolean
	 */
    abstract public function attachEvent($observer_in);
    
    /**
	 * remove observer object from store
	 * 
	 * @return boolean
	 */
    abstract public function detachEvent($observer_in);
    
    /**
	 * fire event
	 * 
	 * @return OSDN_Response
	 */
    abstract public function fireEvent($eventName);

}