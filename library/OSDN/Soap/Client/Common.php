<?php

class OSDN_Soap_Client_Common extends Zend_Soap_Client_Common 
{
    /**
     * Attachments collection
     *
     * @var array
     */
    protected $_attachments = array();
    
    /**
     * Fetch attachments
     *
     * @return array
     */
    public function getAttachments()
    {
        return $this->_attachments;
    }
    
    /**
     * Performs SOAP request over HTTP.
     * Overridden to implement different transport layers, perform additional XML processing or other purpose.
     * Added support attachments
     * requred trace option
     * 
     * @TODO Wait next Zend release function Zend_Mime_Decode::splitMime for support "\r" in attachments
     * 
     * @param string $request
     * @param string $location
     * @param string $action
     * @param int    $version
     * @param int    $one_way
     * @return mixed
     */
    function __doRequest($request, $location, $action, $version, $one_way = null)
    {
        if ($one_way === null) {
            $body = call_user_func($this->_doRequestCallback, $this, $request, $location, $action, $version);
        } else {
            $body = call_user_func($this->_doRequestCallback, $this, $request, $location, $action, $version, $one_way);
        }
        
        if (!preg_match('/boundary\s*=\s*"(.*)"/mi', $this->__getLastResponseHeaders(), $matches)) {
            return $body;
        }
        
        $boundary = $matches[1];

        // @todo change me
        $start = 0;
        $res = array();

        if (false === ($p = strpos($body, '--' . $boundary . "\n", $start) || ($p = strpos($body, '--' . $boundary . "\r\n", $start)))) {
            return "";
        }
        
        // position after first boundary line
        $start = $p + 3 + strlen($boundary);
        while (false !== (($p = strpos($body, '--' . $boundary . "\n", $start)) || ($p = strpos($body, '--' . $boundary . "\r\n", $start)))) {
            $res[] = substr($body, $start, $p - $start);
            $start = $p + 3 + strlen($boundary);
        }

        // no more parts, find end boundary
        if (false === ($p = strpos($body, '--' . $boundary . '--', $start))) {
            throw new OSDN_Soap_Exception('Not a valid Mime Message: End Missing');
        }

        // the remaining part also needs to be parsed:
        $res[] = substr($body, $start, $p - $start);
        if (empty($res)) {
            return "";
        }

        $parts = array();
        foreach ($res as $part) {
            $headers = array();
            $body = "";
           
            Zend_Mime_Decode::splitMessage(ltrim($part, "\r\n"), $headers, $body, "\r\n");
            $parts[] = array('header' => $headers, 'body' => $body);
        }
        
        $count = count($parts);
        for($i = 1; $i < $count; $i++) {
            $this->_attachments[] = $parts[$i]['body'];
        }
        
        return isset($parts[0]['body']) ? $parts[0]['body'] : "";
    }
}