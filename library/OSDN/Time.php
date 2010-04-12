<?php

/**
 * OSDN time object
 *
 * @category		OSDN
 * @package		OSDN
 * @version		$Id: Time.php 7307 2009-03-18 07:04:56Z flash $
 */
class OSDN_Time
{
    /**
     * Hours
     *
     * @var int
     */
    protected $_hours = 0;
    
    /**
     * Minutes
     *
     * @var int
     */
    protected $_minutes = 0;
    
    /**
     * Seconds
     *
     * @var int
     */
    protected $_seconds = 0;
    
    /**
     * Input time
     *
     * @var string
     */
    protected $_time = '';
    
    /**
     * Time separator
     *
     * @var string
     */
    protected $_separator = ':';
    
    /**
     * Allowed separators for time parser
     *
     * @var array
     */
    protected $_allowedSeparators = array(':', ',', '.', ';', '/', '\\');
    
    /**
     * The constructor
     *
     */
    public function __construct($time = "")
    {
        $this->setTime($time);
    }
    
    /**
     * Compare time object with existing one.
     *
     * @param OSDN_Time $time   The compared object
     * @return int
     *   0   - equal
     *   1   - later
     *  -1   - elier
     */
    public function compare(OSDN_Time $time)
    {
        $t1 = $time->toUnixTime();
        $t2 = $this->toUnixTime();
        $result = 0;
        if ($t1 > $t2) {
            $result = 1;
        } elseif ($t1 < $t2) {
            $result = -1;
        }
        
        return $result;
    }
    
    /**
     * Compare hours
     *
     * @param int|string|OSDN_Time $time The compared hours
     * @return int
     *   0   - equal
     *   1   - later
     *  -1   - elier
     */
    public function compareHours($hours)
    {
        if (is_string($hours)) {
            $hours = (int) $hours;
        } elseif($hours instanceof OSDN_Time) {
            $hours = $hours->getHours();
        }
        
        $result = 0;
        if ($hours > $this->getHours()) {
            $result = 1;
        } elseif ($hours < $this->getHours()) {
            $result = -1;
        }
        
        return $result;
    }
    
    /**
     * Compare minutes
     *
     * @param int|string|OSDN_Time $time The compared minutes
     * @return int
     *   0   - equal
     *   1   - later
     *  -1   - elier
     */
    public function compareMinutes($minutes)
    {
        if (is_string($minutes)) {
            $minutes = (int) $minutes;
        } elseif($minutes instanceof OSDN_Time) {
            $minutes = $minutes->getMinutes();
        }
        
        $result = 0;
        if ($minutes > $this->getMinutes()) {
            $result = 1;
        } elseif ($minutes < $this->getMinutes()) {
            $result = -1;
        }
        
        return $result;
    }

    /**
     * Compare seconds
     *
     * @param int|string|OSDN_Time $time The compared seconds
     * @return int
     *   0   - equal
     *   1   - later
     *  -1   - elier
     */
    public function compareSeconds($seconds)
    {
        if (is_string($seconds)) {
            $seconds = (int) $seconds;
        } elseif($seconds instanceof OSDN_Time) {
            $seconds = $seconds->getSeconds();
        }
        
        $result = 0;
        if ($seconds > $this->getSeconds()) {
            $result = 1;
        } elseif ($seconds < $this->getSeconds()) {
            $result = -1;
        }
        
        return $result;
    }
    
    /**
     * Set time separator
     *
     * @param string $separator
     * @return OSDN_Time
     */
    public function setSeparator($separator)
    {
        $this->_separator = (string) $separator;
        return $this;
    }
    
    /**
     * Set time for object
     *
     * @param string|int $time
     * @return OSDN_Time
     */
    public function setTime($time)
    {
        if (!empty($time)) {
            $this->_time = (string) $time;
        }

        $this->_time = trim($this->_time);
        $this->_parse($this->_time);
        return $this;
    }
    
    /**
     * @see toString
     *
     * @return string
     */
    public function __toString()
    {
        return $this->toString();
    }
    
    /**
     * Retrieve the time in string
     *
     * @param string $format        The alternate format
     * @return string
     */
    public function toString($format = "H:i:s")
    {
        return date($format, $this->toUnixTime());
    }
    
    /**
     * Convert to unix time
     *
     * @return int
     */
    public function toUnixTime()
    {
        return strtotime($this->_hours . ':' . $this->_minutes . ':' . $this->_seconds);
    }
    
    /**
     * Parse time
     *
     * @param string $time
     * @return OSDN_Time
     */
    protected function _parse($time)
    {
        $pattern = $this->_separator . '|[' . preg_quote(join('', $this->_allowedSeparators)) . ']';
        $result = preg_split("!$pattern!", $time);
        if (1 == count($result) && strlen($result[0]) > 2) {
            if (preg_match_all('/\d\d/', $time, $matches)) {
                $result = $matches[0];
            }
        }
        
        array_reverse($result);
        
        if (3 == count($result)) {
            $this->_seconds = (int) $result[2];
        }
        
        if (count($result) >= 2) {
            $this->_minutes = (int) $result[1];
        }
        
        if (count($result) >= 1) {
            $this->_hours = (int) $result[0];
        }
        
        return $this;
    }
    
    /**
     * Retrieve hours
     *
     * @return int
     */
    public function getHours()
    {
        return $this->_hours;
    }
    
    /**
     * Retrieve minutes
     *
     * @return int
     */
    public function getMinutes()
    {
        return $this->_minutes;
    }
    
    /**
     * Retrieve seconds
     *
     * @return int
     */
    public function getSeconds()
    {
        return $this->_seconds;
    }
}