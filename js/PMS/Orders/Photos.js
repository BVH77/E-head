Ext.ns('PMS.Orders');

PMS.Orders.Photos = Ext.extend(Ext.Panel, {
    
    loadURL: link('orders', 'files', 'get-photos'),

    uploadURL: link('orders', 'files', 'upload-photo'),
    
    updateURL: link('orders', 'files', 'update-photo'),
    
    deleteURL: link('orders', 'files', 'delete-photo'),
    
    title: 'Фото',
	
    autoScroll: true,
    
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
            plugins: (this.allowEdit && acl.isUpdate('orders', 'photos')) 
                   ? [new Ext.DataView.LabelEditor({dataIndex: 'description'})] : [],
            store: new Ext.data.JsonStore({
                url: this.loadURL,
                root: 'photos',
                fields: ['id', 'filename', 'description'],
                listeners: {
                    update: acl.isUpdate('orders', 'photos') ? this.onUpdatePhoto : Ext.emptyFn,
                    scope: this
                }
            }),
            tpl: new Ext.XTemplate(
                '<tpl for=".">',
                '<div class="thumb-wrap" id="{filename}">',
                '<div class="thumb"><img src="files/{filename}" class="thumb-img" ', 
                'qtip="{[this.e(this.h(values.description), 50)]}"></div>',
                '<span class="x-editable" qtip="{[this.e(this.h(values.description), 50)]}">',
                '{[this.e(this.f(values.description), 15)]}',
                '</span></div></tpl><div class="x-clear"></div>', {
                    f: function(v) {return v || '                    ';}, 
                    h: function(v) {return Ext.util.Format.htmlEncode(v) || '';}, 
                    e: Ext.util.Format.ellipsis
                }
            ),
            listeners: {click: {fn: this.showPhoto, scope: this, buffer: 200}}
        });
        
        if (this.allowEdit) {
            if (acl.isDelete('orders', 'photos')) {
                menu = new Ext.menu.Menu({
                    items: [{
                        text: 'Удалить фото',
                        iconCls: 'delete',
                        handler: function() {
                            var record = menu.view.store.getAt(menu.index);
                            this.deletePhoto(record.get('id'));
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
            if (acl.isAdd('orders', 'photos')) {
                this.bbar = ['->', {
                    text: 'Добавить фото',
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
        
        PMS.Orders.Photos.superclass.initComponent.apply(this, arguments);
    },
    
    showPhoto: function(view, index, node, e) {
        var record = view.store.getAt(index);
        
        var img = new Ext.ComponentMgr.create({
            xtype: 'box',
            autoHeight: true,
            autoEl: {
                tag: 'img',
                style: 'height: 500px;',
                src: 'files/' + record.get('filename')
            }
        });
        
        var wind = new Ext.Window({
            title: record.get('description'),
            modal: true,
            width: 600,
            height: 500,
            autoScroll: true,
            layout: 'fit',
            tools: [{
                id: 'maximize',
                handler: function(event, toolEl, panel){
                    panel.toggleMaximize();
                }
            }],
            items:[img],
            listeners: {
        		bodyClick: function () {
        			wind.close();
        		},
        		scope: this
        	}
        });
        wind.show(record.get('filename'));
    },
        
    loadData: function(data) {
        this.view.store.loadData(data);
        this.orderId = data['id'];
    },
    
    onUpload: function(button) {
        var uploadWin = new Ext.Window({
            title: 'Загрузка фото',
            modal: true,
            width: 400,
            height: 200,
            autoScroll: true,
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
    
    onUpdatePhoto: function(store, record) {
        var loadingMask = new Ext.LoadMask(this.el, {msg: 'Загрузка...'});
        loadingMask.show();
        Ext.Ajax.request({
            url: this.updateURL,
            params: {photoId: record.get('id'), description: record.get('description')},
            callback: function() {
                loadingMask.hide();
            }
        });
    },
    
    deletePhoto: function(id) {
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
                        params: {photoId: id},
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