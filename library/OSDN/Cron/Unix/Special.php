<?php

/**
 * OSDN_Cron_Unix_Special
 *
 * @category OSDN
 * @package OSDN_Cron
 */
class OSDN_Cron_Unix_Special implements OSDN_Cron_Unix_Interface
{
    protected $_elements;

    public function __construct($line)
    {
        $this->setElements($line);

    }
    
    /**
     * return type of line 
     *
     * @return string
     */
    public function getType()
    {
        return 'special';
    }

    /**
     * set elements
     *
     * @param array | string $line
     * 
     * @return array
     */
    public function setElements($line)
    {
        $this->_elements = is_array($line)? $line: split("[ \t]", $line, 2);
    }

    /**
     * get elements
     *
     * @return array
     */
    public function getElements()
    {
        return $this->_elements;
    }

    /**
     * convert object value to string 
     *
     * @return string
     */
    public function toString() {
        return implode(" ", $this->getElements());
    }

    /**
     * convert object value to string 
     *
     * @return string
     */
    function __toString() {
        return $this->toString();
    }
}

