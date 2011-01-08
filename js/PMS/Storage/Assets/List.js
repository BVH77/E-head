Ext.ns('PMS.Storage.Assets');

PMS.Storage.Assets.List = Ext.extend(Ext.grid.GridPanel, {

    title:      'Список ТМЦ из категории',
    
    baseTitle:  'Список ТМЦ из категории ',

    listURL:    link('storage', 'assets', 'get-list'),
    
    addURL:     link('storage', 'assets', 'add'),
    
    updateURL:  link('storage', 'assets', 'update'),
    
    deleteURL:  link('storage', 'assets', 'delete'),
    
    loadMask: true,

    categoryId: null,
    
    permissions: acl.isUpdate('storage'),
    
    initComponent: function() {
        
        this.autoExpandColumn = Ext.id();
        
        this.ds = new Ext.data.JsonStore({
            url: this.listURL,
            remoteSort: true,
            baseParams: {
                categoryId: this.categoryId
            },
            root: 'data',
            id: 'id',
            totalProperty: 'totalCount',
            fields: ['id', 'name', 'measure', 'qty', 'unit_price']
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
            header: 'Ед. измерения',
            dataIndex: 'measure',
            sortable: true,
            width: 100
        }, {
            header: 'Количество',
            dataIndex: 'qty',
            sortable: true,
            width: 100
        }, {
            header: 'Цена за единицу (р.)',
            dataIndex: 'unit_price',
            sortable: true,
            width: 120,
            renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                return Ext.util.Format.number(value, '0,000.00').replace(/,/g, ' ');
            }
        }, {
            header: 'Сумма (р.)',
            width: 120,
            renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                var summ = record.get('qty') * record.get('unit_price');
                summ = Ext.util.Format.number(summ, '0,000.00');
                return summ.replace(/,/g, ' ');
            }
        }];
        
        this.filtersPlugin = new Ext.grid.GridFilters({
            filters: [{type: 'string',  dataIndex: 'name'}]
        });
        
        this.plugins = [actions, this.filtersPlugin];

        this.tbar = [new Ext.Toolbar.Button({
                text: 'Добавить',
                iconCls: 'add',
                hidden: !this.permissions,
                qtip: 'Добавить ТМЦ',
                handler: this.onAdd,
                scope: this
            }), ' ',
            this.filtersPlugin.getSearchField({width: 400})
        ];
        
        this.bbar = new xlib.PagingToolbar({
            plugins: [this.filtersPlugin],
            store: this.ds
        });
        
        PMS.Storage.Assets.List.superclass.initComponent.apply(this, arguments);
    },
    
    onAdd: function(b, e) {
        var formPanel = this.getForm();
        
        var okButton = new Ext.Button({
            text: 'Сохранить',
            handler: function() {
                formPanel.getForm().submit({
                    url: this.addURL,
                    params: {
                        categoryId: this.categoryId
                    },
                    success: function(form, options) {
                        var o = options.result;
                        if (true == o.success) {
                            this.formWindow.close();
                            this.getStore().reload();
                            return;
                        }
                        xlib.Msg.error('Не удалось добавить ТМЦ.')
                    },
                    failure: function() {
                        xlib.Msg.error('Не удалось добавить ТМЦ.')
                    },
                    scope: this
                });
            },
            scope: this
        });
        
        this.showWindow({
            title: 'Добавление записи',
            items: [formPanel],
            okButton: okButton
        });
    },
    
    onUpdate: function(g, rowIndex) {
        
        var formPanel = this.getForm();
        var record = g.getStore().getAt(rowIndex);
        formPanel.on('ready', function(fp) {
            fp.getForm().loadRecord(record);
            fp.updateSumm();
        }, formPanel);
        
        var okButton = new Ext.Button({
            text: 'Сохранить',
            handler: function() {
                formPanel.getForm().submit({
                    url: this.updateURL,
                    params: {
                        id: record.get('id')
                    },
                    success: function(form, options) {
                        var o = options.result;
                        if (true == o.success) {
                            this.formWindow.close();
                            this.getStore().reload();
                            return;
                        }
                        xlib.Msg.error('Не удалось сохранить ТМЦ.')
                    },
                    failure: function() {
                        xlib.Msg.error('Не удалось сохранить ТМЦ.')
                    },
                    scope: this
                });
            },
            scope: this
        });
        
        this.showWindow({
            title: 'Добавление ТМЦ',
            items: [formPanel],
            okButton: okButton,
            scope: this
        });
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
                    var msg = 'Ошибка при удалении.';
                    var res = xlib.decode(response.responseText);
                    if (true == success && res) {
                        if (true == res.success) {
                            g.getStore().reload();
                            return;
                        } else if (errors) {
                            var msg;
                            switch (errors[0].code) {
                                case -20:
                                    msg = 'Невозможно удалить. ' +
                                        'Субъект связан с одним или более заказами.'
                                    break;
                                default:
                            }
                        }
                    }
                    xlib.Msg.error(msg);
                },
                scope: this
            });    
        }, this);
    },
    
    // ------------------------ Private functions ------------------------------
    
    getForm: function() {
        
        var updateSumm = function() {
            var summ = qtyField.getValue() * unitPriceField.getValue();
            summ = Ext.util.Format.number(summ, '0,000.00');
            summField.setValue(summ.replace(/,/g, ' ') + ' р.');
        };
        
        var summField = new Ext.form.DisplayField({
            style: 'line-height: 18px;',
            fieldLabel: 'Сумма'
        });
        
        var qtyField = new Ext.form.NumberField({
            fieldLabel: 'Количество',
            name: 'qty',
            allowDecimals: false,
            enableKeyEvents: true,
            listeners: {
                keyup: updateSumm
            }
        });
        
        var unitPriceField = new Ext.form.NumberField({
            fieldLabel: 'Цена за ед. (р.)',
            name: 'unit_price',
            enableKeyEvents: true,
            listeners: {
                keyup: updateSumm
            }
        });
        
        return new xlib.form.FormPanel({
            permissions: this.permissions,
            updateSumm: updateSumm,
            labelWidth: 100,
            items: [{
                xtype: 'textfield',
                fieldLabel: 'Наименование',
                name: 'name'
            }, {
                layout: 'column',
                border: false,
                columns: 2,
                defaults: {
                    border: false,
                    layout: 'form',
                    columnWidth: .5
                },
                items: [{
                    items: [qtyField]
                }, {
                    padding: '0 0 0 10',
                    items: [{
                        xtype: 'PMS.Storage.Measures.ComboBox',
                        fieldLabel: 'Ед. измерения',
                        anchor: '100%',
                        name: 'measure',
                        hiddenName: 'measure'
                    }]
                }]
            }, {
                layout: 'column',
                border: false,
                columns: 2,
                defaults: {
                    border: false,
                    layout: 'form',
                    columnWidth: .5
                },
                items: [{
                    items: [unitPriceField]
                }, {
                    padding: '0 0 0 10',
                    items: [summField]
                }]
            }],
            listeners: {
                load: updateSumm
            }
        });
    },
    
    showWindow: function(config) {
        this.formWindow = new Ext.Window(Ext.apply({
            resizable: false,
            width: 500,
            modal: true,
            items: [],
            buttons: [config.okButton || '', {
                text: 'Отмена',
                handler: function() {
                    this.formWindow.close();
                },
                scope: this
            }]
        }, config || {}));
        this.formWindow.show();
    },
    
    load: function(categoryId, categoryName) {
        this.setTitle(this.baseTitle + '"' + (categoryName || '') + '"');
        this.categoryId = categoryId;
        this.getStore().setBaseParam('categoryId', categoryId);
        this.getStore().load();
    }
});

Ext.reg('PMS.Storage.Assets.List', PMS.Storage.Assets.List);