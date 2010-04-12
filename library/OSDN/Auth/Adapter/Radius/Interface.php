<?php

interface OSDN_Auth_Adapter_Radius_Interface extends Zend_Auth_Adapter_Interface 
{

	public function setUsername($name);
	
	public function setPassword($password);
	
}
