<?php

/**
 * Default interface for all collection objects
 *
 * @category		OSDN
 * @package		OSDN_Collection
 * @version		$Id: Interface.php 5375 2008-11-14 13:06:38Z flash $
 */
interface OSDN_Collection_Interface extends Countable 
{
    /**
     * Removes all of the elements from this collection (optional operation).
     * The collection will be empty after this method returns.
     */
    public function clear();

    /**
     * Returns true if this collection contains no elements.
     *
     */
    public function isEmpty();
    
    /**
     * Returns an array containing all of the elements in this collection.
     * If this collection makes any guarantees as to what order its elements
     * are returned by its iterator, this method must return the elements in
     * the same order.
     *
     *
     * The returned array will be "safe" in that no references to it are maintained by this collection. (In other words, this method must allocate a new array even if this collection is backed by an array). The caller is thus free to modify the returned array.
     *
     * This method acts as bridge between array-based and collection-based APIs.
     *
     */
    public function toArray();
}