<?php

class OSDN_Workflow_Step_Start extends OSDN_Workflow_Step_Abstract
{
    const NAME = 'start';
    
    public function getName()
    {
        return self::NAME;
    }
    
    public function getDefaultTitle()
    {
        return lang('Start');
    }
}