<?php

if (!defined('ROOT_DIR')) {
    throw new Exception('The site root directory is not defined.');
}

require_once 'Base/src/base.php';

class __Autoload
{
    /**
     * spl_autoload() suitable implementation for supporting class autoloading.
     *
     * Attach to spl_autoload() using the following:
     * <code>
     * spl_autoload_register(array('Zend_Loader', 'autoload'));
     * </code>
     *
     * @param string $class
     * @return string|false Class name on success; false on failure
     */
    public static function autoload($class)
    {
        if (0 === strpos($class, 'ezc')) {
            return ezcBase::autoload($class);
        }

        try {
            Zend_Loader::loadClass($class);
            return $class;
        } catch (Exception $e) {

            return false;
        }
    }
}