Ext.ns('PMS.Orders.Edit');

PMS.Orders.Edit.Info = Ext.extend(Ext.Panel, {
    
    layout: 'form',
    
    padding: '5px',
    
    title: 'Детали',
    
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
            disabled: !acl.isUpdate('orders', 'address'),
            anchor: '-1',
            disabled: acl.isUpdate('customers'),
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
//	                    this.getForm().findField('production_start_planned').setDisabled(!status);
//	                    this.getForm().findField('production_start_fact').setDisabled(!status);
//	                    this.getForm().findField('production_end_planned').setDisabled(!status);
//	                    this.getForm().findField('production_end_fact').setDisabled(!status);
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
//	                    this.getForm().findField('mount_start_planned').setDisabled(!status);
//	                    this.getForm().findField('mount_start_fact').setDisabled(!status);
//	                    this.getForm().findField('mount_end_planned').setDisabled(!status);
//	                    this.getForm().findField('mount_end_fact').setDisabled(!status);
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