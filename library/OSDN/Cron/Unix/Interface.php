<?php

interface OSDN_Cron_Unix_Interface
{
    public function getType();
    
    function toString();
    
    function __toString();
}