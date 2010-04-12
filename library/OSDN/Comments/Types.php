<?php

/**
 * The class for operating with comment types
 *
 * @category OSDN
 * @package OSDN_Comments
 */
class OSDN_Comments_Types 
{
    /**
     * Disable email and action
     */
    const PRIVATE_STATUS = 1;
    
    /**
     * Disable email and action
     */
    const PUBLIC_STATUS = 2;
    
    /**
     * Enable email and action
     */
    const EMAIL_STATUS = 3;
    
    /**
     * Check if present type in db
     *
     * @param int $id
     * @return OSDN_Response
     */
    public function hasType($id)
    { 
        return in_array(self::PRIVATE_STATUS, self::PUBLIC_STATUS, self::EMAIL_STATUS);
    }
    
    /**
     * Retrieve all types
     *
     * @return OSDN_Resposne
     *  data
     *      rows array
     */
    public function getTypes()
    {
        $response = new OSDN_Response();
        $response->addData('rows', array(
            self::PRIVATE_STATUS    => lang('Private note'),
            self::PUBLIC_STATUS     => lang('Public note'),
            self::EMAIL_STATUS      => lang('Email note')
        ));
        $response->addStatus(new OSDN_Comments_Status(OSDN_Comments_Status::OK));
        return $response;
    }
}