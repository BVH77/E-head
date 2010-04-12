Ext.ns('PMS');

PMS.ContragentsFormAbstract = Ext.extend(OSDN.form.FormPanel, {
    
	sid: null,
    
    autoHeight: true,
    
    resizable: false,
    
    entity: null,
	
    initComponent: function() {
        
        this.items = [{
            name: 'id',
            xtype: 'hidden'
        }, {
            name: 'name',
            fieldLabel: 'Название',
            xtype: 'textfield',
            sortable: true,
			allowBlank: false
        }, {
            name: 'description',
            xtype: 'textarea',
            fieldLabel: 'Описание',
            sortable: true,
            allowBlank: true
        }];
        
        this.on('render', this.loadData, this, {delay: 50});
                
        PMS.ContragentsFormAbstract.superclass.initComponent.apply(this, arguments);

        this.addEvents('saved');
    },
    
    onSave: function() {
        if (this.getForm().isValid()) {
            var params = {};
            var serverAction = 'add';
            if (this.sid) {
            	params['id'] = this.sid;
    			serverAction = 'update';
            }
            this.getForm().submit({
                url: link('orders', this.entity, serverAction),
                waitMsg: 'Запись...',
                params: params,
                success: function(f, action) {
                    if (true === action.result.success) {
                        this.sid = action.result.id;
                        this.fireEvent('saved', this.sid);
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
            buttons: [
                {text: 'Сохранить', handler: this.onSave.createDelegate(this)}, 
                {text: 'Отменить', handler: function() {w.close();}}
            ] 
        }, cfg || {}));
        w.show();
        return w;
    },
    
    loadData: function() {
    	if (this.sid) {
	        this.load({
	            url: link('orders', this.entity, 'get'),
	            params: {id: this.sid},
	            waitMsg: 'Загрузка...',
	            success: function(form, options) {this.fireEvent('load');},
	            scope: this
	        });
    	}
    },
    
    onFailure: Ext.emptyFn
});

Ext.reg('PMS.ContragentsFormAbstract', PMS.ContragentsFormAbstract);