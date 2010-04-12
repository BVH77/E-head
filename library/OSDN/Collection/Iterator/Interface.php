<?php

/**
 * An iterator over a collection.
 *
 * @category		OSDN
 * @package		OSDN_Collection
 * @version		$Id: Interface.php 5378 2008-11-14 13:46:12Z flash $
 */
interface OSDN_Collection_Iterator_Interface
{
    /**
     * Returns {@code true} if the iteration has more elements.
     * (In other words, returns {@code true} if #next  would
     * return an element rather than throwing an exception.)
     * 
     * @return boolean
     */
    public function hasNext();
    
    /**
     * Returns the next element in the iteration.
     *
     * @return mixed
     */
    public function next();
    
    /**
     * Removes from the underlying collection the last element returned
     * by this iterator (optional operation). This method can be called
     * only once per call to #next . The behavior of an iterator
     * is unspecified if the underlying collection is modified while the
     * iteration is in progress in any way other than by calling this
     * method.
     *
     * @return void
     */
    public function remove();
}