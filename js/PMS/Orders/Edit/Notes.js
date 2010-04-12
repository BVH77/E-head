Ext.ns('PMS.Orders.Edit');

PMS.Orders.Edit.Notes = Ext.extend(Ext.Panel, {

    autoScroll: true,
    
    layout: 'fit',
    
    permissions: true, 
    
    orderId: null,
    
    border: false,
    
    initComponent: function() {
        
        this.store = new Ext.data.JsonStore({
            url: link('orders', 'index', 'get-notes'),
            baseParams: {orderId: this.orderId},
            root: 'rows',
            fields: ['name', 'text', {name: 'time', type: 'date', dateFormat: 'Y-m-d H:i:s'}],
            listeners: {
                load: function() {
                    this.body.scroll('b', 1000);
                },
                scope: this
            }
        });
        
        this.list = new Ext.DataView({
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
        });
        
        if (this.permissions) {
            this.field = new Ext.form.TextArea({
                width: 620,
                xtype: 'textarea'
            });
            
            this.bbar = new Ext.Toolbar({
                border: false,
                items: [this.field, {
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
        
        this.items = [this.list];
        
        PMS.Orders.Edit.Notes.superclass.initComponent.apply(this, arguments);
        
        this.on('render', function() {
            loadingMask: new Ext.LoadMask(this.el, {
                msg: 'Загрузка...', 
                store: this.store
            }),
            this.store.load();
        }, this, {delay: 50});
    },
        
    saveData: function() {
        var text = this.field.getValue();
        if (!Ext.isEmpty(text)) {
            Ext.Ajax.request({
                url: link('orders', 'index', 'add-note'),
                params: {orderId: this.orderId, text: text},
                callback: function() {
                    this.field.reset();
                    this.store.reload();
                },
                scope: this
            });
        }
    }
});