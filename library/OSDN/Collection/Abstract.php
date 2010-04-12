<?php

/**
 * Abstract collection object
 *
 * @category    OSDN
 * @package     OSDN_Collection
 * @version     $Id: Abstract.php 8444 2009-04-29 11:25:33Z vasya $
 */
abstract class OSDN_Collection_Abstract extends OSDN_Object implements IteratorAggregate, OSDN_Collection_IndexedCollection_Interface
{
    /**
     * Holds the items of the ArrayList
     *
     * @var array
     */
    protected $_items = array();
    
    /**
     * getIterator() - return an iteratable object for use in foreach and the like,
     * this completes the IteratorAggregate interface
     *
     * @return OSDN_Collection_Iterator - iteratable container of items list
     */
    public function getIterator()
    {
        return new OSDN_Collection_Iterator($this->_items);
    }
    
    /**
     * @see OSDN_Collection_IndexedCollection_Interface::addAll(array $set)
     * 
     * @return OSDN_Collection_Abstract
     */
    public function addAll(array $set)
    {
        foreach($set as $key => $value) {
            $this->_items[$key] = $value;
        }
        return $this;
    }
    
    /**
     * This method returns the element with the passed key
     * from the IndexedCollection.
     *
     * @see OSDN_Collection_IndexedCollection_Interface::get($key);
     * @param mixed $key Holds the key of the element to return
     */
    public function get($key)
    {
        if ($this->exists($key)) {
            return $this->_items[$key];
        }

        throw new OutOfBoundsException("Index $key out of bounds.");
    }
    
    /**
     * This method checks if an element with the passed
     * key exists in the IndexedCollection. If yes the
     * method returns TRUE, else FALSE.
     *
     * @see OSDN_Collection_IndexedCollection_Interface::exists($key); 
     * @param mixed $key Holds the key of the element to check for
     * @return boolean Returns TRUE if the element exists in the IndexedCollection else FALSE
     */
    public function exists($key)
    {
        if (is_null($key)) {
            throw new InvalidArgumentException('Passed key is null.');
        }
        
        if (!is_integer($key) && !is_string($key) && !is_double($key)) {
            throw new InvalidArgumentException('Passed key has to be a primitive datatype.');
        }
        
        return array_key_exists($key, $this->_items);
    }

    /**
     * @see OSDN_Collection_IndexedCollection_Interface::toArray()
     * 
     * @return array
     */
    public function toArray()
    {
        return array_values($this->_items);
    }
    
    /**
     * Implements of Countable interface
     *
     * @return int
     */
    public function count()
    {
        return count($this->_items);
    }
    
    /**
     * @see OSDN_Collection_IndexedCollection_Interface::isEmpty()
     * 
     * @return boolean
     */
    public function isEmpty()
    {
        return $this->count() == 0;
    }
    
    public function remove($key)
    {
        if ($this->exists($key)) {
            unset($this->_items[$key]);
            return $this;
        }
        
        throw new OutOfBoundsException("Index $key out of bounds.");
    }
    
    /**
     * This method merges the elements of the passed map
     * with the elements of the actual map. If the keys
     * are equal, the existing value is taken, else
     * the new one is appended.
     *
     * @param OSDN_Collection_Abstract $map
     * @return OSDN_Collection_Abstract
     */
    public function merge(OSDN_Collection_Abstract $map) 
    {
        $this->_items = array_merge($this->_items, $map->toArray());
        return $this;
    }
    
    /**
     * This method checks if an element with the passed
     * value exists in the ArrayList.
     *
     * @param mixed $value Holds the value to check the elements of the array list for
     * @return boolean Returns true if an element with the passed value exists in the array list
     */
    public function contains($value)
    {
        $isEqual = false;
        foreach ($this->_items as $item) {
            if ($item == $value) {
                $isEqual = true;
                break;
            }
        }
        return $isEqual;
    }
    
    /**
     * @see OSDN_Collection_Interface::clear()
     * 
     * @return OSDN_Collection_Abstract
     */
    public function clear()
    {
        $this->_items = array();
        return $this;
    }
}