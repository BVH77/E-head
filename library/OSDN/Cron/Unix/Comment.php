<?php

/**
 * OSDN_Cron_Unix_Comment
 *
 * @category OSDN
 * @package OSDN_Cron
 */
class OSDN_Cron_Unix_Comment implements OSDN_Cron_Unix_Interface
{
    protected $_comment;
    
    public function __construct($comment)
    {
        $this->_comment = $comment;
    }
    
    /**
     * return type of line 
     *
     * @return string
     */
    public function getType() 
    {
        return 'comment';
    }
    
    /**
     * set comment
     *
     * @param string $comment
     * 
     * @return string
     */
    public function setComment($comment)
    {
        $this->_comment = $comment;
    }
    
    /**
     * get comment value
     *
     * @return string
     */
    public function getComment()
    {
        return $this->_comment;
    }
    
    /**
     * convert object value to string 
     *
     * @return string
     */
    public function toString() {
        return "#" . $this->getComment($comment);
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

