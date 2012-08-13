Ext.ns('PMS.Orders.Budget');

PMS.Orders.Budget.List = Ext.extend(Ext.grid.GridPanel, {

    title:      'Смета',
    
    listURL:    link('orders', 'budget', 'get-list'),
    
    addURL:     link('orders', 'budget', 'add'),
    
    updateURL:  link('orders', 'budget', 'update'),
    
    deleteURL:  link('orders', 'budget', 'delete'),
    
    layout: 'fit',
    
    orderId: null,
    
    border: false,
    
    loadMask: true,
    
    permissions: acl.isView('orders'),
    
    initComponent: function() {
        
        if (!this.orderId) {
            throw 'orderId not specified!';
        }
        
        this.autoExpandColumn = Ext.id();
        
        this.ds = new Ext.data.GroupingStore({
            url: this.listURL,
            root: 'data',
            groupField: 'group_id',
            sortInfo: {field: 'group_id', direction: 'ASC'},
            baseParams: {
                'filter[0][field]': 'order_id',
                'filter[0][data][type]': 'string',
                'filter[0][data][value]': this.orderId
            },
            reader: new Ext.data.JsonReader({
                idProperty: 'id',
                root: 'data',
                fields: [
                    'id', 'order_id', 'group_id', 'group', 
                    'name', 'measure', 'qty', 'price', 'margin'
                ]
            })
        });
        
        this.sm = new Ext.grid.RowSelectionModel();
        
        this.view = new Ext.grid.GroupingView({
            hideGroupedColumn: true, 
            groupTextTpl: '{[values.rs[0].get("group")]}'
        }),
        
        this.colModel = new Ext.grid.ColumnModel({
            defaults: {
                menuDisabled: true,
                sortable: false
            },
            columns: [{
                dataIndex: 'group_id'
            }, {
                header: 'Группа расходов',
                hidden: true,
                dataIndex: 'group'
            }, {
                header: 'Наименование статьи расходов',
                dataIndex: 'name',
                id: this.autoExpandColumn,
                renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                    metaData.attr = String.format('qtip=\'{0}\'', value);
                    return value;
               }
            }, {
                header: 'Ед. изм.',
                dataIndex: 'measure',
                align: 'center',
                width: 80
            }, {
                header: 'Количество',
                tooltip: 'Количество',
                dataIndex: 'qty',
                align: 'right',
                width: 50
            }, {
                header: 'Цена',
                dataIndex: 'price',
                align: 'right',
                width: 80,
                renderer: this.moneyRenderer
            }, {
                header: 'Сумма',
                dataIndex: 'summ',
                align: 'right',
                summaryType: 'sum',
                width: 100,
                renderer: this.moneyRenderer
            }, {
                header: 'Наценка (коэффициент)',
                tooltip: 'Наценка (коэффициент)',
                dataIndex: 'margin',
                align: 'center',
                width: 40,
                renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                    return Ext.util.Format.number(value, '0,000.00').replace(/,/g, ' ');
                }
            }, {
                header: 'Стоимость',
                dataIndex: 'total',
                align: 'right',
                summaryType: 'sum',
                width: 100,
                renderer: this.moneyRenderer
            }]
        });
        
        this.plugins = [new xlib.grid.Actions({
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
        }), new Ext.ux.grid.GroupSummary()];

        this.tbar = new Ext.Toolbar({
            items: [{
                text: 'Добавить статью расходов',
                iconCls: 'add',
                hidden: !this.permissions,
                tooltip: 'Добавить статью расходов',
                handler: this.onAdd,
                scope: this
            }, '-', {
                text: 'Группы статей расходов',
                iconCls: 'edit',
                hidden: !this.permissions,
                tooltip: 'Редактироване групп статей расходов',
                handler: this.onGroups,
                scope: this
            }, '->', {
                iconCls: 'x-tbar-loading',
                tooltip: 'Обновить',
                handler: function() {
                    this.getStore().reload();
                },
                scope: this
            }],
            scope: this
        });
        
        this.bottomTpl = new Ext.XTemplate(
            '<div align="right"><b><font color="blue">' +
            'Общая сумма: <font color="red">{summ}</font> ' +
            'Общая стоимость: <font color="red">{total}</font>' +
            '</font></b></div>' +
            '<font color="red">Просьба указывать в наименованиях:</font> <br/>' +
            'Параметры спецтехники (тоннажность/длина стрелы), ' +
            'город и километраж до объекта, ' +
            'кол-во человек в бригаде и чел/час.'
        );
        
        this.bbar = new Ext.Panel({
            cls: 'x-border-top',
            padding: 5,
            border: false,
            height: 55,
            html: this.bottomTpl.apply(['', ''])
        });
        
        PMS.Orders.Budget.List.superclass.initComponent.apply(this, arguments);
        
        this.getStore().on('load', function(store) {
            
            var grand_summ = 0, grand_total = 0;
            
            store.each(function(record) {
                this.calc(record);
                grand_summ = grand_summ + record.get('summ'); 
                grand_total = grand_total + record.get('total'); 
            }, this);
            
            this.getBottomToolbar().update(this.bottomTpl.apply({
                summ: this.moneyRenderer(grand_summ), 
                total: this.moneyRenderer(grand_total)
            }));
            
        }, this);
        
        this.on('rowdblclick', this.onUpdate, this);
        
    },
    
    onGroups: function(b, e) {
        if (!this.permissions) {
            return;
        }
        
        var w = new Ext.Window({
            title: 'Группы статей расходов',
            layout: 'fit',
            resizable: false,
            width: 500,
            height: 400,
            modal: true,
            items: [new PMS.Orders.Budget.Groups()]
        });
        
        w.show();
    },
    
    onAdd: function(b, e) {
        
        if (!this.permissions) {
            return;
        }
        
        var formPanel = new PMS.Orders.Budget.Form({orderId: this.orderId}),
            w = this.getWindow(formPanel, this.addURL, this.getStore());
        
        w.show();
        
        formPanel.getForm().findField('order_id').setValue(this.orderId);
    },
    
    onUpdate: function(g, rowIndex) {
        
        if (!this.permissions) {
            return;
        }
        
        var formPanel = new PMS.Orders.Budget.Form({orderId: this.orderId}),
            record = g.getStore().getAt(rowIndex),
            w = this.getWindow(formPanel, this.updateURL, this.getStore());
        
        w.show();
        
        formPanel.getForm().loadRecord(record);
    },
    
    onDelete: function(g, rowIndex) {
        
        if (!this.permissions) {
            return;
        }
        
        var record = g.getStore().getAt(rowIndex);
        
        xlib.Msg.confirm('Вы уверены?', function() {
            Ext.Ajax.request({
                url: this.deleteURL,
                params: {
                    id: record.get('id')
                },
                callback: function (options, success, response) {
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
    
    // Private functions 
    
    getWindow: function(formPanel, url, store) {
         
        var w = new Ext.Window({
            title: 'Статья расходов',
            resizable: false,
            width: 500,
            modal: true,
            items: [formPanel],
            buttons: [{
                text: 'Сохранить',
                handler: function() {
                    formPanel.getForm().submit({
                        url: url,
                        success: function(form, options) {
                            var o = options.result;
                            if (true == o.success) {
                                w.close();
                                store.reload();
                                return;
                            }
                            xlib.Msg.error('Не удалось сохранить.')
                        },
                        failure: function() {
                            xlib.Msg.error('Не удалось сохранить.')
                        }
                    });
                }
            }, {
                text: 'Отмена',
                handler: function() {
                    w.close();
                }
            }]
        });
        
        return w;
    },
    
    moneyRenderer: function(value, metaData, record, rowIndex, colIndex, store) {
        return Ext.util.Format.number(value, '0,000.00').replace(/,/g, ' ') + ' р.';
    },
    
    calc: function(record) {
        var qty = record.get('qty'),
            price = record.get('price'),
            margin = record.get('margin');
            
            record.set('summ', qty * price);
            record.set('total', qty * price * margin);
    }
});