<?php

class OSDN_Jasper_Report_Output_Csv extends OSDN_Jasper_Report_Output_Abstract  
{
    protected $_extension = 'csv';
    
    protected $_contentType = 'application/csv';
    
    protected $_outputFormat = OSDN_Jasper_Metadata_Argument::RUN_OUTPUT_FORMAT_CSV; 
}