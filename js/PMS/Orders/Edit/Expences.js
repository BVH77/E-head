Ext.ns('PMS.Orders.Edit');

PMS.Orders.Edit.Expences = Ext.extend(Ext.grid.GridPanel, {

    title:      'Расходы',
    
    listURL:    link('orders', 'expences', 'get-list'),
    
    layout: 'fit',
    
    orderId: null,
    
    border: false,
    
    loadMask: true,
    
    permissions: acl.isView('orders'),
    
    viewConfig: {
        scrollOffset: 40
    },
    
    initComponent: function() {
        
        if (!this.orderId) {
            throw 'orderId not specified!';
        }
        
        this.autoExpandColumn = Ext.id();
        
        this.ds = new Ext.data.JsonStore({
            url: this.listURL,
            remoteSort: true,
            root: 'data',
            id: 'id',
            sortInfo: {
                field: 'date',
                direction: 'ASC'
            },
            baseParams: {
                order_id: this.orderId
            },
            totalProperty: 'totalCount',
            fields: [
                {name: 'id', type: 'int'},
                'name', 'qty', 'measure', 'price', 
                {name: 'summ', type: 'float'}, 
                {name: 'created', type: 'date', dateFormat: xlib.date.DATE_TIME_FORMAT_SERVER}
            ]
        });
        
        this.sm = new Ext.grid.RowSelectionModel();
        
        this.columns = [{
            header: 'Выдано',
            dataIndex: 'created',
            renderer: xlib.dateRenderer(xlib.date.DATE_TIME_FORMAT),
            sortable: false,
            width: 120
        }, {
            header: 'Наименование',
            dataIndex: 'name',
            sortable: false,
            id: this.autoExpandColumn
        }, {
            header: 'Ед.изм.',
            dataIndex: 'measure',
            sortable: false,
            width: 60
        }, {
            header: 'Кол-во',
            dataIndex: 'qty',
            sortable: false,
            width: 60
        }, {
            header: 'Цена',
            dataIndex: 'price',
            sortable: false,
            width: 80,
            align: 'right',
            renderer: function(v) {
                return parseFloat(v).toFixed(2) + ' р.';
            }
        }, {
            header: 'Сумма',
            dataIndex: 'summ',
            sortable: false,
            width: 80,
            align: 'right',
            renderer: function(v) {
                return parseFloat(v).toFixed(2) + ' р.';
            }
        }];
        
        var totalSumm = new Ext.form.DisplayField({value: '0.00'});
        this.bbar = new Ext.Toolbar({
            style: 'color: red;',
            items: [{
                xtype: 'button',
                iconCls: 'x-tbar-loading',
                tooltip: 'Обновить',
                handler: function() {
                    this.getStore().reload();
                },
                scope: this
            }, '->', '<b>ИТОГО:</b> ', ' ', totalSumm, ' р.']
        });
        
        PMS.Orders.Edit.Expences.superclass.initComponent.apply(this, arguments);
        
        this.getStore().on('load', function(store) {
            totalSumm.setValue(parseFloat(store.sum('summ')).toFixed(2));
        }); 
    }
});