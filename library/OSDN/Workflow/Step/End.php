<?php

class OSDN_Workflow_Step_End extends OSDN_Workflow_Step_Abstract
{
    const NAME = 'end';
    
    public function getName()
    {
        return self::NAME;
    }
    
    public function getDefaultTitle()
    {
        return lang('Cancel');
    }
}