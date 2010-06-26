Ext.ns('PMS.Orders');

PMS.Orders.Edit = Ext.extend(Ext.TabPanel, {
    
    loadURL: link('orders', 'index', 'get'),

    saveURL: link('orders', 'index', 'update'),
    
    addURL: link('orders', 'index', 'add'),
    
    archiveURL: link('orders', 'index', 'archive'),
    
    record: null,
    
    orderId: null,
    
    permissions: true,
    
    activeTab: 0,
    
    border: false,
    
    defaults: {
        border: false
    },
    
    initComponent: function() {
        
        this.form = new PMS.Orders.Edit.Info({permissions: this.permissions});
        
        this.items = [{
            title: 'Детали',
            bbar: this.permissions ? [{
                    text: 'В архив', 
                    hidden: (!this.record || !this.record.get('success_date_fact') || !acl.isAdd('archive')),
                    handler: this.archive, 
                    scope: this
                }, '->',
                {text: 'Сохранить', handler: this.onSave, scope: this}, '-',  
                {text: 'Отменить', handler: function() {this.wind.close();}, scope: this}
            ] : ['->', {text: 'Закрыть', handler: function() {this.wind.close();}, scope: this}],
            items: [this.form]
        }]
        
        PMS.Orders.Edit.superclass.initComponent.apply(this, arguments);
        
        if (this.record) {
            this.orderId = this.record.get('id');
            this.on('render', function() {this.loadData(this.record)}, this, {delay: 50});
            this.enableTabs();
        }
        
        this.addEvents('add', 'saved', 'load');
    },
    
    enableTabs: function() {
        
        this.suppliers = new PMS.Orders.Edit.Suppliers({
            orderId: this.orderId
        }); 
        
        this.files = new PMS.Orders.Files({
            allowEdit: this.permissions,
            orderId: this.orderId, 
            border: false
        });
        
        this.notes = new PMS.Orders.Edit.Notes({
            permissions: this.permissions,
            listeners: {
        		render: function(obj) {
                	obj.store.load();
        		},
        		scope: this
            },
            orderId: this.orderId
        });
        
        this.add(this.suppliers, this.files, this.notes);
    },
    
    onSave: function() {
        if (this.form.getForm().isValid()) {
            this.form.el.mask('Запись...');
            var url = this.orderId ? this.saveURL : this.addURL;
            var params = this.orderId ? {id: this.orderId} : {};
            var act = this.orderId ? 'saved' : 'added'; 
            this.form.getForm().submit({
                url: url,
                params: params,
                success: function(f, action) {
                    if (true === action.result.success) {
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
                    this.form.el.unmask();
                }, 
                failure: function(response, options) {
                    var res = Ext.decode(response.responseText);
                    this.onFailure(res, options);
                    this.form.el.unmask();
                },
                scope: this
            }
            );
        }
    },
    
    showInWindow: function(cfg) {
        this.wind = new Ext.Window(Ext.apply({
            title: this.orderId ? 'Заказ № ' + this.orderId : 'Новый заказ',
            width: 700,
            height: 400,
            layout: 'fit',
            resizable: false,
            modal: true,
            items: [this]
        }, cfg || {}));
        this.wind.show();
        return this.wind;
    },
    
    loadData: function(record) {
        this.form.loadData(record);
        this.suppliers.loadData(record.data);
        this.files.loadData(record.data);
    },
    
    archive: function() {
        Ext.Msg.show({
            title: 'Подтверждение',
            msg: 'Вы уверены?',
            buttons: Ext.Msg.YESNO,
            fn: function(b) {
                if ('yes' == b) {
                    Ext.Ajax.request({
                        url: this.archiveURL,
                        success: function(res) {
                            var errors = Ext.decode(res.responseText).errors;
                            if (errors) {
                                xlib.Msg.error(errors[0].msg);
                                return;
                            }
                            this.wind.close();
                        },
                        scope: this,
                        failure: Ext.emptyFn(),
                        params: {id: this.record.get('id')}
                    });
                }
            },
            scope: this,
            icon: Ext.MessageBox.QUESTION
        });
    },
    
    onFailure: Ext.emptyFn
});