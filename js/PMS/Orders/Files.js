Ext.ns('PMS.Orders');

PMS.Orders.Files = Ext.extend(Ext.Panel, {
    
    loadURL: link('orders', 'files', 'get-files'),

    uploadURL: link('orders', 'files', 'upload-file'),
    
    updateURL: link('orders', 'files', 'update-file'),
    
    deleteURL: link('orders', 'files', 'delete-file'),
    
    title: 'Файлы',
	
    autoScroll: true,
    
    allowEdit: true,
    
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
            plugins: (this.allowEdit && acl.isUpdate('orders')) 
                   ? [new Ext.DataView.LabelEditor({dataIndex: 'description'})] : [],
            store: new Ext.data.JsonStore({
                url: this.loadURL,
                root: 'files',
                fields: ['id', 'filename', 'description', 'original_name'],
                listeners: {
                    update: acl.isUpdate('orders') ? this.onUpdate : Ext.emptyFn,
                    scope: this
                }
            }),
            tpl: new Ext.XTemplate(
                '<tpl for=".">',
                '<div class="thumb-wrap" id="{filename}">',
                '<div><a href="' + OSDN.ABSOLUTE_PATH + '/files/{filename}" target="_blank">', 
                '<img src="/images/download.png" qtip="Открыть">',
                '</a></div><span class="x-editable" qtip="{[this.e(this.h(values.description), 50)]}">',
                '{[this.e(this.f(values.description), 15)]}',
                '</span></div></tpl><div class="x-clear"></div>', {
                    f: function(v) {return v || '                    ';}, 
                    h: function(v) {return Ext.util.Format.htmlEncode(v) || '';}, 
                    e: Ext.util.Format.ellipsis
                }
            )
        });
        
        if (this.allowEdit) {
            if (acl.isDelete('orders')) {
                menu = new Ext.menu.Menu({
                    items: [{
                        text: 'Удалить файл',
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
                    Ext.apply(menu, {view: view, index: index, node: node, e: e});
                    menu.showAt(e.getXY());
                });
            }
            if (acl.isAdd('orders')) {
                this.bbar = ['->', {
                    text: 'Добавить файл',
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
    
    loadData: function(data) {
        this.view.store.loadData(data);
        this.orderId = data['id'];
    },
    
    onUpload: function(button) {
        var uploadWin = new Ext.Window({
            title: 'Загрузка файла',
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
    
    onUpdate: function(store, record) {
        var loadingMask = new Ext.LoadMask(this.el, {msg: 'Загрузка...'});
        loadingMask.show();
        Ext.Ajax.request({
            url: this.updateURL,
            params: {fileId: record.get('id'), description: record.get('description')},
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
                        params: {fileId: id},
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