<?php

/**
 * Define system entity types
 *
 */
class OSDN_EntityTypes extends OSDN_Entity_Abstract
{
    /**
     * It is a common entity type for system
     * modules. We can use it when work with
     * abstract libraries and must use the response
     * object and particural in status module
     * OSDN_Response_Status_Storage_Abstract
     */
    const SYSTEM        = -1;

    /**
     * Entity types for modules
     */
    const STUDENT           = 1;
    const COURSE            = 2;
    const DOCUMENT          = 3;
    const FILEMANAGER       = 4;
    const COMMENT           = 5;
    const ACCOUNT           = 6;
    const LANGUAGE          = 7;
    const STUDYFORMSTUDENT  = 8;
    const TEACHER           = 9;

    const BPV               = 10;
    const BPV_STUDENT       = 11;

    
    const HR_SINGLE_STUDENT = 12;
    const HR_SINGLE_TEACHER = 13;
    
    const HR_MULTIPLE_STUDENT = 14;
    const HR_MULTIPLE_TEACHER = 15;
    
    const CMP               = 16;  // course module planning
    const CMPS              = 17;  // course module planning schedule
    
    protected static $_instance;

    public static function getInstance()
    {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }
}