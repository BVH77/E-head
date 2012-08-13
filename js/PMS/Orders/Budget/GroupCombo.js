Ext.ns('PMS.Orders.Budget');

PMS.Orders.Budget.GroupCombo = Ext.extend(xlib.form.ComboTrigger, {
	
    lazyInit: false,
    
    displayField: 'name',
	
    valueField: 'id',
	
    hiddenName: 'group_id',
	
    name: 'group_id',
	
    fieldLabel: 'Группа расходов',
	
    updatePermissions: acl.isUpdate('orders'),

    loadURL: link('orders', 'budget-groups', 'get-list'),
    
    editable: false,
	
    allowBlankOption: true,
	
    resizable: false,
	
    trackResetOnLoad: true,
	
	allowBlank: true,
	
    mode: 'remote',
    
    overCls: '',
    
    filteringMode: 'remote',

    initComponent: function() {
        
        this.store = new Ext.data.JsonStore({
            url: this.loadURL,
            root: 'data',
            fields: ['id', 'name'] 
        });
        
        PMS.Orders.Budget.GroupCombo.superclass.initComponent.apply(this, arguments);
    }
});

Ext.reg('PMS.Orders.Budget.GroupCombo', PMS.Orders.Budget.GroupCombo);