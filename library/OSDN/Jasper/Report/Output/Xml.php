<?
class OSDN_Jasper_Report_Output_Xml extends OSDN_Jasper_Report_Output_Abstract 
{
	protected $_extension = 'xml';
    
    protected $_contentType = 'text/xml';
    
    protected $_charset = 'utf-8';
    
    protected $_outputFormat = OSDN_Jasper_Metadata_Argument::RUN_OUTPUT_FORMAT_XML;
}