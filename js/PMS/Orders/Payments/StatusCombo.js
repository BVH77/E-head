Ext.ns('PMS.Orders.Payments');

PMS.Orders.Payments.StatusCombo = Ext.extend(xlib.form.ComboBox, {
	
    displayField: 'name',
	
    valueField: 'id',
	
    hiddenName: 'status',
	
    name: 'status',
	
    fieldLabel: 'Статус',
	
    editable: false,
	
    resizable: false,
	
    trackResetOnLoad: true,
	
	allowBlank: false,
	
    mode: 'local',
    
    overCls: '',
    
    initComponent: function() {
        this.store = new PMS.Orders.Payments.Status();
        PMS.Orders.Payments.StatusCombo.superclass.initComponent.apply(this, arguments);
    }
});

Ext.reg('PMS.Orders.Payments.StatusCombo', PMS.Orders.Payments.StatusCombo);