Ext.ns('PMS.Orders');

PMS.Orders.Layout = Ext.extend(Ext.Panel, {
	
	title: 'Заказы',
	
    border: false,
    
    layout: 'border',
	
    defaults: {
        split: true
    },
    
	initComponent: function() {

		this.infoPanel = new PMS.Orders.Info({
            region: 'center'
        });
        
        this.photosPanel = new PMS.Orders.Photos({
            region: 'south',
            height: 200,
            cls: 'x-border-top'
        });
        
		this.listPanel = new PMS.Orders.List({
            region: 'center',
            minWidth: 600,
            width: 600,
            border: false,
            cls: 'x-border-right'
		});
		
	    this.items = [this.listPanel, {	
            title: 'Детали',
            layout: 'border',
            width: 450,
			region: 'east',
            border: false,
            cls: 'x-border-left',
            defaults: {
                border: false
            },
            items: [this.infoPanel, this.photosPanel]
        }];
        
        this.listPanel.on('orderselect', function(record) {
            this.infoPanel.loadData(record);
            this.photosPanel.loadData(record.data);
        }, this);
        
		PMS.Orders.Layout.superclass.initComponent.apply(this, arguments);
	}
});

Ext.reg('PMS.Orders.Layout', PMS.Orders.Layout);