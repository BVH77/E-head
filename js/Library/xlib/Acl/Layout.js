Ext.ns('xlib.Acl');

xlib.Acl.Layout = Ext.extend(Ext.Panel, {
    
    layout: 'border',
    
    border: false,
    
    title: 'Менеджер доступа',
    
    defaults: {
        split: true
    },
    
    id: 'xlib.acl.layout',
    
    ddAcountsGroup: 'dd-accounts-group',
    
    initComponent: function() {
        
        this.roles = new xlib.Acl.Roles.Tree({
            region: 'west',
            width: 200,
            border: false,
			cls: 'x-border-right',
            collapsible: true,
            ddGroup: this.ddAcountsGroup,
            enableDD: true
        });
        
        this.accounts = new xlib.Acl.Accounts.List({
            region: 'center',
            ddGroup: this.ddAcountsGroup,
			border: false,
			cls: 'x-border-bottom x-border-left',
            enableDragDrop: true
        });
        
        this.permissions = new xlib.Acl.Permission.Tree({
            region: 'south',
            height: 300,
            cmargins: '5 1 1 0',
            collapsible: true,
            border: false,
			cls: 'x-border-top x-border-left',
            loadUrl: link('admin', 'acl', 'get-list')
        });
        
        this.items = [
            this.roles, {
            region: 'center',
            layout: 'border',
            border: false,
            defaults: {
                split: true
            },
            items: [this.accounts, this.permissions]
        }];
        
        xlib.Acl.Layout.superclass.initComponent.apply(this, arguments);
        this.roles.on({
            click: this.onRolesClick,
            firstnodeselected: this.onRolesClick,
            beforenodedrop: this.onBeforeNodeDropRoles,
            nodedragover: this.onNodeDragOverRoles,
            scope: this
        });
    },
    
    onBeforeNodeDropRoles: function(e) {
        
        var node = e.target;
        var accountIds = [];
        
        Ext.each(e.data.selections, function(record, index, allItems) {
            accountIds.push(record.get('id'));
        });
        
        Ext.Ajax.request({
            url: link('admin', 'accounts', 'change-role'),
            params: {
                roleId: node.id,
                accountIds: Ext.encode(accountIds)
            },
            callback: function() {
                this.accounts.getStore().reload();
            },
            scope: this
        });
        return true;
    },
     
    onNodeDragOverRoles: function(e) {
        var nodeId = parseInt(e.target.id, 10);
        if (nodeId === 0) {
            e.cancel = true;
            return;
        }
    },
        
    onRolesClick: function(node) {
        var isRoot = this.roles.isRoot(node);
        if (isRoot) {
            this.permissions.mask(true);    
        } else {
            this.permissions.unmask();
        }
        
        this.permissions.setRoleId(node.id);
        this.accounts.setRoleId(node.id);
        this.accounts.createAccountBtn.setDisabled(isRoot);
    }
});

Ext.reg('xlib.acl.layout', xlib.Acl.Layout);