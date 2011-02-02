Ext.ns('PMS.Storage.Assets.Edit');

PMS.Storage.Assets.Edit.Layout = Ext.extend(Ext.Panel, {
    
    assetId: null,
	
    border: false,
    
    defaultTitle: 'Запись о ТМЦ',
    
    layout: 'border',
    
    inWindow: false,
    
	initComponent: function() {
        
        this.title = this.inWindow ? false : this.defaultTitle;
    
        this.categories = new PMS.Storage.Assets.Tree({
            region: 'west',
            width: 250,
            border: false,
            header: false,
            loadURL: link('storage', 'categories', 'get-complete-tree-checked'),
            margins: '0 2 0 0',
            cls: 'x-border-right'
        });
        
        this.categories.on('load', this.categories.expandAll);
        
        this.assets = new PMS.Storage.Assets.Edit.Form({
            region: 'center',
            border: false,
            cls: 'x-border-left'
        });
        
	    this.items = [this.categories, this.assets];
        
		PMS.Storage.Assets.Edit.Layout.superclass.initComponent.apply(this, arguments);
        
        if (this.inWindow) {
            
            var editWindow = new Ext.Window({
                layout: 'fit',
                title: this.defaultTitle,
                resizable: false,
                width: 600,
                height: 400,
                modal: true,
                buttons: [{
                    text: this.assetId ? 'Сохранить' : 'Добавить',
                    handler: this.saveData,
                    scope: this
                }, {
                    text: 'Отмена',
                    handler: function() {
                        editWindow.close();
                    }
                }]
            });
            
            this.title = false;
            editWindow.add(this);
            editWindow.show();
        }
	},
    
    loadData: function() {
        
    },
    
    saveData: function() {
        
    }
});

Ext.reg('PMS.Storage.Assets.Edit.Layout', PMS.Storage.Assets.Edit.Layout);