<?php

/**
 * OSDN_Cron_Unix_Empty
 *
 * @category OSDN
 * @package OSDN_Cron
 */
class OSDN_Cron_Unix_Empty implements OSDN_Cron_Unix_Interface
{
    /**
     * return type of line 
     *
     * @return string
     */
    public function getType() 
    {
        return 'empty';
    }
    
    /**
     * convert object value to string 
     *
     * @return string
     */
    public function toString() {
        return "\n";
    }
    
    /**
     * convert object value to string 
     *
     * @return string
     */
    function __toString() {
        return "\n";
    }
}

