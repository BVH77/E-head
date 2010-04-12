<?php

/**
 * This class is the implementation of a OSDN_Collection_HashMap.
 *
 * @category		OSDN
 * @package		OSDN_Collection
 * @version		$Id: HashMap.php 5450 2008-11-17 15:56:10Z flash $
 */
class OSDN_Collection_HashMap extends OSDN_Collection_Abstract 
{
    /**
     * Standardconstructor that adds the array passed as parameter 
     * to the internal membervariable.
     *
     * @param array $items      An array to initialize the OSDN_Collection_HashMap
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
     * to the OSDN_Collection_HashMap
     *
     * @see OSDN_Collection_Abstract::exists($key)
     * @param mixed $key The key to add the passed value under
     * @param mixed $object The object to add to the OSDN_Collection_HashMap
     * @return OSDN_Collection_HashMap
     */
    public function add($key, $object)
    {
        if ($this->exists($key)) {
            $this->items[$key] = $object;
        }
        return $this;
    }
    
    /**
     * This method Returns a new OSDN_Collection_HashMap initialized with the passed array.
     *
     * @param array @args Holds the array to initialize the new HashMap
     * @return OSDN_Collection_HashMap      Returns initialized with the passed array
     */
    public function fromArray(array $args = array())
    {
        return new self($args);
    }
}