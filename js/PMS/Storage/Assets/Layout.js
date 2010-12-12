Ext.ns('PMS.Storage.Assets');

PMS.Storage.Assets.Layout = Ext.extend(Ext.Panel, {
	
	title: 'Список ТМЦ',
	
    border: false,
    
    layout: 'border',
    
	initComponent: function() {
        
        this.tree = new PMS.Storage.Assets.Tree({
            region: 'west',
            width: 200,
            border: false,
            margins: '0 2 0 0',
            cls: 'x-border-right'
        });
        
        this.list = new PMS.Storage.Assets.List({
            region: 'center',
            border: false,
            cls: 'x-border-left'
        });
        
	    this.items = [this.tree, this.list];
		PMS.Storage.Assets.Layout.superclass.initComponent.apply(this, arguments);
	}
});

Ext.reg('PMS.Storage.Assets.Layout', PMS.Storage.Assets.Layout);