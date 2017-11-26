Ext.ns('PMS.Expenses');

PMS.Expenses.List = Ext.extend(Ext.grid.GridPanel, {

    title:      'Затраты',
    
    listURL:    link('expenses', 'index', 'get-list'),
    
    deleteURL:  link('expenses', 'index', 'delete'),
    
    loadMask: true,

    permissions: acl.isView('expenses'),

    defaultSortable: true,
    
    initComponent: function() {
        
        this.autoExpandColumn = Ext.id();
        
        this.ds = new Ext.data.JsonStore({
            url: this.listURL,
            autoLoad: true,
            remoteSort: true,
            root: 'data',
            sortInfo: {
                field: 'id',
                direction: 'DESC'
            },
            totalProperty: 'totalCount',
            fields: ['id', 'order_id', 'category', 'entry', 'comment', 'summ', 'date']
        });
        
        this.sm = new Ext.grid.RowSelectionModel();
        
        var actions = new xlib.grid.Actions({
            autoWidth: true,
            items: [{
                text: 'Редактировать',
                iconCls: 'edit',
                hidden: !acl.isUpdate('expenses'),
                handler: this.onUpdate,
                scope: this
            }, {
                text: 'Удалить',
                iconCls: 'delete',
                hidden: !acl.isUpdate('expenses'),
                handler: this.onDelete,
                scope: this
            }],
            scope: this
        });
        
        this.colModel = new Ext.grid.ColumnModel({
            defaultSortable: true,
            columns: [{
                header: '№',
                dataIndex: 'id',
                hidden: true,
                width: 40
            }, {
                header: 'Категория',
                dataIndex: 'category',
                width: 120
            }, {
                header: 'Статья',
                dataIndex: 'entry',
                width: 120
            }, {
                header: 'Сумма',
                dataIndex: 'summ',
                renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                    return Ext.util.Format.number(value, '0,000.00').replace(/,/g, ' ');
                },
                width: 120
            }, {
                header: '№ заказа',
                dataIndex: 'order_id',
                width: 120
            }, {
                header: 'Дата',
                dataIndex: 'date',
                renderer: xlib.dateRenderer(xlib.date.DATE_FORMAT),
                width: 120
            }, {
                header: 'Комментарий',
                dataIndex: 'comment',
                id: this.autoExpandColumn
            }]
        });
        
        this.filtersPlugin = new Ext.grid.GridFilters({
            filters: [
                // {type: 'string',  dataIndex: 'title'},
                // {type: 'string',  dataIndex: 'text'}
            ]
        });
        
        this.plugins = [actions, this.filtersPlugin];

        this.tbar = new Ext.Toolbar({
            items: [
                new Ext.Toolbar.Button({
                    text: 'Добавить',
                    iconCls: 'add',
                    hidden: !this.permissions,
                    tooltip: 'Добавить',
                    handler: this.onAdd,
                    scope: this
                })
            ]
        });
        
        this.bbar = new xlib.PagingToolbar({
            // plugins: [this.filtersPlugin],
            store: this.ds
        });
        
        PMS.Expenses.List.superclass.initComponent.apply(this, arguments);
        
        if (acl.isUpdate('expenses')) {
            this.on('rowdblclick', this.onUpdate, this);
        }
        
    },
    
    onAdd: function(b, e) {
        
        var formPanel = new PMS.Expenses.Form();
        
        formPanel.getForm().on('saved', function() {
            this.getStore().reload();
        }, this);
    },
    
    onUpdate: function(g, rowIndex) {
        
        var record = g.getStore().getAt(rowIndex);
        var id = parseInt(record.get('id'));
        
        var formPanel = new PMS.Expenses.Form({
            itemId: id
        });
        
        formPanel.getForm().on('saved', function() {
            this.getStore().reload();
        }, this);
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
                callback: function(options, success, response) {
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
    
    onReport: function(g, rowIndex) {
        var record = g.getStore().getAt(rowIndex);
        var id = parseInt(record.get('id'));
        // TODO: new PMS.Expenses.report() ...
    }
});

Ext.reg('PMS.Expenses.List', PMS.Expenses.List);