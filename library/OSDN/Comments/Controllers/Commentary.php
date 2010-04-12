<?php

abstract class OSDN_Comments_Controllers_Commentary extends OSDN_Controller_Action
{

    protected $_entityTypeId = null;

    public function init()
    {
        if (is_null($this->_entityTypeId)) {
            throw new OSDN_Exception('The entity type is not defined.');
        }
        parent::init();
    }

    public function permission(OSDN_Controller_Action_Helper_Acl $acl)
    {
        $acl->isAllowed(OSDN_Acl_Privilege::VIEW, 'get-list');
        $acl->isAllowed(OSDN_Acl_Privilege::ADD, 'add');
        $acl->isAllowed(OSDN_Acl_Privilege::DELETE, 'delete');
        $acl->isAllowed(OSDN_Acl_Privilege::VIEW, 'get');
        $acl->isAllowed(OSDN_Acl_Privilege::UPDATE, 'update');
        $acl->isAllowed(OSDN_Acl_Privilege::ADD, 'add-reply');
        $acl->isAllowed(OSDN_Acl_Privilege::VIEW, 'get-types');
        $acl->isAllowed(OSDN_Acl_Privilege::VIEW, 'get-history');
        $acl->isAllowed(OSDN_Acl_Privilege::VIEW, 'mark-readed');
        $acl->isAllowed(OSDN_Acl_Privilege::VIEW, 'fetch-parent');
    }

    public function getListAction()
    {
        $id = $this->_getParam('node');
        $entityId = $this->_getParam('entityId');

        $commentary = new OSDN_Comments_Select();

        // fetch all commentary
        if ($id == 0) {
            $response = $commentary->fetchAll($this->_entityTypeId, $entityId);
        } else {
            $response = $commentary->fetchReplies($this->_entityTypeId, $entityId, $id);
        }

        if ($response->isError()) {
            $this->_collectErrors($response);
            return;
        }
        $rows = $response->rows;
        if (is_array($rows)) {
            foreach ($rows as & $row) {
                $row['leaf'] = !isset($row['replies_count']) || $row['replies_count'] == 0;
            }
        }

        $this->view->assign($rows);
    }

    public function addAction()
    {
        $commentary = new OSDN_Comments_Commentary();
        $data = array(
            'entity_id'      => $this->_getParam('entityId'),
            'entitytype_id'  => $this->_entityTypeId,
            'title'          => $this->_getParam('title'),
            'bodytext'       => $this->_getParam('bodytext'),
            'account_id'     => $this->_getParam('account_id'),
            'commenttype_id' => $this->_getParam('commenttype_id'),
            'action_id'      => $this->_getParam('action_id')
        );

        $response = $commentary->insert($data);
        if ($response->isError()) {
            $this->_collectErrors($response);
            return;
        }

        if (true === $response->allowNotification) {
            $responseNotification = $commentary->notificateEmail(array(
                'action_id'     => $this->_getParam('action_id'),
                'account_id'    => $this->_getParam('account_id'),
                'subject'       => lang('New note: "{0}"', $this->_getParam('title')),
                'message'       => $this->_getParam('bodytext'),
                'entity_id'     => $this->_getParam('entityId'),
                'commentary_id' => $response->commentId,
                'callback'      => $this->_getCallbackAssemblePath()
            ));
        }

        $this->view->success = true;
    }

    public function updateAction()
    {
        $commentary = new OSDN_Comments_Commentary();
        $response = $commentary->update(array(
            'commentary_id' => $this->_getParam('comment_id'),
            'entity_id'     => $this->_getParam('entityId'),
            'entitytype_id' => $this->_entityTypeId,
            'title'         => $this->_getParam('title'),
            'bodytext'      => $this->_getParam('bodytext'),
            'account_id'    => $this->_getParam('account_id'),
            'commenttype_id'=> $this->_getParam('commenttype_id'),
            'action_id'     => $this->_getParam('action_id')
        ));

        if ($response->isError()) {
            $this->_collectErrors($response);
            return;
        }

        if (true === $response->allowNotification) {
            $options = $response->notificationOptions;
            $responseNotification = $commentary->notificateEmail(array(
                'action_id'     => $options->notificated_action,
                'subject'       => lang('Updated note: "{0}"', $this->_getParam('title')),
                'message'       => $this->_getParam('bodytext'),
                'entity_id'     => $this->_getParam('entityId'),
                'account_id'    => $options->notificated_account_id,
                'commentary_id' => $this->_getParam('comment_id'),
                'callback'      => $this->_getCallbackAssemblePath()
            ));
        }

        $this->view->success = true;
    }

