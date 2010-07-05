Ext.ns('PMS.Orders');

PMS.Orders.Edit = Ext.extend(xlib.form.FormPanel, {
    
    loadURL: link('orders', 'index', 'get'),

    saveURL: link('orders', 'index', 'update'),
    
    addURL: link('orders', 'index', 'add'),
    
    archiveURL: link('orders', 'index', 'archive'),
    
    record: null,
    
    orderId: null,
    
    permissions: true,
    
    border: false,
    
    padding: 0,
    
    initComponent: function() {

    	this.formInfo = new PMS.Orders.Edit.Info();
        
        this.formProduction = new PMS.Orders.Edit.Production({
            scope: this
        });
        
        this.formMount = new PMS.Orders.Edit.Mount({
    	   scope: this
        });
        
        this.tabPanel = new Ext.TabPanel({
            activeTab: 0,
            border: false,
            items: [this.formInfo]
        });
    	
        this.items = [this.tabPanel];
        
        this.bbar = this.permissions ? [{
    		text: 'В архив', 
    		hidden: (!this.record || !this.record.get('success_date_fact') || !acl.isAdd('archive')),
    		handler: this.archive, 
    		scope: this
    	}, '->',
    	{text: 'Сохранить', handler: this.onSave, scope: this}, '-',  
    	{text: 'Отменить', handler: function() {this.wind.close();}, scope: this}
    	] : ['->', {text: 'Закрыть', handler: function() {this.wind.close();}, scope: this}];
        
        PMS.Orders.Edit.superclass.initComponent.apply(this, arguments);

        this.addEvents('add', 'saved', 'load');
        
        this.formInfo.on('productionChecked', function(v) {
            this.formProduction.setDisabled(!v);
        }, this);
        
        this.formInfo.on('mountChecked', function(v) {
            this.formMount.cascade(function(cmp) {
                cmp.setDisabled(!v);
            });
        }, this);
        
        if (this.record) {
            this.orderId = this.record.get('id');
            this.enableTabs();
            this.on('render', function() {this.loadData(this.record)}, this, {delay: 50});
        }
    },
    
    enableTabs: function() {
        
        this.suppliers = new PMS.Orders.Edit.Suppliers({
            orderId: this.orderId
        }); 
        
        this.files = new PMS.Orders.Files({
            autoHeight: true,
            allowEdit: this.permissions,
            orderId: this.orderId, 
            border: false
        });
        
        this.notes = new PMS.Orders.Edit.Notes({
            height: 315,
            permissions: this.permissions,
            orderId: this.orderId,
            listeners: {
        		render: function(obj) {
                	obj.store.load();
        		},
        		scope: this
            }
        });
        
        this.tabPanel.add(this.formProduction, this.formMount, this.suppliers, this.files, this.notes);
        
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
            xlib.Msg.error('Не все обязательные правильно заполнены!');
        }
    },
    
    loadData: function(record) {
        this.getForm().loadRecord(record);
        this.suppliers.loadData(record.data);
        this.files.loadData(record.data);
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