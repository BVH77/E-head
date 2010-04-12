<?php

/**
 * Convert array to xml
 * 
 * @category OSDN
 * @package OSDN_Xml
 */
class OSDN_Xml
{
    
    /**
     * Encode array to xml
     *
     * @param array $data
     */
    public static function encode($data)
    {
        $encoder = new OSDN_Xml_Encoder();
        return $encoder->process($data);
    }
    
    /**
     * Decode xml to array
     *
     * @param string $xml
     */
    public static function decode($xml)
    {
    }
}
