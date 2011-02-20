Ext.ns('PMS.Storage.Requests');

PMS.Storage.Requests.List = Ext.extend(Ext.grid.GridPanel, {

    title:      'Заявки на снабжение',
    
    listURL:    link('storage', 'requests', 'get-list'),
    
    addURL:     link('storage', 'requests', 'add'),
    
    updateURL:  link('storage', 'requests', 'update'),
    
    deleteURL:  link('storage', 'requests', 'delete'),
    
    loadMask: true,

    permissions: acl.isUpdate('storage'),
    
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
            fields: ['id', 'asset_id', 'account_name', 'name', 'measure', 'qty', 
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
            header: 'Заказ на дату',
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
            header: 'Кем подана заявка',
            dataIndex: 'account_name',
            sortable: true,
            width: 150
        }, {
            header: 'Дата подачи',
            dataIndex: 'created',
            //renderer: xlib.dateRenderer(xlib.date.DATE_TIME_FORMAT),
            sortable: true,
            width: 150
        }];
        
        this.filtersPlugin = new Ext.grid.GridFilters({
            filters: [{type: 'string',  dataIndex: 'name'}]
        });
        
        this.plugins = [actions, this.filtersPlugin];

        this.tbar = [new Ext.Toolbar.Button({
                text: 'Добавить заявку',
                iconCls: 'add',
                hidden: !this.permissions,
                tooltip: 'Добавить заявку',
                handler: this.onAdd,
                scope: this
            }), ' ',
            this.filtersPlugin.getSearchField({width: 400})
        ];
        
        this.bbar = new xlib.PagingToolbar({
            plugins: [this.filtersPlugin],
            store: this.ds
        });
        
        PMS.Storage.Requests.List.superclass.initComponent.apply(this, arguments);
    },
    
    onAdd: function(b, e) {
        
        var updatePosititon = function(g, rowIndex) {
            var assetRecord = g.getStore().getAt(rowIndex);
            var recordClass = this.getStore().recordType; 
            var record = new recordClass({
                name:           assetRecord.get('name'),
                measure:        assetRecord.get('measure'),
                asset_id:       assetRecord.get('id'),
                account_name:   '',
                created:        (new Date()).format(xlib.date.DATE_TIME_FORMAT),
                request_on:     '',
                qty:            ''
            }, 0);
            
            w.close();
            this.getStore().insert(0, record);
            this.onUpdate(this, 0);
        }; 
        
        var assets = new PMS.Storage.Assets.Layout({
            title: false
        });
        
        assets.assets.on('rowdblclick', updatePosititon, this);
        
        var w = new Ext.Window({
            title: 'Добавление ТМЦ на склад',
            resizable: false,
            layout: 'fit',
            width: 900,
            height: 500,
            modal: true,
            items: [assets],
            buttons: [{
                text: 'Выбрать',
                handler: function() {
                    var sm = assets.assets.getSelectionModel();
                    var record = sm.getSelected();
                    var st = assets.assets.getStore();
                    var rowIndex = st.indexOf(record);
                    updatePosititon.createDelegate(this, [assets.assets, rowIndex])();
                },
                scope: this
            }, {
                text: 'Отмена',
                handler: function() {
                    w.close();
                },
                scope: this
            }],
            scope: this
        });

        w.show();
        
    },
    
    onUpdate: function(g, rowIndex) {
        var record = g.getStore().getAt(rowIndex);
        var id = parseInt(record.get('id'));
        
        var formPanel = this.getForm();
        
        var w = new Ext.Window({
            title: 'Заявка на ТМЦ',
            resizable: false,
            width: 500,
            modal: true,
            items: [formPanel],
            buttons: [{
                text: 'Сохранить',
                handler: function() {
                    formPanel.getForm().submit({
                        params: {
                            id: id
                        },
                        url: id > 0 ? this.updateURL : this.addURL,
                        success: function(form, options) {
                            var o = options.result;
                            if (true == o.success) {
                                w.close();
                                this.getStore().reload();
                                return;
                            }
                            xlib.Msg.error('Не удалось сохранить.')
                        },
                        failure: function() {
                            xlib.Msg.error('Не удалось сохранить.')
                        },
                        scope: this
                    });
                },
                scope: this
            }, {
                text: 'Отмена',
                handler: function() {
                    g.getStore().reload();
                    w.close();
                },
                scope: this
            }],
            scope: this
        });

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
                    if (true == success && res) {
                        if (true == res.success) {
                            g.getStore().reload();
                            return;
                        }
                    }
                    xlib.Msg.error('Ошибка при удалении.');
                },
                scope: this
            });    
        }, this);
    },
    
    // ------------------------ Private functions ------------------------------
    
    getForm: function() {
        return new xlib.form.FormPanel({
            permissions: this.permissions,
            labelWidth: 100,
            items: [{
                xtype: 'hidden',
                name: 'asset_id'
            }, {
                xtype: 'displayfield',
                fieldLabel: 'Наименование',
                name: 'name'
            }, {
                layout: 'column',
                border: false,
                columns: 2,
                defaults: {
                    border: false,
                    layout: 'form'
                },
                items: [{
                    columnWidth: .9,
                    items: [{
                        xtype: 'numberfield',
                        fieldLabel: 'Количество',
                        name: 'qty',
                        validator: function(value) {
                            return value > 0 ? true : 'Значение должно быть больше нуля';
                        },
                        anchor: '100%'
                    }]
                }, {
                    columnWidth: .1,
                    labelWidth: 1, 
                    items: [{
                        xtype: 'displayfield',
                        name: 'measure'
                    }]
                }]
            }, {
                layout: 'column',
                border: false,
                columns: 2,
                defaults: {
                    border: false,
                    layout: 'form'
                },
                items: [{
                    columnWidth: .5,
                    items: [{
                        xtype: 'xlib.form.DateField',
                        format: xlib.date.DATE_FORMAT,
                        fieldLabel: 'Заказ на дату',
                        allowBlank: false,
                        minValue: new Date().clearTime(),
                        name: 'request_on',
                        hiddenName: 'request_on'
                    }]
                }, {
                    columnWidth: .5,
                    labelWidth: 60,
                    items: [{
                        xtype: 'displayfield',
                        fieldLabel: 'Подано',
                        name: 'created',
                        anchor: '100%'
                    }]
                }]
            }]
        });
    },
    
    showWindow: function(config) {
    }
});

Ext.reg('PMS.Storage.Requests.List', PMS.Storage.Requests.List);