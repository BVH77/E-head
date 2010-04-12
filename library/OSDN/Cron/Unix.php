<?php

/**
 * OSDN_Cron_Unix
 *
 * @category OSDN
 * @package OSDN_Cron
 */
class OSDN_Cron_Unix extends OSDN_Cron_Abstract
{
    /**
     * Retrieve the cron jobs for current user
     *
     * @return OSDN_Cron_Unix
     */
    public function read()
    {
        @exec('crontab -l', $tasks, $return);
//        if ($return != 0) {
//            throw new OSDN_Cron_Exception('Error running crontab (' . $return . ')');
//        }
        
        $this->_collection->clear();
        
        foreach ($tasks as $line)
        {
            // discarding all prepending spaces and tabs
            $line = trim($line);
            if (empty($line))
            {
                $this->_add(new OSDN_Cron_Unix_Empty());
                continue;
            }

            // checking if this is a comment
            if ("#" == $line[0])
            {
                $this->_add(new OSDN_Cron_Type_Comment($line));
                continue;
            }

            // Checking if this is an assignment
            if (ereg("(.*)=(.*)", $line, $assign))
            {
                $this->_add(new OSDN_Cron_Unix_Assign($line));
                continue;
            }

            // Checking if this is a special @-entry. check man 5 crontab for more info
            if ('@' == $line[0])
            {
                $this->_add(new OSDN_Cron_Unix_Special($line));
                continue;
            }
            
            // It's a regular crontab-entry
            $this->_add(new OSDN_Cron_Unix_Cmd($line));
        
        }
        return $this;
    }
    
    /**
     * Retrieve current job collection
     *
     * @return OSDN_Collection_ArrayList
     */
    public function getDataCollection()
    {
        return $this->_collection;
    }
    
    /**
     * Write crontab changes
     *
     * @return OSDN_Cron_Unix
     */
    public function write()
    {
        return $this->_write();
    }
    
    /**
     * Append crontab changes
     *
     * @return OSDN_Cron_Unix
     */
    public function append()
    {
        return $this->_write(true);
    }
    
    /**
     * append line to crontab
     *
     * @param OSDN_Cron_Unix_Interface $task
     * 
     * @return OSDN_Cron_Unix
     */
    public function add(OSDN_Cron_Unix_Interface $task)
    {
        return $this->read()->_add($task)->write(false);
    }
    
    /**
     * Append lines to crontab
     *
     * @param array $tasks
     * 
     * @return OSDN_Cron_Unix
     */
    public function addMultiple(array $tasks)
    {
        $this->read();
        foreach ($tasks as $task) {
            $this->_add($task);
        }
        return $this->write();
    }
    
    /**
     * delete crontab line by command
     *
     * @param OSDN_Cron_Unix_Cmd $task
     * 
     * @return OSDN_Cron_Unix
     */
    public function deleteByCommand(OSDN_Cron_Unix_Cmd $task)
    {
        return $this->read()->_deleteByCommand($task)->write();
    }
    
    /**
     * delete crontab line 
     *
     * @param OSDN_Cron_Unix_Interface $task
     * 
     * @return OSDN_Cron_Unix
     */
    public function delete(OSDN_Cron_Unix_Interface $task)
    {
        return $this->read()->_delete($task)->write();
    }
    
    /**
     * delete crontab line by id 
     *
     * @param int $id
     * 
     * @return OSDN_Cron_Unix
     */
    public function deleteById($id)
    {
        $this->_collection->remove($id);
        return $this;
    }
    
    /**
     * delete all crontab for current user 
     * 
     * @return OSDN_Cron_Unix
     */
    public function clear()
    {
        $res = $this->_clear();
        $this->_collection->clear();
        return $this;
    }
    
