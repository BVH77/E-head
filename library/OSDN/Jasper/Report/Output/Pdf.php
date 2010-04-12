<?php
class OSDN_Jasper_Report_Output_Pdf extends OSDN_Jasper_Report_Output_Abstract  
{
    protected $_extension = 'pdf';
    
    protected $_contentType = 'application/pdf';
    
    protected $_outputFormat = OSDN_Jasper_Metadata_Argument::RUN_OUTPUT_FORMAT_PDF;
}