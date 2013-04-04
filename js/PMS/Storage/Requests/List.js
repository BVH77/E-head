Ext.ns('PMS.Storage.Requests');

PMS.Storage.Requests.List = Ext.extend(Ext.grid.GridPanel, {

    title:      'Заявки на снабжение',
    
    listURL:    link('storage', 'requests', 'get-list'),
    
    addURL:     link('storage', 'requests', 'add'),
    
    updateURL:  link('storage', 'requests', 'update'),
    
    deleteURL:  link('storage', 'requests', 'delete'),
    
    loadMask: true,

    permissions: acl.isView('storage'),
    
    viewConfig: {
        
        getRowClass: function (record) {
            
            if (record.get('processed') > 0) { 
                return 'x-row-success';
            }
            
            if (record.get('out_of_stock') > 0) { 
                return 'x-row-error';
            }
            
            if (record.get('request_on') < new Date()) { 
                return 'x-row-expired';
            }
        }
        
    },
    
    initComponent: function() {
        
        this.autoExpandColumn = Ext.id();
        
        this.ds = new Ext.data.JsonStore({
            url: this.listURL,
            autoLoad: true,
            remoteSort: true,
            root: 'data',
            id: 'id',
            sortInfo: {
                field: 'request_on',
                direction: 'ASC'
            },
            totalProperty: 'totalCount',
            fields: ['account_name', 'name', 'measure', 'description', 
                {name: 'id', type: 'int'},
                {name: 'asset_id', type: 'int'},
                {name: 'order_id', type: 'int'},
                {name: 'processed', type: 'int'},
                {name: 'out_of_stock', type: 'int'},
                {name: 'qty', type: 'int'},
                {name: 'request_on', type: 'date', dateFormat: xlib.date.DATE_FORMAT_SERVER},
                {
                    name: 'created', 
                    type: 'date', 
                    dateFormat: xlib.date.DATE_TIME_FORMAT_SERVER,
                    convert: function(v, record) {
                        return Ext.util.Format.date(
                            Date.parseDate(v, xlib.date.DATE_TIME_FORMAT_SERVER), 
                            xlib.date.DATE_TIME_FORMAT
                        );
                    }
                }
            ]
        });
        
        this.sm = new Ext.grid.RowSelectionModel();
        
        var actions = new xlib.grid.Actions({
            autoWidth: true,
            items: [{
                text: 'Смотреть',
                iconCls: 'details',
                handler: this.onView,
                scope: this
            }, function (g, rowIndex, e) {
                
                var record = g.getStore().getAt(rowIndex);
                
                return !g.isLocked(record) ? {
                        text: 'Редактировать',
                        iconCls: 'edit',
                        hidden: !g.permissions,
                        handler: g.onUpdate,
                        scope: g
                    } : false;
                    
            }, function (g, rowIndex, e) {
                
                var record = g.getStore().getAt(rowIndex);
                
                return !g.isLocked(record) ? {
                        text: 'Удалить',
                        iconCls: 'delete',
                        hidden: !g.permissions,
                        handler: g.onDelete,
                        scope: g
                    } : false;
            }],
            scope: this
        });
        
        this.columns = [{
            header: 'Заявка на дату',
            dataIndex: 'request_on',
            renderer: xlib.dateRenderer(xlib.date.DATE_FORMAT),
            sortable: true,
            width: 100
        }, {
            header: 'Наименование',
            dataIndex: 'name',
            sortable: true,
            id: this.autoExpandColumn
        }, {
            header: 'Количество',
            dataIndex: 'qty',
            sortable: true,
            width: 100
        }, {
            header: 'Ед. измерения',
            dataIndex: 'measure',
            sortable: true,
            width: 100
        }, {
            header: 'Автор заявки',
            dataIndex: 'account_name',
            sortable: true,
            width: 150
        }, {
            header: 'Дата подачи',
            dataIndex: 'created',
            sortable: true,
            width: 150
        }, {
            header: 'К заказу №',
            dataIndex: 'order_id',
            sortable: true,
            width: 80
        }];
        
        this.filtersPlugin = new Ext.grid.GridFilters({
            filters: [{type: 'string',  dataIndex: 'name'}]
        });
        
        this.plugins = [actions, this.filtersPlugin];

        this.tbar = new Ext.Toolbar({
            items: [new Ext.Toolbar.Button({
                text: 'Добавить заявку',
                iconCls: 'add',
                hidden: !this.permissions,
                tooltip: 'Добавить заявку',
                handler: this.onAdd,
                scope: this
            }), ' ', this.filtersPlugin.getSearchField({width: 400}), ' '
            ],
            plugins: [new xlib.Legend.Plugin({
                items: [{
                    color: '#99FF99',
                    text: 'Обработано'
                }, {
                    color: '#FFFF99',
                    text: 'Просрочено'
                }, {
                    color: '#FF9999',
                    text: 'Отсутствует на складе'
                }]
            })],
            scope: this
        });
        
        this.bbar = new xlib.PagingToolbar({
            plugins: [this.filtersPlugin],
            store: this.ds
        });
        
        PMS.Storage.Requests.List.superclass.initComponent.apply(this, arguments);
        
        this.on('rowdblclick', this.onView, this);
    },
    
    onView: function(g, rowIndex) {
        var formPanel = new PMS.Storage.Requests.Form({readOnly: true}),
            record = g.getStore().getAt(rowIndex),
            w = this.getWindow(formPanel, this.updateURL, this.getStore(), record.get('id'));
        w.show();
        formPanel.getForm().loadRecord(record);
    },
    
    onAdd: function(b, e) {
        
        if (!this.permissions) {
            return;
        }
        var formPanel = new PMS.Storage.Requests.Form(),
            w = this.getWindow(formPanel, this.addURL, this.getStore(), false);
        w.show();
    },
    
    onUpdate: function(g, rowIndex) {
        
        if (!this.permissions) {
            return;
        }
        var formPanel = new PMS.Storage.Requests.Form(),
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
    
    // Private functions 
    
    isLocked: function(record) {
        return (record.get('processed') > 0) || (record.get('order_id') > 0);
    },
    
    getWindow: function(formPanel, url, store, id) {
       
        var buttons = [], record;
        
        if (id > 0) {
            record = store.getById(id);
        }
        
        if (record != undefined 
        && !(record.get('processed') > 0) 
        && !(record.get('out_of_stock') > 0) 
        && formPanel.readOnly) {
            
            buttons.push({
                text: 'Обработать заявку',
                handler: function() {
                    
                    formPanel.on('processed', function() {
                        w.close();
                        store.reload();
                    });
                    
                    formPanel.onProcess();
                }
            });
            
        }
        
        if (record != undefined && this.isLocked(record) || formPanel.readOnly) {
            
            buttons.push({
                text: 'Закрыть',
                handler: function() {
                    w.close();
                }
            });
            
            formPanel.setReadOnly();
            
        } else {
            
            buttons.push({
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
            });
            
            buttons.push({
                text: 'Отмена',
                handler: function() {
                    w.close();
                }
            });
        }
         
        var w = new Ext.Window({
            title: 'Заявка на ТМЦ',
            resizable: false,
            width: 500,
            modal: true,
            items: [formPanel],
            buttons: buttons
        });
        
        return w;
    }
});

Ext.reg('PMS.Storage.Requests.List', PMS.Storage.Requests.List);