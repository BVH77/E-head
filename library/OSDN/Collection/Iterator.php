<?php

/**
 * This class is the default implementation of a Iterator
 * used for foreach constructs.
 *
 * @category		OSDN
 * @package		OSDN_Collection
 * @version		$Id: Iterator.php 5388 2008-11-14 13:58:05Z flash $
 */
class OSDN_Collection_Iterator extends OSDN_Object implements Iterator
{
    /**
     * Holds the internal array
     *
     * @var array
     */
    private $_collection = array();
    
    /**
     * Constructor that initializes the internal member
     * with the array passed as parameter.
     *
     * @param array $collection
     */
    public function __construct(array $collection)
    {
        $this->_collection = $collection;
    }
    
    /**
     * Resets the internal array pointer to the first entry. 
     * And retures the value therefore.
     *
     * @return mixed
     */
    public function rewind()
    {
        return reset($this->_collection);
    }
    
    /**
     * Returns the actual entry.
     * 
     * @return mixed
     */
    public function current()
    {
        return current($this->_collection);
    }
    
    /**
     * Returns the key of the actual entry.
     *
     * @return mixed
     */
    public function key()
    {
        return key($this->_collection);
    }
    
    /**
     * Returns the next entry.
     *
     * @return mixed
     */
    public function next()
    {
        return next($this->_collection);
    }
    
    /**
     * Checks if the actual entry of the internal array is not false.
     *
     * @return boolean  True if there is a actual entry in the internal array, else false
     */
    public function valid()
    {
        return false !== $this->current();
    }
    
    /**
     * This method sets the internal array pointer
     * to the end of the array and returns the value therefore.
     * 
     * @return mixed    Holds the last value of the internal array
     */
    public function last()
    {
        return end($this->_collection);
    }
}