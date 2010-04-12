Ext.namespace('OSDN.Documents');

OSDN.Documents.Categories = Ext.extend(OSDN.tree.TreePanel, {

    module: null,
    
    allowMenu: true,
    
    allowAdd: false,
    
    allowRemove: false,
    
    allowRename: false,
    
    allowToolAdd: false,
    
    title: lang('Categories'),
    
    sortable: false,
    
    initComponent: function() {
        
        this._prepareUrls();
        
        this.loader = new Ext.tree.TreeLoader({
            url: this.getNodeURL,
            baseAttrs: {
                singleClickExpand: true,
                iconCls: 'nav'
            }
        });
        
        this.root = new Ext.tree.AsyncTreeNode({
            id: '0',
            expanded: true,
            allowRename: false,
            blocked: true,
            iconCls: 'nav',
            text: lang('All')
        });
        
        this.tools = [];
        
        if (this.allowToolAdd) {
            this.tools.push({
                id: 'plus',
                qtip: lang('Add'),
                handler: function() {
                    this.createProcess.call(this)
                },
                scope: this
            })
        }
        
        this.tools.push({
            id: 'refresh',
            qtip: lang('Refresh'),
            handler: function(event, toolEl, panel) {
                panel.getRootNode().reload();
            }
        });
        
        OSDN.Documents.Categories.superclass.initComponent.apply(this, arguments);
    },
    
    initializeContextMenuItems: function(menu, node) {
        if (this.allowAdd === true && menu.items.findIndex('name', 'add') == -1) {
            if (menu.items.findIndex('name', 'add') == -1) {
                menu.add({
                    text: lang('Add'),
                    name: 'add',
                    iconCls: 'add',
                    handler: function() {
                        this.createProcess(node);
                    },
                    scope: this
                });
            }
        }
        if (this.allowRename === true && menu.items.findIndex('name', 'rename') == -1) {
            menu.add({
                text: lang('Rename'),
                name: 'rename',
                iconCls: 'edit',
                handler: function() {
                    this.treeEditor.triggerEdit(node);
                },
                disabled: node.attributes.allowRename === false,
                scope: this
            });
        }
        if (this.allowRemove && menu.items.findIndex('name', 'remove') == -1) {
            menu.add({
                text: lang('Remove'),
                name: 'remove',
                iconCls: 'delete',
                handler: function() {
                    this.beforeRemove(node);
                },
                disabled: node.attributes.blocked,
                scope: this
            });
        }
    },
    
    onContextMenu: function(node, e) {
        e.stopEvent();
        if (this.allowMenu && node.attributes.allowMenu !== false) {
            var menu = new Ext.menu.Menu({
                closeAction: 'close'
            });
            this.initializeContextMenuItems(menu, node);
            if (menu.items.getCount() === 0) {
                menu.destroy();
                return;
            }
            menu.on('hide', function(menu) {
                menu.destroy();
            });
            menu.showAt(e.getXY());
        }
    },
    
    renameProcess: function(editor, node, value, startValue) {
        Ext.Ajax.request({
            url: this.renameNodeURL,
            params: {node: node.id, text: value},
            callback: function(options, success, response) {
                var r = OSDN.decode(response.responseText);
                if (success && r && r.success) {
                } else {
                    node.setText(startValue);
                    //OSDN.Msg.error('ACHTUNG !!!');
                }
            }
        });
    },
    
    removeProcess: function(node) {
        OSDN.Msg.confirm(null, function(){
            Ext.Ajax.request({
                url: this.removeNodeURL,
                params: {node: node.id},
                callback: function(options, success, response) {
                    var r = OSDN.decode(response.responseText);
                    if (success && r && r.success) {
                        pNode = node.parentNode; 
                        this.removeNode(node);
                        if (pNode.hasChildNodes() == false) {
                            pNode.parentNode.reload();
                        }
                    } else {
                        OSDN.Msg.error(lang('Some templates alredy subscribed to this category! Deleting is not possible!'));
                    }
                }.createDelegate(this)
            });
        }, this);
    },
    
    createProcess: function() {
        var text = lang('New Category');
         
        Ext.Ajax.request({
            url: this.createNodeURL,
            params: {
                name: text
            },
            callback: function(options, success, response) {
                var r = OSDN.decode(response.responseText);
                if (success && r && r.success && r.id > 0) {
                    var newNode = new Ext.tree.AsyncTreeNode({
                        text: text,
                        id: r.id,
                        iconCls: 'nav',
                        expanded: true 
                    });
                    //this.getRootNode().expand();
                    this.getRootNode().appendChild(newNode);    
                    this.treeEditor.triggerEdit(newNode);
                    
                } else {
                    //OSDN.Msg.error('ACHTUNG !!!');
                }
            },
            scope: this
        });
    },
    
    onBeforeMoveCoreNodeExists: function(node, oldParent, newParent, index) {
        if (oldParent != newParent) {
            return false;
        }
        Ext.Ajax.request({
            url: this.moveNodeURL,
            params: {
                category_id: node.id,
                order: index
            },
            success: function() {
                
            },
            scope: this
        });
        
        return true;    
    },
    
    //private
    _prepareUrls: function() {
        var module = this.module;
        var a = {
            getNodeURL: link(module, 'documents', 'get-categories-list'),
            renameNodeURL: link(module, 'document-types', 'rename-category'),
            createNodeURL: link(module, 'document-types', 'create-category'),
            removeNodeURL: link(module, 'document-types', 'remove-category'),
            moveNodeURL: link(module, 'document-types', 'change-category-order')
        };
        
        for(var i in a) {
            if (!this[i]) {
                this[i] = a[i];
            }
        }
        return this;
    }

});