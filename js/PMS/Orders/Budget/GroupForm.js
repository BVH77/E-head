Ext.ns('PMS.Orders.Budget');

PMS.Orders.Budget.GroupForm = Ext.extend(xlib.form.FormPanel, {
    
	itemId: null,
    
    autoHeight: true,
    
    resizable: false,
    
    loadURL: link('orders', 'budget-groups', 'get'),
    
    addURL: link('orders', 'budget-groups', 'add'),
    
    updateURL: link('orders', 'budget-groups', 'update'),
    
    hideLabels: true,
    
    initComponent: function() {
        
        this.items = [{
            name: 'id',
            xtype: 'hidden'
        }, {
            name: 'name',
            xtype: 'textfield',
			allowBlank: false
        }];
        
        this.on('render', this.loadData, this, {delay: 50});
                
        PMS.Orders.Budget.GroupForm.superclass.initComponent.apply(this, arguments);

        this.addEvents('saved');
    },
    
    onSave: function() {
        if (this.getForm().isValid()) {
            var params = {};
            if (this.itemId) {
            	params['id'] = this.itemId;
            }
            this.getForm().submit({
                url: this.itemId ? this.updateURL : this.addURL,
                waitMsg: 'Запись...',
                params: params,
                success: function(f, action) {
                    if (true === action.result.success) {
                        this.itemId = action.result.id;
                        this.fireEvent('saved', this.itemId);
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
    
    showInWindow: function(cfg) {
        var w = new Ext.Window(Ext.apply({
            labelWidth: 80,
            width: 400,
            autoHeight: true,
            items: [this],
            modal: true,
            buttons: [
                {text: 'Сохранить', handler: this.onSave.createDelegate(this)}, 
                {text: 'Отменить', handler: function() {w.close();}}
            ] 
        }, cfg || {}));
        w.show();
        return w;
    },
    
    loadData: function() {
    	if (this.itemId) {
	        this.load({
	            url: this.loadURL,
	            params: {id: this.itemId},
	            waitMsg: 'Загрузка...',
	            success: function(form, options) {this.fireEvent('load');},
	            scope: this
	        });
    	}
    },
    
    onFailure: function(res) {
        Ext.Msg.alert('Ошибка', res);
    }
});