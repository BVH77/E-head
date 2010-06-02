Ext.ns('PMS.Orders.Edit');

PMS.Orders.Edit.Notes = Ext.extend(Ext.Panel, {

    autoScroll: true,
    
    layout: 'border',
    
    permissions: true, 
    
    orderId: null,
    
    border: false,
    
    initComponent: function() {
        
        this.store = new Ext.data.JsonStore({
            url: link('orders', 'index', 'get-notes'),
            baseParams: {orderId: this.orderId},
            root: 'rows',
            fields: ['name', 'text', {name: 'time', type: 'date', dateFormat: 'Y-m-d H:i:s'}]
        });
        
        this.list = new Ext.DataView({
            autoHeight: true,
            autoWidth: true,
            border: false,
            itemSelector: 'div.search-item',
            store: this.store,
            tpl: new Ext.XTemplate(
                '<style>',
                '.search-item {',
                    'font:normal 11px tahoma, arial, helvetica, sans-serif;',
                    'padding: 3px 10px 3px 10px;',
                    'border-bottom: 1px solid #eeeeee;',
                '}',
                '</style>',
                '<tpl for="."><div class="search-item"><b>{name}</b>, ',
                '<i>{time:date("d.m.Y H:i")}</i>.<br/><br/>{text}</div></tpl>'
            )
        });
        
        this.items = [{
        	region: 'center',
        	border: false,
        	autoScroll: true,
        	items: [new Ext.DataView({
        		autoHeight: true,
        		autoWidth: true,
        		itemSelector: 'div.search-item',
        		store: this.store,
        		tpl: new Ext.XTemplate(
        				'<style>',
        				'.search-item {',
        				'font:normal 11px tahoma, arial, helvetica, sans-serif;',
        				'padding: 3px 10px 3px 10px;',
        				'border-bottom: 1px solid #eeeeee;',
        				'}',
        				'</style>',
        				'<tpl for="."><div class="search-item"><b>{name}</b>, ',
        				'<i>{time:date("d.m.Y H:i")}</i>.<br/><br/>{text}</div></tpl>'
        		)
        	})]
        }];
        
        if (this.permissions) {
            this.field = new Ext.form.TextArea({
            	height: 62,
            	flex: 1
            });
            this.items.push({
            	region: 'south',
            	height: 60,
            	layout: 'hbox',
                border: false,
                items: [this.field, {
                	columnWidth: '100px',
                	margins: 0,
                    xtype: 'button',
                    handleMouseEvents: false,
                    tooltip: 'Отослать', 
                    ctCls: 'chat-big-button',
                    handler: function() {
                        this.saveData();
                    },
                    scope: this
                }]
            });
        }
        
        PMS.Orders.Edit.Notes.superclass.initComponent.apply(this, arguments);
        
        this.on('render', function() {
            new Ext.LoadMask(this.el, {
                msg: 'Загрузка...', 
                store: this.store
            });
        }, this, {delay: 50});
    },
        
    saveData: function() {
        var text = this.field.getValue();
        if (!Ext.isEmpty(text)) {
            Ext.Ajax.request({
                url: link('orders', 'index', 'add-note'),
                params: {orderId: this.store.orderId, text: text},
                callback: function() {
                    this.field.reset();
                    this.store.reload();
                },
                scope: this
            });
        }
    }
});