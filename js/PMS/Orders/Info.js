Ext.ns('PMS.Orders');

PMS.Orders.Info = Ext.extend(Ext.grid.GridPanel, {

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
            width: 140
        }, {
        	id: this.autoExpandColumn,
	        dataIndex: 'value'
        }];
		
		this.plugins = [new Ext.ux.DataTip({
			trackMouse: true,
			maxWidth: 250,
			tpl: '{value}'
		})];
		
        PMS.Orders.Info.superclass.initComponent.apply(this, arguments);
    },
    
    loadData: function(record) {
    	var dateFormt = function(v) {
    		return Ext.isDate(v) ? v.format(xlib.date.DATE_FORMAT) : '';
    	}
    	var data = [
            ['№', record.get('id')],
            ['Добавлено', dateFormt(record.get('created')) + ', ' + record.get('creator_name')]
        ];
    	if (acl.isView('customers')) {
    		data.push(['Заказчик', record.get('customer_name')]);
    	}
    	if (acl.isView('orders', 'address')) {
	        data.push(['Адрес', record.get('address')]);
    	}
    	if (acl.isView('orders', 'production', 'start_planned') && !!+(record.get('production'))) {
	        data.push(['Начало пр-ва (план)', dateFormt(record.get('production_start_planned'))]);
    	}
    	if (acl.isView('orders', 'production', 'start_fact') && !!+(record.get('production'))) {
	        data.push(['Начало пр-ва (факт)', dateFormt(record.get('production_start_fact'))]);
    	}
    	if (acl.isView('orders', 'production', 'end_planned') && !!+(record.get('production'))) {
	        data.push(['Конец пр-ва (план)', dateFormt(record.get('production_end_planned'))]);
    	}
    	if (acl.isView('orders', 'production', 'end_fact') && !!+(record.get('production'))) {
	        data.push(['Конец пр-ва (факт)', dateFormt(record.get('production_end_fact'))]);
    	}
    	if (acl.isView('orders', 'mount', 'start_planned') && !!+(record.get('mount'))) {
	        data.push(['Начало монтажа (план)', dateFormt(record.get('mount_start_planned'))]);
    	}
    	if (acl.isView('orders', 'mount', 'start_fact') && !!+(record.get('mount'))) {
	        data.push(['Начало монтажа (факт)', dateFormt(record.get('mount_start_fact'))]);
    	}
    	if (acl.isView('orders', 'mount', 'end_planned') && !!+(record.get('mount'))) {
	        data.push(['Конец монтажа (план)', dateFormt(record.get('mount_end_planned'))]);
    	}
    	if (acl.isView('orders', 'mount', 'end_fact') && !!+(record.get('mount'))) {
	        data.push(['Конец монтажа (факт)', dateFormt(record.get('mount_end_fact'))]);
    	}
    	if (acl.isView('orders', 'success', 'planned')) {
	        data.push(['Сдача (план)', dateFormt(record.get('success_date_planned'))]);
    	}
    	if (acl.isView('orders', 'success', 'fact')) {
	        data.push(['Сдача (факт)', dateFormt(record.get('success_date_fact'))]);
        }
        if (acl.isView('orders', 'cost')) {
        	data.push(['Стоимость', record.get('cost')]);
        	data.push(['Аванс', record.get('advanse')]);
        }
        if (acl.isView('orders', 'description')) {
        	data.push(['Описание', record.get('description')]);
        }
        if (acl.isView('suppliers')) {
        	data.push(['<b>Поставщики:</b>']);
        	Ext.each(record.get('suppliers'), function(item) {
        		data.push([item.name, acl.isView('orders', 'cost') ? item.cost : '']);
        	});
        }
        
        this.store.loadData(data);
    }
});