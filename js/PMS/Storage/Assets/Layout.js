Ext.ns('PMS.Storage.Assets');

PMS.Storage.Assets.Layout = Ext.extend(Ext.Panel, {
	
	title: 'Список ТМЦ',
	
    border: false,
    
    layout: 'border',
    
	initComponent: function() {
    	/*
    	this.listPanel = new PMS.Orders.List({
    		region: 'center',
    		border: false,
    		cls: 'x-border-right x-border-bottom'
    	});
    	
    	this.filesPanel = new PMS.Orders.Files({
    		region: 'center',
    		border: false,
    		cls: 'x-border-left x-border-bottom'
    	});

		this.infoPanel = new PMS.Orders.Info({
			width: 320,
			margins: '0 2px 0 0',
			cls: 'x-border-left x-border-right x-border-bottom',
            region: 'west'
        });
        
		this.descriptionPanel = new Ext.Panel({
			title: 'Описание',
			region: 'south',
			autoScroll: true,
    		margins: '2px 0 0 0',
            border: false,
			padding: 5,
			bodyCssClass: 'images-view',
			cls: 'x-border-right x-border-top',
			height: 130
		})
		
        this.notesPanel = new PMS.Orders.Edit.Notes({
        	margins: '2px 0 0 0',
        	cls: 'x-border-left x-border-top',
        	region: 'south',
        	permissions: false,
        	height: 130
        });
		*/
	    this.items = [{
	    	region: 'center',
	    	border: false
        }];
        /*
        this.listPanel.on('orderselect', function(record) {
            this.infoPanel.loadData(record);
            this.filesPanel.loadData(record.data);
            if (acl.isView('orders', 'description')) {
            	this.descriptionPanel.update(record.get('description'));
            }
            this.notesPanel.store.setBaseParam('orderId', record.get('id'));
            this.notesPanel.store.load();
        }, this);
        */
		PMS.Storage.Assets.Layout.superclass.initComponent.apply(this, arguments);
	}
});

Ext.reg('PMS.Storage.Assets.Layout', PMS.Storage.Assets.Layout);