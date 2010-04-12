Ext.ns('OSDN.Comments');

OSDN.Comments.TreeNodeUI = Ext.extend(Ext.tree.ColumnNodeUI, {
    onCheckboxClick: function() {},
    onCheckChange: function() {}
});

OSDN.Comments.Tree = Ext.extend(Ext.tree.ColumnTree, {

    title: lang('Comments'),
    border: false,
    animCollapse: false,
    animate: false,
    autoScroll:true,

    tabCls: 'yellow-notes',
    autoExpandColumn: 'bodytext',
    allowRename: false,
    allowRemove: false,
    allowMenu: false,
    enableDD: false,
    allowMove: false,
    rootVisible: false,
    
    url: null,
    addReplyUrl: null,
    updateCommentaryUrl: null,
    addCommentaryUrl: null,
    updateCommentaryUrl: null,
    getCommentaryUrl: null,
    getCommentaryTypes: null, 
    markReadedUrl: null,

    entityType: null,
    entityId: null,
    controller: null,
    
    resource: [],
            
    initComponent: function() {
        
        // generate the urls
        this._prepareUrls(this.entityType, this.controller || 'commentary');
        this.tbar = new Ext.Toolbar({
            items: [{
                iconCls: 'x-tbar-loading',
                text: lang('Refresh'),
                handler: function() {
                    this.getRootNode().reload();
                },
                scope: this
            }, {
                iconCls: 'osdn-comment-add',
                text: lang('Add commentary'),
                hidden: !acl.isAdd.apply(acl, this.resource),
                handler: function() {
                    var rootNode = this.getRootNode();
                    var w = this.addCommentary({
                        url: this.addCommentaryUrl,
                        entityId: this.entityId,
                        onSuccess: function(){
                            rootNode.reload();
                        },
                        onFailure: function(){
                            OSDN.Msg.error(lang('Add new commentary failed. Try again.'));
                        },
                        scope: this
                    }).show();
                },
                scope: this
            }],
            scope: this
        });

        this.columns = [{
            header: lang('Title'),
            dataIndex: 'title',
            width: 200,
            renderer: function(v, node, record) {
                return v 
                + ' <span qtip="' + lang('{0} replies present', record.replies_count) + '">(' 
                + record.replies_count + ')</span>';
            }
        }, {
            header: lang('Text'),
            dataIndex: 'bodytext',
            renderer: function(v) {
                return '<span qtip="' + v + '">' + v + '</span>';
            }
        }, {
            header: lang('Owner'),
            dataIndex: 'creator_account_name',
            renderer: function(v) {
                v = v || lang('Anonymous');
                return '<span qtip="' + v + '">' + v + '</span>';
            }
        }, {
            header: lang('Response needed'),
            renderer: function(b, node, a) {
                if (a.notificated_owner && !a.reaction_received) {
                    return '<div class="x-grid3-check-col-on">&nbsp;</div>';    
                }
                return '&nbsp;';
            }
        }, {
            header: lang('Date of creation'),
            dataIndex: 'createddatetime',
            width: 120,
            renderer: function(v) {
                return Date.parseDate(v, OSDN.date.DATE_TIME_FORMAT_SERVER).format(OSDN.date.DATE_TIME_FORMAT);
            }
        }];

        this.loader = new Ext.tree.TreeLoader({
            dataUrl: this.url,
            baseParams: {
                entityId: this.entityId
            },
            uiProviders:{
                'col': OSDN.Comments.TreeNodeUI
            },
            baseAttrs: {
                uiProvider: 'col',
                iconCls: 'comm'
            },
            scope: this
        });
        
        this.root = new Ext.tree.AsyncTreeNode({
            id: '0',
            iconCls: 'comm'
        });
        
        this.contextMenu = new Ext.menu.Menu({
            items: [{
                text: lang('Edit'),
                iconCls: 'osdn-comment-edit',
                action: 'edit',
                hidden: !acl.isUpdate.apply(acl, this.resource)
            }, {
                text: lang('Delete'),
                iconCls: 'osdn-comment-delete',
                action: 'delete',
                hidden: !acl.isDelete.apply(acl, this.resource)
            }, {
                text: lang('Reply'),
                iconCls: 'reply',
                action: 'reply',
                hidden: !acl.isAdd.apply(acl, this.resource)
            }]
        });
        this.contextMenu.on('itemclick', this.onContextMenuItemClick, this);

        this.on('contextmenu', function(node, e) {
            node.select();
            var c = node.getOwnerTree().contextMenu;
            c.contextNode = node;
            
            // check if replies are present then disabled menu item
            var repliesPresent = node.attributes.replies_count;
            c.items.each(function(i) {
                if (-1 != ['delete', 'edit'].indexOf(i.action)) {
                    i.setDisabled(repliesPresent);
                }
            }, this);

            c.showAt(e.getXY());
        }, this); 

        this.on('click', this.onItemClick, this);
        OSDN.Comments.Tree.superclass.initComponent.call(this);
    },
    
    onItemClick: function(node, e) {
        var commentaryId = node.attributes.comment_id;
        var t = new Ext.XTemplate(
            '<tpl><table cellspacing="8">',
                '<tr>',
                    '<th style="vertical-align: top;"><b>', lang('Title'), ': </b></th>',
                    '<td>{title}</td>',
                '</tr>',
                '<tr>',
                    '<th style="white-space:nowrap;vertical-align: top;"><b>', lang('Text'), ': </b></th>',
                    '<td>{[fm.nl2br(values.bodytext)]}</td>',
                '</tr>',
                '<tr>',
                    '<th style="white-space:nowrap;"><b>' , lang('Owner') , ': </b></th>',
                    '<td>{[values.creator_account_name || lang("Anonymous")]}</td>',
                '</tr>',
                '<tr>',
                    '<th style="white-space:nowrap"><b>' , lang('Created at') , ': </b></th>',
                    '<td>{createddatetime}</td>',
                '</tr>',
                '<tpl if="modifieddatetime != undefined">',
                '<tr>',
                    '<th><b style="white-space:nowrap">', lang("Modified at"), ': </b></th>', 
                    '<td>{modifieddatetime}', 
                        '<tpl if="modified_account_name"> by {modified_account_name}</tpl>',
                    '</td>',
                '</tr>',
                '<tpl if="notificated_owner && !reaction_received">',
                    '<tr><td colspan="2"><b>', lang("Please reply on this message."), '</b></td></tr>',
                '</tpl>',
                '</tpl>',
            '</table></tpl>'
        );
        this.markReaded(node);
        var w = new Ext.Window({
            title: lang('Commentary viewer'),
            width: 400,
            autoHeight: true,
            autoScroll: true,
            modal: true,
            items: [{
                border: false,
                html: t.apply(node.attributes)
            }],
            buttons: [{
                text: lang('reply'),
                iconCls: 'reply',
                hidden: !acl.isAdd.apply(acl, this.resource),
                handler: function() {
                    var replyWindow = this.addReply({
                        title: lang('Add new reply'),
                        url: this.addReplyUrl,
                        entityId: this.entityId,
                        getHistoryUrl: this.getHistoryUrl,
                        commentId: commentaryId,
                        history: true,
                        onSuccess: function(){
                            node.parentNode.reload();
                        },
                        onFailure: function(){
                            OSDN.Msg.error(lang('Add new reply failed. Try again.'));
                        },
                        scope: this
                    });
                    replyWindow.show(null, function() {
                        w.close();
                    });
                },
                scope: this
            }, {
                text: lang('Close'),
                iconCls: 'ext-ux-uploaddialog-uploadstopbtn',
                handler: function() {
                    w.close();
                },
                scope: this
            }],
            scope: this
        });
        w.show();
    },
    
    onContextMenuItemClick: function(item) {
        
        var node = item.parentMenu.contextNode;
        var id = node.id;
        
        switch (item.action) {
            case 'edit':
                
                var w = this.updateCommentary({
                    getUrl: this.getCommentaryUrl,
                    url: this.updateCommentaryUrl,
                    comment_id: id,
                    entityId: this.entityId,
                    onSuccess: function() {
                        node.parentNode.reload();
                    },
                    onFailure: function() {
                        OSDN.Msg.error(lang('Edit commentary failed. Try again.'));
                    },
                    scope: this
                });
                w.show(null, function() {
                    this.markReaded(node);
                }, this);
                break;
            
            case 'reply':
            
                var w = this.addReply({
                    title: lang('Add new reply'),
                    url: this.addReplyUrl,
                    entityId: this.entityId,
                    getHistoryUrl: this.getHistoryUrl,
                    commentId: id,
                    history: true,
                    onSuccess: function(){
                        node.parentNode.reload();
                    },
                    onFailure: function(){
                        OSDN.Msg.error(lang('Add new reply failed. Try again.'));
                    },
                    scope: this
                });
                w.show(null, function() {
                    this.markReaded(node);
                }, this);
                break;
                        
            case 'delete':
            
                OSDN.Msg.confirm(null, function() {
                    this.removeCommentary({
                        commentId: id,
                        entityId :this.entityId,
                        url: this.deleteCommentaryUrl,
                        onSuccess: function() {
                            var parent = node.parentNode;
                            if (this.getRootNode() != parent) {
                                parent = parent.parentNode;
                            }
                            parent.reload();
                        },
                        onFailure: function() {
                            OSDN.Msg.error(lang('Delete node failed. Try again.'));
                        },
                        scope: this
                    });
                }, this);
                break;
        }
    },
    
    
    
    /**
     * Add new reply to system
     * 
     * @param {Object} cfg
     * <code>
     * cfg: {
     *     commentId: 1,
     *     url: link('comments', 'reply', 'addnew'),
     *     onSuccess: function() {},
     *     onFailure: function() {}
     * }
     * </code>
     * @return {Ext.Window} The window widget
     */
    addReply: function(cfg) {
        
        Ext.applyIf(cfg || {}, {
            onSuccess: Ext.emptyFn,
            onFailure: Ext.emptyFn
        });
        
        var w = new Ext.Window({
            title: lang('Add new reply'),
            iconCls: 'reply',
            resizable: false,
            modal: true,
            shadow: false,
            width: 450,
            items: [{
                xtype: 'osdn.comments.commentaryform',
                typesUrl: this.getCommentaryTypes,
                history: true,
                permissions: acl.isAdd.apply(acl, this.resource)
            }],
            buttons: [{
                text: lang('Reply'),
                iconCls: 'osdn-add',
                handler: function() {
                    var f = w.items.first();
                    f.getForm().submit({
                        url: cfg.url,
                        params: {
                            parent_id: cfg.commentId,
                            entity_id: cfg.entityId
                        },
                        waitMsg: lang('Saving...'),
                        success: function(form, action) {
                            if (action.result.success === true) {
                                cfg.onSuccess.apply(this, arguments);
                                w.close();
                            } else {
                                cfg.onFailure.apply(this, arguments);
                            }
                        },
                        failure: cfg.onFailure.apply(this, arguments),
                        scope: this
                    });
                }
            }, {
                text: lang('Cancel'),
                handler: function(){
                    w.close();
                },
                scope: this
            }],
            scope: this
        });
        
        w.on('show', function() {
            var f = w.items.first();
            f.getForm().load({
                url: cfg.getHistoryUrl,
                params: {
                    parent_id: cfg.commentId,
                    entity_id: cfg.entityId
                },
                waitMsg: lang('Loading...'),
                scope: this
            });
        }, this);
         
        return w;
    },
    
    addCommentary: function(cfg) {
        
        Ext.applyIf(cfg || {}, {
            onSuccess: Ext.emptyFn,
            onFailure: Ext.emptyFn
        });
        
        var w = new Ext.Window({
            title: lang('Add new commentary'),
            iconCls: 'osdn-comment-add',
            resizable: false,
            modal: true,
            shadow: false,
            width: 450,
            items: [{
                xtype: 'osdn.comments.commentaryform',
                typesUrl: this.getCommentaryTypes,
                permissions: acl.isAdd.apply(acl, this.resource)
            }],
            buttons: [{
                text: lang('Submit'),
                iconCls: 'osdn-add',
                handler: function() {
                    var f = w.items.first();
                    f.getForm().submit({
                        url: cfg.url,
                        waitMsg: lang('Saving...'),
                        params: {
                            entityId: cfg.entityId
                        },
                        success: function(form, action) {
                            if (action.result.success === true) {
                                cfg.onSuccess.apply(this, arguments);
                                w.close();
                            } else {
                                cfg.onFailure.apply(this, arguments);
                            }
                        },
                        failure: function() {
                            cfg.onFailure.apply(this, arguments);
                        },
                        scope: this
                    });
                }
            }, {
                text: lang('Cancel'),
                handler: function() {
                    w.close();
                },
                scope: this
            }]
         });
         return w;
    },
    
    updateCommentary: function(cfg) {
        
        Ext.applyIf(cfg || {}, {
            onSuccess: Ext.emptyFn,
            onFailure: Ext.emptyFn
        });
        
        var w = new Ext.Window({
            title: lang('Update commentary'),
            iconCls: 'osdn-comment-edit',
            resizable: false,
            modal: true,
            shadow: false,
            width: 450,
            items: [{
                xtype: 'osdn.comments.commentaryform',
                typesUrl: this.getCommentaryTypes,
                permissions: acl.isUpdate.apply(acl, this.resource)
            }],
            buttons: [{
                text: lang('Update'),
                iconCls: 'osdn-edit',
                handler: function() {
                    var f = w.items.first();
                    f.getForm().submit({
                        url: cfg.url,
                        params: {
                            comment_id: cfg.comment_id,
                            entityId: cfg.entityId
                        },
                        waitMsg: lang('Saving...'),
                        success: function(form, action) {
                            if (action.result.success === true) {
                                cfg.onSuccess.apply(this, arguments);
                                w.close();
                            } else {
                                cfg.onFailure.apply(this, arguments);
                            }
                        },
                        failure: function() {
                            cfg.onFailure.apply(this, arguments);
                        },
                        scope: this
                    });
                }
            }, {
                text: lang('Cancel'),
                handler: function() {
                    w.close();
                },
                scope: this
            }]
         });
         
         w.on('show', function() {
             var f = w.items.first();
             f.getForm().load({
                 url: cfg.getUrl,
                 params: {
                     comment_id: cfg.comment_id,
                     entityId: cfg.entityId
                 },
                 waitMsg: lang('Loading...'),
                 scope: this
             });
         }, this);
         
         return w;
    },
    
    /**
     * Delete commentary
     * 
     * @param {Object} cfg
     * <code>
     * cfg: {
     *     commentId: 1,
     *     url: link('comments', 'commentary', 'delete'),
     *     onSuccess: function() {},
     *     onFailure: function() {}
     * }
     * </code>
     */
    removeCommentary: function(cfg) {
        
        Ext.applyIf(cfg || {}, {
            onSuccess: Ext.emptyFn,
            onFailure: Ext.emptyFn
        });
        
        Ext.Ajax.request({
            url: cfg.url,
            params: {
                id: cfg.commentId,
                entityId: cfg.entityId
            },
            success: function(response) {
                var res = Ext.decode(response.responseText);
                if (res.success === true) {
                    cfg.onSuccess.apply(this, arguments);
                } else {
                    cfg.onFailure.apply(this, arguments);
                }
            },
            failure: function() {
                cfg.onFailure.createDelegate(this, arguments);   
            },
            scope: this
        });
    },
    
    // private
    _prepareUrls: function(entityType, controller) {
        var a = {
            url: link(entityType, controller, 'get-list'),
            addReplyUrl: link(entityType, controller, 'add-reply'),
            deleteCommentaryUrl: link(entityType, controller, 'delete'),
            addCommentaryUrl: link(entityType, controller, 'add'),
            updateCommentaryUrl: link(entityType, controller, 'update'),
            getCommentaryUrl: link(entityType, controller, 'get'),
            getCommentaryTypes: link(entityType, controller, 'get-types'),
            getHistoryUrl: link(entityType, controller, 'get-history'),
            markReadedUrl: link(entityType, controller, 'mark-readed'),
            fetchParentCommentary: link(entityType, controller, 'fetch-parent')
        };
        
        for(var i in a) {
            if (!this[i]) {
                this[i] = a[i];
            }
        }
        
        return this;
    },
    
    markReaded: function(node) {
        
        var a = node.attributes;
        if (a.reaction_received || !a.notificated_owner) {
            return;
        }
        
        Ext.Ajax.request({
            url: this.markReadedUrl,
            params: {
                comment_id: a.comment_id,
                entity_id: a.entity_id
            },
            callback: function(options, success, response) {
                var response = OSDN.decode(response.responseText);
                if (response.success === true) {
                    node.attributes.reaction_received = new Date().format(OSDN.date.DATE_TIME_FORMAT_SERVER);
                    node.getUI().columns[2].innerHTML = "&nbsp;";
                }
            },
            scope: this
        });
    },
    
    fetchReverse: function(id, callback, parentIds) {
        
        if (!Ext.isArray(parentIds)) {
            parentIds = [];
        }
        
        Ext.Ajax.request({
            url: this.fetchParentCommentary,
            params: {
                entity_id: this.entityId,
                commentary_id: id
            },
            callback: function(options, success, response) {
                var res = OSDN.decode(response.responseText);
                if (!success || !res.success) {
                    return false;
                }

                var parentId = parseInt(res.parent_id, 10);
                if (isNaN(parentId)) {
                    return false;
                }
                
                if (parentId > 0) {
                    parentIds.unshift(parentId);
                    this.fetchReverse(parentId, callback, parentIds);
                    return;
                }
                
                if (0 == parentId && 'function' == typeof callback) {
                    callback.apply(this, [parentIds]);
                }
            },
            scope: this
        });
    },
    
    expandReverse: function(id, callback) {
        this.getEl().mask(lang('Fetching commentary...'), 'x-mask-loading');
        this.fetchReverse(id, function(parentIds) {
            parentIds.unshift(this.getRootNode().id);
            this.expandPath('/' + parentIds.join('/'), null, function(oSuccess, oLastNode) {
                var node = oLastNode.findChild('id', id);
                if (node instanceof Ext.tree.TreeNode) {
                    this.onItemClick(node);
                    node.select();
                } else {
                    alert(lang('Commentary does not exists.'));
                }
                
            }.createDelegate(this));
            
            if ('function' == typeof callback) {
                callback(parentIds);
            }
            this.getEl().unmask();
        }.createDelegate(this));
    },
    
    setEntityId: function(id) {
        this.entityId = id;
        this.loader.baseParams.entityId = id;
        return this;
    }    
});

Ext.reg('osdn.comments.tree', OSDN.Comments.Tree);