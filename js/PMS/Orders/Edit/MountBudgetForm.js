Ext.ns('PMS.Orders.Edit');

PMS.Orders.Edit.MountBudgetForm = Ext.extend(xlib.form.FormPanel, {
    
    permissions: acl.isView('orders', 'mount'),
    
    orderId: null,
    
    tableColumns: 10,
    
    initComponent: function() {
        
        if (!this.orderId) {
            throw 'orderId not specified!';
        }
        
        this.items = [{
            xtype: 'hidden',
            name: 'id'
        }, {
            xtype: 'hidden',
            name: 'order_id'
        }, {
            layout: 'table',
            anchor: '-20',
            border: false,
            defaults: {
                bodyStyle: 'padding: 5px; text-align: center;',
                border: false
            },
            layoutConfig: {
                tableAttrs: {
                    style: {
                        width: '100%;'
                    }
                },
                columns: this.tableColumns
            },
            items: [{
                bodyStyle: 'padding: 5px; text-align: center; background-color: #FCF400;',
                html: 'Наименование',
                border: true
            },{
                bodyStyle: 'padding: 5px; text-align: center; background-color: #FCF400;',
                html: 'Ед. изм.',
                border: true
            },{
                bodyStyle: 'padding: 5px; text-align: center; background-color: #FCF400;',
                html: 'Кол-во',
                border: true
            },{
                bodyStyle: 'padding: 5px; text-align: center; background-color: #FCF400;',
                colspan: 2,
                html: 'Цена',
                border: true
            },{
                bodyStyle: 'padding: 5px; text-align: center; background-color: #FCF400;',
                colspan: 2,
                html: 'Сумма',
                border: true
            },{
                bodyStyle: 'padding: 5px; text-align: center; background-color: #FCF400;',
                html: 'Наценка',
                border: true
            },{
                bodyStyle: 'padding: 5px; text-align: center; background-color: #FCF400;',
                colspan: 2,
                html: 'Стоимость',
                border: true
            },{ // Next group
                colspan: this.tableColumns,
                html: '<b>Выезд на замеры (Москва и обл.)</b>',
                bodyStyle: 'padding: 5px; text-align: left; background-color: lightgreen;'
            },{
                bodyStyle: 'text-align: left; padding-left: 5px;',
                width: 260,
                html: 'Выезд технического специалиста'
            },{
                html: 'смена'
            },{
                bodyStyle: 'text-align: center;',
                items: [{
                    xtype: 'numberfield',
                    width: 40,
                    name: 'f1_qty',
                    allowBlank: false,
                    minValue: 0,
                    value: 0
                }]
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'numberfield',
                    width: 60,
                    name: 'f1_price',
                    allowBlank: false,
                    minValue: 0,
                    value: 0
                }]
            },{
                html: 'р.'
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'displayfield',
                    width: 60,
                    name: 'f1_summ',
                    value: 0
                }]
            },{
                html: 'р.'
            },{
                bodyStyle: 'text-align: center;',
                items: [{
                    xtype: 'displayfield',
                    name: 'f1_margin',
                    value: 1.25
                }]
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'displayfield',
                    width: 60,
                    name: 'f1_total',
                    value: 0
                }]
            },{
                html: 'р.'
            },{ 
                // Rows separator
                cls: 'x-border-bottom',
                colspan: this.tableColumns
            },{ 
                bodyStyle: 'text-align: left; padding-left: 5px;',
                width: 260,
                layout: 'form',
                labelWidth: 70,
                items: [{
                    html: 'Транспортные расходы',
                    border: false
                }, {
                    xtype: 'textfield',
                    width: 175,
                    fieldLabel: 'город',
                    name: 'f2_dest'
                }, {
                    xtype: 'textfield',
                    width: 175,
                    fieldLabel: 'расстояние',
                    name: 'f2_distance'
                }]
            },{
                html: 'км'
            },{
                bodyStyle: 'text-align: center;',
                items: [{
                    xtype: 'numberfield',
                    width: 40,
                    name: 'f2_qty',
                    allowBlank: false,
                    minValue: 0,
                    value: 0
                }]
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'numberfield',
                    width: 60,
                    name: 'f2_price',
                    allowBlank: false,
                    minValue: 0,
                    value: 0
                }]
            },{
                html: 'р.'
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'displayfield',
                    width: 60,
                    name: 'f2_summ',
                    value: 0
                }]
            },{
                html: 'р.'
            },{
                bodyStyle: 'text-align: center;',
                items: [{
                    xtype: 'displayfield',
                    name: 'f2_margin',
                    value: 1.30
                }]
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'displayfield',
                    width: 60,
                    name: 'f2_total',
                    value: 0
                }]
            },{
                html: 'р.'
            },{ 
                // Rows separator
                cls: 'x-border-bottom',
                colspan: this.tableColumns
            },{ 
                colspan: 5
            },{
                bodyStyle: 'text-align: right; background-color: #FCF400;',
                items: [{
                    xtype: 'displayfield',
                    width: 60,
                    name: 'g1_summ',
                    value: 0
                }]
            },{
                bodyStyle: 'background-color: #FCF400;',
                html: 'р.'
            },{
            },{
                bodyStyle: 'text-align: right; background-color: #FCF400;',
                items: [{
                    xtype: 'displayfield',
                    width: 60,
                    name: 'g1_total',
                    value: 0
                }]
            },{
                bodyStyle: 'background-color: #FCF400;',
                html: 'р.'
            },{ // Next group
                colspan: this.tableColumns,
                html: '<b>Выезд на замеры (другой город)</b>',
                bodyStyle: 'padding: 5px; text-align: left; background-color: lightgreen;'
            },{ 
                bodyStyle: 'text-align: left; padding-left: 5px;',
                width: 260,
                layout: 'form',
                labelWidth: 70,
                items: [{
                    html: 'Билеты туда и обратно',
                    border: false
                }, {
                    xtype: 'textfield',
                    width: 175,
                    fieldLabel: 'транспорт',
                    name: 'f3_transport'
                }, {
                    xtype: 'textfield',
                    width: 175,
                    fieldLabel: 'человек',
                    name: 'f3_people'
                }]
            },{
                html: 'ед.'
            },{
                bodyStyle: 'text-align: center;',
                items: [{
                    xtype: 'numberfield',
                    width: 40,
                    name: 'f3_qty',
                    allowBlank: false,
                    minValue: 0,
                    value: 0
                }]
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'numberfield',
                    width: 60,
                    name: 'f3_price',
                    allowBlank: false,
                    minValue: 0,
                    value: 0
                }]
            },{
                html: 'р.'
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'displayfield',
                    width: 60,
                    name: 'f3_summ',
                    value: 0
                }]
            },{
                html: 'р.'
            },{
                bodyStyle: 'text-align: center;',
                items: [{
                    xtype: 'displayfield',
                    name: 'f3_margin',
                    value: 1.25
                }]
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'displayfield',
                    width: 60,
                    name: 'f3_total',
                    value: 0
                }]
            },{
                html: 'р.'
            },{ 
                // Rows separator
                cls: 'x-border-bottom',
                colspan: this.tableColumns
            },{
                bodyStyle: 'text-align: left; padding-left: 5px;',
                width: 260,
                items: [{
                    html: 'Командировочные, питание',
                    border: false
                }, {
                    layout: 'column',
                    border: false,
                    columns: 2,
                    defaults: {
                        border: false,
                        layout: 'form',
                        labelWidth: 50
                    },
                    items: [{
                        items: [{
                            xtype: 'textfield',
                            width: 60,
                            fieldLabel: 'человек',
                            name: 'f4_people'
                        }]
                    }, {
                        style: 'padding-left: 20px;',
                        items: [{
                            xtype: 'textfield',
                            width: 60,
                            fieldLabel: 'дней',
                            name: 'f4_days'
                        }]
                    }]
                }]
            },{
                html: 'чел/дни'
            },{
                bodyStyle: 'text-align: center;',
                items: [{
                    xtype: 'numberfield',
                    width: 40,
                    name: 'f4_qty',
                    allowBlank: false,
                    minValue: 0,
                    value: 0
                }]
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'numberfield',
                    width: 60,
                    name: 'f4_price',
                    allowBlank: false,
                    minValue: 0,
                    value: 0
                }]
            },{
                html: 'р.'
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'displayfield',
                    width: 60,
                    name: 'f4_summ',
                    value: 0
                }]
            },{
                html: 'р.'
            },{
                bodyStyle: 'text-align: center;',
                items: [{
                    xtype: 'displayfield',
                    name: 'f4_margin',
                    value: 1.25
                }]
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'displayfield',
                    width: 60,
                    name: 'f4_total',
                    value: 0
                }]
            },{
                html: 'р.'
            },{ 
                // Rows separator
                cls: 'x-border-bottom',
                colspan: this.tableColumns
            },{
                bodyStyle: 'text-align: left; padding-left: 5px;',
                width: 260,
                layout: 'form',
                labelWidth: 70,
                items: [{
                    html: 'Командировочные, проживание',
                    border: false
                }, {
                    layout: 'column',
                    border: false,
                    columns: 2,
                    defaults: {
                        border: false,
                        layout: 'form',
                        labelWidth: 50
                    },
                    items: [{
                        items: [{
                            xtype: 'textfield',
                            width: 60,
                            fieldLabel: 'человек',
                            name: 'f5_people'
                        }]
                    }, {
                        style: 'padding-left: 20px;',
                        items: [{
                            xtype: 'textfield',
                            width: 60,
                            fieldLabel: 'дней',
                            name: 'f5_days'
                        }]
                    }]
                }]
            },{
                html: 'чел/дни'
            },{
                bodyStyle: 'text-align: center;',
                items: [{
                    xtype: 'numberfield',
                    width: 40,
                    name: 'f5_qty',
                    allowBlank: false,
                    minValue: 0,
                    value: 0
                }]
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'numberfield',
                    width: 60,
                    name: 'f5_price',
                    allowBlank: false,
                    minValue: 0,
                    value: 0
                }]
            },{
                html: 'р.'
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'displayfield',
                    width: 60,
                    name: 'f5_summ',
                    value: 0
                }]
            },{
                html: 'р.'
            },{
                bodyStyle: 'text-align: center;',
                items: [{
                    xtype: 'displayfield',
                    name: 'f5_margin',
                    value: 1.25
                }]
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'displayfield',
                    width: 60,
                    name: 'f5_total',
                    value: 0
                }]
            },{
                html: 'р.'
            },{ 
                // Rows separator
                cls: 'x-border-bottom',
                colspan: this.tableColumns
            },{ 
                colspan: 5
            },{
                bodyStyle: 'text-align: right; background-color: #FCF400;',
                items: [{
                    xtype: 'displayfield',
                    width: 60,
                    name: 'g2_summ',
                    value: 0
                }]
            },{
                bodyStyle: 'background-color: #FCF400;',
                html: 'р.'
            },{
            },{
                bodyStyle: 'text-align: right; background-color: #FCF400;',
                items: [{
                    xtype: 'displayfield',
                    width: 60,
                    name: 'g2_total',
                    value: 0
                }]
            },{
                bodyStyle: 'background-color: #FCF400;',
                html: 'р.'
            },{ // Next group
                colspan: this.tableColumns,
                html: '<b>Монтаж (Москва и область)</b>',
                bodyStyle: 'padding: 5px; text-align: left; background-color: lightgreen;'
            },{
                bodyStyle: 'text-align: left; padding-left: 5px;',
                width: 260,
                layout: 'form',
                labelWidth: 70,
                items: [{
                    border: false,
                    html: 'Автовышка'
                }, {
                    xtype: 'textfield',
                    width: 175,
                    fieldLabel: 'параметры',
                    name: 'f6_params'
                }]
            },{
                html: 'смена'
            },{
                bodyStyle: 'text-align: center;',
                items: [{
                    xtype: 'numberfield',
                    width: 40,
                    name: 'f6_qty',
                    allowBlank: false,
                    minValue: 0,
                    value: 0
                }]
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'numberfield',
                    width: 60,
                    name: 'f6_price',
                    allowBlank: false,
                    minValue: 0,
                    value: 0
                }]
            },{
                html: 'р.'
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'displayfield',
                    width: 60,
                    name: 'f6_summ',
                    value: 0
                }]
            },{
                html: 'р.'
            },{
                bodyStyle: 'text-align: center;',
                items: [{
                    xtype: 'displayfield',
                    name: 'f6_margin',
                    value: 1.3
                }]
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'displayfield',
                    width: 60,
                    name: 'f6_total',
                    value: 0
                }]
            },{
                html: 'р.'
            },{ 
                // Rows separator
                cls: 'x-border-bottom',
                colspan: this.tableColumns
            },{
                bodyStyle: 'text-align: left; padding-left: 5px;',
                width: 260,
                layout: 'form',
                labelWidth: 70,
                items: [{
                    border: false,
                    html: 'Автокран'
                }, {
                    xtype: 'textfield',
                    width: 175,
                    fieldLabel: 'параметры',
                    name: 'f7_params'
                }]
            },{
                html: 'смена'
            },{
                bodyStyle: 'text-align: center;',
                items: [{
                    xtype: 'numberfield',
                    width: 40,
                    name: 'f7_qty',
                    allowBlank: false,
                    minValue: 0,
                    value: 0
                }]
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'numberfield',
                    width: 60,
                    name: 'f7_price',
                    allowBlank: false,
                    minValue: 0,
                    value: 0
                }]
            },{
                html: 'р.'
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'displayfield',
                    width: 60,
                    name: 'f7_summ',
                    value: 0
                }]
            },{
                html: 'р.'
            },{
                bodyStyle: 'text-align: center;',
                items: [{
                    xtype: 'displayfield',
                    name: 'f7_margin',
                    value: 1.3
                }]
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'displayfield',
                    width: 60,
                    name: 'f7_total',
                    value: 0
                }]
            },{
                html: 'р.'
            },{ 
                // Rows separator
                cls: 'x-border-bottom',
                colspan: this.tableColumns
            },{
                bodyStyle: 'text-align: left; padding-left: 5px;',
                width: 260,
                layout: 'form',
                labelWidth: 70,
                items: [{
                    html: 'Монтажные работы, бригада',
                    border: false
                }, {
                    layout: 'column',
                    border: false,
                    columns: 2,
                    defaults: {
                        border: false,
                        layout: 'form',
                        labelWidth: 50
                    },
                    items: [{
                        items: [{
                            xtype: 'textfield',
                            width: 60,
                            fieldLabel: 'человек',
                            name: 'f8_people'
                        }]
                    }, {
                        style: 'padding-left: 20px;',
                        items: [{
                            xtype: 'textfield',
                            width: 60,
                            fieldLabel: 'дней',
                            name: 'f8_days'
                        }]
                    }]
                }]
            },{
                html: 'чел/часы'
            },{
                bodyStyle: 'text-align: center;',
                items: [{
                    xtype: 'numberfield',
                    width: 40,
                    name: 'f8_qty',
                    allowBlank: false,
                    minValue: 0,
                    value: 0
                }]
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'numberfield',
                    width: 60,
                    name: 'f8_price',
                    allowBlank: false,
                    minValue: 0,
                    value: 0
                }]
            },{
                html: 'р.'
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'displayfield',
                    width: 60,
                    name: 'f8_summ',
                    value: 0
                }]
            },{
                html: 'р.'
            },{
                bodyStyle: 'text-align: center;',
                items: [{
                    xtype: 'displayfield',
                    name: 'f8_margin',
                    value: 1.3
                }]
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'displayfield',
                    width: 60,
                    name: 'f8_total',
                    value: 0
                }]
            },{
                html: 'р.'
            },{ 
                // Rows separator
                cls: 'x-border-bottom',
                colspan: this.tableColumns
            },{
                bodyStyle: 'text-align: left; padding-left: 5px;',
                width: 260,
                layout: 'form',
                labelWidth: 70,
                items: [{
                    border: false,
                    html: 'Доставка (грузовая техника)'
                }, {
                    xtype: 'textfield',
                    width: 175,
                    fieldLabel: 'параметры',
                    name: 'f9_params'
                }]
            },{
                html: 'смена'
            },{
                bodyStyle: 'text-align: center;',
                items: [{
                    xtype: 'numberfield',
                    width: 40,
                    name: 'f9_qty',
                    allowBlank: false,
                    minValue: 0,
                    value: 0
                }]
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'numberfield',
                    width: 60,
                    name: 'f9_price',
                    allowBlank: false,
                    minValue: 0,
                    value: 0
                }]
            },{
                html: 'р.'
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'displayfield',
                    width: 60,
                    name: 'f9_summ',
                    value: 0
                }]
            },{
                html: 'р.'
            },{
                bodyStyle: 'text-align: center;',
                items: [{
                    xtype: 'displayfield',
                    name: 'f9_margin',
                    value: 1.3
                }]
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'displayfield',
                    width: 60,
                    name: 'f9_total',
                    value: 0
                }]
            },{
                html: 'р.'
            },{ 
                // Rows separator
                cls: 'x-border-bottom',
                colspan: this.tableColumns
            },{
                bodyStyle: 'text-align: left; padding-left: 5px;',
                width: 260,
                html: 'Транспортные расходы по Москве'
            },{
                html: 'смена'
            },{
                bodyStyle: 'text-align: center;',
                items: [{
                    xtype: 'numberfield',
                    width: 40,
                    name: 'f10_qty',
                    allowBlank: false,
                    minValue: 0,
                    value: 0
                }]
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'numberfield',
                    width: 60,
                    name: 'f10_price',
                    allowBlank: false,
                    minValue: 0,
                    value: 0
                }]
            },{
                html: 'р.'
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'displayfield',
                    width: 60,
                    name: 'f10_summ',
                    value: 0
                }]
            },{
                html: 'р.'
            },{
                bodyStyle: 'text-align: center;',
                items: [{
                    xtype: 'displayfield',
                    name: 'f10_margin',
                    value: 1.3
                }]
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'displayfield',
                    width: 60,
                    name: 'f10_total',
                    value: 0
                }]
            },{
                html: 'р.'
            },{ 
                // Rows separator
                cls: 'x-border-bottom',
                colspan: this.tableColumns
            },{ 
                colspan: 5
            },{
                bodyStyle: 'text-align: right; background-color: #FCF400;',
                items: [{
                    xtype: 'displayfield',
                    width: 60,
                    name: 'g3_summ',
                    value: 0
                }]
            },{
                bodyStyle: 'background-color: #FCF400;',
                html: 'р.'
            },{
            },{
                bodyStyle: 'text-align: right; background-color: #FCF400;',
                items: [{
                    xtype: 'displayfield',
                    width: 60,
                    name: 'g3_total',
                    value: 0
                }]
            },{
                bodyStyle: 'background-color: #FCF400;',
                html: 'р.'
            },{ // Next group
                colspan: this.tableColumns,
                html: '<b>Командировочные (если монтаж в другом городе)</b>',
                bodyStyle: 'padding: 5px; text-align: left; background-color: lightgreen;'
            },{ 
                bodyStyle: 'text-align: left; padding-left: 5px;',
                width: 260,
                layout: 'form',
                labelWidth: 70,
                items: [{
                    html: 'Транспортные расходы',
                    border: false
                }, {
                    xtype: 'textfield',
                    width: 175,
                    fieldLabel: 'город',
                    name: 'f11_dest'
                }, {
                    xtype: 'textfield',
                    width: 175,
                    fieldLabel: 'расстояние',
                    name: 'f11_distance'
                }]
            },{
                html: 'км'
            },{
                bodyStyle: 'text-align: center;',
                items: [{
                    xtype: 'numberfield',
                    width: 40,
                    name: 'f11_qty',
                    allowBlank: false,
                    minValue: 0,
                    value: 0
                }]
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'numberfield',
                    width: 60,
                    name: 'f11_price',
                    allowBlank: false,
                    minValue: 0,
                    value: 0
                }]
            },{
                html: 'р.'
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'displayfield',
                    width: 60,
                    name: 'f11_summ',
                    value: 0
                }]
            },{
                html: 'р.'
            },{
                bodyStyle: 'text-align: center;',
                items: [{
                    xtype: 'displayfield',
                    name: 'f11_margin',
                    value: 1.30
                }]
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'displayfield',
                    width: 60,
                    name: 'f11_total',
                    value: 0
                }]
            },{
                html: 'р.'
            },{
                // Rows separator
                cls: 'x-border-bottom',
                colspan: this.tableColumns
            },{
                bodyStyle: 'text-align: left; padding-left: 5px;',
                width: 260,
                items: [{
                    html: 'Командировочные, питание',
                    border: false
                }, {
                    layout: 'column',
                    border: false,
                    columns: 2,
                    defaults: {
                        border: false,
                        layout: 'form',
                        labelWidth: 50
                    },
                    items: [{
                        items: [{
                            xtype: 'textfield',
                            width: 60,
                            fieldLabel: 'человек',
                            name: 'f12_people'
                        }]
                    }, {
                        style: 'padding-left: 20px;',
                        items: [{
                            xtype: 'textfield',
                            width: 60,
                            fieldLabel: 'дней',
                            name: 'f12_days'
                        }]
                    }]
                }]
            },{
                html: 'чел/дни'
            },{
                bodyStyle: 'text-align: center;',
                items: [{
                    xtype: 'numberfield',
                    width: 40,
                    name: 'f12_qty',
                    allowBlank: false,
                    minValue: 0,
                    value: 0
                }]
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'numberfield',
                    width: 60,
                    name: 'f12_price',
                    allowBlank: false,
                    minValue: 0,
                    value: 0
                }]
            },{
                html: 'р.'
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'displayfield',
                    width: 60,
                    name: 'f12_summ',
                    value: 0
                }]
            },{
                html: 'р.'
            },{
                bodyStyle: 'text-align: center;',
                items: [{
                    xtype: 'displayfield',
                    name: 'f12_margin',
                    value: 1.25
                }]
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'displayfield',
                    width: 60,
                    name: 'f12_total',
                    value: 0
                }]
            },{
                html: 'р.'
            },{ 
                // Rows separator
                cls: 'x-border-bottom',
                colspan: this.tableColumns
            },{
                bodyStyle: 'text-align: left; padding-left: 5px;',
                width: 260,
                layout: 'form',
                labelWidth: 70,
                items: [{
                    html: 'Командировочные, проживание',
                    border: false
                }, {
                    layout: 'column',
                    border: false,
                    columns: 2,
                    defaults: {
                        border: false,
                        layout: 'form',
                        labelWidth: 50
                    },
                    items: [{
                        items: [{
                            xtype: 'textfield',
                            width: 60,
                            fieldLabel: 'человек',
                            name: 'f13_people'
                        }]
                    }, {
                        style: 'padding-left: 20px;',
                        items: [{
                            xtype: 'textfield',
                            width: 60,
                            fieldLabel: 'дней',
                            name: 'f13_days'
                        }]
                    }]
                }]
            },{
                html: 'чел/дни'
            },{
                bodyStyle: 'text-align: center;',
                items: [{
                    xtype: 'numberfield',
                    width: 40,
                    name: 'f13_qty',
                    allowBlank: false,
                    minValue: 0,
                    value: 0
                }]
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'numberfield',
                    width: 60,
                    name: 'f13_price',
                    allowBlank: false,
                    minValue: 0,
                    value: 0
                }]
            },{
                html: 'р.'
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'displayfield',
                    width: 60,
                    name: 'f13_summ',
                    value: 0
                }]
            },{
                html: 'р.'
            },{
                bodyStyle: 'text-align: center;',
                items: [{
                    xtype: 'displayfield',
                    name: 'f13_margin',
                    value: 1.25
                }]
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'displayfield',
                    width: 60,
                    name: 'f13_total',
                    value: 0
                }]
            },{
                html: 'р.'
            },{ 
                // Rows separator
                cls: 'x-border-bottom',
                colspan: this.tableColumns
            },{ 
                colspan: 5
            },{
                bodyStyle: 'text-align: right; background-color: #FCF400;',
                items: [{
                    xtype: 'displayfield',
                    width: 60,
                    name: 'g4_summ',
                    value: 0
                }]
            },{
                bodyStyle: 'background-color: #FCF400;',
                html: 'р.'
            },{
            },{
                bodyStyle: 'text-align: right; background-color: #FCF400;',
                items: [{
                    xtype: 'displayfield',
                    width: 60,
                    name: 'g4_total',
                    value: 0
                }]
            },{
                bodyStyle: 'background-color: #FCF400;',
                html: 'р.'
            },{ // Next group
                colspan: this.tableColumns,
                html: '<b>Дополнительно</b>',
                bodyStyle: 'padding: 5px; text-align: left; background-color: lightgreen;'
            },{
                bodyStyle: 'text-align: left; padding-left: 5px;',
                width: 260,
                html: 'Утилизация конструкций'
            },{
                html: 'контейнер'
            },{
                bodyStyle: 'text-align: center;',
                items: [{
                    xtype: 'numberfield',
                    width: 40,
                    name: 'f14_qty',
                    allowBlank: false,
                    minValue: 0,
                    value: 0
                }]
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'numberfield',
                    width: 60,
                    name: 'f14_price',
                    allowBlank: false,
                    minValue: 0,
                    value: 0
                }]
            },{
                html: 'р.'
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'displayfield',
                    width: 60,
                    name: 'f14_summ',
                    value: 0
                }]
            },{
                html: 'р.'
            },{
                bodyStyle: 'text-align: center;',
                items: [{
                    xtype: 'displayfield',
                    name: 'f14_margin',
                    value: 1.3
                }]
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'displayfield',
                    width: 60,
                    name: 'f14_total',
                    value: 0
                }]
            },{
                html: 'р.'
            },{ 
                // Rows separator
                cls: 'x-border-bottom',
                colspan: this.tableColumns
            },{
                bodyStyle: 'text-align: left; padding-left: 5px;',
                width: 260,
                layout: 'form',
                labelWidth: 70,
                items: [{
                    html: 'Непредвиденные расходы (ложный выезд и др.)',
                    border: false
                }, {
                    xtype: 'textfield',
                    width: 255,
                    hideLabel: true,
                    name: 'f15_descr'
                }]
            },{
                html: ''
            },{
                bodyStyle: 'text-align: center;',
                items: [{
                    xtype: 'numberfield',
                    width: 40,
                    name: 'f15_qty',
                    allowBlank: false,
                    minValue: 0,
                    value: 0
                }]
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'numberfield',
                    width: 60,
                    name: 'f15_price',
                    allowBlank: false,
                    minValue: 0,
                    value: 0
                }]
            },{
                html: 'р.'
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'displayfield',
                    width: 60,
                    name: 'f15_summ',
                    value: 0
                }]
            },{
                html: 'р.'
            },{
                bodyStyle: 'text-align: center;',
                items: [{
                    xtype: 'displayfield',
                    name: 'f15_margin',
                    value: 1
                }]
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'displayfield',
                    width: 60,
                    name: 'f15_total',
                    value: 0
                }]
            },{
                html: 'р.'
            },{ 
                // Rows separator
                cls: 'x-border-bottom',
                colspan: this.tableColumns
            },{
                bodyStyle: 'text-align: left; padding-left: 5px;',
                width: 260,
                layout: 'form',
                labelWidth: 70,
                items: [{
                    html: 'Непредвиденные расходы (ложный выезд и др.)',
                    border: false
                }, {
                    xtype: 'textfield',
                    width: 255,
                    hideLabel: true,
                    name: 'f16_descr'
                }]
            },{
                html: ''
            },{
                bodyStyle: 'text-align: center;',
                items: [{
                    xtype: 'numberfield',
                    width: 40,
                    name: 'f16_qty',
                    allowBlank: false,
                    minValue: 0,
                    value: 0
                }]
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'numberfield',
                    width: 60,
                    name: 'f16_price',
                    allowBlank: false,
                    minValue: 0,
                    value: 0
                }]
            },{
                html: 'р.'
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'displayfield',
                    width: 60,
                    name: 'f16_summ',
                    value: 0
                }]
            },{
                html: 'р.'
            },{
                bodyStyle: 'text-align: center;',
                items: [{
                    xtype: 'displayfield',
                    name: 'f16_margin',
                    value: 1
                }]
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'displayfield',
                    width: 60,
                    name: 'f16_total',
                    value: 0
                }]
            },{
                html: 'р.'
            },{ 
                // Rows separator
                cls: 'x-border-bottom',
                colspan: this.tableColumns
            },{
                bodyStyle: 'text-align: left; padding-left: 5px;',
                width: 260,
                layout: 'form',
                labelWidth: 70,
                items: [{
                    html: 'Непредвиденные расходы (ложный выезд и др.)',
                    border: false
                }, {
                    xtype: 'textfield',
                    width: 255,
                    hideLabel: true,
                    name: 'f17_descr'
                }]
            },{
                html: ''
            },{
                bodyStyle: 'text-align: center;',
                items: [{
                    xtype: 'numberfield',
                    width: 40,
                    name: 'f17_qty',
                    allowBlank: false,
                    minValue: 0,
                    value: 0
                }]
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'numberfield',
                    width: 60,
                    name: 'f17_price',
                    allowBlank: false,
                    minValue: 0,
                    value: 0
                }]
            },{
                html: 'р.'
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'displayfield',
                    width: 60,
                    name: 'f17_summ',
                    value: 0
                }]
            },{
                html: 'р.'
            },{
                bodyStyle: 'text-align: center;',
                items: [{
                    xtype: 'displayfield',
                    name: 'f17_margin',
                    value: 1
                }]
            },{
                bodyStyle: 'text-align: right;',
                items: [{
                    xtype: 'displayfield',
                    width: 60,
                    name: 'f17_total',
                    value: 0
                }]
            },{
                html: 'р.'
            },{ 
                // Rows separator
                cls: 'x-border-bottom',
                colspan: this.tableColumns
            },{ 
                colspan: 5
            },{
                bodyStyle: 'text-align: right; background-color: #FCF400;',
                items: [{
                    xtype: 'displayfield',
                    width: 60,
                    name: 'g5_summ',
                    value: 0
                }]
            },{
                bodyStyle: 'background-color: #FCF400;',
                html: 'р.'
            },{
            },{
                bodyStyle: 'text-align: right; background-color: #FCF400;',
                items: [{
                    xtype: 'displayfield',
                    width: 60,
                    name: 'g5_total',
                    value: 0
                }]
            },{
                bodyStyle: 'background-color: #FCF400;',
                html: 'р.'
            },{ 
                // Total row separator
                colspan: this.tableColumns
            },{ 
                // Rows separator
                cls: 'x-border-bottom',
                colspan: this.tableColumns
            },{ 
                bodyStyle: 'text-align: right; font-weight: 900;',
                html: 'ИТОГО:'
            },{
                colspan: 4
            },{
                bodyStyle: 'text-align: right; background-color: #FCF400; font-weight: 900;',
                items: [{
                    xtype: 'displayfield',
                    width: 60,
                    name: 'grand_summ',
                    value: 0
                }]
            },{
                bodyStyle: 'background-color: #FCF400; font-weight: 900;',
                html: 'р.'
            },{
            },{
                bodyStyle: 'text-align: right; background-color: #FCF400; font-weight: 900;',
                items: [{
                    xtype: 'displayfield',
                    width: 60,
                    name: 'grand_total',
                    value: 0
                }]
            },{
                bodyStyle: 'background-color: #FCF400; font-weight: 900;',
                html: 'р.'
            },{ 
                // Total row separator
                colspan: this.tableColumns
            }]
        }];
        
        PMS.Orders.Edit.MountBudgetForm.superclass.initComponent.apply(this, arguments);
        
        this.showinWindow();
        
        this.getForm().findField('order_id').setValue(this.orderId);
        
        this.initFieldsListeners.defer(150, this);
        this.calcFields.defer(150, this);
    },
    
    // Private functions 

    initFieldsListeners: function() {

        for (var i=1; i<=17; i++) {
            
            var qtyField    = this.getForm().findField('f'+i+'_qty'),
                priceField  = this.getForm().findField('f'+i+'_price');

            qtyField.on('change', this.calcFields, this);
            priceField.on('change', this.calcFields, this);
        }
    },
    
    calcFields: function() {
        
        var grand_summ = 0, grand_total = 0;
        
        // Calc ROWS
        for (var i=1; i<=17; i++) {
            var qty = this.getForm().findField('f'+i+'_qty').getValue(),
                price = this.getForm().findField('f'+i+'_price').getValue(),
                margin = this.getForm().findField('f'+i+'_margin').getValue();
            
            var summ = parseFloat(qty) * parseFloat(price),
                total = parseFloat(qty) * parseFloat(price) * parseFloat(margin); 
            
            this.getForm().findField('f'+i+'_summ').setValue(summ.toFixed(2));
            this.getForm().findField('f'+i+'_total').setValue(total.toFixed(2));
            
            grand_summ = grand_summ + parseFloat(summ); 
            grand_total = grand_total + parseFloat(total);
        }
        
        this.getForm().findField('grand_summ').setValue(grand_summ.toFixed(2));
        this.getForm().findField('grand_total').setValue(grand_total.toFixed(2));
        
        // Calc GROUPS
        
        // group 1
        var g_summ = 0, g_total = 0;
        for (var i=1; i<=2; i++) {
            var summ = this.getForm().findField('f'+i+'_summ').getValue(),
                total = this.getForm().findField('f'+i+'_total').getValue();
            
            g_summ = g_summ + parseFloat(summ); 
            g_total = g_total + parseFloat(total);
        }
        this.getForm().findField('g1_summ').setValue(g_summ.toFixed(2));
        this.getForm().findField('g1_total').setValue(g_total.toFixed(2));
        
        // group 2
        var g_summ = 0, g_total = 0;
        for (var i=3; i<=5; i++) {
            var summ = this.getForm().findField('f'+i+'_summ').getValue(),
                total = this.getForm().findField('f'+i+'_total').getValue();
            
            g_summ = g_summ + parseFloat(summ); 
            g_total = g_total + parseFloat(total);
        }
        this.getForm().findField('g2_summ').setValue(g_summ.toFixed(2));
        this.getForm().findField('g2_total').setValue(g_total.toFixed(2));
        
        // group 3
        var g_summ = 0, g_total = 0;
        for (var i=6; i<=10; i++) {
            var summ = this.getForm().findField('f'+i+'_summ').getValue(),
                total = this.getForm().findField('f'+i+'_total').getValue();
            
            g_summ = g_summ + parseFloat(summ); 
            g_total = g_total + parseFloat(total);
        }
        this.getForm().findField('g3_summ').setValue(g_summ.toFixed(2));
        this.getForm().findField('g3_total').setValue(g_total.toFixed(2));
        
        // group 4
        var g_summ = 0, g_total = 0;
        for (var i=11; i<=13; i++) {
            var summ = this.getForm().findField('f'+i+'_summ').getValue(),
                total = this.getForm().findField('f'+i+'_total').getValue();
            
            g_summ = g_summ + parseFloat(summ); 
            g_total = g_total + parseFloat(total);
        }
        this.getForm().findField('g4_summ').setValue(g_summ.toFixed(2));
        this.getForm().findField('g4_total').setValue(g_total.toFixed(2));
        
        // group 5
        var g_summ = 0, g_total = 0;
        for (var i=14; i<=17; i++) {
            var summ = this.getForm().findField('f'+i+'_summ').getValue(),
                total = this.getForm().findField('f'+i+'_total').getValue();
            
            g_summ = g_summ + parseFloat(summ); 
            g_total = g_total + parseFloat(total);
        }
        this.getForm().findField('g5_summ').setValue(g_summ.toFixed(2));
        this.getForm().findField('g5_total').setValue(g_total.toFixed(2));
    },
    
    showinWindow: function() {

        var w = new Ext.Window({
            title: 'Смета на монтаж',
            resizable: false,
            width: 820,
            layout: 'fit',
            height: 600,
            items: [this],
            buttons: [{
                text: 'Сохранить',
                handler: function() {
                    this.getForm().submit({
                        url: link('orders', 'budget', 'save'),
                        success: function(form, options) {
                            var o = options.result;
                            if (true == o.success) {
                                this.fireEvent('fomsaved');
                                w.close();
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
                    w.close();
                }
            }]
        });
        
        w.show();
    }
});