    /**
     * find job by command 
     *
     * @param string $command
     * 
     * @return OSDN_Cron_Unix_Cmd || false
     */
    public function findTaskByCommand($command)
    {
        $collection = $this->read()->getDataCollection();
        foreach ($collection as $line) {
            if ($line->getType() == 'cmd' && $line->getCommand() == trim($command)) {
                return $line;
            }
        }
        return false;
    }
    
    /**
     * return param   
     *
     * @param string $param
     * 
     * @return string
     */
    public function getParam($param)
    {
        return $this->read()->_getParam($param);
    }
    
    /**
     * return param   
     *
     * @param string $param
     * 
     * @return string || false
     */
    public function _getParam($param)
    {
        $collection = $this->getDataCollection();
        foreach ($collection as $line) {
            if ($line->getType() == 'assign' && $line->getName() == $param) {
                return $line->getValue();
            }
        }
        return false;
    }
    
    /**
     * delete crontab line without real saving
     *
     * @param OSDN_Cron_Unix_Interface $task
     * 
     * @return OSDN_Cron_Unix
     */
    protected function _delete(OSDN_Cron_Unix_Interface $task)
    {
        foreach ($this->_collection as $k => $t) {
            if ($task->toString() == $t->toString()) {
                $this->_collection->remove($k);
            }
        }
        return $this;
    }
    
    /**
     * delete crontab line by command without real saving 
     *
     * @param OSDN_Cron_Unix_Cmd $task
     * 
     * @return OSDN_Cron_Unix
     */
    protected function _deleteByCommand(OSDN_Cron_Unix_Cmd $task)
    {
        foreach ($this->_collection as $k => $t) {
            if ($t->getType() === 'cmd' && $t->getCommand() == $task->getCommand()) {
                $this->_collection->remove($k);
            }
        }
        return $this;
    }
    
    /**
     * delete all crontab for current user without real saving 
     * 
     * @return OSDN_Cron_Unix
     */
    protected function _clear() 
    {
        exec("crontab -r", $returnar, $return);
        
//        if ($return != 0) {
//            throw new OSDN_Cron_Exception('Error running crontab (' . $return . ')');
//        }
        return true;
    }
    
    /**
     * append line to crontab without real saving
     *
     * @param OSDN_Cron_Unix_Interface $task
     * 
     * @return OSDN_Cron_Unix
     */
    protected function _add(OSDN_Cron_Unix_Interface $task) 
    {
        switch ($task->getType()) {
            case 'cmd':
                $this->_deleteByCommand($task);
                $this->_collection->add($task);
            break;
            case 'assign':
                $v = $this->_getParam($task->getName());
                if (false !== $v) {
                    $this->_delete(new OSDN_Cron_Unix_Assign($task->getName(), $v));
                }
                if ($task->getValue()) {
                    $tmpCollection = new OSDN_Collection_ArrayList();
                    $tmpCollection->add($task);
                    foreach ($this->_collection as $line) {
                        $tmpCollection->add($line);
                    }
                    $this->_collection = $tmpCollection;
                }
            break;
        }
        return $this;
    }
    
    /**
     * Write crontab changes
     *
     * @return OSDN_Cron_Unix
     */
    protected function _write($append = false)
    {
        if (!$append) {
            $this->_clear();
        }
        
        $filename = ($this->_debug && isset($this->_tmpPath)? tempnam("{$this->_tmpPath}/crons", "cron") : tempnam("/tmp", "cron"));
        $file = fopen($filename, "w");
        foreach($this->_collection as $task)
        {
            fwrite($file, $task . "\n");
        }
        fclose($file);

        if ($this->_debug) {
            echo "DEBUGMODE: not updating crontab. writing to $filename instead.\n";
        } else {
            //exec("crontab -u $this->user $filename", $returnar, $return);
            exec("crontab $filename", $returnar, $return);
            
            if ($return != 0) {
                throw new OSDN_Cron_Exception('Error running crontab (' . $return . ')');
            }
            else {
                unlink($filename);
            }
        }
        return $this;
    }
    
    
}