Ext.ns('PMS.Orders');

PMS.Orders.Edit = Ext.extend(xlib.form.FormPanel, {
    
    saveURL: link('orders', 'index', 'update'),
    
    addURL: link('orders', 'index', 'add'),
    
    archiveURL: link('orders', 'index', 'archive'),
    
    record: null,
    
    orderId: null,
    
    productionEnabled: false,
    
    printEnabled: false,
    
    mountEnabled: false,
    
    permissions: acl.isUpdate('orders'),
    
    allowEditFiles: false,
    
    border: false,
    
    padding: 0,
    
    initComponent: function() {

    	this.formInfo = new PMS.Orders.Edit.Info();
        
        this.formProduction = new PMS.Orders.Edit.Production({
            scope: this
        });
        
        this.formPrint = new PMS.Orders.Edit.Print({
            scope: this
        });
        
        this.formDelivery = new PMS.Orders.Edit.Delivery({
            scope: this
        });
        
        this.formMount = new PMS.Orders.Edit.Mount({
            height: 333,
    	    scope: this
        });
        
        this.tabPanel = new Ext.TabPanel({
            activeTab: 0,
            border: false,
            items: [this.formInfo]
        });
    	
        this.items = [this.tabPanel];
        
        this.bbar = [{
    		text: 'В архив', 
    		hidden: (!this.record || !this.record.get('success_date_fact') || !acl.isUpdate('archive')),
    		handler: this.archive, 
    		scope: this
    	}, '->', {
            text: 'Сохранить', 
            hidden: !acl.isUpdate('orders'),
            handler: this.onSave, 
            scope: this
        }, {
            text: acl.isUpdate('orders') ? 'Отменить' : 'Закрыть', 
            handler: function() {
                this.wind.close();
            }, 
            scope: this
        }];
        
        PMS.Orders.Edit.superclass.initComponent.apply(this, arguments);

        this.addEvents('add', 'saved', 'load');
        
        this.formInfo.on('productionChecked', function(v) {
            if (this.formProduction) {
                this.formProduction.cascade(function(cmp) {
                    cmp.setDisabled(!v);
                });
            }
        }, this);
        
        this.formInfo.on('printChecked', function(v) {
            if (this.formPrint) {
                this.formPrint.cascade(function(cmp) {
                    cmp.setDisabled(!v);
                });
            }
        }, this);
        
        this.formInfo.on('mountChecked', function(v) {
            if (this.formMount) {
                this.formMount.cascade(function(cmp) {
                    cmp.setDisabled(!v);
                });
            }
        }, this);
        
        this.formInfo.on('deliveryChecked', function(v) {
            if (this.formDelivery) {
                this.formDelivery.cascade(function(cmp) {
                    cmp.setDisabled(!v);
                });
            }
        }, this);
        
        if (this.record) {
            this.orderId = this.record.get('id');
            this.enableTabs();
            this.on('render', function() {this.loadData(this.record)}, this, {delay: 50});
        }
    },
    
    enableTabs: function() {
        
        this.formMount.orderId = this.orderId;
        
        if (acl.isView('orders', 'production')) {
            this.tabPanel.add(this.formProduction);
        }
        if (acl.isView('orders', 'print')) {
            this.tabPanel.add(this.formPrint);
        }
        if (acl.isView('orders', 'mount')) {
            this.tabPanel.add(this.formMount);
        }
        if (acl.isView('orders', 'delivery')) {
            this.tabPanel.add(this.formDelivery);
        }
        
        this.expences = new PMS.Orders.Edit.Expences({
            height: 335,
            permissions: this.permissions,
            orderId: this.orderId,
            listeners: {
                render: function(obj) {
                    obj.store.load();
                },
                scope: this
            }
        })
        this.tabPanel.add(this.expences);
        
        this.requests = new PMS.Orders.Requests.List({
            permissions: this.permissions,
            orderId: this.orderId,
            listeners: {
                render: function(obj) {
                    obj.store.load();
                },
                scope: this
            }
        })
        this.tabPanel.add(this.requests);
        
        if (acl.isView('orders', 'payments')) {
            this.payments = new PMS.Orders.Payments.List({
                autoHeight: true,
                permissions: this.permissions,
                orderId: this.orderId,
                listeners: {
                    render: function(obj) {
                        obj.store.load();
                    },
                    scope: this
                }
            });
            this.tabPanel.add(this.payments);
        }
        
        if (acl.isView('orders', 'files')) {
            this.files = new PMS.Orders.Files({
                height: 305,
                allowEdit: this.allowEditFiles || this.permissions,
                orderId: this.orderId, 
                border: false
            });
            this.tabPanel.add(this.files);
        }
        
        this.notes = new PMS.Orders.Edit.Notes({
            height: 333,
            permissions: this.permissions,
            orderId: this.orderId,
            listeners: {
        		render: function(obj) {
                	obj.store.load();
        		},
        		scope: this
            }
        });
        this.tabPanel.add(this.notes);
    },
    
    onSave: function() {
        if (this.getForm().isValid()) {
            this.el.mask('Запись...');
            var url = this.orderId ? this.saveURL : this.addURL;
            var params = this.orderId ? {id: this.orderId} : {};
            var act = this.orderId ? 'saved' : 'added'; 
            this.getForm().submit({
                url: url,
                params: params,
                success: function(f, action) {
                    if (true === action.result.success) {
                        xlib.Msg.info('Заказ успешно сохранён.').getDialog().close.defer(3000);
                        this.fireEvent(act, action.result.id);
                        if (act == 'saved') { 
                            this.wind.close();
                        } else {
                            this.orderId = action.result.id;
                            this.setTitle('Заказ №' + this.orderId); 
                            this.enableTabs();
                        }
                    } else {
                        this.onFailure(f, action);
                    }
                    this.el.unmask();
                }, 
                failure: function(response, options) {
                    var res = Ext.decode(response.responseText);
                    this.onFailure(res, options);
                    this.el.unmask();
                },
                scope: this
            });
        } else {
            xlib.Msg.error('Не все обязательные поля правильно заполнены!');
        }
    },
    
    loadData: function(record) {
        this.getForm().loadRecord(record);
        this.files.loadData(record.data);
    },
    
    showInWindow: function(cfg) {
        
        this.wind = new Ext.Window(Ext.apply({
            title: this.orderId ? 'Заказ № ' + this.orderId : 'Новый заказ',
            width: 800,
            height: 420,
            layout: 'fit',
            resizable: false,
            items: [this]
        }, cfg || {}));
        
        this.wind.show();
        
        this.on('archived', function() {
            this.wind.close();
        }, this);
        
        return this.wind;
    },
    
    archive: function() {
        
        var scope = this;
        
        var archiveForm = new xlib.form.FormPanel({
            permissions: true,
            layout: 'column', 
            columns: 2,
            defaults: {
                layout: 'form',
                border: false,
                labelWidth: 50,
                defaults: {
                    allowBlank: false,
                    anchor: '90%'
                },
                columnWidth: .5
            },
            items: [{
                items: [{
                    xtype: 'textfield',
                    fieldLabel: 'Счет №',
                    name: 'invoice_number'
                }, {
                    xtype: 'xlib.form.DateField',
                    fieldLabel: 'От',
                    name: 'invoice_date',
                    hiddenName: 'invoice_date'
                }]
            }, {
                items: [{
                    xtype: 'textfield',
                    fieldLabel: 'Акт №',
                    name: 'act_number'
                }, {
                    xtype: 'xlib.form.DateField',
                    fieldLabel: 'От',
                    name: 'act_date',
                    hiddenName: 'act_date'
                }]
            }]
        });
        
        var archiveWindow = new Ext.Window({
            title: 'Поместить заказ № ' + this.orderId + ' в архив',
            autoShow: true,
            width: 400,
            height: 125,
            layout: 'fit',
            resizable: false,
            items: [archiveForm],
            bbar: ['->', {
                text: 'OK',
                minWidth: 30,
                handler: function() {
                    
                    if (!scope.orderId) {
                        return;
                    }
                    
                    if (archiveForm.getForm().isValid() == false) {
                        xlib.Msg.error('Не все обязательные поля правильно заполнены!');
                        return;    
                    }
                    
                    archiveForm.el.mask('Запись...');
                    
                    archiveForm.getForm().submit({
                        url: scope.archiveURL,
                        params: {id: scope.orderId},
                        success: function(f, action) {
                            if (true === action.result.success) {
                                scope.fireEvent('archived');
                                archiveWindow.close();
                            } else {
                                archiveForm.el.unmask();
                                var res = Ext.decode(response.responseText);
                                scope.onFailure(res);
                            }
                        }, 
                        failure: function(response, options) {
                            archiveForm.el.unmask();
                            scope.onFailure('Ошибка записи.');
                        }
                    });
                }
            }, '-', {
                text: 'Отмена',
                handler: function() {
                    archiveWindow.close();
                }
            }]
        }).show();
    },
    
    onFailure: function(msg) {
        xlib.Msg.error(msg);
    }
});