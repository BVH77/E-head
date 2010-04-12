<?php

class OSDN_Files_Controllers_Abstract extends OSDN_Controller_Action
{
    public function downloadFileAction()
    {
        $this->disableRender(true);
        
        $id = $this->_getParam('id');
        
        $response = $this->file->get($id);
        if ($response->isError()) {
            return;
        }
        $data = $response->data;
        
        header('Content-disposition: attachment; filename="' . $data['originalfilename'] . '"');
        
        header('Content-Type: ' . $data['type']);
        
        header('Content-Transfer-Encoding: binary');
        
        header('Content-Length: '. $data['size']);
        
        header('Pragma: no-cache');
        
        header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
        
        header('Expires: 0');
        
        echo $data['filecontent'];
        
        exit;
    }
    
    public function deleteFileAction()
    {
        $response = $this->file->delete($this->_getParam('file_id'));
        if ($response->isError()) {
            $this->_collectErrors($response);
            $this->view->success = false;
            return;
        }
        if (method_exists($this, '_afterDeleteFile')) {
            $this->_afterDeleteFile($response);
        }
        $this->view->success = true;
    }
    
    public function loadFileAction()
    {
        $data = $this->_getAllParams();
        $response = $this->file->get($this->_getParam('file_id'), array(
            'id',
            'originalfilename',
            'description',
            'type',
            'size',
//            'created',
//            'creator_user_id',
//            'modified',
//            'modified_user_id'
        ));
        if ($response->isError()) {
            $this->_collectErrors($response);
            return;
        }
        $this->view->data = array($response->data);
    }

    public function scanFileAction()
    {
       $this->disableRender(true);
        
        $this->view->ScanConfig = array(
            'imageType'    => OSDN_Config::get('scanner_imageType'),
            'pixelType'    => OSDN_Config::get('scanner_pixelType'),
            'ifShowUI'     => OSDN_Config::get('scanner_ifShowUI'),
            'Resolution'   => OSDN_Config::get('scanner_Resolution'),
            'IfFeederEnabled'   => OSDN_Config::get('scanner_IfFeederEnabled'),
            'IfDuplexEnabled'   => OSDN_Config::get('scanner_IfDuplexEnabled')
        );
        $this->view->ScanSource = OSDN_Config::get('scanner_ScanSource');
        
        $data = $this->_getAllParams();
        
        if (isset($_FILES['RemoteFile']) && $_FILES['RemoteFile']['name'])  {
            $data['file'] = $_FILES['RemoteFile'];
            $data['file']['description'] = $data['description'];

            if (!isset($data['file_id']) || $data['file_id'] == 'null') {
                $response = $this->file->insert($data['file']);
                if (method_exists($this, '_afterInsertFile')) {
                    $this->_afterInsertFile($response);
                }
                $this->view->file_id = $response->fileId;
                $this->view->success = true;
                echo Zend_Json::encode($this->view);
            } else {
                $response = $this->file->update($this->_getParam('file_id'), $data['file']);
                if (method_exists($this, '_afterUpdateFile')) {
                    $this->_afterUpdateFile($response);
                }
            }
            if ($response->isError()) {
                $this->_collectErrors($response);
                $this->view->success = false;
                echo Zend_Json::encode($this->view);
            }
            exit;
        }
        
        $request = $this->getRequest();
        
        $this->view->link = $this->view->link($request->getModuleName(), $request->getControllerName(), $request->getActionName());
        OSDN_Documents_Scan::display($this->view);
        exit;
    }
    
    public function updateFileAction()
    {
        $data = $this->_getAllParams();
        $data['file'] = array();
        if (!empty($_FILES['RemoteFile']) && $_FILES['RemoteFile']['name']) {
            $data['file'] = $_FILES['RemoteFile'];
        }
        $data['file']['description'] = $data['description'];
        if (!isset($data['file_id'])  || $data['file_id'] == 'null') {
            $response = $this->file->insert($data['file']);
            if (method_exists($this, '_afterInsertFile')) {
                $this->_afterInsertFile($response);
            }
            $this->view->file_id = $response->fileId;
        } else {
            $response = $this->file->update($this->_getParam('file_id'), $data['file']);
            if (method_exists($this, '_afterUpdateFile')) {
                $this->_afterUpdateFile($response);
            }
        }
        if ($response->isError()) {
            $this->_collectErrors($response);
            $this->view->success = false;
            return;
        }
        $this->view->success = true;
    }
    
}
