Ext.namespace('OSDN.Files');

OSDN.Files.InfoPanel = Ext.extend(Ext.Panel, {
	
	params: {},
	
	border: false,
	
	loadUrl: null,
    
    updateUrl: null,
    
    scanUrl: null,
    
    downloadUrl: function (id) { 
        return null;
    },
    
	initComponent: function() {
		
		OSDN.Files.InfoPanel.superclass.initComponent.apply(this, arguments);
		
		//this.on('render', this.putAddFileButton, this);
	},
	
	putAddFileButton: function () {
		var scope = this;
		if (this._fileInfo) {
			this.remove(this._fileInfo);
		}
        this.params.file_id = null;
		this._fileInfo = new Ext.Panel({
            width: 90,
            border: false,
            items: [{
                xtype: 'button',
                minWidth: 90,
                border: false,
                text: lang('Add file'),
                handler: function() {
                	var p, w = new OSDN.Files.Edit({
                		params: this.params,
                		loadUrl: this.loadUrl,
                        updateUrl: this.updateUrl,
                        scanUrl: this.scanUrl,
                        downloadUrl: this.downloadUrl 
                	});
                	w.show();
                	w.on('updateFile', function (sc, response, options) {
                        var res = Ext.decode(response.responseText);
                        if (res.file_id) {
                        	this.params.file_id = res.file_id;
                        	this.load(this.params);
                        }
                        w.close();
                	}, this);
                },
                scope: this
            }],
            scope: this
        });
        this.add(this._fileInfo);
        this.doLayout();
        return this._fileInfo;
	},
	
	putAddedFilePanel: function (file) {
		var self = this;
		
		if (this._fileInfo) {
			this.remove(this._fileInfo);
        }
        
        this.params.file_id = file['id'];
        
		this._fileInfo = new Ext.Panel({
            layout: 'column',
            layoutColumn: {
                columns: 3
            },
            height: 22,
            border: false,
            defaults: {
                border: false,
                scope: this
            },
            items: [{
                xtype: 'panel',
                html: [
                    '<nobr><a qtip="', 
                    file['description'],
                    '<br>',
                    '<b>' + file['originalfilename'] + '</b>',
                    ' ( ' + Ext.util.Format.fileSize(file['size']) + ' )',
                    '" href="', 
                    this.downloadUrl(file['id']),
                    '">',
                    file['originalfilename'],
                    '</a> ( ',
                    Ext.util.Format.fileSize(file['size']),
                    ' ) </nobr>'
                ].join(''),
                columnWidth: 1
            }, {
                xtype: 'panel',
                width: 90,
                items: [{
                    xtype: 'button',
                    minWidth: 85,
                    text: lang('Edit'),
                    handler: function() {
                        var p, w = new OSDN.Files.Edit({
                            params: this.params,
                            loadUrl: this.loadUrl,
                            updateUrl: this.updateUrl,
                            scanUrl: this.scanUrl,
                            downloadUrl: this.downloadUrl
                        });
                        w.show();
                        w.on('updateFile', function (scope, response, options) {
                        	this.load(this.params);
                        	w.close();
                        }, this);
                    },
                    scope: this
                }]
            }, {
                xtype: 'panel',
                width: 85,
                items: [{
                    xtype: 'button',
                    minWidth: 85,
                    text: lang('Delete'),
                    handler: function() {
                        OSDN.Files.Delete({
                            url: self.deleteFileUrl,
                            params: self.params,
                            success: function () {
                                self.putAddFileButton();
                                self.fireEvent('deleteFile');
                            }
                        })
                    }
                }]
            }],
            scope: this
        });
        this.add(this._fileInfo);
        this.doLayout();
        return this._fileInfo;
	}, 
	
	load: function (params) {
		if (params) {
			this.params = Ext.apply(this.params, params);
		}
		if (params && params.file_id) {
			//this.getEl().mask(lang('Loading'), 'x-mask-loading');
            Ext.Ajax.request({
                url: this.loadUrl,
                callback: function (options, success, response) {
                	var res = Ext.decode(response.responseText);
                	if (res && res.data) {
                		this.putAddedFilePanel(res.data[0]);
                	}
                	//this.getEl().unmask();
                },
                params: params,
                scope: this
            });
		}
	}
});
    