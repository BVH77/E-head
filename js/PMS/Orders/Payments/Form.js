Ext.ns('PMS.Orders.Payments');

PMS.Orders.Payments.Form = Ext.extend(xlib.form.FormPanel, {
    
    permissions: acl.isView('orders', 'payments'),
    
    labelWidth: 120,
    
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
            fieldLabel: 'Дата счёта',
            allowBlank: false,
            name: 'date',
            hiddenName: 'date'
        }, {
            xtype: 'textfield',
            fieldLabel: '№ счёта',
            allowBlank: false,
            name: 'bill'
        }, {
            xtype: 'numberfield',
            fieldLabel: 'Сумма счёта (р.)',
            name: 'summ',
            allowBlank: false,
            validator: function(value) {
                return value > 0 ? true : 'Значение должно быть больше нуля';
            }
        }, {
            xtype: 'xlib.form.DateField',
            format: 'd-m-Y',
            fieldLabel: 'Дата оплаты',
            allowBlank: true,
            name: 'date_pay',
            hiddenName: 'date_pay'
        }, {
            xtype: 'numberfield',
            fieldLabel: 'Сумма оплаты (р.)',
            allowBlank: true,
            name: 'summ_pay'
        }];
        
        PMS.Orders.Payments.Form.superclass.initComponent.apply(this, arguments);
    }
});