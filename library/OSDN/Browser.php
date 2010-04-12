<?php

/**
 * Identifies the user's Operating system and browser
 * by parsing the HTTP_USER_AGENT string sent to the server
 *
 * @category		OSDN
 * @package		OSDN_Browser
 * @version		$Id: Browser.php 9633 2009-06-17 09:58:59Z yaroslav $
 */
class OSDN_Browser
{
    /**
     * Is opera engine
     *
     * @return boolean
     */
    public static function isOpera()
    {
        return false !== stripos($_SERVER['HTTP_USER_AGENT'], 'opera');
    }
    
    /**
     * Is Safari engine
     *
     * @return boolean
     */
    public static function isSafari()
    {
        return (boolean) preg_match('/webkit|khtml/i', $_SERVER['HTTP_USER_AGENT']);
    }
    
    /**
     * Is Safari 3 engine
     *
     * @return boolean
     */
    public static function isSafari3()
    {
        return self::isSafari() && false !== stripos($_SERVER['HTTP_USER_AGENT'], 'webkit/5');
    }
    
    /**
     * Is IE engine
     *
     * @return boolean
     */
    public static function isIE()
    {
        return !self::isOpera() && false !== stripos($_SERVER['HTTP_USER_AGENT'], 'msie');
    }
    
    /**
     * Is IE 6
     *
     * @return boolean
     */
    public static function isIE6()
    {
    	return self::isIE() && !self::isIE7() && !self::isIE8();	
    }
    
    /**
     * Is IE 7
     *
     * @return boolean
     */
    public static function isIE7()
    {
        return !self::isOpera() && false !== stripos($_SERVER['HTTP_USER_AGENT'], 'msie 7');
    }
    
    /**
     * Is IE 8
     *
     * @return boolean
     */
	public static function isIE8()
    {
        return !self::isOpera() && false !== stripos($_SERVER['HTTP_USER_AGENT'], 'msie 8');
    }
    
    /**
     * Is Gecko engine
     *
     * @return boolean
     */
    public static function isGecko()
    {
        return !self::isSafari() && false !== stripos($_SERVER['HTTP_USER_AGENT'],'gecko');
    }
    
    /**
     * Is Gecko 3 engine
     *
     * @return boolean
     */
    public static function isGecko3()
    {
        return !self::isSafari() && false !== stripos($_SERVER['HTTP_USER_AGENT'], 'rv:1.9');
    }
    
    /**
     * Is the abobe AIR agent
     *
     * @return boolean
     */
    public static function isAir()
    {
        return false !== stripos($_SERVER['HTTP_USER_AGENT'], 'adobeair');
    }
    
    /**
     * Is secure connection used
     *
     * @return boolean
     */
    public static function isSecure()
    {
        return isset($_SERVER['HTTPS']);
    }
    
    /**
     * Is konqueror engine
     *
     * @return boolean
     */
    public static function isKonqueror()
    {
        return false !== stripos($_SERVER['HTTP_USER_AGENT'], 'konqueror');
    }
    
    /**
     * Is linux platform
     *
     * @return boolean
     */
    public static function isLinux()
    {
        return false !== stripos($_SERVER['HTTP_USER_AGENT'], 'linux');
    }
    
    /**
     * Is windows platform
     *
     * @return boolean
     */
    public static function isWindows()
    {
        return false !== stripos($_SERVER['HTTP_USER_AGENT'], 'windows') ||
            false !== stripos($_SERVER['HTTP_USER_AGENT'], 'win32');
    }
    
    /**
     * Is mac platform
     *
     * @return boolean
     */
    public static function isMac()
    {
        return false !== stripos($_SERVER['HTTP_USER_AGENT'], 'macintosh') || false !== stripos($_SERVER['HTTP_USER_AGENT'], 'mac os x');
    }
    
}