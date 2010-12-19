Ext.ns('PMS.Storage.Assets');

PMS.Storage.Assets.Layout = Ext.extend(Ext.Panel, {
	
	title: 'Список ТМЦ',
	
    border: false,
    
    layout: 'border',
    
	initComponent: function() {
        
        this.categories = new PMS.Storage.Assets.Tree({
            region: 'west',
            minWidth: 200,
            width: 300,
            split: true,
            border: false,
            margins: '0 2 0 0',
            cls: 'x-border-right'
        });
        
        this.assets = new PMS.Storage.Assets.List({
            region: 'center',
            border: false,
            cls: 'x-border-left'
        });
        
	    this.items = [this.categories, this.assets];
        
        var loadNodeItems = function(node) {
            this.assets.load(node.id, node.text);
        } 
        
        this.categories.on({
            click: loadNodeItems,
            contextmenu: loadNodeItems,
            firstnodeselected: loadNodeItems,
            textchange: function(node, text, oldText) {
                this.assets.setTitle(this.assets.baseTitle + '"' + text + '"');
            },
            scope: this
        });
        
		PMS.Storage.Assets.Layout.superclass.initComponent.apply(this, arguments);
	}
});

Ext.reg('PMS.Storage.Assets.Layout', PMS.Storage.Assets.Layout);