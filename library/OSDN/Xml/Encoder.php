<?php

/**
 * Encode data to xml
 * 
 * @category OSDN
 * @package OSDN_Xml
 */
class OSDN_Xml_Encoder
{
    /**
     * Root node name
     *
     * @var string
     */
    protected $_root = 'rootnode';

    /**
     * Dom document object
     *
     * @var DOMDocument
     */
    private $_dom;
    
    /**
     * OSDN_Xml_Encoder constructor
     *
     * @todo finish with non associative array
     * 
     * @param array $config
     */
    public function __construct(array $config = array())
    {
        switch ($config) {    
            case 'root':
                $this->_root = $config['root'];
                break;
        
            default:
        }
    }
    
    /**
     * Run encode process
     *
     * @return string
     */
    public function process($data)
    {
        $this->_dom = new DOMDocument('1.0', 'UTF-8');
        $root = $this->_dom->createElement($this->_root);
        $doc = $this->_encodeProcess($root, $data);
        $this->_dom->appendChild($doc);
        return $this->_dom->saveXML();        
    }
    
    /**
     * @todo non assotiative array is not supportet yet
     */
    protected function _encodeProcess($node, $data)
    {
        if (!is_array($data)) {
            return false;
        }
        
        foreach ($data as $key => $value) {
            if (is_array($value)) {
                if (is_int($key)) {
                    if (false !== ($newNode = $this->_encodeProcess($node, $value))) {
                        $node->appendChild($newNode);
                    }
                    continue;
                }
                
                $e = $this->_dom->createElement($key);
                $node->appendChild($e);
                if (false !== ($newNode = $this->_encodeProcess($e, $value))) {
                    $node->appendChild($newNode);
                }
            } else {
                $e = $this->_dom->createElement($key, $value);
                $node->appendChild($e);
            }
        }
        return $node;
    }
    
}
