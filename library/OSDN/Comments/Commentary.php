<?php

/**
 * OSDN_Comments_Commentary
 *
 * Yellow notes like functionality for OSDN system.
 *
 * @category OSDN
 * @package OSDN_Comments
 */
class OSDN_Comments_Commentary
{
    const RESPONSE_IS_NEEDED = 1;
    
    const NOTIFICATION_ONLY = 2;
    
    /**
     * Comment table object
     *
     * @var OSDN_Comments_Table_Comments
     */
    protected $_tableComments = null;
    
    /**
     * Comment constructor
     */
    public function __construct()
    {
        $this->_tableComments = new OSDN_Comments_Table_Comments();
    }
    
    /**
     * Add new commentary
     *
     * @param array $data
     *
     * Data may contain following attributes<pre>
     *      entity_id           int     required
     *      entitytype_id       int     required
     *      commenttype_id      int     required
     *      title               string  OPTIONAL
     *      bodytext            string  OPTIONAL
     *      parent_id           int     OPTIONAL
     *      account_id          int     OPTIONAL       The notificated account id
     *      action_id           int     OPTIONAL
     * </pre>
     * @return OSDN_Response
     * <pre>data:
     *      commentId
     *      notificationId
     * </pre>
     */
    public function insert(array $data)
    {
        $response = new OSDN_Response();
        $filters = array(
            'title'             => 'StringTrim',
            'bodytext'          => 'StringTrim'
        );
        
        $validators = array(
            'entity_id'      => array('id', 'presence' => 'required'),
            'entitytype_id'  => array('id', 'presence' => 'required'),
            'commenttype_id' => array('id', 'presence' => 'required'),
            'title'          => array(array('StringLength', 0, 150)),
            'parent_id'      => array('id')
        );

        if (isset($data['commenttype_id'])
            && OSDN_Comments_Types::EMAIL_STATUS == $data['commenttype_id']) {
            $validators += array(
                'account_id'    => array('id', 'presence' => 'required'),
                'action_id'     => array('id', 'presence' => 'required')
            );
        }
        
        $filterInput = new OSDN_Filter_Input($filters, $validators, $data);
        $response->addInputStatus($filterInput);
        if ($response->hasNotSuccess()) {
            return $response;
        }
        
        $preparedData = array(
            'entity_id'         => $filterInput->entity_id,
            'entitytype_id'     => $filterInput->entitytype_id,
            'commenttype_id'    => $filterInput->commenttype_id,
            'title'             => $filterInput->title,
            'bodytext'          => $filterInput->bodytext,
            'creator_account_id'=> OSDN_Accounts_Prototype::getId()
        );

        if (OSDN_Comments_Types::EMAIL_STATUS == $filterInput->commenttype_id) {
            $preparedData['notificated_account_id'] = $filterInput->account_id;
            $preparedData['notificated_action'] = $filterInput->action_id;
        }
        
        if (!empty($filterInput->parent_id)) {
            $preparedData['parent_id'] = $filterInput->parent_id;
        }
        
        $commentId = $this->_tableComments->insert($preparedData);
        if (!$commentId) {
            $response->addStatus(new OSDN_Comments_Status(OSDN_Comments_Status::ADD_FAILED));
            return $response;
        }
        $response->commentId = $commentId;
        $response->allowNotification = OSDN_Comments_Types::EMAIL_STATUS == $filterInput->commenttype_id;
        $response->addStatus(new OSDN_Comments_Status(OSDN_Comments_Status::OK));
        return $response;
    }
    
