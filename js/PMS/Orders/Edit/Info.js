Ext.ns('PMS.Orders.Edit');

PMS.Orders.Edit.Info = Ext.extend(xlib.form.FormPanel, {
    
    permissions: true,
    
    labelWidth: 150,
    
    autoHeight: true,
    
    border: false,
    
    loadURL: link('orders', 'index', 'get'),
    
    defaults: {
        xtype: 'panel',
        anchor: '100%',
        border: false,
        layout: 'column',
        columns: 2,
        defaults: {
            xtype: 'panel',
            border: false,
            layout: 'form'
        }
    },
    
    initComponent: function() {
        
        this.items = [{
            xtype: 'pms.customers.combo',
            disabled: !acl.isUpdate('orders', 'address'),
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
                columnWidth: .45,
                items: [{ 
                    name: 'production_start_planned',
                    hiddenName: 'production_start_planned',
                    xtype: 'xlib.form.DateField',
                    fieldLabel: 'Начало пр-ва (план)',
                    disabled: !acl.isUpdate('orders', 'production', 'start_planned'),
                    anchor: 0,
                    allowBlank: false
                }]
            }, {
                columnWidth: .45,
                items: [{ 
                    name: 'production_start_fact',
                    hiddenName: 'production_start_fact',
                    xtype: 'xlib.form.DateField',
                    fieldLabel: 'Начало пр-ва (факт)',
                    disabled: !acl.isUpdate('orders', 'production', 'start_fact'),
                    anchor: 0,
                    allowBlank: true
                }]
            }, {
                columnWidth: .1,
                items:[{
                    hideLabel: true,
                    xtype: 'checkbox',
                    name: 'production',
                    inputValue: 1,
                    checked: true,
                    disabled: !acl.isUpdate('orders', 'production'),
                    handler: function(cb, status) {
                        this.getForm().findField('production_start_planned').setDisabled(!status);
                        this.getForm().findField('production_start_fact').setDisabled(!status);
                        this.getForm().findField('production_end_planned').setDisabled(!status);
                        this.getForm().findField('production_end_fact').setDisabled(!status);
                    }, scope: this
                }]
            }]
        }, {
            items: [{
                columnWidth: .45,
                items: [{             
                    name: 'production_end_planned',
                    hiddenName: 'production_end_planned',
                    xtype: 'xlib.form.DateField',
                    fieldLabel: 'Конец пр-ва (план)',
                    disabled: !acl.isUpdate('orders', 'production', 'end_planned'),
                    anchor: 0,
                    allowBlank: false
                }]
            }, {
                columnWidth: .45,
                items: [{ 
                    name: 'production_end_fact',
                    hiddenName: 'production_end_fact',
                    xtype: 'xlib.form.DateField',
                    fieldLabel: 'Конец пр-ва (факт)',
                    disabled: !acl.isUpdate('orders', 'production', 'end_fact'),
                    anchor: 0,
                    allowBlank: true
                }]
            }, {
                columnWidth: .1,
                items:[{
                    xtype: 'label',
                    text: 'вкл./выкл.'
                }]
            }]
        }, {
            items: [{
                columnWidth: .45,
                items: [{
                    name: 'mount_start_planned',
                    hiddenName: 'mount_start_planned',
                    xtype: 'xlib.form.DateField',
                    fieldLabel: 'Начало монтажа (план)',
                    disabled: !acl.isUpdate('orders', 'mount', 'start_planned'),
                    anchor: 0,
                    allowBlank: false
                }]
            }, {
                columnWidth: .45,
                items: [{
                    name: 'mount_start_fact',
                    hiddenName: 'mount_start_fact',
                    xtype: 'xlib.form.DateField',
                    fieldLabel: 'Начало монтажа (факт)',
                    disabled: !acl.isUpdate('orders', 'mount', 'start_fact'),
                    anchor: 0,
                    allowBlank: true
                }]
            }, {
                columnWidth: .1,
                items:[{
                    hideLabel: true,
                    xtype: 'checkbox',
                    name: 'mount',
                    inputValue: 1,
                    checked: true,
                    disabled: !acl.isUpdate('orders', 'mount'),
                    handler: function(cb, status) {
                        this.getForm().findField('mount_start_planned').setDisabled(!status);
                        this.getForm().findField('mount_start_fact').setDisabled(!status);
                        this.getForm().findField('mount_end_planned').setDisabled(!status);
                        this.getForm().findField('mount_end_fact').setDisabled(!status);
                    }, scope: this
                }]
            }]
        }, {
            items: [{
                columnWidth: .45,
                items: [{
                    name: 'mount_end_planned',
                    hiddenName: 'mount_end_planned',
                    xtype: 'xlib.form.DateField',
                    fieldLabel: 'Конец монтажа (план)',
                    disabled: !acl.isUpdate('orders', 'mount', 'end_planned'),
                    anchor: 0,
                    allowBlank: false
                }]
            }, {
                columnWidth: .45,
                items: [{
                    name: 'mount_end_fact',
                    hiddenName: 'mount_end_fact',
                    xtype: 'xlib.form.DateField',
                    fieldLabel: 'Конец монтажа (факт)',
                    disabled: !acl.isUpdate('orders', 'mount', 'end_fact'),
                    anchor: 0,
                    allowBlank: true
                }]
            }, {
                columnWidth: .1,
                items:[{
                    xtype: 'label',
                    text: 'вкл./выкл.'
                }]
            }]
        }, {
            items: [{
                columnWidth: .45,
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
                columnWidth: .45,
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
            hidden: !acl.isView('orders', 'cost'),
            items: [{
                columnWidth: .45,
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
                columnWidth: .45,
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
            height: 90,
            disabled: !acl.isUpdate('orders', 'description'),
            allowBlank: true
        }];
        
        PMS.Orders.Edit.Info.superclass.initComponent.apply(this, arguments);
    },
    
    saveData: function() {
        if (this.form.getForm().isValid()) {
            this.form.getForm().submit({
                url: this.saveURL,
                params: {id: this.id},
                success: function(f, action) {
                    if (true === action.result.success) {
                        this.id = action.result.id;
                        this.fireEvent('saved', this.id);
                        this.wind.close();
                    } else {
                        this.onFailure(f, action);
                    }
                }, 
                failure: function(response, options) {
                    var res = Ext.decode(response.responseText);
                    this.onFailure(res, options);
                },
                scope: this
            });
        }
    },
    
    loadData: function(record) {
        this.getForm().loadRecord(record);
    }
});