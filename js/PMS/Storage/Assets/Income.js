Ext.ns('PMS.Storage.Assets');

PMS.Storage.Assets.Income = Ext.extend(xlib.form.FormPanel, {
    
    title: false,
    
    defaultTitle: 'Оприходовать ТМЦ',
    
    permissions: acl.isUpdate('storage'),
    
    defaults: {
        anchor: '100%'
    },
    
    record: null,
    
    URL: link('storage', 'assets', 'income'),
    
    autoHeight: true,
    
    initComponent: function() {
       
        if (!Ext.isObject(this.record)) {
            throw 'Record is not set!';
        }
        
        this.qtyField = new Ext.form.NumberField({
            fieldLabel: 'Добавить',
            allowDecimals: false,
            minValue: 1,
            name: 'qty_add'
        });
        
        this.items = [{
            xtype: 'displayfield',
            fieldLabel: 'Наименование',
            name: 'name'
        }, {
            xtype: 'PMS.Storage.Measures.ComboBox',
            fieldLabel: 'Ед. измерения',
            disabled: true,
            updatePermissions: false,
            hideTrigger: true,
            name: 'measure'
        }, {
            xtype: 'displayfield',
            fieldLabel: 'Цена за ед. (р.)',
            name: 'unit_price'
        }, {
            xtype: 'displayfield',
            fieldLabel: 'В наличии',
            name: 'qty'
        },  this.qtyField];
        
        PMS.Storage.Assets.Income.superclass.initComponent.apply(this, arguments);
        
        this.w = new Ext.Window({
            layout: 'fit',
            title: this.defaultTitle,
            resizable: false,
            width: 300,
            modal: true,
            items: [this],
            buttons: [{
                text: 'Добавить',
                handler: this.saveData,
                scope: this
            }, {
                text: 'Отмена',
                handler: function() {
                    this.w.close();
                },
                scope: this
            }]
        });
        
        this.w.show();
        
        this.getForm().loadRecord(this.record);
    },
    
    saveData: function() {
        
        if (!this.getForm().isValid()) {
            return;
        }
        
        this.w.disable();
        
        Ext.Ajax.request({
           url: this.URL,
           params: { 
                asset_id: this.record.get('id'),
                qty_add: this.qtyField.getValue()
           },
           success: function(res) {
                var responseText = Ext.decode(res.responseText);
                if (!responseText || !responseText.success) {
                    xlib.Msg.error('Ошибка на стороне сервера.');
                    this.w.enable();
                    return;
                }
                this.fireEvent('saved');
                this.w.close();
            },
            failure: function() {
                xlib.Msg.error('Ошибка связи с сервером.');
                this.w.enable();
            },
            scope: this
        });
    }    
});