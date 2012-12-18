Ext.ns('PMS.Orders.Edit');

PMS.Orders.Edit.Delivery = Ext.extend(Ext.Panel, {
    
	title: 'Доставка',
	
	layout: 'column',

	columns: 2,
    
    padding: '5px',

    autoHeight: true,
    
    border: false,
    
    defaults: {
        layout: 'form',
        columnWidth: .4,
        border: false
    },
    
    initComponent: function() {

        this.items = [{
            items: [{ 
                name: 'delivery_start_planned',
                hiddenName: 'delivery_start_planned',
                xtype: 'xlib.form.DateField',
                fieldLabel: 'Начало - план',
                disabled: !acl.isUpdate('orders', 'delivery', 'start_planned')
            }]
        }, {
            items: [{ 
                name: 'delivery_start_fact',
                hiddenName: 'delivery_start_fact',
                xtype: 'xlib.form.DateField',
                fieldLabel: 'Начало - факт',
                disabled: !acl.isUpdate('orders', 'delivery', 'start_fact')
            }]
        }, {
            items: [{             
                name: 'delivery_end_planned',
                hiddenName: 'delivery_end_planned',
                xtype: 'xlib.form.DateField',
                fieldLabel: 'Конец - план',
                disabled: !acl.isUpdate('orders', 'delivery', 'end_planned')
            }]
        }, {
            items: [{ 
                name: 'delivery_end_fact',
                hiddenName: 'delivery_end_fact',
                xtype: 'xlib.form.DateField',
                fieldLabel: 'Конец - факт',
                disabled: !acl.isUpdate('orders', 'delivery', 'end_fact')
            }]
        }];

        PMS.Orders.Edit.Delivery.superclass.initComponent.apply(this, arguments);
    }
});