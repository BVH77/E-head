Ext.ns('PMS.Staff.Payments');

PMS.Staff.Payments.List = Ext.extend(Ext.grid.GridPanel, {

    title:  'Список выплат',
    
    listURL:    link('staff', 'payments', 'get-list'),
    
    deleteURL:  link('staff', 'payments', 'delete'),
    
    personId: null,
    
    loadMask: true,

    permissions: acl.isUpdate('staff'),

    defaultSortable: true,
    
    initComponent: function() {
        
        if (!this.personId) {
            throw 'personId is required!';
        }
        
        this.autoExpandColumn = Ext.id();
        
        this.ds = new Ext.data.JsonStore({
            url: this.listURL,
            remoteSort: true,
            autoLoad: true,
            root: 'data',
            sortInfo: {
                field: 'date',
                direction: 'DESC'
            },
            totalProperty: 'totalCount',
            baseParams: {
                staff_id: this.personId
            },
            fields: [
                {name: 'id', type: 'int'}, 
                {
                    name: 'date', 
                    type: 'date', 
                    dateFormat: xlib.date.DATE_FORMAT_SERVER,
                    convert: function(v, record) {
                        return Ext.util.Format.date(
                            Date.parseDate(v, xlib.date.DATE_FORMAT_SERVER), 
                            xlib.date.DATE_FORMAT
                        );
                    }
                },
                {name: 'value', type: 'int'} 
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
                text: 'Добавить',
                iconCls: 'add',
                hidden: !acl.isUpdate('staff'),
                handler: this.onAdd,
                scope: this
            }],
            scope: this
        });
        
        this.colModel = new Ext.grid.ColumnModel({
            defaultSortable: true,
            columns: [{
                header: 'Дата',
                dataIndex: 'date',
                width: 140
            }, {
                header: 'Сумма (руб.)',
                dataIndex: 'value',
                align: 'right',
                id: this.autoExpandColumn,
                renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                    return Ext.util.Format.number(value, '0,000.00').replace(/,/g, ' ');
                }
            }]
        });
                
        this.plugins = [actions];
        
        this.bbar = new xlib.PagingToolbar({
            store: this.ds
        });
        
        PMS.Staff.Payments.List.superclass.initComponent.apply(this, arguments);
        
        if (this.permissions) {
            this.on('rowdblclick', this.onUpdate, this);
        }
    },
    
    onAdd: function(b, e) {
        
        var formPanel = new PMS.Staff.Payments.Form({
            personId: this.personId
        });
        
        formPanel.getForm().on('saved', function() {
            this.getStore().reload();
        }, this);
    },
    
    onUpdate: function(g, rowIndex) {
        
        var record = g.getStore().getAt(rowIndex);
        
        var formPanel = new PMS.Staff.Payments.Form({
            record: record
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
    }
});

Ext.reg('PMS.Staff.Payments.List', PMS.Staff.Payments.List);