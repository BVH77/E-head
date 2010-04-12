<?
abstract class OSDN_Documents_Controllers_Abstract extends OSDN_Controller_Action
{
    protected $_entityTypeId = null;
    
    protected $_allowedDocumentTypes = null;
    
    protected $_allowedFileExtensions = null;
    
    public function init()
    {
        if (is_null($this->_entityTypeId)) {
            throw new OSDN_Exception('The entity type is not defined.');
        }
        $this->docs = new OSDN_Documents($this->_entityTypeId, $this->_allowedDocumentTypes, $this->_allowedFileExtensions);
        parent::init();
    }
    
    public function getCategoriesListAction() 
    {
        $node = $this->_getParam('node');
        if ($node > 0) {
            return $this->view->assign(array());
        }
        $categories = new OSDN_Documents_Category($this->_entityTypeId);
        $response = $categories->fetchAll();
        if ($response->isError()) {
            $this->_collectErrors($response);
            return; 
        }
        $data = $response->data;
        foreach ($data as &$row) {
            $row['text'] = $row['name'];
            $row['leaf'] = true;
        }
        $this->view->assign($data);        
    }
    
    public function downloadAction()
    {
        $this->disableRender(true);
        
        $file = new OSDN_Files();
        
        $id = $this->_getParam('id');
        
        $response = $file->get($id);
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
    
    public function getPlannedDocumentsAction()
    {
        $data = $this->_getAllParams();
        
        $data['fields'] = array(
            'dt'    => array(
                'type_id' => 'id', 'name', 'required', 'order',
                'question', 'expired_date_required'),
            'd'		=> array(
                'id', 'title', 'subject', 'document_storage_source_id',
                'presence', 'received_date', 'requested_date'
            )
        );
        
        if (!empty($data['allowedDocumentTypes'])) {
            $data['allowedDocumentTypes'] = Zend_Json::decode($data['allowedDocumentTypes']);
        }
        
        $response = $this->docs->fetchAllForDocTypes($data);
        if ($response->isError()) {
            $this->_collectErrors($response);
            return;
        }
        $rows = $response->rows;
        foreach ($rows as $k => $v) {
            $rows[$k]['templates'] = Zend_Json::encode($v['templates']);
        }
        $this->view->rows = $rows;
        $this->view->total = $response->total;
    }
    
    public function getDocumentTypeFilesAction()
    {
        $data = $this->_getAllParams();
        
        $data['fields'] = array('type_id' => 'id', 'name', 'required');
        
        if (!empty($data['allowedDocumentTypes'])) {
            $data['allowedDocumentTypes'] = Zend_Json::decode($data['allowedDocumentTypes']);
        }
        
        $response = $this->docs->fetchAllDocTypeFiles($data);
        if ($response->isError()) {
            $this->_collectErrors($response);
            return;
        }

        $this->view->rows = $response->rows;
        $this->view->total = $response->total;
    }
    
    
    public function getGeneralDocumentsAction()
    {
        $data = $this->_getAllParams();
        
        $data['fields'] = array(
            'd'		=> array('id', 'title', 'subject', 'document_storage_source_id'),
        );
        
        $response = $this->docs->fetchAll($data);
        if ($response->isError()) {
            $this->_collectErrors($response);
            return;
        }
        $this->view->rows = $response->rows;
        $this->view->total = $response->total;
    }
    
    public function getDocumentAction()
    {
        $response = $this->docs->get($this->_getParam('id'), '*', array(
            'id','originalfilename', 'type', 'size'
        ));
        
        if ($response->isError()) {
            $this->_collectErrors($response);
            return;
        }
        $this->view->data = array($response->data);
    }
    
    public function getDocumentSoursesAction()
    {
    	$response = $this->docs->getDocSourses();
    	if (!$response->isSuccess()) {
    		$this->_collectErrors($response);
    		return;
    	}
    	
    	$this->view->rows = $response->rows;
    }
    
    public function scanDocumentAction()
    {
        
        $this->disableRender(true);
        
//        $this->view->ScanConfig = array(
//	    	'title'        => 'pdf-RGB-200dpi',
//	        'imageType'    => 'pdf',
//	        'pixelType'    => 1,
//	        'Resolution'   => 2
//        );
//        $this->view->ScanSource = 1;
        
        $this->view->ScanConfig = array(
	        'imageType'         => OSDN_Config::get('scanner_imageType'),
	        'pixelType'         => OSDN_Config::get('scanner_pixelType'),
            'ifShowUI'          => OSDN_Config::get('scanner_ifShowUI'),
            'IfFeederEnabled'   => OSDN_Config::get('scanner_IfFeederEnabled'),
            'IfDuplexEnabled'   => OSDN_Config::get('scanner_IfDuplexEnabled'),
	        'Resolution'        => OSDN_Config::get('scanner_Resolution')
        );
        $this->view->ScanSource = OSDN_Config::get('scanner_ScanSource');
	    
	    
        $data = $this->_getAllParams();
        
        if (isset($_FILES['RemoteFile']) && $_FILES['RemoteFile']['name']) {
            $data['file'] = $_FILES['RemoteFile'];
            if (isset($data['id'])) {
                $response = $this->docs->update($data['id'], $data);
            } else {
                $response = $this->docs->insert($data);
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
    
    public function updateDocumentAction()
    {
        $data = $this->_getAllParams();
        
        if (isset($_FILES['RemoteFile']) && $_FILES['RemoteFile']['name'])  {
            $data['file'] = $_FILES['RemoteFile'];
        }
        
        if (isset($data['id'])) {
            $response = $this->docs->update($data['id'], $data);
        } else {
            $response = $this->docs->insert($data);
        }
        
        if ($response->isError()) {
            $this->_collectErrors($response);
            $this->view->success = false;
            return;
        }
        $this->view->success = true;
    }
    
    public function deleteDocumentAction()
    {
        $response = $this->docs->delete($this->_getParam('id'));
        if ($response->isError()) {
            $this->_collectErrors($response);
            $this->view->success = false;
            return;
        }
        $this->view->success = true;
    }
    
    public function deleteFileAction()
    {
        $response = $this->docs->deleteFile($this->_getParam('id'), $this->_getParam('file_id'));
        if ($response->isError()) {
            $this->_collectErrors($response);
            $this->view->success = false;
            return;
        }
        $this->view->success = true;
    }
}