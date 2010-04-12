<?php

/**
 * Utility methods for WorkflowDatabaseTiein.
 *
 * @package WorkflowDatabaseTiein
 * @version $Id: Utils.php 8688 2009-05-13 11:17:49Z yaroslav $
 * @access private
 */
abstract class OSDN_Workflow_Database_Utils
{
    /**
     * Wrapper for serialize() that returns an empty string
     * for empty arrays and null values.
     *
     * @param  mixed $var
     * @return string
     */
    public static function serialize( $var )
    {
        $var = serialize( $var );

        if ( $var == 'a:0:{}' || $var == 'N;' ) {
            return '';
        }

        return $var;
    }

    /**
     * Wrapper for unserialize().
     *
     * @param  string $serializedVar
     * @param  mixed  $defaultValue
     * @return mixed
     */
    public static function unserialize($serializedVar, $defaultValue = array())
    {
        if (!empty($serializedVar)) {
            return unserialize($serializedVar);
        } else {
            return $defaultValue;
        }
    }
}