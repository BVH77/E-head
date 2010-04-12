Ext.ns('OSDN.Documents.TypeManager');

OSDN.Documents.TypeManager.Layout = Ext.extend(Ext.Panel, {
    
    resource: false,
    
    stateId: 'osdn.documents.typemanager.layout',
    
    border: false,
    
    layout: 'border',
    
    defaults: {
        split: true
    },
    
    module: 'student',
    
    initComponent: function() {
        
        this.ddGroupCommon = this.module + '-dd'; 
        
        var self = this;
        
        this.tree = new OSDN.Documents.Categories({
            resource: this.resource,
            module: this.module,
            allowRemove: acl.isDelete(this.module, 'documenttypes'),
            allowRename: acl.isUpdate(this.module, 'documenttypes'),
            allowToolAdd: acl.isAdd(this.module, 'documenttypes'),
            firstNodeSelected: true,
            region: 'west',
            collapsible: true,
            border: false,
            cmargins: "0 5 0 0", 
            cls: 'x-osdn-border-right',
            width: 175,
            ddGroup: this.ddGroupCommon
        });
        
        this.docTypesList = new OSDN.Documents.TypeManager.List({
            resource: this.resource,
            module: this.module,
            region: 'center',
            collapsible: true,
            border: false,
            cls: 'x-osdn-border-left',
            enableDragDrop: true,
            ddGroup: this.ddGroupCommon
        });
        
        this.items = [
            this.tree, 
            this.docTypesList
        ];
        OSDN.Documents.TypeManager.Layout.superclass.initComponent.apply(this, arguments);
        
        this.tree.on('beforenodedrop', function(e) {
            if (!e.dropNode && e.data.grid && e.target.attributes.id) {
                var list = e.data.grid;
                var record = list.getStore().getAt(e.data.rowIndex);
                list.changeCategory.call(list, record.get('id'), e.target.attributes.id);
            }
        }, this);
        
        this.tree.on('load', function (node) {
            var sm = this.tree.getSelectionModel();
            if (!sm.getSelectedNode()) {
                sm.select(node);
            }
        }, this);
        
        this.tree.getSelectionModel().on('selectionchange', function(tree, node) {
        	if (node) {
                var id = node.id || null;
        	} else {
        		var id = null;
        	}
            this.docTypesList.load.call(this.docTypesList, {
                category_id: id
            });
            this.docTypesList.getView().onShowGroupsClick(null, OSDN.empty(id));
        }, this);
    },
    
    getDocTypesList : function () {
        return this.docTypesList;
    }
});

Ext.reg('osdn.documents.typemanager.layout', OSDN.Documents.TypeManager.Layout);