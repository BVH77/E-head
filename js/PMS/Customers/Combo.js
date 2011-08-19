Ext.ns('PMS.Customers');

PMS.Customers.Combo = Ext.extend(xlib.form.ComboTrigger, {
	
    lazyInit: false,
    
    displayField: 'name',
	
    valueField: 'id',
	
    hiddenName: 'customer_id',
	
    name: 'customer_id',
	
    fieldLabel: 'Заказчик',
	
    updatePermissions: acl.isUpdate('customers'),

    loadURL: link('orders', 'customers', 'get-list'),
    
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
            sortInfo: {
                field: 'name',
                direction: 'ASC'
            },
            fields: ['id', 'name', 'description'] 
        });
        
        this.triggers = [{
            cls: 'add',
            name: 'btn0',
            overCls: '',
            permissions: this.updatePermissions,
            qtip: 'Добавить заказчика',
            handler: function(e, node) {
                this.collapse();
                var f = new PMS.Customers.Form({
                    permissions: this.updatePermissions,
                    listeners: {
                        saved: function(id) {
                            this.setValue(id);
                            this.store.reload();
                            win.close();
                        },
                        scope: this
                    }
                });
                var win = f.showInWindow({
                    title: 'Добавить заказчика'
                });
            },
            scope: this
        }, {
            cls: 'edit',
            name: 'btn1',
            overCls: '',
            permissions: this.updatePermissions,
            qtip: 'Редактировать заказчика',
            handler: function(e, node) {
                this.collapse();
                var value = this.getValue();
                if (value > 0) {
                    var f = new PMS.Customers.Form({
                        sid: value,
                        permissions: this.updatePermissions,
                        listeners: {
                            saved: function(id) {
                                this.store.reload();
                                win.close();
                            },
                            scope: this
                        }
                    });
                    var win = f.showInWindow({
                        title: 'Редактировать заказчика'
                    });
                }
            }
        }];
    	
        PMS.Customers.Combo.superclass.initComponent.apply(this, arguments);
    }
});

Ext.reg('PMS.Customers.Combo', PMS.Customers.Combo);