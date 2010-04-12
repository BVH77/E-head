<?php
/**
 * OSDN_Subject_Observer_Abstract
 *
 * @category OSDN
 * @package OSDN_Subject
 */
abstract class OSDN_Subject_Observer_Abstract {
    
    /**
	 * return unique name of observer
	 * 
	 * @return string
	 */
    public function __toString() {
        return get_class($this);
    }
}