    public function deleteAction()
    {
        $comments = new OSDN_Comments_Commentary();
        $response = $comments->delete(
            $this->_entityTypeId,
            $this->_getParam('entityId'),
            $this->_getParam('id')
        );

        if ($response->isSuccess()) {
            $this->view->success = true;
            return;
        }

        $this->_collectErrors($response);
        $this->view->success = false;
    }

    public function getAction()
    {
        $commentaryId = $this->_getParam('comment_id');
        $entityId = $this->_getParam('entityId');
        $select = new OSDN_Comments_Select();
        $response = $select->fetchCommentaryByEntity($this->_entityTypeId, $entityId, $commentaryId);
        $success = false;

        if ($response->isError()) {
            $this->_collectErrors($response);
        } else {
            $this->view->success = true;
        }
        $this->view->rows = array($response->commentary);
    }

    public function addReplyAction()
    {

        $commentary = new OSDN_Comments_Commentary();
        $data = $this->getRequest()->getPost();
        $data['entitytype_id'] = $this->_entityTypeId;
        $response = $commentary->reply($data);
        if ($response->isError()) {
            $this->_collectErrors($response);
            return;
        }

        if (true === $response->allowNotification) {
            $responseNotification = $commentary->notificateEmail(array(
                'action_id'     => $this->_getParam('action_id'),
                'account_id'    => $this->_getParam('account_id'),
                'entity_id'     => $this->_getParam('entity_id'),
                'commentary_id' => $response->commentId,
                'subject'       => lang('New reply note: "{0}"', $response->title),
                'message'       => $this->_getParam('bodytext'),
                'callback'      => $this->_getCallbackAssemblePath()
            ));
        }

        $this->view->success = true;
        $this->view->errors = array();
    }

    public function getHistoryAction()
    {
        $entityId = $this->_getParam('entity_id');
        $parentId = $this->_getParam('parent_id');
        $select = new OSDN_Comments_Select();

        $response = $select->fetchHistory($this->_entityTypeId, $entityId, $parentId);

        if ($response->isError()) {
            $this->_collectErrors($response);
            $this->view->rows = array();
        } else {
            $this->view->success = true;
            $this->view->rows = array(array('history' => $response->history));
        }
    }

    public function fetchParentAction()
    {
        $entityId = $this->_getParam('entity_id');
        $commentaryId = $this->_getParam('commentary_id');
        $commentary = new OSDN_Comments_Commentary();
        $response = $commentary->fetchParentCommentary($entityId, $this->_entityTypeId, $commentaryId);
        if ($response->isError()) {
            $this->_collectErrors($response);
            return;
        }

        $this->view->parent_id = (int) $response->parent_id;
        $this->view->success = true;
    }


    public function getTypesAction()
    {
        $types = new OSDN_Comments_Types();
        $response = $types->getTypes();
        $rows = array();
        if ($response->isSuccess()) {
            foreach ($response->rows as $id => $value) {
                $rows[] = array(
                    'id'    => $id,
                    'name'  => $value
                );
            }
        }
        $this->view->types = $rows;
    }

    /**
     * Mark script as readed
     *
     * @return void
     */
    public function markReadedAction()
    {
        $entityId = $this->_getParam('entity_id');
        $commentaryId = $this->_getParam('comment_id');
        $commentary = new OSDN_Comments_Commentary();
        $response = $commentary->markReaded($this->_entityTypeId, $entityId, $commentaryId);
        $this->view->success = $response->isSuccess();
    }

    /**
     * Fetch callback script for assembly when
     * user goto from browser to application
     *
     * @return string
     */
    protected function _getCallbackAssemblePath()
    {
        $filename = '/' . join('/', array(
            $this->getRequest()->getModuleName(),
            'views', 'scripts',
            $this->getRequest()->getControllerName(),
            'assemble.phtml'
        ));
        return $filename;
    }
}