<?
abstract class OSDN_Documents_Controllers_TypesAbstract extends OSDN_Controller_Action
{
    protected $_entityTypeId = null;

    protected $_allowedDocumentTypes = null;

    protected $_allowedFileExtensions = null;

    protected $_categories = null;

    public function init()
    {
        if (is_null($this->_entityTypeId)) {
            throw new OSDN_Exception('The entity type is not defined.');
        }
        $this->docTypes = new OSDN_DocumentTypes($this->_entityTypeId, $this->_allowedDocumentTypes, $this->_allowedFileExtensions);
        parent::init();
    }

    public function changeCategoryOrderAction()
    {
        $categories = new OSDN_Documents_Category($this->_entityTypeId);
        $response = $categories->changeOrder($this->_getParam('category_id'), $this->_getParam('order'));
        if ($response->isError()) {
            $this->view->success = false;
            $this->_collectErrors($response);
            return;
        }
        $this->view->success = true;
    }

    public function renameCategoryAction()
    {
        $categories = new OSDN_Documents_Category($this->_entityTypeId);
        $response = $categories->update($this->_getParam('node'), array(
            'name' => $this->_getParam('text')
        ));
        if ($response->isError()) {
            $this->view->success = false;
            $this->_collectErrors($response);
            return;
        }
        $this->view->success = true;
    }

    public function removeCategoryAction()
    {
        $categories = new OSDN_Documents_Category($this->_entityTypeId);
        $response = $categories->delete($this->_getParam('node'));
        if ($response->isError()) {
            $this->view->success = false;
            return;
        }
        $this->view->success = true;
    }

    public function createCategoryAction()
    {
        $categories = new OSDN_Documents_Category($this->_entityTypeId);
        $response = $categories->add(array(
            'name'     => $this->_getParam('name')
        ));
        if ($response->isError()) {
            $this->view->success = false;
            return;
        }
        $this->view->id = $response->id;
        $this->view->success = true;
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

    public function getListAction()
    {
        $response = $this->docTypes->fetchAllWithFiles($this->_getAllParams());
        if ($response->isError()) {
            $this->_collectErrors($response);
            return;
        }
        $this->view->rows = $response->rows;
        $this->view->total = $response->total;
    }

    public function getReplaceableListAction()
    {
        $response = $this->docTypes->fetchAllWithReplaceable($this->_getParam('documentTypeId'), $this->_getAllParams());
        if ($response->isSuccess()) {
            $this->view->rows = $response->getRowset();
            $this->view->success = true;
        } else {
            $this->_collectErrors($response);
        }
    }

    public function loadAction()
    {
        $response = $this->docTypes->get($this->_getParam('id'), '*', array(
            'originalfilename', 'type', 'size'
        ));

        if ($response->isError()) {
            $this->_collectErrors($response);
            return;
        }
        $this->view->data = array($response->data);
    }


    public function updateAction()
    {
        $data = $this->_getAllParams();
        if (!isset($data['id'])) {
            $response = $this->docTypes->insert($data);
            $this->view->document_type_id = $response->docTypeId;
        } else {
            $response = $this->docTypes->update($data['id'], $data);
        }
        if ($response->isError()) {
            $this->_collectErrors($response);
            $this->view->success = false;
            return;
        }
        $this->view->success = true;
    }

    public function deleteAction()
    {
        $response = $this->docTypes->delete($this->_getParam('id'));
        if ($response->isError()) {
            $this->_collectErrors($response);
            $this->view->success = false;
            return;
        }
        $this->view->success = true;
    }


    public function filesListAction()
    {
        $data = $this->_getAllParams();

        $response = $this->docTypes->getFiles($data['document_type_id']);
        if ($response->isError()) {
            $this->_collectErrors($response);
            return;
        }
        $this->view->data = $response->rows;
        $this->view->total = isset($response->total)? $response->total : 0;
    }

    public function loadFileAction()
    {
        $data = $this->_getAllParams();
        $response = $this->docTypes->getFile($data['file_id']);
        if ($response->isError()) {
            $this->_collectErrors($response);
            return;
        }
        $this->view->data = array($response->data);
    }

    public function scanFileAction()
    {

        $this->disableRender(true);

//        $this->view->ScanConfig = array(
//	    	'title'        => 'pdf-RGB-200dpi',
//	        'imageType'    => 'pdf',
//	        'pixelType'    => 1,
//	        'Resolution'   => 2
//	    );
//
//	    $this->view->ScanSource = 1;

	    $this->view->ScanConfig = array(
	        'imageType'         => OSDN_Config::get('scanner_imageType'),
	        'pixelType'         => OSDN_Config::get('scanner_pixelType'),
	        'ifShowUI'          => OSDN_Config::get('scanner_ifShowUI'),
	        'Resolution'        => OSDN_Config::get('scanner_Resolution'),
	        'IfFeederEnabled'   => OSDN_Config::get('scanner_IfFeederEnabled'),
            'IfDuplexEnabled'   => OSDN_Config::get('scanner_IfDuplexEnabled')
        );
        $this->view->ScanSource = OSDN_Config::get('scanner_ScanSource');


        $data = $this->_getAllParams();

        if (isset($_FILES['RemoteFile']) && $_FILES['RemoteFile']['name'])  {
            $data['file'] = $_FILES['RemoteFile'];
            $data['file']['description'] = $data['description'];
            if (!isset($data['file_id'])) {
                $response = $this->docTypes->insertFile($data);
            } else {
                $response = $this->docTypes->updateFile($data);
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
        if (!isset($data['file_id'])) {
            $response = $this->docTypes->insertFile($data);
        } else {
            $response = $this->docTypes->updateFile($data);
        }
        if ($response->isError()) {
            $this->_collectErrors($response);
            $this->view->success = false;
            return;
        }
        $this->view->success = true;
    }

    public function deleteFileAction()
    {
        $data = $this->_getAllParams();
        $response = $this->docTypes->deleteFile($data['file_id']);
        if ($response->isError()) {
            $this->_collectErrors($response);
            $this->view->success = false;
            return;
        }
        $this->view->success = true;
    }


    public function getPlannedDocumentsAction()
    {
        $data = $this->_getAllParams();

        $data['fields'] = array(
            'dt'    => array('type_id' => 'id', 'name', 'required', 'order'),
            'd'		=> array('id', 'title', 'comments', 'document_storage_source_id'),
        );

        $response = $this->docs->fetchAllForDocTypes($data);
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
            'd'		=> array('id', 'title', 'comments', 'document_storage_source_id'),
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
            'originalfilename', 'type', 'size'
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
}