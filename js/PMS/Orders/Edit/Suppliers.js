Ext.ns('PMS.Orders.Edit');

PMS.Orders.Edit.Suppliers = Ext.extend(Ext.grid.EditorGridPanel, {
	
	loadURL: link('orders', 'index', 'get-suppliers'),
    
	attachURL: link('orders', 'index', 'attach-supplier'),
    
    removeURL: link('orders', 'index', 'remove-supplier'),
    
    updateURL: link('orders', 'index', 'update-supplier'),
    
    checkURL: link('orders', 'index', 'check-supplier'),
    
    loadMask: {msg: 'Загрузка...'},
    
    title: 'Поставщики',
    
    orderId: null,
    
    autoScroll: true,
    
    autoHeight: true,
    
    border: false,
    
    stripeRows: true,
    
    layout: 'fit',
    
    initComponent: function() {
        
        var success = new xlib.grid.CheckColumn({
            header: 'Выпонено',
            width: 65,
            dataIndex: 'success',
            disabled: !acl.isUpdate('suppliers'),
            getQtip: function(record) {
                var dt = record.get('date');
                dt = Ext.isDate(dt) ? dt.format('l, d-m-Y') : '';
                return !record.get('success') ? null : dt;
            }
        });
        
        this.autoExpandColumn = Ext.id();
        
        this.cm = new Ext.grid.ColumnModel([success, {
            header: 'Название',
            width: 200,
            dataIndex: 'name',
        	renderer: function(v, md, r) {
        		return '<span qtip="' + r.get('description') + '">' + v + '</span>';
        	}
        }, {
            header: 'Сотимость',
            dataIndex: 'cost',
            renderer: function(v) {
                return v == 0 ? '' : v;  
            },
            width: 80,
            editor: acl.isUpdate('suppliers') ? new Ext.form.NumberField() : ''
        }, {
        	id: this.autoExpandColumn, 
        	header: 'Примечание',
        	dataIndex: 'note',
        	editor: acl.isUpdate('suppliers') ? new Ext.form.TextField() : ''
        }]);
        
        this.cm.defaultSortable = true; 

        this.sm = new Ext.grid.RowSelectionModel({singleSelect: true});

        this.ds = new Ext.data.JsonStore({
            url: this.loadURL,
            baseParams: {
                orderId: this.orderId
            },
	        root: 'suppliers',
	        fields: [
	            {name: 'id', type: 'int'},
                {name: 'success', type: 'int'},
                {name: 'name'},
                {name: 'description'},
                {name: 'date', type: 'date', dateFormat: xlib.date.DATE_FORMAT_SERVER},
                {name: 'cost', type: 'int'},
                {name: 'note'}
	        ]
	    });
        
        this.plugins = [success];
        
        if (acl.isUpdate('suppliers')) {

            var actionsPlugin = new xlib.grid.Actions({
    	        autoWidth: true,
    	        items: [{
                    text: 'Отсоединить',
                    iconCls: 'delete',
                    handler: this.onRemove,
                    scope: this,
                    hidden: !acl.isDelete('suppliers')
                }]
    	    });
            
            this.plugins.push(actionsPlugin);
            
            this.tbar = ['->', {
            	text: 'Присоединить',
            	iconCls: 'add',
            	handler: this.onAttach,
                scope: this,
                hidden: !acl.isAdd('suppliers')
            }];
	    
            this.on({
                afteredit: function(params) {
                    switch (params.field) {
                        case 'success':
                            this.onCheck(params.record);
                            break;
                        default:
                            this.onUpdate(params.record);
                            break;
                    }
                },
                scope: this
            });
        }
        
        PMS.Orders.Edit.Suppliers.superclass.initComponent.apply(this, arguments);
    },
    
    onCheck: function(record) {
        this.el.mask('Запись...');
        Ext.Ajax.request({
           url: this.checkURL,
           params: { 
                id: record.get('id'),
                success: record.get('success')
           },
           success: function(res) {
                var errors = Ext.decode(res.responseText).errors;
                if (errors) {
                    xlib.Msg.error(errors[0].msg);
                    record.reject();
                    this.el.unmask();
                    return;
                }
                record.set('date', new Date());
                record.commit();
                this.el.unmask();
            },
            failure: function() {
                xlib.Msg.error('Ошибка связи с сервером.');
                record.reject();
                this.el.unmask();
            },
            scope: this
        });
    },

    onUpdate: function(record) {
        this.el.mask('Запись...');
        Ext.Ajax.request({
           url: this.updateURL,
           params: { 
                id: record.get('id'),
                cost: record.get('cost'),
                note: record.get('note')
           },
           success: function(res) {
                var errors = Ext.decode(res.responseText).errors;
                if (errors) {
                    xlib.Msg.error(errors[0].msg);
                    record.reject();
                    this.el.unmask();
                    return;
                }
                record.commit();
                this.el.unmask();
            },
            failure: function() {
                xlib.Msg.error('Ошибка связи с сервером.');
                record.reject();
                this.el.unmask();
            },
            scope: this
        });
    },
    
    onAttach: function(g, rowIndex) {
        
        var scope = this;
        
        var onRowdblclick = function(g, rowIndex) {
            g.el.mask('Запись...');
            Ext.Ajax.request({
                url: scope.attachURL,
                params: {
                    supplier_id: g.getStore().getAt(rowIndex).get('id'), 
                    order_id: scope.orderId
                },
                success: function(res) {
                    var errors = Ext.decode(res.responseText).errors;
                    if (errors) {
                        xlib.Msg.error(errors[0].msg);
                        g.el.unmask();
                        return;
                    }
                    g.el.unmask();
                    wind.close();
                    scope.getStore().load();
                },
                failure: function() {
                    g.el.unmask();
                    xlib.Msg.error('Ошибка связи с сервером.');
                }
            });
        };
        
        var itemsList = new PMS.ContragentsListAbstract({
            entity: 'suppliers',
            onRowdblclick: onRowdblclick,
            actions: [{
                text: 'Присоединить',
                iconCls: 'add',
                handler: onRowdblclick.createDelegate(this)
            }, '-']
        });
        
        var wind = new Ext.Window({
            title: 'Присоединить',
            width: 800,
            height: 300,
            layout: 'fit',
            resizable: false,
            modal: true,
            items: [itemsList]
        });
        wind.show();
        
        itemsList.getStore().load();
	},
    
    onRemove: function(g, rowIndex) {
        Ext.Msg.show({
            title: 'Подтверждение',
            msg: 'Вы уверены?',
            icon: Ext.MessageBox.QUESTION,
            buttons: Ext.Msg.YESNO,
            fn: function(b) {
                if ('yes' == b) {
                    this.el.mask('Запись...');
                    Ext.Ajax.request({
                        url: this.removeURL,
                        params: {
                            id: g.getStore().getAt(rowIndex).get('id')
                        },
                        success: function(res){
                            var errors = Ext.decode(res.responseText).errors;
                            if (errors) {
                                xlib.Msg.error(errors[0].msg);
                                this.el.unmask();
                                return;
                            }
                            this.el.unmask();
                            g.getStore().load();
                        },
                        failure: function() {
                            xlib.Msg.error('Ошибка связи с сервером.');
                            this.el.unmask();
                        },
                        scope: this
                    });
                }
            },
            scope: this
        });
    },
    
    loadData: function(data) {
        this.getStore().loadData(data);
    }
});