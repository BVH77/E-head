Ext.ns('PMS.Storage.Availability');

PMS.Storage.Availability.List = Ext.extend(Ext.grid.GridPanel, {

    title:      'Наличие на складе',
    
    listURL:    link('storage', 'availability', 'get-list'),
    
    addURL:     link('storage', 'availability', 'add'),
    
    updateURL:  link('storage', 'availability', 'update'),
    
    deleteURL:  link('storage', 'availability', 'delete'),
    
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
            totalProperty: 'totalCount',
            fields: ['id', 'asset_id', 'name', 'measure', 'qty']
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
        }];
        
        this.filtersPlugin = new Ext.grid.GridFilters({
            filters: [{type: 'string',  dataIndex: 'name'}]
        });
        
        this.plugins = [actions, this.filtersPlugin];

        this.tbar = [new Ext.Toolbar.Button({
                text: 'Добавить ТМЦ на склад',
                iconCls: 'add',
                hidden: !this.permissions,
                qtip: 'Добавить ТМЦ на склад',
                handler: this.onAdd,
                scope: this
            }), ' ',
            this.filtersPlugin.getSearchField({width: 400})
        ];
        
        this.bbar = new xlib.PagingToolbar({
            plugins: [this.filtersPlugin],
            store: this.ds
        });
        
        PMS.Storage.Availability.List.superclass.initComponent.apply(this, arguments);
    },
    
    onAdd: function(b, e) {
        
        var updatePosititon = function(g, rowIndex) {
            var assetRecord = g.getStore().getAt(rowIndex);
            var recordClass = this.getStore().recordType; 
            var record = new recordClass({
                name:       assetRecord.get('name'),
                measure:    assetRecord.get('measure'),
                asset_id:   assetRecord.get('id'),
                qty:        0
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
            title: 'Запись о ТМЦ на складе',
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
            }]
        });
    },
    
    showWindow: function(config) {
    }
});

Ext.reg('PMS.Storage.Availability.List', PMS.Storage.Availability.List);