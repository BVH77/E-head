Ext.ns('PMS.Orders');

PMS.Orders.Suppliers = Ext.extend(Ext.grid.GridPanel, {

    layout: 'fit',
    
    hideHeaders: true,
    
    initComponent: function() {
	
		this.sm = new Ext.grid.RowSelectionModel({singleSelect:true});
		
		this.store = new Ext.data.ArrayStore({
			idProperty: 'name',
			idIndex: 0,
		    fields: ['name', 'value']
		});

		this.autoExpandColumn = Ext.id();
		
		this.columns = [{
            dataIndex: 'name',
        	id: this.autoExpandColumn
        }, {
	        dataIndex: 'value',
            width: 50
        }];
		
		this.plugins = [new Ext.ux.DataTip({
			trackMouse: true,
			maxWidth: 250,
			tpl: '{value}'
		})];
		
        PMS.Orders.Suppliers.superclass.initComponent.apply(this, arguments);
    },
    
    loadData: function(dataArray) {
        var data = [];
    	Ext.each(dataArray, function(item) {
    		data.push([item.name, acl.isView('orders', 'cost') ? item.cost : '']);
    	});
        this.store.loadData(data);
    }
});