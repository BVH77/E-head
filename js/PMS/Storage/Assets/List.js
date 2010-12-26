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
            fields: ['id', 'name', 'measure']
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
        formPanel.getForm().loadRecord(record);
        
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
        return new xlib.form.FormPanel({
            permissions: this.permissions,
            labelWidth: 100,
            items: [{
                xtype: 'textfield',
                fieldLabel: 'Наименование',
                name: 'name'
            }, PMS.Storage.Assets.Measures.getCombo({
                fieldLabel: 'Ед. измерения',
                name: 'measure',
                hiddenName: 'measure'
            })]
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