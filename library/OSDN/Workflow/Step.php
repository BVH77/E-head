<?php

final class OSDN_Workflow_Step extends OSDN_Workflow_Step_Abstract
{
    public function getTitle($params = null)
    {
        return '';
    }
    
    public function getDefaultTitle()
    {
        return '';
    }
    
    public function getIdByName($name)
    {
        return $this->_getId($name);
    }
}