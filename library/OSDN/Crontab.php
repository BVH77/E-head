<?php
/**
 * The OSDN_Crontab class is a class for interfacing with crontab
 * This class lets you manipulate the crontab. It lets you add delete update entries easily.
 *
 * @category OSDN
 * @package OSDN_Crontab
 */

class OSDN_Crontab
{
    const CRON_COMMENT = 0;
    const CRON_ASSIGN = 1;
    const CRON_CMD = 2;
    const CRON_SPECIAL = 3;
    const CRON_EMPTY = 4;
    
    /*
     $crontabs: Array that holds all the different lines. Lines are associative arrays with the  following fields:
     "minute" : holds the minutes (0-59)
     "hour"  : holds the hour (0-23)
     "dayofmonth": holds the day of the month (1-31)
     "month" : the month (1-12 or the names)
     "dayofweek" : 0-7 (or the names)

     or a line can be a 2-value array that represents an assignment: "name" => "value"
     or a line can be a comment (string beginning with #)
     or it can be a special command (beginning with an @)
     */
    protected $crontabs;
    protected $user; // the user for whom the crontab will be manipulated
    protected $linetypes; // Lists the type of line of each line in $crontabs. can be: any of the CRON_*  constants. so $linetype[5] is the type of $crontabs[5].

    protected $error = '';
    protected $return = null;
    
    protected $debug = false;
    protected $tmp_path = null;

     
    /** Methods */

    // The constructor. Initialises $this->crontabs
    function __construct($user = 'www-data', $debug = false, $tmp_path = null)
    {
        $this->user = $user;
        $this->debug = $debug;
        $this->tmp_path = $tmp_path;
        $this->readCrontab();
    }

    // This reads the crontab of $this->user and parses it in $this->crontabs
    public function readCrontab()
    {
        //          exec("crontab -u $this->user -l", $crons, $return);
        exec("crontab -l", $crons, $return);
        

        $this->crontabs = array();
        $this->linetypes = array();
        foreach ($crons as $line)
        {
            $line = trim($line); // discarding all prepending spaces and tabs

            // empty lines..
            if (!$line)
            {
                $this->crontabs[] = "empty line";
                $this->linetypes[] = self::CRON_EMPTY;
                continue;
            }

            // checking if this is a comment
            if ($line[0] == "#")
            {
                $this->crontabs[] = trim($line);
                $this->linetypes[] = self::CRON_COMMENT;
                continue;
            }

            // Checking if this is an assignment
            if (ereg("(.*)=(.*)", $line, $assign))
            {
                $this->crontabs[] = array("name" =>trim($assign[1]), "value"  =>trim($assign[2]));
                $this->linetypes[] = self::CRON_ASSIGN;
                continue;
            }

            // Checking if this is a special @-entry. check man 5 crontab for more info
            if ($line[0] == '@')
            {
                $this->crontabs[] = split("[ \t]", $line, 2);
                $this->linetypes[] = self::CRON_SPECIAL;
                continue;
            }

            // It's a regular crontab-entry
            $ct = split("[ \t]", $line, 6);
            $this->addCron($ct[0], $ct[1], $ct[2], $ct[3], $ct[4], $ct[5], $ct[6]);
        }
    }

    // Writes the current crontab
    public function writeCrontab()
    {
        $filename = ($this->debug && isset($this->tmp_path)? tempnam("{$this->tmp_path}/crons", "cron") : tempnam("/tmp", "cron"));
        $file = fopen($filename, "w");

        foreach($this->crontabs as $i => $value)
        {
            switch ($this->linetypes[$i])
            {
                case self::CRON_COMMENT :
                    $line = $this->crontabs[$i];
                    break;
                case self::CRON_ASSIGN:
                    $line = trim($this->crontabs[$i][name]) . "=" .  trim($this->crontabs[$i][value]);
                    break;
                case self::CRON_CMD:
                    $line = implode(" ", $this->crontabs[$i]);
                    break;
                case self::CRON_SPECIAL:
                    $line = implode(" ", $this->crontabs[$i]);
                    break;
                CASE self::CRON_EMPTYLINE:
                    $line = "\n"; // an empty line in the crontab-file
                    break;
                default:
                    unset($line);
                    //echo "Something very weird is going on. This line ($i) has an  unknown type.\n";
                    break;
            }

            //echo "line $i : $line\n";

            if ($line) {
                fwrite($file, $line."\n");
            }
        }
        fclose($file);

        if ($this->debug)
            echo "DEBUGMODE: not updating crontab. writing to $filename instead.\n";
        else
        {
            //exec("crontab -u $this->user $filename", $returnar, $return);
            exec("crontab $filename", $returnar, $return);
            $this->return = $return;
            if ($return != 0) {
                $this->error = "Error running crontab ($return).";
                return false;
            }
            else
            unlink($filename);
        }

        return true;
    }


