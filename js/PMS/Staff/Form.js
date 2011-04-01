Ext.ns('PMS.Staff');

PMS.Staff.Form = Ext.extend(xlib.form.FormPanel, {

    itemId: null,
    
    categoryId: null,
    
    itemURL:    link('staff', 'index', 'get'),
    
    addURL:     link('staff', 'index', 'add'),
    
    updateURL:  link('staff', 'index', 'update'),
    
    loadMask: true,

    fileUpload: true,
    
    markFieldsDirty: false,
    
//    labelWidth: 70,
    
//    defaults: {
//        disabledClass: ''
//    },
    
    permissions: acl.isUpdate('staff'),
    
    initComponent: function() {
        
        this.items = [{
            xtype: 'textfield',
            fieldLabel: 'Имя',
            name: 'name',
            allowBlank: false
        }, {
            xtype: 'textfield',
            fieldLabel: 'Должность',
            name: 'function',
            allowBlank: false
        }, {
            layout: 'column',
            border: false,
            columns: 3,
            defaults: {
                border: false,
                layout: 'form'
            },
            items: [{
                columnWidth: .33,
                items: [{
                    xtype: 'xlib.form.DateField',
                    fieldLabel: 'Принят на работу',
                    name: 'hire_date',
                    hiddenName: 'hire_date',
                    width: 100,
                    allowBlank: false
                }]
            }, {
                labelWidth: 100,
                columnWidth: .33,
                items: [{
                    xtype: 'xlib.form.combobox',
                    fieldLabel: 'Система оплаты',
                    name: 'pay_period',
                    hiddenName: 'pay_period',
                    mode: 'local',
                    displayField: 'name',
                    valueField: 'id',
                    store: new Ext.data.ArrayStore({
                        fields: ['id', 'name'],
                        data: PMS.Staff.PayPeriods
                    }),
                    selectFirst: true,
                    editable: false,
                    allowBlank: false,
                    width: 100
                }]
            }, {
                labelWidth: 80,
                columnWidth: .34,
                items: [{
                    xtype: 'numberfield',
                    fieldLabel: 'Тариф (руб.)',
                    name: 'pay_rate',
                    anchor: '100%',
                    allowBlank: false
                }]
            }]
        }, {
            xtype: 'fileuploadfield',
            fieldLabel: 'Резюме',
            name: 'cv_file',
            buttonText: '',
            allowBlank: true,
            buttonCfg: {
                iconCls: 'x-form-file-btn-icon'
            }
        }];
        
        PMS.Staff.Form.superclass.initComponent.apply(this, arguments);
        
        var w = this.getWindow(this.itemId).show();
        
        if (this.itemId) {
            this.getForm().load({
                url: this.itemURL,
                params: {
                    id: this.itemId
                }
            });
        }
    },
    
    // Private functions 
    
    getWindow: function(id) {
        
       var w = new Ext.Window({
            title: !id ? 'Новая запись' : 'Запись № ' + id,
            resizable: false,
            hidden: false,
            width: 750,
            height: 178,
            modal: true,
            items: [this],
            buttons: [{
                text: 'Сохранить',
                hidden: !this.permissions,
                handler: function() {
                    
                    if (!this.getForm().isValid()) {
                        return;
                    }
                    
                    this.getForm().submit({
                        params: {
                            id: this.itemId,
                            category_id: this.categoryId
                        },
                        url: !this.itemId ? this.addURL : this.updateURL,
                        success: function(form, options) {
                            var o = options.result;
                            if (true == o.success) {
                                form.fireEvent('saved');
                                w.close();
                                return;
                            }
                            xlib.Msg.error('Не удалось сохранить.')
                        },
                        failure: function() {
                            xlib.Msg.error('Не удалось сохранить.')
                        }
                    });
                },
                scope: this
            }, {
                text: 'Отмена',
                handler: function() {
                    w.close();
                }
            }]
        });
        
        return w;
    }
});

Ext.reg('PMS.Notice.Form', PMS.Notice.Form);