    /**
     * @return OSDN_Response
     */
    public function update(array $data)
    {
        $response = new OSDN_Response();
        $validators = array(
            'commentary_id'  => array('id', 'presence' => 'required'),
            'entity_id'      => array('id', 'presence' => 'required'),
            'entitytype_id'  => array('id', 'presence' => 'required')
        );
        $filter = new OSDN_Filter_Input(array('*' => 'int'), $validators, $data);
        unset($validators);
        
        $response->addInputStatus($filter);
        if ($response->hasNotSuccess()) {
            return $response;
        }
        $commentaryId = $filter->commentary_id;
        $entityTypeId = $filter->entitytype_id;
        $entityId = $filter->entity_id;
        
        $select = new OSDN_Comments_Select();
        $selectResponse = $select->fetchCommentaryByEntity($entityTypeId, $entityId, $commentaryId);
        
        if ($selectResponse->isError()) {
            return $selectResponse;
        }
        $commentary = $selectResponse->commentary;
        if (empty($commentary)) {
            $response->addStatus(new OSDN_Comments_Status(OSDN_Comments_Status::COMMENTARY_IS_MISSING));
            return $response;
        }
        
        $filters = array(
            'title'    => 'StringTrim',
            'bodytext' => 'StringTrim'
        );
        $validators = array(
            'title' => array(array('StringLength', 0, 150))
        );
                
        $emailStatus = OSDN_Comments_Types::EMAIL_STATUS == $commentary['commenttype_id'];
        if (! $emailStatus) {
            $validators += array(
                'commenttype_id' => array('id', 'presence' => 'required')
            );
            
            if (isset($data['commenttype_id'])
                && OSDN_Comments_Types::EMAIL_STATUS == $data['commenttype_id']) {
                $validators += array(
                    'account_id'    => array('id', 'presence' => 'required'),
                    'action_id'     => array('id', 'presence' => 'required')
                );
            }
        }

        $filterInput = new OSDN_Filter_Input($filters, $validators, $data);
        $response->addInputStatus($filterInput);
        if ($response->hasNotSuccess()) {
            return $response;
        }
        
        // check if reply is present
        $count = $this->_tableComments->count(array('parent_id = ?' => $commentaryId));
        if (false === $count) {
            $response->addStatus(new OSDN_Comments_Status(OSDN_Comments_Status::DATABASE_ERROR));
            return $response;
        } elseif ($count > 0) {
            $response->addStatus(new OSDN_Comments_Status(OSDN_Comments_Status::UPDATED_REPLY_IS_ALREADY_MADE));
            return $response;
        }
        
        
        $preparedData = array(
            'title'                 => $filterInput->title,
            'bodytext'              => $filterInput->bodytext,
            'modified_account_id'   => OSDN_Accounts_Prototype::getId()
        );

        if (! $emailStatus) {
            $preparedData['commenttype_id'] = $filterInput->commenttype_id;
            
            if (OSDN_Comments_Types::EMAIL_STATUS == $filterInput->commenttype_id) {
                $preparedData['notificated_account_id'] = $filterInput->account_id;
                $preparedData['notificated_action'] = $filterInput->action_id;
            }
        }
        
        // update process
        $updatedRows = $this->_tableComments->updateQuote($preparedData, array(
            'id = ?'             => $commentaryId,
            'entity_id = ?'      => $entityId,
            'entitytype_id = ?'  => $entityTypeId
        ));
        
        $response->affectedRows = $updatedRows;
        $response->addStatus(new OSDN_Comments_Status(
            OSDN_Comments_Status::retrieveAffectedRowStatus($updatedRows))
        );
        
        if ($response->allowNotification = $emailStatus && $response->isSuccess()) {
            $options = new stdClass();
            $options->notificated_account_id = $commentary['notificated_account_id'];
            $options->notificated_action = $commentary['notificated_action'];
            $response->notificationOptions = $options;
        }
        
        return $response;
    }
    
    /**
     * Delete commentary by id
     *
     * @param int $entityTypeId         The entity id
     * @param int $entityId             The entity type
     * @param int $commentaryId         The commentary id
     * @return OSDN_Response
     */
    public function delete($entityTypeId, $entityId, $commentaryId)
    {
        $response = new OSDN_Response();
        $validate = new OSDN_Validate_Id();
        
        if (
            !$validate->isValid($entityTypeId)
            || !$validate->isValid($entityId)
            || !$validate->isValid($commentaryId)) {
            $response->addStatus(new OSDN_Comments_Status(
                OSDN_Comments_Status::INPUT_PARAMS_INCORRECT));
            return $response;
        }
        
        $affectedRows = $this->_tableComments->deleteQuote(array(
            'id = ?'            => $commentaryId,
            'entitytype_id = ?' => $entityTypeId,
            'entity_id = ?'     => $entityId
        ));
        
        $response->addData('affectedRows', $affectedRows);
        $response->addStatus(new OSDN_Comments_Status(
            OSDN_Comments_Status::DELETED));
        return $response;
    }
    
    /**
     * Delete commentaries by entity
     *
     * @param int $entityTypeId         The entity id
     * @param int $entityId             The entity type
     * @return OSDN_Response
     */
    public function deleteByEntity($entityTypeId, $entityId)
    {
        $response = new OSDN_Response();
        $validate = new OSDN_Validate_Id();
        
        if (
            !$validate->isValid($entityTypeId)
            || !$validate->isValid($entityId)) {
            $response->addStatus(new OSDN_Comments_Status(
                OSDN_Comments_Status::INPUT_PARAMS_INCORRECT));
            return $response;
        }
        
        $affectedRows = $this->_tableComments->deleteQuote(array(
            'entitytype_id = ?' => $entityTypeId,
            'entity_id = ?'     => $entityId
        ));
        
        $response->addData('affectedRows', $affectedRows);
        $response->addStatus(new OSDN_Comments_Status(
            OSDN_Comments_Status::DELETED));
        return $response;
    }
        
