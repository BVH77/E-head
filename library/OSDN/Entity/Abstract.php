<?php

/**
 * The general class for entity objects
 *
 * @category		OSDN
 * @package		OSDN_Entity
 * @version		$Id: Abstract.php 8624 2009-05-08 09:07:14Z yaroslav $
 */
abstract class OSDN_Entity_Abstract
{
    /**
     * Use the singleton implementation only
     *
     * You must declare the static property instance
     * and method getInstance
     * <example>
     *
     * protected static $_instance;
     *
     * public static function getInstance()
     * {
     *      if (is_null(self::$_instance)) {
     *          self::$_instance = new self();
     *      }
     *
     *      return self::$_instance;
     * }
     */
    protected function __construct()
    {}
    
    protected function __clone()
    {}
    
    /**
     * Fetch all entities
     *
     * @return array
     */
    public function fetchAll()
    {
        $reflection = new ReflectionClass($this);
        $constants = $reflection->getConstants();
        return array_change_key_case($constants, CASE_LOWER);
    }
    
    public function fetchValues()
    {
        return array_values($this->fetchAll());
    }
    
    public function isExists($name)
    {
        $values = $this->fetchAll();
        return array_key_exists(strtolower($name), $values);
    }
    
    public function name2id($name)
    {
        $values = $this->fetchAll();
        $name = strtolower($name);
        return isset($values[$name]) ? $values[$name] : false;
    }
    
    public function id2name($id)
    {
        $values = $this->fetchAll();
        $key = array_search($id, $values);
        return false !== $key ? $key : false;
    }
}