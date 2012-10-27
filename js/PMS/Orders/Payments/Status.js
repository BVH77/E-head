Ext.ns('PMS.Orders.Payments');

PMS.Orders.Payments.Status = Ext.extend(Ext.data.ArrayStore, {
	
    constructor: function() {
        
        PMS.Orders.Payments.Status.superclass.constructor.call(this, {
            idIndex: 0,
            fields: ['id', 'name'],
            data: [
                [0, 'Ожидается'],
                [1, 'Оплачено']//,
//                [2, 'Ждем подтверждения'],
//                [3, 'Задерживается']
            ]
        });
    }
});

Ext.reg('PMS.Orders.Payments.Status', PMS.Orders.Payments.Status);