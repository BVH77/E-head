Ext.ns('PMS.Storage.Assets');

PMS.Storage.Assets.Tree = Ext.extend(xlib.TreePanel, {

    title: 'Ктегории',

    untitledNodeName: 'Новая категория',
    
    loadURL: link('storage', 'assets', 'get-categories'),
    
    addURL: link('storage', 'assets', 'add-category'),
    
    updateURL: link('storage', 'assets', 'update-category'),
    
    deleteURL: link('storage', 'assets', 'delete-category'),
    
    firstNodeSelected: true,
    
    ddAppendOnly: true,
    
    enableDrop: true,
    
    enableDD: false,
    
    rootVisible: true,
    
    initComponent: function() {
        
        this.root = new Ext.tree.AsyncTreeNode({
            text: 'Все категории',
            id: '0',
            expanded: true,
            allowRemove: false,
            allowRename: false
        });
        
        this.tools = [{
            id: 'refresh',
            qtip: 'Обновить',
            handler: function() {
                this.getRootNode().reload();
            },
            scope: this
        }];
        
        this.loader = new Ext.tree.TreeLoader({
            url: this.loadURL,
            baseAttrs: {
                leaf: true 
            }
        });
        
        PMS.Storage.Assets.Tree.superclass.initComponent.apply(this, arguments);
    },
    
    onContextMenu: function(node, e) {
        e.stopEvent();
        
        var menu = new Ext.menu.Menu();
        if (this.isRoot(node)) {
            menu.add({
                text: 'Добавить',
                iconCls: 'add',
                handler: function() {
                    this.createProcess(node);
                },
                scope: this
            });
        } else {
            menu.add({
                text: 'Переименовать',
                iconCls: 'edit',
                handler: function() {
                    this.treeEditor.triggerEdit(node);
                }, 
                scope: this
            });
            menu.add({
                text: 'Удалить',
                iconCls: 'delete',
                handler: function() {
                    this.beforeRemove(node);
                }, 
                scope: this
            });
        }
        menu.showAt(e.getXY());
    },
    
    createProcess: function(node) {
        var text = this.generateNodeName(this.getRootNode());
        Ext.Ajax.request({
            url: this.addURL,
            params: {
                name: text
            },
            callback: function(options, success, response) {
                var r = xlib.decode(response.responseText);
                if (success && r && r.success && r.id > 0) {
                    var newNode = new Ext.tree.TreeNode({
                        text: text,
                        id: r.id 
                    });
                    node.expand();
                    node.appendChild(newNode);
                    this.treeEditor.triggerEdit(newNode);
                    return;
                }
                xlib.Msg.error('Не удалось добавить категорию.');
            },
            scope: this
        });
    },
    
    renameProcess: function(editor, node, value, startValue) {
        Ext.Ajax.request({
            url: this.updateURL,
            params: {
                node: node.id,
                text: value
            },
            callback: function(options, success, response) {
                var r = xlib.decode(response.responseText);
                var success = success && r && r.success;
                
                if (!success) {
                    this.revertRename(node, startValue);
                    xlib.Msg.error('Не удалось переименовать категорию.');
                }
            },
            scope: this
        });
    },
    
    removeProcess: function(node) {
        Ext.Ajax.request({
            url: this.deleteURL,
            params: {
                id: node.id
            },
            callback: function(options, success, response) {
                var r = xlib.decode(response.responseText);
                if (success && r && r.success) {
                    this.removeNode(node);
                    return;
                }
                xlib.Msg.error('Не удалось удалить категорию.');
            },
            scope: this
        });
    }
});

Ext.reg('PMS.Storage.Assets.Tree', PMS.Storage.Assets.Tree);