<?php

/**
 * OSDN_View_Engine_Xml
 * Allows contain view data and return xml object
 *
 * @category OSDN
 * @package OSDN_View
 * @subpackage OSDN_View_Engine
 */
class OSDN_View_Engine_Xml extends OSDN_View_Engine_Abstract
{
    /**
     * @todo implement functionality encoding to xml
     *
     * @param string $name      required by OSDN_View_Engine_Interface
     */
    public function render($name)
    {
        return OSDN_Xml::encode($this->getCollection());
    }
    
    public function getEngine()
    {
        return 'xml';
    }
}