    // Add a item of type self::CRON_CMD to the end of $this->crontabs
    public function addCron($m, $h, $dom, $mo, $dow, $cmd)
    {
        $this->crontabs[] = array("minute" => $m, "hour" => $h, "dayofmonth" => $dom, "month" =>  $mo, "dayofweek" => $dow, "command" => $cmd);
        $this->linetypes[] = self::CRON_CMD;
    }


    // Add a comment to the cron to the end of $this->crontabs
    public function addComment($comment)
    {
        $this->crontabs[] = "# $comment\n";
        $this->linetypes[] = self::CRON_COMMENT;
    }


    // Add a special command (check man 5 crontab for more information)
    public function addSpecial($sdate, $cmd)
    {
        $this->crontabs[] = array("special" => $sdate, "command" => $cmd);
        $this->linetypes[] = self::CRON_SPECIAL;
    }


    // Add an assignment (name = value)
    public function addAssign($name, $value)
    {
        $this->crontabs[] = array("name" => $name, "value" => $value);
        $this->linetypes[] = self::CRON_ASSIGN;
    }


    // Delete a line from the arrays.
    public function delEntry($index)
    {
        unset($this->crontabs[$index]);
        unset($this->linetypes[$index]);
    }


    // Get all the lines of a certain type in an array
    public function getByType($type)
    {
        if ($type < self::CRON_COMMENT || $type > self::CRON_EMPTY)
        {
            trigger_error("Wrong type: $type", E_USER_WARNING);
            return 0;
        }

        $returnar = array();
        for ($i=0; $i < count($this->linetypes); $i++)
        if ($this->linetypes[$i] == $type)
        $returnar[] = $this->crontabs[$i];

        return $returnar;
    }
    
    public function editCron($m, $h, $dom, $mo, $dow, $cmd)
    {
        $this->readCrontab();
        foreach ($this->crontabs as $k => $v) {
            if ($this->linetypes[$k] === self::CRON_CMD && trim($this->crontabs[$k]['command']) == trim($cmd)) {
                $this->delEntry($k);
            }
        }
        if (!$this->delCrontabAll()) {
            return false;
        }
        $this->addCron($m, $h, $dom, $mo, $dow, $cmd);
        return $this->writeCrontab();
    }
    
    public function deleteCronByCommand($cmd) 
    {
        $this->readCrontab();
        foreach ($this->crontabs as $k => $v) {
            if ($this->linetypes[$k] === self::CRON_CMD && trim($this->crontabs[$k]['command']) == trim($cmd)) {
                $this->delEntry($k);
            }
        }
        if (!$this->delCrontabAll()) {
            return false;
        }
        return $this->writeCrontab();
    }
    
    
    public function deleteCronById($id)
    {
        $this->readCrontab();
        if (isset($this->crontabs[$id]) && isset($this->linetypes[$id])) {
            $this->delEntry($id);
        }
        if (!$this->delCrontabAll()) {
            return false;
        }
        return $this->writeCrontab();
    } 
    
    public function delCrontabAll()
    {
        exec("crontab -r", $returnar, $return);
        $this->return = $return;
        if ($return != 0) {
            $this->error = "Error running crontab ($return).";
            return false;
        }
        return true;
    }

    public function getErrorMsg()
    {
        return $this->error;
    }
    
    public function getResult()
    {
        return $this->return;
    }
    
    public function getCronTabs()
    {
        return $this->crontabs;
    }
    
    public function getLineTypes()
    {
        return $this->linetypes; 
    }
    
    public function setCronTabs($crontabs)
    {
        $this->crontabs = $crontabs;
    }
    
    public function setLineTypes($linetypes)
    {
        $this->linetypes = $linetypes; 
    }
}

