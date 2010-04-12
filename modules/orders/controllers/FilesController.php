<?php

class Orders_FilesController extends OSDN_Controller_Action
{
	/**
	 * @var PMS_Files
	 */
	protected $_class;
	
	public function init()
	{
		$this->_class = new PMS_Files();
		parent::init();
	}
	
    public function permission(OSDN_Controller_Action_Helper_Acl $acl)
    {
        $acl->setResource(OSDN_Acl_Resource_Generator::getInstance()->orders->photos);
        $acl->isAllowed(OSDN_Acl_Privilege::VIEW,   'get-photos');
        $acl->isAllowed(OSDN_Acl_Privilege::UPDATE, 'upload-photo');
        $acl->isAllowed(OSDN_Acl_Privilege::UPDATE, 'update-photo');
        $acl->isAllowed(OSDN_Acl_Privilege::UPDATE, 'delete-photo');
        
        $acl->isAllowed(OSDN_Acl_Privilege::VIEW,   'get-files');
        $acl->isAllowed(OSDN_Acl_Privilege::UPDATE, 'upload-file');
        $acl->isAllowed(OSDN_Acl_Privilege::UPDATE, 'update-file');
        $acl->isAllowed(OSDN_Acl_Privilege::UPDATE, 'delete-file');
    }
    
    public function getPhotosAction()
    {
        $response = $this->_class->getPhotos($this->_getParam('orderId'));
        if ($response->isSuccess()) {
            $this->view->success = true;
            $this->view->photos = $response->getRowset();
        } else {
           $this->_collectErrors($response);
        }
    }
    
    public function uploadPhotoAction()
    {
        $response = $this->_class->savePhoto($this->_getParam('orderId'), $_FILES['file']);
        $this->view->success = $response->isSuccess();
    }
    
    public function updatePhotoAction()
    {
        $response = $this->_class->updateFileDescription(array(
            'id'          => $this->_getParam('photoId'),
            'description' => $this->_getParam('description')
        ));
        $this->view->success = $response->isSuccess();
    }
    
    public function deletePhotoAction()
    {
        $response = $this->_class->deleteFile($this->_getParam('photoId'));
        $this->view->success = $response->isSuccess();
    }

// -----------------------------------------------------------------------------

    public function getFilesAction()
    {
        $response = $this->_class->getFiles($this->_getParam('orderId'));
        if ($response->isSuccess()) {
            $this->view->success = true;
            $this->view->files = $response->getRowset();
        } else {
           $this->_collectErrors($response);
        }
    }

    public function uploadFileAction()
    {
        $response = $this->_class->saveFile($this->_getParam('orderId'), $_FILES['file']);
        $this->view->success = $response->isSuccess();
    }
    
    public function updateFileAction()
    {
        $response = $this->_class->updateFileDescription(array(
            'id'          => $this->_getParam('fileId'),
            'description' => $this->_getParam('description')
        ));
        $this->view->success = $response->isSuccess();
    }
    
    public function deleteFileAction()
    {
        $response = $this->_class->deleteFile($this->_getParam('fileId'));
        $this->view->success = $response->isSuccess();
    }
}