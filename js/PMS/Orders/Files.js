Ext.ns('PMS.Orders');

PMS.Orders.Files = Ext.extend(Ext.Panel, {
    
	loadURL: link('orders', 'files', 'get-all'),

    uploadURL: link('orders', 'files', 'upload'),
    
    updateURL: link('orders', 'files', 'update'),
    
    deleteURL: link('orders', 'files', 'delete'),
    
    title: 'Файлы',
	
    autoScroll: true,

    border: false,
    
    allowEdit: false,
    
    layout: 'fit',
    
    cls: 'images-view',
    
    margins: '5 5 5 0',
    
    monitorResize: true,
    
    orderId: null,
    
    initComponent: function() {

        this.view = new Ext.DataView({
            cls: 'images-view',
            itemSelector: 'div.thumb-wrap',
            overClass: 'x-view-over',
            style: 'overflow: auto',
            layout: 'fit',
            multiSelect: false,
            plugins: (this.allowEdit && acl.isUpdate('orders', 'files')) 
                   ? [new Ext.DataView.LabelEditor({dataIndex: 'description'})] : [],
            store: new Ext.data.JsonStore({
                url: this.loadURL,
                root: 'files',
                fields: ['id', 'filename', 'description', 'is_photo'],
                listeners: {
                    update: acl.isUpdate('orders', 'files') ? this.onUpdate : Ext.emptyFn,
                    scope: this
                }
            }),
            tpl: new Ext.XTemplate(
                '<tpl for=".">',
	                '<div class="thumb-wrap" id="{filename}">',
		                '<div class="thumb">',
			                '<tpl if="is_photo == 0">',
			                	'<a href="/files/{filename}" target="_blank">',
			            			'<img src="/images/download.png" ',
			            			'qtip="{[this.h(values.description + \' [.\' + [this.x(values.filename)] + \']\')]}"/>',
			                	'</a>',
			                '</tpl>',
			                '<tpl if="is_photo == 1">',
			                	'<img src="/files/{filename}" class="thumb-img" ',
			                	'qtip="{[this.h(values.description + \' [.\' + [this.x(values.filename)] + \']\')]}">',
			                '</tpl>', 
		                '</div>',
		                '<span class="x-editable" qtip="{[this.h(values.description + \' [.\' + [this.x(values.filename)] + \']\')]}">',
		                	'{[this.e(this.f(values.description), 15)]}',
	                	'</span>',
	            	'</div>',
            	'</tpl>',
            	'<div class="x-clear"></div>', {
                    f: function(v) {return v || '                    ';}, 
                    h: function(v) {return Ext.util.Format.htmlEncode(v) || '';},
                    x: function(v) {return v.split('.').pop() || '';},
                    e: Ext.util.Format.ellipsis
                }
            ),
            listeners: {click: {fn: this.showFile, scope: this, buffer: 200}}
        });
        
        if (this.allowEdit || acl.isUpdate('admin')) {
            if (acl.isUpdate('orders', 'files')) {
                menu = new Ext.menu.Menu({
                    items: [{
                        text: 'Удалить',
                        iconCls: 'delete',
                        handler: function() {
                            var record = menu.view.store.getAt(menu.index);
                            this.onDelete(record.get('id'));
                        },
                        scope: this
                    }]
                });
                
                this.view.on('contextmenu', function(view, index, node, e) {
                    e.stopEvent();
                    Ext.apply(menu, {view: view, index:index, node: node, e: e});
                    menu.showAt(e.getXY());
                });
            }
            if (acl.isUpdate('orders', 'files') && this.allowEdit) {
                this.tbar = [{
                    text: 'Добавить',
                    iconCls: 'add',
                    handler: this.onUpload,
                    scope: this
                }];
            }
        }
        
        this.items = [this.view];
   
        this.on('render', function(panel) {
            panel.loadingMask = new Ext.LoadMask(this.el, {
                msg: 'Загрузка...', 
                store: panel.view.store
            });
        });
        
        PMS.Orders.Files.superclass.initComponent.apply(this, arguments);
    },
    
    showFile: function(view, index, node, e) {
    	
        var record = view.store.getAt(index);

        if (record.get('is_photo') == 0) {
        	return;
        }
        
        var img = new Ext.ComponentMgr.create({
            xtype: 'box',
            html: '<a href="/files/' + record.get('filename') + '" '
        		+ 'style="border: none;" target="_blank">'
            	+ '<img src="/files/' + record.get('filename') + '" '
            	+ 'style="max-height: 400px; max-width: 600px;" /></a>'
        });
        
        var wind = new Ext.Window({
            title: record.get('description'),
            autoWidth: true,
            resizable: false,
            autoHeight: true,
            items:[img]
        });
        wind.show(record.get('filename'));
    },
        
    loadData: function(data) {
        this.view.store.loadData(data);
        this.orderId = data['id'];
    },
    
    onUpload: function(button) {
        var uploadWin = new Ext.Window({
        	title: 'Передача файлов на сервер',
            width: 400,
            height: 200,
            layout: 'fit',
            items:[new Ext.ux.UploadDialog.Dialog({
                url: this.uploadURL,
                base_params: {orderId: this.orderId},
                closeAction: 'hide',
                listeners: {
                    hide: function() {
                        uploadWin.hide();
                        this.view.store.load({params: {orderId: this.orderId}});
                    },
                    scope: this
                },
                scope: this
            })]
        });
        uploadWin.show(button.getEl());
    },
    
    onUpdate: function(store, record) {
        var loadingMask = new Ext.LoadMask(this.el, {msg: 'Загрузка...'});
        loadingMask.show();
        Ext.Ajax.request({
            url: this.updateURL,
            params: {id: record.get('id'), description: record.get('description')},
            callback: function() {
                loadingMask.hide();
            }
        });
    },
    
    onDelete: function(id) {
        Ext.Msg.show({
            title: 'Подтверждение',
            msg: 'Вы уверены?',
            buttons: Ext.Msg.YESNO,
            fn: function(b) {
                if ('yes' == b) {
                    var loadingMask = new Ext.LoadMask(this.el, {msg: 'Загрузка...'});
                    loadingMask.show();
                    Ext.Ajax.request({
                        url: this.deleteURL,
                        params: {id: id},
                        callback: function() {
                            loadingMask.hide();
                            this.view.store.load({params: {orderId: this.orderId}});
                        },
                        scope: this
                    });
                }
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this
        });
    }
});