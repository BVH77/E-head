Ext.ns('PMS.Orders');

PMS.Orders.Layout = Ext.extend(Ext.Panel, {
	
	title: 'Заказы',
	
    border: false,
    
    layout: 'border',
    
	initComponent: function() {
    	
    	this.listPanel = new PMS.Orders.List({
    		region: 'center',
    		border: false,
    		cls: 'x-border-right x-border-bottom'
    	});
    	
    	this.photosPanel = new PMS.Orders.Photos({
    		region: 'south',
    		height: 130,
    		border: false,
    		margins: '2px 0 0 0',
    		cls: 'x-border-right x-border-top'
    	});

		this.infoPanel = new PMS.Orders.Info({
			title: 'Детали',
			margins: '0 0 2px 0',
			cls: 'x-border-left x-border-bottom',
            region: 'center'
        });
        
        this.notesPanel = new PMS.Orders.Edit.Notes({
        	title: 'Комментарии',
        	region: 'south',
        	border: false,
        	height: 300,
        	cls: 'x-border-left x-border-top'
        });
		
	    this.items = [{
	    	region: 'center',
	    	layout: 'border',
	    	border: false,
	    	items: [this.listPanel, this.photosPanel]	
	    }, {
            layout: 'border',
            width: 320,
			region: 'east',
			border: false,
            margins: '0 0 0 2px', 
            defaults: {
                border: false
            },
            items: [this.infoPanel, this.notesPanel]
        }];
        
        this.listPanel.on('orderselect', function(record) {
            this.infoPanel.loadData(record);
            this.photosPanel.loadData(record.data);
            this.notesPanel.store.setBaseParam('orderId', record.get('id'));
            this.notesPanel.store.load();
        }, this);
        
		PMS.Orders.Layout.superclass.initComponent.apply(this, arguments);
	}
});

Ext.reg('PMS.Orders.Layout', PMS.Orders.Layout);