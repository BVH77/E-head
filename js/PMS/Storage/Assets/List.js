Ext.ns('PMS.Storage.Assets');

PMS.Storage.Assets.List = Ext.extend(Ext.grid.GridPanel, {

    title:      'Список ТМЦ из категории "Все категории" ',
    
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
        
        this.ds = new Ext.data.Store({
            url: this.listURL,
            baseParams: {
                categoryId: this.categoryId
            },
            reader: new Ext.data.JsonReader({
                root: 'rows',
                id: 'id',
                totalProperty: 'total'
            }, ['id', 'name', 'measure'])
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
            id: this.autoExpandColumn
        }, {
            header: 'Ед. изм.',
            dataIndex: 'measure',
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
        
        var f = new xlib.form.FormPanel({
        	permissions: this.permissions,
            items: [{
                fieldLabel: 'Наименование',
                name: 'name'
            }, PMS.Storage.Assets.Measures.getCombo({
                fieldLabel: 'Ед. изм.',
                name: 'measure',
                hiddenName: 'measure'
            })]
        });
        
        var okButton = new Ext.Button({
            text: 'Добавить',
            iconCls: 'add',
            handler: function() {
                f.getForm().submit({
                    url: this.addURL,
                    params: {
                        categoryId: this.categoryId
                    },
                    success: function(form, options) {
                        var o = options.result;
                        if (true == o.success) {
                            w.close();
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
            items: [f],
            okButton: okButton
        });
    },
    
    onUpdate: function(g, rowIndex) {
        
        var record = g.getStore().getAt(rowIndex);
        
        var f = new xlib.form.FormPanel({
            permissions: this.permissions,
            items: [{
                xtype: 'textfield',
                fieldLabel: 'Наименование',
                name: 'name',
                value: record.get('name')
            }, PMS.Storage.Assets.Measures.getCombo({
                fieldLabel: 'Ед. изм.',
                name: 'measure',
                hiddenName: 'measure',
                value: record.get('measure')
            })]
        });
        
        var okButton = new Ext.Button({
            text: 'Сохранить',
            iconCls: 'add',
            handler: function() {
                f.getForm().submit({
                    url: this.addURL,
                    params: {
                        id: record.get('id')
                    },
                    success: function(form, options) {
                        var o = options.result;
                        if (true == o.success) {
                            w.close();
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
            items: [f],
            okButton: okButton
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
                    if (true == success) {
                        var res = xlib.decode(response.responseText);
                        if (true == res.success) {
                            g.getStore().reload();
                            return;
                        }
                    }
                    xlib.Msg.error('Не удалось удаление.');
                },
                scope: this
            });    
        }, this);
    },
    
    showWindow: function(config) {
        var w = Ext.apply(new Ext.Window({
            resizable: false,
            width: 300,
            modal: true,
            items: [],
            buttons: [config.okButton || {}, {
                text: 'Отмена',
                handler: function() {
                    w.close();
                },
                scope: this
            }]
        }), conffig || {});
        
        w.show();
    },
    
    load: function(categoryId, categoryName) {
        this.setTitle(this.baseTitle + '"' + (categoryName || '') + '"');
        this.categoryId = categoryId;
        this.ds.setBaseParam('categoryId', categoryId);
        this.ds.load();
    }
});

Ext.reg('xlib.acl.accounts.list', xlib.Acl.Accounts.List);