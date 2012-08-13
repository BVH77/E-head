Ext.ns('PMS.Orders.Budget');

PMS.Orders.Budget.Form = Ext.extend(xlib.form.FormPanel, {
    
    permissions: acl.isView('orders'),
    
    orderId: null,
    
    defaults: {
        defaults: {
            defaults: {
                border: false,
                anchor: '90%'
            },
            layout: 'form',
            border: false
        },
        border: false,
        anchor: '100%'
    },
    
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
            xtype: 'PMS.Orders.Budget.GroupCombo',
            allowBlank: false
        }, {
            xtype: 'textfield',
            fieldLabel: 'Статья расходов',
            name: 'name',
            allowBlank: false
        }, {
            layout: 'column',
            items: [{
                items: [{
                    xtype: 'textfield',
                    fieldLabel: 'Ед. изм.',
                    name: 'measure',
                    allowBlank: false
                }]
            }, {
                style: 'padding-left: 22px;',
                items: [{
                    xtype: 'numberfield',
                    fieldLabel: 'Кол-во',
                    name: 'qty',
                    allowBlank: false,
                    validator: function(value) {
                        return value > 0 ? true : 'Значение должно быть больше нуля';
                    },
                    listeners: {
                        change: this.calcFields,
                        scope: this
                    }
                }]
            }]
        }, {
            layout: 'column',
            items: [{
                items: [{
                    xtype: 'numberfield',
                    fieldLabel: 'Цена',
                    name: 'price',
                    allowBlank: false,
                    validator: function(value) {
                        return value > 0 ? true : 'Значение должно быть больше нуля';
                    },
                    listeners: {
                        change: this.calcFields,
                        scope: this
                    }
                }]
            }, {
                style: 'padding-left: 22px;',
                items: [{
                    xtype: 'numberfield',
                    fieldLabel: 'Сумма',
                    disabled: true,
                    name: 'summ'
                }]
            }]
        }, {
            layout: 'column',
            items: [{
                items: [{
                    xtype: 'numberfield',
                    fieldLabel: 'Наценка (коэф.)',
                    name: 'margin',
                    allowBlank: false,
                    validator: function(value) {
                        return value > 0 ? true : 'Значение должно быть больше нуля';
                    },
                    listeners: {
                        change: this.calcFields,
                        scope: this
                    }
                }]
            }, {
                style: 'padding-left: 22px;',
                items: [{
                    xtype: 'numberfield',
                    fieldLabel: 'Стоимость',
                    disabled: true,
                    name: 'total'
                }]
            }]
        }];
        
        PMS.Orders.Budget.Form.superclass.initComponent.apply(this, arguments);
        
        this.calcFields.defer(150, this);
    },
    
    // Private functions 

    calcFields: function() {
        var qtyField = this.getForm().findField('qty'),
            priceField = this.getForm().findField('price'),
            summField = this.getForm().findField('summ'),
            marginField = this.getForm().findField('margin'),
            totalField = this.getForm().findField('total');
            
        summField.setValue(qtyField.getValue() * priceField.getValue());
        totalField.setValue(qtyField.getValue() * priceField.getValue() * marginField.getValue());
    }
});