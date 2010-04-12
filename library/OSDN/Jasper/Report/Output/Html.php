<?
class OSDN_Jasper_Report_Output_Html extends OSDN_Jasper_Report_Output_Abstract   
{
	protected $_extension = 'html';
    
    protected $_contentType = 'text/html';
    
    protected $_charset = 'utf-8';
    
    protected $_outputFormat = OSDN_Jasper_Metadata_Argument::RUN_OUTPUT_FORMAT_HTML;
}