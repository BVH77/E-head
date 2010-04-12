<?php

/**
 * A comparison function, which imposes a <i>total ordering</i> on some
 * collection of objects.
 *
 * @category		OSDN
 * @package		OSDN_Collection
 * @version		$Id: Interface.php 5377 2008-11-14 13:45:23Z flash $
 */
interface OSDN_Collection_Comparator
{
    /**
     * Compares its two arguments for order. Returns a negative integer,
     * zero, or a positive integer as the first argument is less than, equal
     * to, or greater than the second.<p>
     *
     * The implementor must ensure that <tt>sgn(compare(x, y)) ==
     * -sgn(compare(y, x))</tt> for all <tt>x</tt> and <tt>y</tt>. (This
     * implies that <tt>compare(x, y)</tt> must throw an exception if and only
     * if <tt>compare(y, x)</tt> throws an exception.)<p>
     *
     * The implementor must also ensure that the relation is transitive:
     * <tt>((compare(x, y)&gt;0) &amp;&amp; (compare(y, z)&gt;0))</tt> implies
     * <tt>compare(x, z)&gt;0</tt>.<p>
     *
     * Finally, the implementer must ensure that <tt>compare(x, y)==0</tt>
     * implies that <tt>sgn(compare(x, z))==sgn(compare(y, z))</tt> for all
     * <tt>z</tt>.<p>
     * 
     * It is generally the case, but <i>not</i> strictly required that
     * <tt>(compare(x, y)==0) == (x.equals(y))</tt>. Generally speaking,
     * any comparator that violates this condition should clearly indicate
     * this fact. The recommended language is "Note: this comparator
     * imposes orderings that are inconsistent with equals."
     * 
     * @param $o1 the first object to be compared.
     * @param $o2 the second object to be compared.
     * @return a negative integer, zero, or a positive integer as the
     * first argument is less than, equal to, or greater than the
     * second.
     * 
     * @throws ClassCastException if the arguments' types prevent them from
     * being compared by this Comparator.
     */
    public function compare($arg1, $arg2);
    
    /**
     * Indicates whether some other object is "equal to" this
     * comparator.  This method must obey the general contract of
     * {@link OSDN_OBject#equals(OSDN_Object)}.  Additionally, this method can return
     * <tt>true</tt> <i>only</i> if the specified object is also a comparator
     * and it imposes the same ordering as this comparator.  Thus,
     * <code>comp1.equals(comp2)</code> implies that <tt>sgn(comp1.compare(o1,
     * o2))==sgn(comp2.compare(o1, o2))</tt> for every object reference
     * <tt>o1</tt> and <tt>o2</tt>.<p>
     * 
     *
     * @param OSDN_Object $obj
     * @return boolean
     */
    public function equals(OSDN_Object $obj);
}