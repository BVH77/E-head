Ext.ns('PMS.Orders.Requests');

PMS.Orders.Requests.Form = Ext.extend(xlib.form.FormPanel, {
    
    permissions: acl.isView('orders'),
    
    labelWidth: 100,
    
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
            name: 'asset_id'
        }, {
            layout: 'column',
            border: false,
            columns: 2,
            defaults: {
                layout: 'form',
                border: false
            },
            items: [{
                columnWidth: .88,
                items: [{
                    xtype: 'textfield',
                    fieldLabel: 'Наименование',
                    name: 'name',
                    allowBlank: false,
                    id: 'nameField',
                    anchor: '100%'
                }]
            }, {
                columnWidth: .12,
                labelWidth: 1, 
                items: [{
                    xtype: 'menuitem',
                    iconCls: 'prod_schd-icon',
                    text: 'Выбор',
                    style: 'padding-left: 22px;',
                    handler: this.onChoice,
                    scope: this
                }]
            }]
        }, {
            layout: 'column',
            border: false,
            columns: 2,
            defaults: {
                border: false,
                layout: 'form'
            },
            items: [{
                columnWidth: .80,
                items: [{
                    xtype: 'numberfield',
                    fieldLabel: 'Количество',
                    name: 'qty',
                    validator: function(value) {
                        return value > 0 ? true : 'Значение должно быть больше нуля';
                    },
                    anchor: '100%'
                }]
            }, {
                columnWidth: .20,
                labelWidth: 1, 
                items: [{
                    xtype: 'PMS.Storage.Measures.ComboBox',
                    name: 'measure',
                    anchor: '100%'
                }]
            }]
        }, {
            layout: 'column',
            border: false,
            columns: 2,
            defaults: {
                border: false,
                layout: 'form'
            },
            items: [{
                columnWidth: .45,
                items: [{
                    xtype: 'xlib.form.DateField',
                    format: 'd-m-Y',
                    fieldLabel: 'Заявка на дату',
                    allowBlank: false,
                    name: 'request_on',
                    hiddenName: 'request_on',
                    anchor: '95%'
                }]
            }, {
                columnWidth: .55,
                labelWidth: 80,
                items: [{
                    xtype: 'displayfield',
                    style: 'line-height: 18px;',
                    value: (new Date()).format(xlib.date.DATE_TIME_FORMAT),
                    fieldLabel: 'Дата подачи',
                    name: 'created',
                    anchor: '100%'
                }]
            }]
        }, {
            layout: 'column',
            border: false,
            columns: 2,
            defaults: {
                border: false,
                layout: 'form'
            },
            items: [{
                columnWidth: .45,
                items: [{
                    xtype: 'displayfield',
                    fieldLabel: 'К заказу №',
                    name: 'order_id',
                    value: this.orderId,
                    anchor: '95%'
                }, {
                    xtype: 'hidden',
                    name: 'order_id',
                    value: this.orderId
                }]
            }, {
                columnWidth: .55,
                labelWidth: 80,
                items: [{
                    xtype: 'displayfield',
                    style: 'line-height: 18px;',
                    value: xlib.username || '',
                    fieldLabel: 'Автор заявки',
                    name: 'account_name',
                    anchor: '100%'
                }]
            }]
        }, {
            xtype: 'textarea',
            fieldLabel: 'Описание',
            name: 'description',
            allowBlank: true
        }];
        
        PMS.Orders.Requests.Form.superclass.initComponent.apply(this, arguments);
        
        this.processName.defer(150, this);
        
        if (this.readOnly) {
            this.setReadOnly.defer(200, this);
        }
    },
    
    // Private functions 

    setReadOnly: function() {
        
        Ext.each(this.findByType('menuitem'), function(item) {
            item.disable();
        });
        
        this.getForm().applyToFields({readOnly: true});
    },
    
    onChoice: function() {
        
        var assets = new PMS.Storage.Assets.Layout({
            title: false,
            readOnly: true
        });
        
        var w = new Ext.Window({
            title: 'Выбор ТМЦ',
            resizable: false,
            width: 900,
            height: 600,
            modal: true,
            layout: 'fit',
            items: [assets],
            buttons: [{
                text: 'OK',
                handler: function() {
                    
                    var record = assets.getSelected();
                    if (false === record) {
                        return;
                    }
                    
                    var assetField = this.getForm().findField('asset_id');
                    if (null === assetField) {
                        return;
                    }
                    
                    var nameField = this.getForm().findField('name');
                    var measureField = this.getForm().findField('measure');
                    if (null === nameField || null === measureField) {
                        return;
                    }
                    
                    assetField.setValue(record.get('id'));
                    nameField.setValue(record.get('name')).disable();
                    measureField.setValue(record.get('measure')).disable();
                    
                    w.close();
                    
                },
                scope: this
            }, {
                text: 'Отмена',
                handler: function() {
                    w.close();
                }
            }]
        });
        w.show();
    },
    
    processName: function() {
        
        var assetField = this.getForm().findField('asset_id');
        if (null === assetField 
        || Ext.isEmpty(assetField.getValue()) 
        || 0 === parseInt(assetField.getValue())) {
            return;
        }
                
        var nameField = this.getForm().findField('name');
        var measureField = this.getForm().findField('measure');
        if (null === nameField || null === measureField || Ext.isEmpty(nameField.getValue())) {
            return;
        }
        nameField.disable();
        measureField.disable();
        measureField.hideTriggerItem('btn0');
    }
});