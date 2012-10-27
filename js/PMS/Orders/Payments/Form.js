Ext.ns('PMS.Orders.Payments');

PMS.Orders.Payments.Form = Ext.extend(xlib.form.FormPanel, {
    
    permissions: acl.isView('orders', 'payments'),
    
    labelWidth: 70,
    
    orderId: null,
    
    readOnly: false,
    
    defaults: {
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
            name: 'order_id',
            value: this.orderId
        }, {
            xtype: 'xlib.form.DateField',
            format: 'd-m-Y',
            fieldLabel: 'Дата',
            allowBlank: false,
            name: 'date',
            hiddenName: 'date'
        }, {
            xtype: 'numberfield',
            fieldLabel: 'Сумма (р.)',
            name: 'summ',
            allowBlank: false,
            validator: function(value) {
                return value > 0 ? true : 'Значение должно быть больше нуля';
            }
        }, {
            xtype: 'checkbox',
            fieldLabel: 'Оплачено',
            name: 'status',
            inputValue: 1
        }];
        
        PMS.Orders.Payments.Form.superclass.initComponent.apply(this, arguments);
    }
});