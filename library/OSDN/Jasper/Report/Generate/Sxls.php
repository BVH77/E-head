<?php

/**
 * Simple xls generator
 *
 * @category		OSDN
 * @package		OSDN_Jasper_Report_Generate
 * @version		$Id: Sxls.php 6265 2009-01-19 13:09:47Z flash $
 */
class OSDN_Jasper_Report_Generate_Sxls extends OSDN_Jasper_Report_Generate_Abstract
{
    /**
     * Generate report
     *
     * @return string
     */
    public function generate()
    {
        $content = "";
        
        try {
            $query = $this->_db->query($this->getQuery());
            $rowset = $query->fetchAll();
        } catch (Exception $e) {
            if (OSDN_DEBUG) {
                throw $e;
            }
            return $content;
        }
        
        $view = $this->getView();
        $view->assign('rowset', $rowset);
        
        /**
         * Try render template
         */
        try {
            return $view->render($this->_template);
        } catch (Exception $e) {
            
            $output = array();
            $output[] = sprintf('<tr><th>%s</th></tr>', join('</th><th>', array_keys(current($rowset))));
    
            foreach ($rowset as $row) {
                $output[] = sprintf('<tr><td>%s</td></tr>', join('</td><td>', $row));
            }
            
            return sprintf('<table border="1">%s</table>', join('', $output));
        }
    }
}