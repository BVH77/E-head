<?php

/**
 * This class is the implementation of a OSDN_Collection_ArrayList.
 *
 * @category		OSDN
 * @package		OSDN_Collection
 * @version		$Id: ArrayList.php 5450 2008-11-17 15:56:10Z flash $
 */
class OSDN_Collection_ArrayList extends OSDN_Collection_Abstract
{
    /**
     * Standard constructor that adds the array passed
     * as parameter to the internal membervariable.
     * 
     * @param array $items An array to initialize the ArrayList
     */
    public function __construct(array $items = array())
    {
        if (empty($items)) {
            return;
        }
        
        $this->addAll($items);
    }

    /**
     * This method adds the passed object with the passed key
     * to the OSDN_Collection_ArrayList.
     *
     * @param mixed $o  The object that should be added to the ArrayList
     * @return OSDN_Collection_ArrayList
     */
    public function add($o) 
    {
        if (is_null($o)) {
            throw new InvalidArgumentException('Passed object is null.');
        }
        
        $this->_items[] = $o;
        return $this;
    }
    
    /**
     * OSDN_Collection_IndexedCollection_Interface::addAll(array $set)
     *
     * @return OSDN_Collection_ArrayList
     */
    public function addAll(array $set)
    {
        foreach ($set as $o) {
            $this->add($o);
        }
        return $this;
    }
    
    /**
     * This method Returns a new ArrayList initialized with the passed array.
     *
     * @param array $args   Holds the array to initialize the new OSDN_Collection_ArrayList
     * @return OSDN_Collection_ArrayList
     */
    public function fromArray(array $args = array())
    {
        return new self($args);
    }
    
    /**
     * This method returns a new ArrayList with the items from 
     * the passed offset with the passed length.
     * 
     * If no length is passed, the section up from the offset until the end of the items is
     * returned.
     *
     * @param integer $offset       The start of the section
     * @param integer $length       The length of the section to return
     * @return OSDN_Collection_ArrayList    Holds the OSDN_Collection_ArrayList 
     *                                      with the requested elements
     */
    public function slice($offset, $length = null) 
    {
        $items = array();
        if (is_null($length)) {
            $items = array_slice($this->_items, $offset);
        } else {
            $items = array_slice($this->_items, $offset, (int) $length);
        }
        
        return new self($items);
    }
}