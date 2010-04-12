Ext.ns('PMS.Customers');

PMS.Customers.Combo = Ext.extend(OSDN.form.ComboTrigger, {
	
    lazyInit: false,
    
    displayField: 'name',
	
    valueField: 'id',
	
    hiddenName: 'customer_id',
	
    name: 'customer_id',
	
    fieldLabel: 'Заказчик',
	
    editable: false,
	
    allowBlankOption: true,
	
    resizable: false,
	
    trackResetOnLoad: true,
	
    permissions: acl.isAdd('customers'),
	
	allowBlank: true,
	
    pageSize: 20,

    listWidth: 500,
    
    mode: 'remote',
    
    overCls: '',
    
    filteringMode: 'remote',

    initComponent: function() {
        
        this.store = new Ext.data.JsonStore({
            url: link('orders', 'customers', 'get-list'),
            root: 'data',
            fields: ['id', 'name', 'descrioption'] 
        });
        
        this.triggers = [{
            cls: 'add',
            name: 'btn0',
            overCls: '',
            permissions: acl.isAdd('customers'),
            qtip: 'Добавить заказчика',
            handler: function(e, node) {
                this.collapse();
                var f = new PMS.ContragentsFormAbstract({
                    permissions: acl.isAdd('customers'),
                    entity: 'customers',
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
            }
        }, {
            cls: 'edit',
            name: 'btn1',
            overCls: '',
            permissions: acl.isUpdate('customers'),
            qtip: 'Редактировать заказчика',
            handler: function(e, node) {
                this.collapse();
                var value = this.getValue();
                if (value > 0) {
                    var f = new PMS.ContragentsFormAbstract({
                        sid: value,
                        permissions: acl.isUpdate('customers'),
                        entity: 'customers',
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

Ext.reg('pms.customers.combo', PMS.Customers.Combo);