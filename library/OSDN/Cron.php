<?php

/**
 * Class for using the schedule mechanizm
 *
 * @category		OSDN
 * @package		OSDN_Cron
 * @version		$Id: Cron.php 8437 2009-04-28 12:33:16Z vasya $
 */
class OSDN_Cron
{
    /**
     * Create the cron instance
     *
     * @param string $adapter
     * @return OSDN_Cron_Interface
     */
    public static function factory($adapter = 'Unix')
    {
        $adapter = ucfirst(strtolower($adapter));
        $adapterNamespace = 'OSDN_Cron_';
        $adapterCls = $adapterNamespace . $adapter;
        $adapterInstance = new $adapterCls();
        return $adapterInstance;
    }
}