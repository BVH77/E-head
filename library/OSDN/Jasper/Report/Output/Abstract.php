<?php

/**
 * Abstract class for output report content
 * 
 * @category OSDN
 * @package OSDN_Jasper_Report
 */
abstract class OSDN_Jasper_Report_Output_Abstract 
{
    /**
     * File extension
     *
     * @var string
     */
    protected $_extension = '';
    
    /**
     * File content type
     *
     * @var string
     */
    protected $_contentType = '';

    /**
     * Default output format
     *
     * @var string
     */
    protected $_outputFormat = OSDN_Jasper_Metadata_Argument::RUN_OUTPUT_FORMAT_JRPRINT;

    /**
     * Default charset
     *
     * @var string
     */
    protected $_charset;
    
    /**
     * Report content
     *
     * @var string
     */
    protected $_content = '';
    
    /**
     * Set report content
     *
     * @param string $content
     * @return OSDN_Jasper_Report_Output_Abstract
     */
    public function setContent($content)
    {
        $this->_content = $content;
        return $this;
    }
    
    /**
     * Dump report
     *
     * @param string $filename
     * @param string $content
     */
	public function dump($filename, $content = null)
	{
	    if (!is_null($content)) {
	        $this->_content = $content;
	    }
	    
	    $this->_sendHeaders($filename, strlen($this->fetch()));
	    echo $this->fetch();
	}
	
	/**
	 * Fetch report content
	 *
	 * @return string
	 */
	public function fetch()
	{
	    return $this->_content;
	}
	
	/**
	 * Send default headers
	 *
	 * @param string $filename
	 * @param string $filesize
	 */
	protected function _sendHeaders($filename, $filesize)
	{
	    if (empty($this->_extension)) {
            throw new OSDN_Exception('The extension is undefined.');
        }
        
        if (empty($this->_contentType)) {
            throw new OSDN_Exception('The content type is undefined.');
        }
        
	    header('Content-disposition: attachment; filename="' . $this->_getName($filename) . '"');
	    $charset = "";
	    if (!is_null($this->_charset)) {
	        $charset .= ';charset=' . $this->_charset; 
	    }
	    
        header('Content-type: ' . $this->_contentType . $charset);
        header('Content-Transfer-Encoding: binary');
        header('Content-Length: '. $filesize);
        header('Pragma: no-cache');
        header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
        header('Expires: 0');
        set_time_limit(0);
	}
	
	/**
	 * Get report name
	 *
	 * @param string $name     The report name
	 * @return string
	 */
	protected function _getName($name)
	{
	    $name = trim($name);
	    if (empty($name)) {
	        $name = 'Untitled report';
	    }
	    
	    if (preg_match("/\.{$this->_extension}$/", $name)) {
	        return $name;
	    }
	    
	    return $name . '.' . $this->_extension;
	}
	
	/**
	 * Fetch output format
	 *
	 * @return string
	 */
	public function getOutputFormat()
	{
	    return $this->_outputFormat;
	}
}