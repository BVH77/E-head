Ext.ns('PMS.Staff');

PMS.Staff.PayPeriods = [ 
    ['hour', 'Почасовая'],
    ['day', 'Подённая'],
    ['month', 'Cтавка']
];

PMS.Staff.List = Ext.extend(Ext.grid.GridPanel, {

    title: true,
    
    baseTitle:  'Список сотрудников из категории ',
    
    listURL:    link('staff', 'index', 'get-list'),
    
    deleteURL:  link('staff', 'index', 'delete'),
    
    loadMask: true,

    permissions: acl.isUpdate('staff'),

    defaultSortable: true,
    
    categoryId: null,
    
    initComponent: function() {
        
        var pay_periods = new Ext.util.MixedCollection(); 
        Ext.each(PMS.Staff.PayPeriods, function(item) {
            pay_periods.add(item[0], item[1]);
        });
        
        this.autoExpandColumn = Ext.id();
        
        this.ds = new Ext.data.JsonStore({
            url: this.listURL,
            remoteSort: true,
            root: 'data',
            sortInfo: {
                field: 'name',
                direction: 'ASC'
            },
            totalProperty: 'totalCount',
            fields: [
                {name: 'id', type: 'int'}, 
                {name: 'pay_rate', type: 'int'}, 
                'name', 'function', 'pay_period', 'cv_file',
                {
                    name: 'hire_date', 
                    type: 'date', 
                    dateFormat: xlib.date.DATE_FORMAT_SERVER,
                    convert: function(v, record) {
                        return Ext.util.Format.date(
                            Date.parseDate(v, xlib.date.DATE_FORMAT_SERVER), 
                            xlib.date.DATE_FORMAT
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
                hidden: !acl.isUpdate('staff'),
                handler: this.onUpdate,
                scope: this
            }, {
                text: 'Удалить',
                iconCls: 'delete',
                hidden: !acl.isUpdate('staff'),
                handler: this.onDelete,
                scope: this
            }, '-', {
                text: 'Учёт времени',
                iconCls: 'prod_schd-icon',
                hidden: !acl.isUpdate('staff'),
                handler: this.onHR,
                scope: this
            }],
            scope: this
        });
        
        this.colModel = new Ext.grid.ColumnModel({
            defaultSortable: true,
            columns: [{
                header: '№',
                dataIndex: 'id',
                width: 40
            }, {
                header: 'Имя',
                dataIndex: 'name',
                minWidth: 250,
                id: this.autoExpandColumn
            }, {
                header: 'Должность',
                dataIndex: 'function',
                width: 250
            }, {
                header: 'Дата приёма на работу',
                dataIndex: 'hire_date',
                width: 140
            }, {
                header: 'Система оплаты',
                dataIndex: 'pay_period',
                width: 100,
                renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                    return pay_periods.get(value);
                }
            }, {
                header: 'Тариф (руб.)',
                dataIndex: 'pay_rate',
                align: 'right',
                width: 80,
                renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                    return Ext.util.Format.number(value, '0,000.00').replace(/,/g, ' ');
                }
            }, {
                header: 'Резюме',
                dataIndex: 'cv_file',
                width: 160,
                renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                    return Ext.isEmpty(value) ? '' 
                    : '<a href="/files/' + value + '" target="_blank">' + value + '</a>';
                }
            }]
        });
        
        this.filtersPlugin = new Ext.grid.GridFilters({
            filters: [
                {type: 'string',  dataIndex: 'name'},
                {type: 'string',  dataIndex: 'function'},
                {type: 'string',  dataIndex: 'hire_date'}
            ]
        });
        
        this.plugins = [actions, this.filtersPlugin];

        this.addBtn = new Ext.Toolbar.Button({
            text: 'Добавить',
            iconCls: 'add',
            hidden: !this.permissions,
            tooltip: 'Добавить',
            handler: this.onAdd,
            scope: this
        });
        
        this.tbar = new Ext.Toolbar({
            items: [
                this.addBtn, 
                ' ', 
                this.filtersPlugin.getSearchField({width: 400}), 
                ' '
            ]
        });
        
        this.bbar = new xlib.PagingToolbar({
            plugins: [this.filtersPlugin],
            store: this.ds
        });
        
        PMS.Staff.List.superclass.initComponent.apply(this, arguments);
        
        if (this.permissions) {
            this.on('rowdblclick', this.onUpdate, this);
        }
        
        if (!this.title) {
            this.setTitle(this.baseTitle);
        }
    },
    
    onAdd: function(b, e) {
        
        var formPanel = new PMS.Staff.Form({
            categoryId: this.categoryId
        });
        
        formPanel.getForm().on('saved', function() {
            this.getStore().reload();
        }, this);
    },
    
    onUpdate: function(g, rowIndex) {
        
        var record = g.getStore().getAt(rowIndex);
        var id = parseInt(record.get('id'));
        
        var formPanel = new PMS.Staff.Form({
            itemId: id,
            categoryId: this.categoryId
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
    
    onHR: function(g, rowIndex) {
        var record = g.getStore().getAt(rowIndex);
        var id = parseInt(record.get('id'));
        new PMS.Staff.HR.Layout({personId: id});
    },
    
    onReport: function(g, rowIndex) {
        var record = g.getStore().getAt(rowIndex);
        var id = parseInt(record.get('id'));
        //new PMS.Notice.DstInfo({itemId: id}).getWindow().show();
    },
    
    loadList: function(categoryId, categoryName) {
        this.addBtn.setDisabled(!(categoryId > 0));
        this.setTitle(this.baseTitle + '"' + (categoryName || '') + '"');
        this.categoryId = categoryId;
        this.getStore().setBaseParam('categoryId', categoryId);
        this.getStore().load();
    }
});

Ext.reg('PMS.Staff.List', PMS.Staff.List);