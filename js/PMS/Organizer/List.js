Ext.ns('PMS.Organizer');

PMS.Organizer.List = Ext.extend(Ext.grid.GridPanel, {

    title:      'Задачи',
    
    listURL:    link('organizer', 'index', 'get-list'),
    
    getURL:     link('organizer', 'index', 'get'),
    
    addURL:     link('organizer', 'index', 'add'),
    
    updateURL:  link('organizer', 'index', 'update'),
    
    deleteURL:  link('organizer', 'index', 'delete'),
    
    closeTaskURL: link('organizer', 'index', 'close-task'),
    
    loadMask: true,

    permissions: true,
    
    viewConfig: {
        
        getRowClass: function (record) {
            
            if (!Ext.isEmpty(record.get('closed'))) { 
                return 'x-row-closed';
            }
        }
        
    },
    
    initComponent: function() {
        
        this.autoExpandColumn = Ext.id();
        
        this.ds = new Ext.data.JsonStore({
            url: this.listURL,
            autoLoad: true,
            root: 'data',
            id: 'id',
            totalProperty: 'totalCount',
            fields: ['text', 'account_name',
                {name: 'id', type: 'int'},
                {name: 'ondate', type: 'date', dateFormat: xlib.date.DATE_FORMAT_SERVER},
                {name: 'ontime', type: 'date', dateFormat: xlib.date.TIME_FORMAT},
                {name: 'account_id', type: 'int'},
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
                },
                {
                    name: 'closed', 
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
            items: [function (g, rowIndex, e) {
                
                var record = g.getStore().getAt(rowIndex);
                
                return Ext.isEmpty(record.get('closed')) ? {
                        text: 'Выполнено',
                        iconCls: 'check',
                        hidden: !g.permissions,
                        handler: g.onCloseTask,
                        scope: g
                    } : false;
                    
            }, function (g, rowIndex, e) {
                
                var record = g.getStore().getAt(rowIndex);
                
                return Ext.isEmpty(record.get('closed')) ? {
                        text: 'Редактировать',
                        iconCls: 'edit',
                        hidden: !g.permissions,
                        handler: g.onUpdate,
                        scope: g
                    } : false;
                    
            }, {
                text: 'Удалить',
                iconCls: 'delete',
                handler: this.onDelete,
                scope: this
            }],
            scope: this
        });
        
        this.columns = [{
            header: 'Дата/время',
            dataIndex: 'ondate',
            renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                var date = record.get('ondate');
                var time = record.get('ontime');
                var out = date.format(xlib.date.DATE_FORMAT) 
                    + ' ' + time.format(xlib.date.TIME_WITHOUT_SECONDS_FORMAT);
                return out;
            },
            width: 100
        }, {
            header: 'Текст',
            dataIndex: 'text',
            id: this.autoExpandColumn
        }, {
            header: 'Исполнитель',
            dataIndex: 'account_name',
            hidden: !acl.isView('admin'),
            width: 150
        }, {
            header: 'Создана',
            dataIndex: 'created',
            width: 150
        }, {
            header: 'Закрыта',
            dataIndex: 'closed',
            width: 150
        }];
        
        this.filtersPlugin = new Ext.grid.GridFilters({
            filters: [{type: 'string',  dataIndex: 'text'}]
        });
        
        this.plugins = [actions, this.filtersPlugin];

        this.tbar = new Ext.Toolbar({
            items: [new Ext.Toolbar.Button({
                text: 'Добавить задачу',
                iconCls: 'add',
                hidden: !acl.isUpdate('organizer'),
                tooltip: 'Добавить задачу',
                handler: this.onAdd,
                scope: this
            }), ' ', this.filtersPlugin.getSearchField({width: 400}), ' '
            ],
            scope: this
        });
        
        this.bbar = new xlib.PagingToolbar({
            plugins: [this.filtersPlugin],
            store: this.ds
        });
        
        PMS.Organizer.List.superclass.initComponent.apply(this, arguments);
    },
    
    onAdd: function(b, e) {
    	
        var formPanel = new PMS.Organizer.Form(),
            w = this.getWindow(formPanel, this.addURL, this.getStore(), false);
        w.show();
    },
    
    onCloseTask: function(g, rowIndex) {
    	
        var record = g.getStore().getAt(rowIndex);
        
        Ext.Ajax.request({
            url: this.closeTaskURL,
            params: {
                id: record.get('id')
            },
            callback: function (options, success, response) {
                var res = xlib.decode(response.responseText);
                if (true == success && res && true == res.success) {
                    g.getStore().reload();
                    return;
                }
                xlib.Msg.error('Ошибка при закрытии задачи.');
            },
            scope: this
        });
    },
    
    onUpdate: function(g, rowIndex) {
        var formPanel = new PMS.Organizer.Form(),
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
    
    getWindow: function(formPanel, url, store, id) {
         
        var w = new Ext.Window({
            title: 'Новая задача',
            resizable: false,
            width: 500,
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

Ext.reg('PMS.Organizer.List', PMS.Organizer.List);