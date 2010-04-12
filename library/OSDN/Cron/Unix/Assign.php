<?php

/**
 * OSDN_Cron_Unix_Assign
 *
 * @category OSDN
 * @package OSDN_Cron
 */
class OSDN_Cron_Unix_Assign implements OSDN_Cron_Unix_Interface
{

    protected $_name;

    protected $_value;

    public function __construct($name, $value = null)
    {
        $this->setParam($name, $value);
    }

    /**
     * return type of line 
     *
     * @return string
     */
    public function getType()
    {
        return 'assign';
    }

    /**
     * set param value 
     *
     * @param string $name
     * @param string not required $value 
     * 
     * @return void
     */
    public function setParam($name, $value = null)
    {
        if (isset($value)) {
            $this->_name = trim($name);
            $this->_value = trim($value);
        } else {
            ereg("(.*)=(.*)", $name, $assign);
            $this->_name = trim($assign[1]);
            $this->_value = trim($assign[2]);
        }
    }

    /**
     * get param name of object 
     *
     * @return string
     */
    public function getName()
    {
        return trim($this->_name);
    }

    /**
     * get param value of object 
     *
     * @return string
     */
    public function getValue()
    {
        return trim($this->_value);
    }

    /**
     * convert object value to string 
     *
     * @return string
     */
    public function toString()
    {
        return $this->getName() . "=" . $this->getValue();
    }

    /**
     * convert object value to string 
     *
     * @return string
     */
    function __toString()
    {
        return $this->toString();
    }
}