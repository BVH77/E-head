Ext.ns('PMS.Orders');

PMS.Orders.Archive = Ext.extend(Ext.grid.GridPanel, {
    
    loadLink: link('orders', 'index', 'get-archive-list'),
    
    unArchiveURL: link('orders', 'index', 'un-archive'),

    loadMask: {msg: 'Загрузка...'},
    
    title: 'Архив заказов',
	
    autoScroll: true,
    
    monitorResize: true,
    
    autoLoadData: true,
    
    stripeRows: true,
    
    initComponent: function() {
        
        this.autoExpandColumn = Ext.id();
        
        this.sm = new Ext.grid.RowSelectionModel({singleSelect:true});
        
        this.ds = new Ext.data.JsonStore({
            baseParams: {Xfilter: 0},
            timeout: 300,
	        url: this.loadLink,
	        autoLoad: this.autoLoadData,
	        root: 'data',
	        totalProperty: 'totalCount',
	        remoteSort: true,
	        sortInfo: {field: 'success_date_fact', direction: 'ASC'},
	        fields: [
	            {name: 'id'},
	            {name: 'customer'},
	            {name: 'address'},
	            {name: 'description'},
	            {name: 'mount'},
	            {name: 'production'},
	            {name: 'production_start_planned', type: 'date', dateFormat: OSDN.date.DATE_FORMAT_SERVER},
	            {name: 'production_start_fact', type: 'date', dateFormat: OSDN.date.DATE_FORMAT_SERVER},
	            {name: 'production_end_planned', type: 'date', dateFormat: OSDN.date.DATE_FORMAT_SERVER},
	            {name: 'production_end_fact', type: 'date', dateFormat: OSDN.date.DATE_FORMAT_SERVER},
	            {name: 'mount_start_planned', type: 'date', dateFormat: OSDN.date.DATE_FORMAT_SERVER},
	            {name: 'mount_start_fact', type: 'date', dateFormat: OSDN.date.DATE_FORMAT_SERVER},
	            {name: 'mount_end_planned', type: 'date', dateFormat: OSDN.date.DATE_FORMAT_SERVER},
	            {name: 'mount_end_fact', type: 'date', dateFormat: OSDN.date.DATE_FORMAT_SERVER},
	            {name: 'success_date_planned', type: 'date', dateFormat: OSDN.date.DATE_FORMAT_SERVER},
	            {name: 'success_date_fact', type: 'date', dateFormat: OSDN.date.DATE_FORMAT_SERVER},
	            {name: 'cost'},
	            {name: 'advanse'},
	            {name: 'created', type: 'date', dateFormat: OSDN.date.DATE_TIME_FORMAT_SERVER},
	            {name: 'creator_id'},
	            {name: 'creator_name'},
	            {name: 'suppliers'},
	            {name: 'subcontractors'},
	            {name: 'photos'},
	            {name: 'files'}
	        ]
	    });
        
        var onView = function(g, rowIndex) {
            var record = g.getStore().getAt(rowIndex);
            if (record) {
                var editForm = new PMS.Orders.Edit({
                    record: record,
                    permissions: false
                }).showInWindow();
            }
        };
        
        var onSuccess = function(res) {
            var errors = Ext.decode(res.responseText).errors;
            if (errors) {
                OSDN.Msg.error(errors[0].msg);
                return;
            }
            this.getStore().reload();
        };
        
        var onDelete = function(g, rowIndex) {
            Ext.Msg.show({
                title: 'Подтверждение',
                msg: 'Вы уверены?',
                buttons: Ext.Msg.YESNO,
                fn: function(b) {
                    if ('yes' == b) {
                        Ext.Ajax.request({
                            url: link('orders', 'index', 'delete'),
                            success: onSuccess,
                            failure: Ext.emptyFn(),
                            params: {id: g.getStore().getAt(rowIndex).get('id')},
                            scope: this
                        });
                    }
                },
                scope: this,
                icon: Ext.MessageBox.QUESTION
            });
        };
        
        var unArchive = function(g, rowIndex) {
            Ext.Msg.show({
                title: 'Подтверждение',
                msg: 'Вы уверены?',
                buttons: Ext.Msg.YESNO,
                fn: function(b) {
                    if ('yes' == b) {
                        Ext.Ajax.request({
                            url: this.unArchiveURL,
                            success: onSuccess,
                            failure: Ext.emptyFn(),
                            params: {id: g.getStore().getAt(rowIndex).get('id')},
                            scope: this
                        });
                    }
                },
                scope: this,
                icon: Ext.MessageBox.QUESTION
            });
        };
        
	    this.filtersPlugin = new OSDN.grid.plugin.Filter({
	        filters: [
	            {type: 'string',  dataIndex: 'customer'},
	            {type: 'string',  dataIndex: 'address'},
    	        {type: 'date',  dataIndex: 'success_date_fact', dateFormat: 'Y-m-d'}
	    ]});
        
	    var actionsPlugin = new OSDN.grid.Actions({
	        autoWidth: true,
	        items: [{
                text: 'Просмотреть',
                iconCls: 'edit',
                handler: onView,
                scope: this
        	}, {
                text: 'Извлечь из архива',
                iconCls: 'settings',
                handler: unArchive,
                scope: this,
				hidden: !acl.isUpdate('archive')
        	}, {
                text: 'Удалить',
                iconCls: 'delete',
                handler: onDelete,
				hidden: !acl.isDelete('archive')
            }]
	    });
        
        this.plugins = [this.filtersPlugin, actionsPlugin];
        
        this.tbar = new Ext.Toolbar({
            items: [this.filtersPlugin.getSearchField({width:500})],
            scope: this
        });
        
        this.bbar = new OSDN.PagingToolbar({
            plugins: [this.filtersPlugin],
            store: this.ds
        });
        
		this.columns = [{
            header: '№', 
            dataIndex: 'id',
            width: 40,
            sortable: true
        }, {
            header: 'Заказчик', 
            id: this.autoExpandColumn,
            dataIndex: 'customer',
            sortable: true
        }, {
            header: 'Адрес', 
            dataIndex: 'address',
            width: 180,
            sortable: true
        }, {
            header: 'Сдача (факт)',
            dataIndex: 'success_date_fact',
            renderer: OSDN.util.Format.dateRenderer(OSDN.date.DATE_FORMAT),
            width: 90,
            sortable: true
        }];
        
        PMS.Orders.Archive.superclass.initComponent.apply(this, arguments);
        
        this.on('rowdblclick', onView, this);
        
		this.getStore().on('load', function() {
			this.getSelectionModel().selectFirstRow();
	    }, this);
    }
});

Ext.reg('PMS.Orders.Archive', PMS.Orders.Archive);