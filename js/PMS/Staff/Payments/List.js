Ext.ns('PMS.Staff.Payments');

PMS.Staff.Payments.List = Ext.extend(Ext.grid.GridPanel, {

    title:  'Список выплат',
    
    listURL: link('staff', 'payments', 'get-list'),
    
    personId: null,
    
    loadMask: true,

    permissions: acl.isUpdate('staff'),

    defaultSortable: true,
    
    viewConfig: {
        scrollOffset: 28
    },
    
    initComponent: function() {
        
        if (!this.personId) {
            throw 'personId is required!';
        }
        
        this.autoExpandColumn = Ext.id();
        
        this.plugins = [new xlib.grid.Actions({
            autoWidth: true,
            items: [{
                text: 'Редактировать',
                iconCls: 'edit',
                hidden: !acl.isUpdate('staff'),
                handler: this.onUpdate,
                scope: this
            }],
            scope: this
        })];
        
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
                {name: 'value', type: 'int'}, 
                {name: 'paid', type: 'int'},
                'comment'
            ]
        });
        
        this.sm = new Ext.grid.RowSelectionModel();
        
        this.colModel = new Ext.grid.ColumnModel({
            defaultSortable: true,
            columns: [{
                header: 'Дата',
                dataIndex: 'date',
                width: 80
            }, {
                header: 'Сумма (руб.)',
                dataIndex: 'value',
                width: 100,
                align: 'right',
                renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                    return Ext.util.Format.number(value, '0,000.00').replace(/,/g, ' ');
                }
            }, {
                header: 'Распределено (руб.)',
                dataIndex: 'paid',
                width: 100,
                align: 'right',
                renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                    return Ext.util.Format.number(value, '0,000.00').replace(/,/g, ' ');
                }
            }, {
                header: 'Остаток (руб.)',
                // dataIndex: 'value' - 'paid',
                width: 100,
                align: 'right',
                renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                    value = record.get('value') - record.get('paid'); 
                    return Ext.util.Format.number(value, '0,000.00').replace(/,/g, ' ');
                }
            }, {
                header: 'Комментарий',
                dataIndex: 'comment',
                id: this.autoExpandColumn
            }]
        });
                
        this.bbar = new xlib.PagingToolbar({
            store: this.ds
        });
        
        PMS.Staff.Payments.List.superclass.initComponent.apply(this, arguments);
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
    
    onAdd: function(b, e) {
        
        var formPanel = new PMS.Staff.Payments.Form({
            personId: this.personId
        });
        
        formPanel.getForm().on('saved', function() {
            this.getStore().reload();
        }, this);
    }
});

Ext.reg('PMS.Staff.Payments.List', PMS.Staff.Payments.List);