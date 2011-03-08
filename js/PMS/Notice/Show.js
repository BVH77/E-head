Ext.ns('PMS.Notice');

PMS.Notice.Show = Ext.extend(Ext.Window, {

    title: 'Объявление',
    
    resizable: false,
    
    hidden: false,
    
    width: 800,
    
    height: 500,
    
    modal: true,
    
    layout: 'fit',
    
    defaults: {
        border: false,
        autoScroll: true,
        padding: '10'
    },
    
    autoScroll: true,
    
    initComponent: function() {
        
        this.buttons = [{
            text: 'ОK',
            handler: function() {
                this.close();
            },
            scope: this
        }]
        
        PMS.Notice.Show.superclass.initComponent.apply(this, arguments);
    }
    
});
/*    
        
        this.autoExpandColumn = Ext.id();
        
        this.ds = new Ext.data.JsonStore({
            url: this.listURL,
            autoLoad: true,
            remoteSort: true,
            root: 'data',
            id: 'id',
            sortInfo: {
                field: 'id',
                direction: 'DESC'
            },
            totalProperty: 'totalCount',
            fields: ['id', 'title', 'account_name', {
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
                text: 'Редактировать',
                iconCls: 'edit',
                hidden: !this.permissions,
                handler: this.onUpdate,
                scope: this
            }, {
                text: 'Удалить',
                iconCls: 'delete',
                hidden: !this.permissions,
                handler: this.onDelete,
                scope: this
            }],
            scope: this
        })
        
        this.columns = [{
            header: '№',
            dataIndex: 'id',
            sortable: true,
            width: 40
        }, {
            header: 'Название',
            dataIndex: 'title',
            sortable: true,
            id: this.autoExpandColumn
        }, {
            header: 'Кем добавлено',
            dataIndex: 'account_name',
            sortable: true,
            width: 150
        }, {
            header: 'Когда добавлено',
            dataIndex: 'created',
            sortable: true,
            width: 150
        }];
        
        this.filtersPlugin = new Ext.grid.GridFilters({
            filters: [
                {type: 'string',  dataIndex: 'title'},
                {type: 'string',  dataIndex: 'text'}
            ]
        });
        
        this.plugins = [actions, this.filtersPlugin];

        this.tbar = [new Ext.Toolbar.Button({
                text: 'Добавить объявление',
                iconCls: 'add',
                hidden: !this.permissions,
                tooltip: 'Добавить объявление',
                handler: this.onAdd,
                scope: this
            }), ' ', this.filtersPlugin.getSearchField({width: 400})
        ];
        
        this.bbar = new xlib.PagingToolbar({
            plugins: [this.filtersPlugin],
            store: this.ds
        });
        
        PMS.Notice.List.superclass.initComponent.apply(this, arguments);
    },
    
    onAdd: function(b, e) {
        this.getWindow(this.getNoticeForm(), this.addURL, this.getStore(), false);
    },
    
    onUpdate: function(g, rowIndex) {
        var formPanel = this.getNoticeForm();
        var record = g.getStore().getAt(rowIndex);
        var id = parseInt(record.get('id'));
        
        this.getWindow(formPanel, this.updateURL, this.getStore(), id);
        
        formPanel.getForm().load({
            url: this.itemURL,
            params: {
                id: id
            }
        });
    },
    
    onDelete: function(g, rowIndex) {
        var record = g.getStore().getAt(rowIndex);
        var id = parseInt(record.get('id'));
        xlib.Msg.confirm('Вы уверены?', function() {
            Ext.Ajax.request({
                url: this.deleteURL,
                params: {
                    id: id
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
            title: !id ? 'Новое объявление' : 'Объявление № ' + id,
            resizable: false,
            hidden: false,
            width: 800,
            height: 500,
            modal: true,
            items: [formPanel],
            buttons: [{
                text: 'Сохранить',
                hidden: !this.permissions,
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
    },
    
    getNoticeForm: function() {
        return new xlib.form.FormPanel({
            permissions: acl.isUpdate('notice'),
            labelWidth: 70,
            defaults: {
                disabledClass: ''
            },
            items: [{
                xtype: 'hidden',
                name: 'id'
            }, {
                xtype: 'textfield',
                fieldLabel: 'Название',
                name: 'title',
                allowBlank: false
            }, {
                xtype: 'textarea',
                hideLabel: true,
                name: 'title',
                anchor: '100%',
                height: 345,
                allowBlank: false
            }, {
                xtype: 'displayfield',
                fieldLabel: 'Автор',
                name: 'account_name',
                submitValue: false,
                value: xlib.username || ''
            }, {
                xtype: 'displayfield',
                fieldLabel: 'Дата',
                name: 'created',
                submitValue: false,
                value: (new Date()).format(xlib.date.DATE_TIME_FORMAT)
            }]
        });
    }
    
});

Ext.reg('PMS.Notice.List', PMS.Notice.List);
*/