    /**
     * Create new reply by comment
     *
     * @param int $id       comment id
     * @param array $data
     * @see insert()
     *
     * @return OSDN_Response
     */
    public function reply(array $data)
    {
        $validate = new OSDN_Validate_Id();
        if (!isset($data['parent_id']) || !$validate->isValid($data['parent_id'])) {
            $response = new OSDN_Response();
            $response->addStatus(new OSDN_Comments_Status(
                OSDN_Comments_Status::INPUT_PARAMS_INCORRECT, 'parent_id'));
            return $response;
        }
        
        $parentId = $data['parent_id'];
        $parentCommentary = $this->_tableComments->findOne($parentId);
        if (is_null($parentCommentary)) {
            $response = new OSDN_Response();
            $response->addStatus(new OSDN_Comments_Status(
                OSDN_Comments_Status::REPLY_PARENT_NOT_EXISTS));
            return $response;
        }
        
        if (empty($data['title'])) {
            $data['title'] = $parentCommentary->title;
        }
        
        $response = $this->insert($data);
        $response->title = $data['title'];
        return $response;
    }
    
    /**
     * Update reply
     *
     * @param int $id       The comment
     * @param array $data   Reply data
     * @return OSDN_Response
     */
    public function updateReply($id, array $data)
    {
        $prepare = array();
        if (isset($data['bodytext'])) {
            array_push($prepare, $data['bodytext']);
        }
        return $this->update($id, $prepare);
    }
    
    /**
     * Set message status to private
     *
     * @param int $id           message id
     * @return OSDN_Response
     */
    public function setPrivate($id)
    {
        $response = new OSDN_Response();
        $validate = new OSDN_Validate_Id();
        
        if (!$validate->isValid($id)) {
            $response->addStatus(new OSDN_Comments_Status(
                OSDN_Comments_Status::INPUT_PARAMS_INCORRECT));
            return $response;
        }
        
        $affectedRows = $this->_tableComments->updateByPk(array('private' => 1), $id);
        $response->addStatus(new OSDN_Comments_Status(OSDN_Comments_Status::retrieveAffectedRowStatus($aff)));
        $response->addData('affectedRows', $affectedRows);
        return $response;
    }
    
    /**
     * Fetch replies for commentary
     *
     * @param int $id       The commentary id
     * @return OSDN_Response
     */
    public function getRepliesCount($id)
    {
        $response = new OSDN_Response();
        $validate = new OSDN_Validate_Id();
        if (!$validate->isValid($id)) {
            $response->addStatus(new OSDN_Comments_Status(OSDN_Comments_Status::INPUT_PARAMS_INCORRECT, 'id'));
            return $response;
        }
        
        $count = $this->_tableComments->count(array('parent_id = ?' => $id));
        if (false !== $count) {
            $status = OSDN_Comments_Status::OK;
        } else {
            $status = OSDN_Comments_Status::DATABASE_ERROR;
        }
        $response->count = $count;
        $response->addStatus(new OSDN_Comments_Status($status));
        return $response;
    }
    
    /**
     * Send notification message
     *
     * @param string $to            The receive email
     * @param string $subject       Mail subject
     * @param string $message       Mail text content
     * @return OSDN_Response
     * <code>
     * array(
     *  'result' => boolean
     * )
     * </code>
     */
    
