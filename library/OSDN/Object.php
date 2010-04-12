<?php

/**
 * Base class for all another objects
 *
 * @category    OSDN
 * @package     OSDN
 * @version     $Id: Object.php 5404 2008-11-14 15:18:29Z flash $
 */
class OSDN_Object extends stdClass
{
    /**
     * Returns a hash code value for the object.
     *
     * @return string
     */
    public function codeHash()
    {
        return spl_object_hash($this);
    }
    
    /**
     * Indicates whether some other object is "equal to" this one. 
     *
     * @param stdClass $obj
     * @return boolean
     */
    public function equals(stdClass $obj) 
    {
        return $this == $obj;
    }
    
    /**
     * Returns a string representation of the object.
     * In general, the <code>toString</code> method returns a string that
     * "textually represents" this object. The result should
     * be a concise but informative representation that is easy for a
     * person to read.
     * It is recommended that all subclasses override this method.
     *
     * @return string       representation of the object.
     */
    public function toString()
    {
        return $this->getClass() . '@' . $this->codeHash();
    }
    
    /**
     * Returns the runtime class of this {@code Object}. The returned
     * {@code Class} object is the object that is locked by {@code
     * static synchronized} methods of the represented class.
     * 
     * @return string
     */
    public function getClass()
    {
        return get_class($this);
    }
}