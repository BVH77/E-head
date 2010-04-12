<?php

abstract class OSDN_Jasper_Report_Abstract 
{
    
    protected $RUN_OUTPUT_FORMAT;
	
	protected $JasperClient;  
	
	public function  __construct( $data = array () ) {
		$this->JasperClient = new OSDN_Jasper_Client ( $data );
	}
	
	public function getReport( $currentUri, $report_params, $output_params ) {
		
		 $output_params[RUN_OUTPUT_FORMAT] = $this->RUN_OUTPUT_FORMAT;
		 
		 $res = $this->JasperClient->runReport( $currentUri, $report_params, $output_params, $attachments);
		 
		 return $attachments["cid:report"];
		 
	}
	
	public function generateReport( $currentUri, $report_params, $output_params, 
										$fileName = 'report', $header = true, $headerFunction = 'generateHeaders') {
		if ($headerFunction != 'getReport' && $headerFunction != "__construct" 
				&& method_exists($this, $headerFunction)) {
					
			$reportContent = $this->getReport( $currentUri, $report_params, $output_params );	

			if($header){
				$this->{$headerFunction}( $fileName, strlen($reportContent));
				echo( $reportContent );
				return true;
			}else{
				return $reportContent;
			}
			
		} else {

			return false;

		} 
	}
	
	abstract public function generateHeaders( $fileName, $fileSize );
	
}