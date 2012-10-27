Ext.ns('PMS.Orders.Payments');

PMS.Orders.Payments.List = Ext.extend(Ext.grid.GridPanel, {

    title:      'Платежи',
    
    listURL:    link('orders', 'payments', 'get-list'),
    
    addURL:     link('orders', 'payments', 'add'),
    
    updateURL:  link('orders', 'payments', 'update'),
    
    deleteURL:  link('orders', 'payments', 'delete'),
    
    orderId: null,
    
    border: false,
    
    loadMask: true,
    
    permissions: acl.isView('orders', 'payments'),
    
    viewConfig: {
        
        getRowClass: function (record) {
            
            var s = parseInt(record.get('status')),
                date = new Date(record.get('date')),
                today = (new Date()).clearTime(); 
            
            if (date < today && s != 1) {
                s = 3;
            }
                
            switch(s) {
                case 0: return 'x-row-waiting';
                case 1: return 'x-row-payed';
                case 2: return 'x-row-confirmwaiting';
                case 3: return 'x-row-paymentdelayed';
            }
        }
    },
    
    initComponent: function() {
        
        if (!this.orderId) {
            throw 'orderId not specified!';
        }
        
        this.autoExpandColumn = Ext.id();
        
        this.ds = new Ext.data.JsonStore({
            url: this.listURL,
            remoteSort: true,
            root: 'data',
            id: 'id',
            sortInfo: {
                field: 'date',
                direction: 'ASC'
            },
            baseParams: {
                'filter[0][field]': 'order_id',
                'filter[0][data][type]': 'string',
                'filter[0][data][value]': this.orderId
            },
            totalProperty: 'totalCount',
            fields: [
                {name: 'id', type: 'int'},
                {name: 'order_id', type: 'int'},
                'summ', 
                {name: 'status', type: 'int'},
                {name: 'date', type: 'date', dateFormat: xlib.date.DATE_FORMAT_SERVER}
            ]
        });
        
        this.sm = new Ext.grid.RowSelectionModel();
        
        this.statuses = new PMS.Orders.Payments.Status();
        
        this.columns = [{
            header: 'Дата',
            dataIndex: 'date',
            renderer: xlib.dateRenderer(xlib.date.DATE_FORMAT),
            sortable: false,
            width: 120
        }, {
            header: 'Сумма',
            dataIndex: 'summ',
            sortable: false,
            width: 150,
            align: 'right',
            renderer: function(v) {
                return parseFloat(v).toFixed(2) + ' р.';
            }
        }, {
            dataIndex: '',
            sortable: false,
            id: this.autoExpandColumn
        }];
        
        this.plugins = [new xlib.grid.Actions({
            autoWidth: true,
            items: [function (g, rowIndex, e) {
                return {
                    text: 'Редактировать',
                    iconCls: 'edit',
                    hidden: !g.permissions,
                    handler: g.onUpdate,
                    scope: g
                };
            }, function (g, rowIndex, e) {
                return {
                    text: 'Удалить',
                    iconCls: 'delete',
                    hidden: !g.permissions,
                    handler: g.onDelete,
                    scope: g
                };
            }],
            scope: this
        })];

        this.tbar = new Ext.Toolbar({
            items: [new Ext.Toolbar.Button({
                iconCls: 'x-tbar-loading',
                tooltip: 'Обновить',
                handler: function() {
                    this.getStore().reload();
                },
                scope: this
            }), new Ext.Toolbar.Button({
                text: 'Добавить',
                iconCls: 'add',
                hidden: !this.permissions,
                tooltip: 'Добавить',
                handler: this.onAdd,
                scope: this
            })],
            plugins: [new xlib.Legend.Plugin({
                items: [{
                    color: '#99CC00',
                    text: 'Оплачено'
                }, {
                    color: '#FFFF80',
                    text: 'Ожидается'
                }, {
                    color: '#FF8080',
                    text: 'Задерживается'
                }]
            })],
            scope: this
        });
        
        PMS.Orders.Payments.List.superclass.initComponent.apply(this, arguments);
    },
    
    onAdd: function(b, e) {
        
        if (!this.permissions) {
            return;
        }
        
        var formPanel = new PMS.Orders.Payments.Form({orderId: this.orderId}),
            w = this.getWindow(formPanel, this.addURL, this.getStore(), false);
        w.show();
    },
    
    onUpdate: function(g, rowIndex) {
        
        if (!this.permissions) {
            return;
        }
        var formPanel = new PMS.Orders.Payments.Form({orderId: this.orderId}),
            record = g.getStore().getAt(rowIndex),
            w = this.getWindow(formPanel, this.updateURL, this.getStore(), record.get('id'));
        w.show();
        formPanel.getForm().loadRecord(record);
    },
    
    onDelete: function(g, rowIndex) {
        var record = g.getStore().getAt(rowIndex);
        xlib.Msg.confirm('Вы уверены?', function() {
            Ext.Ajax.request({
                url: this.deleteURL,
                params: {
                    id: record.get('id')
                },
                callback: function (options, success, response) {
                    var res = xlib.decode(response.responseText);
                    if (true == success && res && true == res.success) {
                        g.getStore().reload();
                        return;
                    }
                    xlib.Msg.error('Ошибка при удалении.');
                },
                scope: this
            });    
        }, this);
    },
    
    getWindow: function(formPanel, url, store, id) {

        var w = new Ext.Window({
            title: 'Платёж',
            resizable: false,
            width: 250,
            modal: true,
            items: [formPanel],
            buttons: [{
                text: 'Сохранить',
                handler: function() {
                    formPanel.getForm().submit({
                        params: !id ? {} : {id: id},
                        url: url,
                        success: function(form, options) {
                            var o = options.result;
                            if (true == o.success) {
                                w.close();
                                store.reload();
                                return;
                            }
                            xlib.Msg.error('Не удалось сохранить.')
                        },
                        failure: function() {
                            xlib.Msg.error('Не удалось сохранить.')
                        }
                    });
                }
            }, {
                text: 'Отмена',
                handler: function() {
                    w.close();
                }
            }]
        });
        
        return w;
    }
});

Ext.reg('PMS.Orders.Payments.List', PMS.Orders.Payments.List);