<?php

class OSDN_Jasper_Report_Output
{
    /**
     * Create report output format
     *
     * @param string $format
     * @return OSDN_Jasper_Report_Output_Abstract
     */
    public static function factory($format)
    {
        $output = 'OSDN_Jasper_Report_Output_Pdf';
        $cls = 'OSDN_Jasper_Report_Output_' . ucfirst(strtolower($format));
        if (
            !defined('OSDN_Jasper_Metadata_Argument::RUN_OUTPUT_FORMAT_' . strtoupper($format)) ||
            !class_exists($cls)
        ) {
            return new $output;
        }
        
        return new $cls;
    }
}