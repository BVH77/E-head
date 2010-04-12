<?php

/**
 * OSDN_Cron_Unix_Cmd
 *
 * @category OSDN
 * @package OSDN_Cron
 */
class OSDN_Cron_Unix_Cmd implements OSDN_Cron_Unix_Interface
{
    protected $_line;
    
    protected $_minute;
      
    protected $_hour;
     
    protected $_dayofmonth;
      
    protected $_month;
      
    protected $_dayofweek;
      
    protected $_command;
    
    
    public function __construct($line)
    {
        $this->setCommandLine($line);
    }
    
    /**
     * return type of line 
     *
     * @return string
     */
    public function getType() 
    {
        return 'cmd';
    }
    
    /**
     * get minute value 
     *
     * @param string $v
     * 
     * @return void
     */
    public function setMinute($v)
    {
        $this->_minute = $v;
    }
    
    /**
     * return minute value 
     *
     * @return string
     */
    public function getMinute()
    {
        return $this->_minute;
    }
    
    /**
     * set hour value 
     *
     * @param string $v
     * 
     * @return void
     */
    public function setHour($v)
    {
        $this->_hour = $v;
    }
    
    /**
     * return hour value 
     *
     * @return string
     */
    public function getHour()
    {
        return $this->_hour;
    }
    
    /**
     * set day of month value 
     *
     * @param string $v
     * 
     * @return void
     */
    public function setDayofmonth($v)
    {
        $this->_dayofmonth = $v;
    }
    
    /**
     * return day of month value 
     *
     * @return string
     */
    public function getDayofmonth()
    {
        return $this->_dayofmonth;
    }
    
    /**
     * set month value 
     *
     * @param string $v
     * 
     * @return void
     */
    public function setMonth($v)
    {
        $this->_month = $v;
    }
    
    /**
     * return month value 
     *
     * @return string
     */
    public function getMonth()
    {
        return $this->_month;
    }
    
    /**
     * set day of week value 
     *
     * @param string $v
     * 
     * @return void
     */
    public function setDayofweek($v)
    {
        $this->_dayofweek = $v;
    }
    
    /**
     * return day of week value 
     *
     * @return string
     */
    public function getDayofweek()
    {
        return $this->_dayofweek;
    }

    /**
     * set command value 
     *
     * @param string $v
     * 
     * @return void
     */
    public function setCommand($v)
    {
        $this->_command = $v;
    }
    
    /**
     * return command value 
     *
     * @return string
     */
    public function getCommand()
    {
        return trim($this->_command);
    }

    /**
     * return all params in string  
     *
     * @return string
     */
    public function getParams()
    {
        return trim(implode(" ", array(
            $this->getMinute(),
            $this->getHour(),
            $this->getDayofmonth(),
            $this->getMonth(),
            $this->getDayofweek()
        )));
    } 
    
    /**
     * set command line value 
     *
     * @param string $v
     * 
     * @return void
     */
    public function setCommandLine($line)
    {
        //$pars = func_get_args();
        $ct = split("[ \t]", $line, 6);
        if (count($ct) == 6) {
            $this->setMinute($ct[0]);
            $this->setHour($ct[1]);
            $this->setDayofmonth($ct[2]);
            $this->setMonth($ct[3]);
            $this->setDayofweek($ct[4]);
            $this->setCommand($ct[5]);
        }
        $this->_line = $line;
    }
    
    /**
     * return command line 
     *
     * @return string
     */
    public function getCommandLine()
    {
        return implode(" ", array(
            $this->getMinute(),
            $this->getHour(),
            $this->getDayofmonth(),
            $this->getMonth(),
            $this->getDayofweek(),
            $this->getCommand()
        ));
    }
    
    /**
     * convert object value to string 
     *
     * @return string
     */
    public function toString() {
        return $this->getCommandLine();
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


