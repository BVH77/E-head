<?php

/**
 * Interface of all Set objects.
 *
 * @category		OSDN
 * @package		OSDN_Collection
 * @version		$Id: Interface.php 5396 2008-11-14 14:23:45Z flash $
 */
interface OSDN_Collection_IndexedCollection_Interface extends OSDN_Collection_Interface
{
    /**
     * This method appends all elements of the
     * passed array to the Collection.
     *
     * @param array $set Holds the array with the values to add
     * @return void
     */
    public function addAll(array $set);
    
    /**
     * This method checks if the element with the passed
     * key exists in the Collection.
     * 
     * @param mixed $key Holds the key to check the elements of the Collection for
     * @return boolean Returns true if an element with the passed key exists in the Collection
     * 
     * @throws InvalidArgumentException Is thrown if the passed key is invalid or is NULL
     */
    public function exists($key);
    
    /**
     * This method returns the object, identified by the key
     * passed as a parameter, from the Collection.
     * 
     * @param mixed $key The key of the element to return
     * @return mixed Holds the entry identified by the passed key
     * 
     * @throws InvalidArgumentException Is thrown if the passed key is invalid or is NULL
     * @throws OutOfBoundsException If element with passed key is not in the collection
     */
    public function get($key);
} 