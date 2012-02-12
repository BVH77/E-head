<?php

class PMS_Storage_Requests_Status extends OSDN_Response_Status_Storage_Abstract
{
    const NOT_IN_STOCK  = -101;
    const OUT_OF_STOCK  = -102;

    /**
     * Module code
     * @var int
     */
    protected $_moduleCode = 10;

    /**
     * Module name
     * @var int
     */
    protected $_moduleName = 'PMS_Storage_Requests';

    /**
     * Description storage
     * @var array
     */
    protected $_storage = array(
        self::NOT_IN_STOCK  => 'Asset is not in stock',
        self::OUT_OF_STOCK  => 'Asset is out of stock'
    );
}
