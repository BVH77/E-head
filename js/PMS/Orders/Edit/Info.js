Ext.ns('PMS.Orders.Edit');

PMS.Orders.Edit.Info = Ext.extend(Ext.Panel, {
    
    layout: 'form',
    
    padding: '5px',
    
    title: 'Детали',
    
    permissions: acl.isUpdate('orders'),
    
    autoHeight: true,
    
    border: false,
    
    defaults: {
        xtype: 'panel',
        anchor: '100%',
        border: false,
        layout: 'column',
        columns: 2,
        defaults: {
			columnWidth: .5,
            border: false,
            layout: 'form'
        }
    },
    
    initComponent: function() {

        this.items = [{
            xtype: 'pms.customers.combo',
            permissions: acl.isUpdate('customers'),
            disabled: acl.isUpdate('customers'),
            anchor: '-1',
			allowBlank: false
        }, {
            xtype: 'textfield',
            name: 'address',
            fieldLabel: 'Адрес',
            disabled: !acl.isUpdate('orders', 'address'),
			allowBlank: false
        }, {
            items: [{
                items: [{
                    name: 'success_date_planned',
                    hiddenName: 'success_date_planned',
                    xtype: 'xlib.form.DateField',
                    fieldLabel: 'Сдача (план)',
                    disabled: !acl.isUpdate('orders', 'success', 'planned'),
                    anchor: 0,
                    allowBlank: false
                }]
            }, {
                items: [{
                    name: 'success_date_fact',
                    hiddenName: 'success_date_fact',
                    xtype: 'xlib.form.DateField',
                    fieldLabel: 'Сдача (факт)',
                    disabled: !acl.isUpdate('orders', 'success', 'fact'),
                    anchor: 0,
                    allowBlank: true
                }]
            }]
        }, {
        	items: [{
        		items: [{
        			xtype: 'checkbox',
        			fieldLabel: 'Производство',
        			boxLabel: 'вкл./выкл.',
        			name: 'production',
                    inputValue: 1,
                    checked: true,
        			disabled: !acl.isUpdate('orders', 'production'),
        			anchor: 0,
        			allowBlank: false,
        			handler: function(cb, status) {
        				this.fireEvent('productionChecked', status);
	                }, scope: this
        		}]
        	}, {
        		items: [{
        			xtype: 'checkbox',
        			fieldLabel: 'Монтаж',
        			boxLabel: 'вкл./выкл.',
        			name: 'mount',
                    inputValue: 1,
                    checked: true,
        			disabled: !acl.isUpdate('orders', 'mount'),
        			anchor: 0,
        			allowBlank: false,
        			handler: function(cb, status) {
        				this.fireEvent('mountChecked', status);
	                }, scope: this
        		}]
        	}]
        }, {
            hidden: !acl.isView('orders', 'cost'),
            items: [{
                items: [{
                    name: 'cost',
                    xtype: 'numberfield',
                    fieldLabel: 'Стоимость',
                    disabled: !acl.isUpdate('orders', 'cost'),
                    anchor: 0,
                    minValue: 1,
                    allowBlank: false
                }]
            }, {
                items: [{
                    name: 'advanse',
                    xtype: 'numberfield',
                    fieldLabel: 'Аванс',
                    disabled: !acl.isUpdate('orders', 'cost'),
                    anchor: 0,
                    allowBlank: false
                }]
            }]
        }, {
        	name: 'description',
        	xtype: 'textarea',
        	fieldLabel: 'Описание',
        	height: 160,
        	disabled: !acl.isUpdate('orders', 'description'),
        	allowBlank: true
        }];
        
        PMS.Orders.Edit.Info.superclass.initComponent.apply(this, arguments);
        
        this.addEvents('productionChecked', 'mountChecked');
    }
});