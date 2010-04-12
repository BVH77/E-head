<?php

/**
 * Paginator storage collection
 *
 * @category		OSDN
 * @package		OSDN_Paginator
 * @version		$Id: Storage.php 6711 2009-02-10 13:30:04Z flash $
 */
class OSDN_Paginator_Storage
{
    /**
     * The start counter
     *
     * @var int
     */
    protected $_start = 0;

    /**
     * The limit counter
     *
     * @var int
     */
    protected $_limit = 20;
    
    /**
     * Sortable field
     *
     * @var string
     */
    protected $_sort = "";
    
    /**
     * Direction
     *
     * @var string
     */
    protected $_direction = 'ASC';
    
    /**
     * Filters collection
     *
     * @var array
     */
    protected $_filter = array();

    /**
     * Count of records
     *
     * @var integer
     */
    protected $_totalCount = 0;
    
    /**
     * The constructor
     * Read the collection and fill
     *
     * @param array $collection
     */
    public function __construct(array $collection = array())
    {
        foreach ($collection as $key => $value) {
            switch ($key) {
                case 'start':
                    $this->setStart($value);
                    break;
                    
                case 'limit':
                    $this->setLimit($value);
                    break;
                    
                case 'sort':
                    $this->setSort($value);
                    break;
                    
                case 'dir':
                    $this->setDirection($value);
                    break;
                    
                case 'filter':
                    if (is_array($value)) {
                        $this->setFilter($value);
                    }
                    break;
                    
                default:
                    // continue to next iteration
                    break;
            }
        }
    }
    
    public function getLimit()
    {
        return (int) $this->_limit;
    }
    
    public function getStart()
    {
        return (int) $this->_start;
    }
    
    public function getSort()
    {
        return (string) $this->_sort;
    }
    
    /**
     * Fetch total count of records
     *
     * @return OSDN_Paginator_Storage
     */
    public function getTotalCount()
    {
        return $this->_totalCount;
    }
    
    public function getPage()
    {
        $page = 1;
        if ($this->_totalCount <= 0) {
            return $page;
        }
        
        
    }
    
    public function getDirection()
    {
        return (string) $this->_direction;
    }
    
    public function setStart($start)
    {
        $start = (int) $start;
        if ($start > 0) {
            $this->_start = (int) $start;
        }
        
        return $this;
    }
    
    public function setLimit($limit)
    {
        $limit = (int) $limit;
        if ($limit >= 1) {
            $this->_limit = $limit;
        }
        
        return $this;
    }
    
    public function setSort($sort)
    {
        $sortField = (string) $sort;
        if (!empty($sort)) {
            $this->_sort = $sort;
        }
        
        return $this;
    }
    
    public function setDirection($direction)
    {
        $direction = strtoupper((string) $direction);
        if (!empty($direction) && in_array($direction, array('ASC', 'DESC'))) {
            $this->_direction = $direction;
        }
        
        return $this;
    }
    
    /**
     * Set total count of records
     *
     * @param int $totalCount
     * @return OSDN_Paginator_Storage
     */
    public function setTotalCount($totalCount)
    {
        $this->_totalCount = (int) $totalCount;
        return $this;
    }
    
    /**
     * Set filter collection
     *
     * @param array $filter
     * @return OSDN_Paginator_Storage
     */
    public function setFilter(array $filter)
    {
        
        return $this;
    }
}