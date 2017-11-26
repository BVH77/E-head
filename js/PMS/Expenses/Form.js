Ext.ns('PMS.Expenses');

PMS.Expenses.Form = Ext.extend(xlib.form.FormPanel, {

    itemId: null,
    
    itemURL:    link('expenses', 'index', 'get'),
    
    addURL:     link('expenses', 'index', 'add'),
    
    updateURL:  link('expenses', 'index', 'update'),
    
    loadMask: true,

    markFieldsDirty: false,
    
    labelWidth: 100,
    
    permissions: acl.isUpdate('expenses'),
    
    initComponent: function() {
        
        this.items = [{
            fieldLabel: 'Категория',
            xtype: 'textfield',
            name: 'category'
        }, {
            fieldLabel: 'Статья',
            xtype: 'textfield',
            name: 'entry'
        }, {
            fieldLabel: 'Сумма',
            xtype: 'numberfield',
            anchor: 0,
            name: 'summ'
        }, {
            fieldLabel: '№ заказа',
            xtype: 'numberfield',
            anchor: 0,
            allowBlank: true,
            name: 'order_id'
        }, {
            fieldLabel: 'Дата',
            hiddenName: 'date',
            xtype: 'xlib.form.DateField',
            anchor: 0,
            name: 'date',
            value: (new Date()).format(xlib.date.DATE_FORMAT)
        }, {
            xtype: 'textarea',
            fieldLabel: 'Комментарий',
            allowBlank: true,
            name: 'comment'
        }];
        
        PMS.Expenses.Form.superclass.initComponent.apply(this, arguments);
        
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
            width: 400,
            //height: 500,
            items: [this],
            buttons: [{
                text: 'Сохранить',
                hidden: !this.permissions,
                handler: function() {
                    if (!this.getForm().isValid()) return;
                    var params = {};
                    if (id) params.id = id;
                    this.getForm().submit({
                        params: params,
                        url: !id ? this.addURL : this.updateURL,
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

Ext.reg('PMS.Expenses.Form', PMS.Expenses.Form);