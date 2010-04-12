<?php

class PMS_Files
{
	protected $_tableFunctions = null;
	
    public function __construct()
    {
        $this->_table = new PMS_Files_Table_Files();
    }

    public function getPhotos($orderId)
    {
    	$response = new OSDN_Response();
        $validate = new OSDN_Validate_Id();
        if (!$validate->isValid($orderId)) {
            $response->addStatus(new PMS_Status(
                PMS_Status::INPUT_PARAMS_INCORRECT, 'orderId'));
            return $response;
        }
        try {
            $response->setRowset($this->_table->fetchAll(array(
                'order_id = ?' => $orderId,
                'is_photo = ?' => 1
            ))->toArray());
            $status = PMS_Status::OK;
        } catch (Exception $e) {
            $status = PMS_Status::DATABASE_ERROR;
            if (OSDN_DEBUG) {
                throw $e;
            }
        }
        return $response->addStatus(new PMS_Status($status));
    }
    
    public function savePhoto($orderId, $file)
    {
    	$response = new OSDN_Response();
        $validate = new OSDN_Validate_Id();
        if (!$validate->isValid($orderId)) {
            $response->addStatus(new PMS_Status(
                PMS_Status::INPUT_PARAMS_INCORRECT, 'orderId'));
            return $response;
        }
        if ($file['error'] > 0) {
            $response->addStatus(new PMS_Status(
                PMS_Status::INPUT_PARAMS_INCORRECT, 'file'));
            return $response;
        }
        
        $filenameArray = split('\.', $file['name']);
        $ext = array_pop($filenameArray); 
       	$filename = uniqid() . '.' . $ext;
       	$filepath = FILES_DIR . '/' . $filename;
        try {
        	if (move_uploaded_file($file['tmp_name'], $filepath)) {
	            $this->_table->insert(array(
	               'order_id'      => $orderId, 
	               'filename'      => $filename,
	               'is_photo'      => 1,
	               'description'   => join(' ', $filenameArray)
	            ));
	            $status = PMS_Status::OK;
        	} else {
        		$status = PMS_Status::ADD_FAILED;
        	}
        } catch (Exception $e) {
            $status = PMS_Status::DATABASE_ERROR;
            if (OSDN_DEBUG) {
                throw $e;
            }
        }
        return $response->addStatus(new PMS_Status($status));
    }

    public function getFiles($orderId)
    {
    	$response = new OSDN_Response();
        $validate = new OSDN_Validate_Id();
        if (!$validate->isValid($orderId)) {
            $response->addStatus(new PMS_Status(
                PMS_Status::INPUT_PARAMS_INCORRECT, 'orderId'));
            return $response;
        }
        try {
            $response->setRowset($this->_table->fetchAll(array(
                'order_id = ?' => $orderId,
                'is_photo = ?' => 0
            ))->toArray());
            $status = PMS_Status::OK;
        } catch (Exception $e) {
            $status = PMS_Status::DATABASE_ERROR;
            if (OSDN_DEBUG) {
                throw $e;
            }
        }
        return $response->addStatus(new PMS_Status($status));
    }
    
    public function saveFile($orderId, $file)
    {
    	$response = new OSDN_Response();
        $validate = new OSDN_Validate_Id();
        if (!$validate->isValid($orderId)) {
            $response->addStatus(new PMS_Status(
                PMS_Status::INPUT_PARAMS_INCORRECT, 'orderId'));
            return $response;
        }
        if ($file['error'] > 0) {
            $response->addStatus(new PMS_Status(
                PMS_Status::INPUT_PARAMS_INCORRECT, 'file'));
            return $response;
        }
        $filenameArray = split('\.', $file['name']);
        $ext = array_pop($filenameArray); 
       	$filename = uniqid() . '.' . $ext;
       	$filepath = FILES_DIR . '/' . $filename;
        try {
        	if (move_uploaded_file($file['tmp_name'], $filepath)) {
	            $this->_table->insert(array(
	               'order_id'      => $orderId, 
	               'filename'      => $filename,
	               'is_photo'      => 0,
	               'description'   => join(' ', $filenameArray)
	            ));
	            $status = PMS_Status::OK;
        	} else {
        		$status = PMS_Status::ADD_FAILED;
        	}
        } catch (Exception $e) {
            $status = PMS_Status::DATABASE_ERROR;
            if (OSDN_DEBUG) {
                throw $e;
            }
        }
        return $response->addStatus(new PMS_Status($status));
    }
    
//------------------------------------------------------------------------------
    
    public function updateFileDescription($params)
    {
        $f = new OSDN_Filter_Input(array(
            'id'            => 'Int',
            'description'   => 'StringTrim'
        ), array(
            'id'            => array('id', 'presence' => 'required'),
            'description'   => array(array('StringLength', 0, 255))
        ), $params);
        $response = new OSDN_Response();
        $response->addInputStatus($f);
        if ($response->hasNotSuccess()) {
            return $response;
        }
        $res = $this->_table->updateByPk($f->getData(), $f->id);
        $status = $res === false ? PMS_Status::FAILURE : PMS_Status::OK;
        return $response->addStatus(new PMS_Status($status));
    }

    public function deleteFile($id)
    {
        $response = new OSDN_Response();
        $validate = new OSDN_Validate_Id();
        if (!$validate->isValid($id)) {
            return $response->addStatus(new PMS_Status(PMS_Status::INPUT_PARAMS_INCORRECT, 'id'));
        }
        $file = $this->_table->find($id)->toArray();
        if (count($file)) {
        	if (!empty($file[0]['filename'])) {
        		$filename = FILES_DIR . '/' . $file[0]['filename'];
        		if (file_exists($filename)) {
                     if(!@unlink($filename)) {
                        return $response->addStatus(new PMS_Status(PMS_Status::DELETE_FAILED));
                     }
        		}
        	} 
	        $affectedRows = $this->_table->deleteByPk($id);
	        $status = PMS_Status::retrieveAffectedRowStatus($affectedRows);
            return $response->addStatus(new PMS_Status($status));
        } else {
        	return $response->addStatus(new PMS_Status(PMS_Status::INPUT_PARAMS_INCORRECT, 'id'));
        }
    }
}