    //$accountId, $action, $subject, $message
    public function notificateEmail(array $data)
    {
        $response = new OSDN_Response();
        $filters = array(
            'subject'       => 'StringTrim',
            'message'       => 'StringTrim',
            'account_id'    => 'int',
            'action_id'     => 'int',
            'entity_id'     => 'int',
            'commentary_id' => 'int'
        );
        
        $validators = array(
            'account_id'    => array('id', 'presence' => 'required'),
            'action_id'     => array('id', 'presence' => 'required'),
            'commentary_id' => array('id', 'presence' => 'required'),
            'entity_id'     => array('id', 'presence' => 'required'),
            'subject'       => array(array('StringLength', 0, 150))
        );

        $filterInput = new OSDN_Filter_Input($filters, $validators, $data);
        $response->addInputStatus($filterInput);
        if ($response->hasNotSuccess()) {
            return $response;
        }
        
        $config = Zend_Registry::get('config');
        $feedbackAddress = $config->mail->from->address;
        $emailValidator = new Zend_Validate_EmailAddress();
        
        $accounts = new OSDN_Accounts();
        $accountsResponse = $accounts->fetchAccount($filterInput->account_id);
        if ($accountsResponse->hasNotSuccess()) {
            return $accountsResponse;
        }
        
        $accountInformation = $accountsResponse->rowset;
        $to = !empty($accountInformation) ? $accountInformation['email'] : "";
        
        if (!$emailValidator->isValid($to) || !$emailValidator->isValid($feedbackAddress)) {
            $response->addStatus(new OSDN_Comments_Status(OSDN_Comments_Status::INPUT_PARAMS_INCORRECT));
            return $response;
        }

        $assemble = new OSDN_Controller_Assemble();
        $assembleResponse = $assemble->insert(array(
            'callback'      => $filterInput->callback,
            'entity_id'     => $filterInput->entity_id,
            'commentary_id' => $filterInput->commentary_id
        ));
        
        if ($assembleResponse->isError()) {
            return $assembleResponse;
        }
        $assembleId = $assembleResponse->id;
        $subject = $filterInput->subject;
        
        if (empty($subject)) {
            $subject = lang('New inbox message from {0}', $feedbackAddress);
        }

        // sorry for this "vinaigrette" in code :-(
        // but I don't want to build more creppy solution
        $siteAddress = Zend_Registry::get('config')->site->address;
        $url = $siteAddress . '/' . $assembleId . '/';
        $message = nl2br($filterInput->message) . '<br />'
            . lang('Follow this link to read the message {0}', "<a href=\"$url\">$url</a>");
                
        if ($filterInput->action_id == self::RESPONSE_IS_NEEDED) {
            $message .= '
                <br/ >
                <br />
                --<br />
                <i>' . lang('Please response on this note.') . '</i>';
        }
        
        $mail = new Zend_Mail('UTF-8');
        $mail->addTo($to);
        $mail->setFrom($feedbackAddress, $config->mail->from->caption);
        $mail->setSubject($subject);
        $mail->setBodyHtml($message);

        try {
            $response->result = $mail->send();
            $status = OSDN_Comments_Status::OK;
        } catch (Exception $e) {
            if (OSDN_DEBUG) {
                throw $e;
            }
            $status = OSDN_Comments_Status::DATABASE_ERROR;
        }
        
        $response->addStatus(new OSDN_Comments_Status($status));
        return $response;
    }
    
    /**
     * Mark the message readed
     *
     * @param int $entityTypeId     The entity type
     * @param int $entityId         The entity id
     * @param int $commentaryId     The commentary id
     * @return OSDN_Response
     */
    public function markReaded($entityTypeId, $entityId, $commentaryId)
    {
        $response = new OSDN_Response();
        $validate = new OSDN_Validate_Id();
        if (!$validate->isValid($entityTypeId) ||
            !$validate->isValid($entityId) ||
            !$validate->isValid($commentaryId)) {
            $response->addStatus(new OSDN_Comments_Status(OSDN_Comments_Status::INPUT_PARAMS_INCORRECT));
            return $response;
        }
        
        $affectedRows = $this->_tableComments->updateQuote(
            array('reaction_received' => new Zend_Db_Expr('NOW()')),
            array(
                'entitytype_id = ?' => $entityTypeId,
                'entity_id = ?'     => $entityId,
                'id = ?'            => $commentaryId,
                new Zend_Db_Expr('reaction_received IS NULL'),
                'notificated_account_id = ?' => OSDN_Accounts_Prototype::getId()
            )
        );

        $response->addStatus(new OSDN_Comments_Status(
            OSDN_Comments_Status::retrieveAffectedRowStatus($affectedRows)));
        return $response;
    }
    
    /**
     * Fetch parent commentary id
     *
     * @param int $entityTypeId     The entity type
     * @param int $entityId         The entity id
     * @param int $commentaryId     The commentary id
     * @return OSDN_Response
     */
    public function fetchParentCommentary($entityId, $entityTypeId, $commentaryId)
    {
        $response = new OSDN_Response();
        $validate = new OSDN_Validate_Id();
        if (!$validate->isValid($entityTypeId) ||
            !$validate->isValid($entityId) ||
            !$validate->isValid($commentaryId)) {
            $response->addStatus(new OSDN_Comments_Status(OSDN_Comments_Status::INPUT_PARAMS_INCORRECT));
            return $response;
        }
        
        $row = $this->_tableComments->fetchRow(array(
            'entitytype_id = ?' => $entityTypeId,
            'entity_id = ?'     => $entityId,
            'id = ?'            => $commentaryId
        ));
        
        $response->parent_id = !is_null($row) ? $row->parent_id : 0;
        $response->addStatus(new OSDN_Comments_Status(OSDN_Comments_Status::OK));
        return $response;
    }
}
