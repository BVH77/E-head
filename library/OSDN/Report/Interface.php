<?php

/**
 * Common interface for generating reports
 *
 * @category		OSDN
 * @package		OSDN_Report
 * @version		$Id: Interface.php 7420 2009-03-20 15:44:04Z flash $
 */
interface OSDN_Report_Interface
{
    /**
     * Output the report
     *
     * @return void
     */
    public function render();
    
    /**
     * Send headers and output the report
     *
     * @param string $name  The report name
     * @return void
     */
    public function dump($name = "");
}