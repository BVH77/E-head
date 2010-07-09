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
    	
    	this.filesPanel = new PMS.Orders.Files({
    		region: 'south',
    		height: 200,
    		border: false,
    		margins: '2px 0 0 0',
    		cls: 'x-border-right x-border-top'
    	});

		this.infoPanel = new PMS.Orders.Info({
			title: 'Детали заказа',
			border: false,
			width: 320,
			margins: '0 2px 0 0',
			cls: 'x-border-left x-border-right x-border-bottom',
            region: 'west'
        });
        
		this.suppliersPanel = new PMS.Orders.Suppliers({
			title: 'Поставщики',
			region: 'center',
			border: false,
			cls: 'x-border-left x-border-bottom'
		});
		
		this.descriptionPanel = new Ext.Panel({
			title: 'Описание',
			region: 'center',
			autoScroll: true,
			padding: 5,
			bodyCssClass: 'images-view',
			cls: 'x-border-left x-border-top x-border-bottom',
			border: false,
			height: 200
		})
		
        this.notesPanel = new PMS.Orders.Edit.Notes({
        	title: 'Комментарии',
        	border: false,
        	margins: '2px 0 0 0',
        	cls: 'x-border-left x-border-top',
        	region: 'south',
        	permissions: false,
        	height: 200
        });
		
	    this.items = [{
	    	region: 'center',
	    	layout: 'border',
	    	border: false,
	    	items: [this.listPanel, this.filesPanel]	
	    }, {
            layout: 'border',
            width: 620,
			region: 'east',
			border: false,
            margins: '0 0 0 2px', 
            defaults: {
	    		layout: 'border',
	    		border: false
            },
            items: [{
            	region: 'center',
            	margins: '0 0 2px 0',
            	items: [this.infoPanel, this.suppliersPanel]
            }, {
            	region: 'south',
            	height: 400,
            	items: [this.descriptionPanel, this.notesPanel]
            }]
        }];
        
        this.listPanel.on('orderselect', function(record) {
            this.infoPanel.loadData(record);
            this.filesPanel.loadData(record.data);
            if (acl.isView('suppliers')) {
            	this.suppliersPanel.loadData(record.get('suppliers'));
            }
            if (acl.isView('orders', 'description')) {
            	this.descriptionPanel.update(record.get('description'));
            }
            this.notesPanel.store.setBaseParam('orderId', record.get('id'));
            this.notesPanel.store.load();
        }, this);
        
		PMS.Orders.Layout.superclass.initComponent.apply(this, arguments);
	}
});

Ext.reg('PMS.Orders.Layout', PMS.Orders.Layout);