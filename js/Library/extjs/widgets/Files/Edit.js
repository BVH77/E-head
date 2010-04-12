Ext.namespace('OSDN.Files');

OSDN.Files.Edit = Ext.extend(OSDN.Window, {
    
    loadUrl: link('admin', 'student-document-types', 'load-file'),
    
    updateUrl: link('admin', 'student-document-types', 'update-file'),
    
    scanUrl: link('admin', 'student-document-types', 'scan-file', null, 'html'),
    
    downloadUrl: function (id) { 
        return link('admin', 'student-document-types', 'download', {id: id}, 'html');
    },
    
    allowedFormats: [
        'pdf',
        'xls',
        'doc',
        'tif',
        'jpeg',
        'png'
    ],
    
    width: 350,
    
    modal: true,
    
    //height: 150,
    
    autoHeight: true,
    
    //layout: 'fit',
    
    file_id: null,
    
    params: null,
    
    permissions: true,
    
    _uploadMask: null,
    
    _fileInfo: null,
    
    initComponent: function() {
        var scope = this;
        
        if (Ext.isIE) {
            this.tools = [{
                id: 'gear',
                qtip: lang('Scanner settings'),
                handler: this.openScanConfiguration,
                scope: this
            }];
        }
        
        if (this.params && this.params.file_id) {
        	this.file_id = this.params.file_id;
        }
        
        if (!this.file_id) {
            //this.height = 132;
        }
        
        this.form = new OSDN.form.FormPanel({
            autoScroll: false,
            autoHeight: true,
            //height: this.file_id?120:90,
            permissions: this.permissions,
            items: [{
                xtype:      "textarea",
                fieldLabel: lang('File description'),
                name:       'description',
                dataIndex: 'description',
                anchor: "-1",
                allowBlank: false,
                enableKeyEvents: true,
                listeners:{
                    keyup: scope.disableEnableButtons.createDelegate(scope)
                }
                
            }],
            reader: new Ext.data.JsonReader({
                root: 'data'
            }, [
                'description', 
                'id', 
                'originalfilename', 
                'type', 
                'size'
            ])
        });
        
        this.items = [
            this.form
        ];

        if (this.file_id) {
            this.title = lang('File changing');
        } else {
            this.title = lang('Adding file');
        }
        
        this.buttons = [];
        
        if (Ext.isIE) {
            this.buttons.push({
                iconCls : 'osdn-scanner-configuration',
                tooltip: lang('Scanner settings'), 
                text: '',
                minWidth: 16,
                handler: this.openScanConfiguration,
                scope: this
            });
            this.buttons.push(new Ext.Toolbar.Fill({own: true}));
            
            this.scanBtn = new OSDN.ScanButton({
                url: scope.scanUrl,
                text: lang('Scan'),
                parameters: scope._parameters.createDelegate(scope),
                iconCls: 'osdn-scan',
                listeners: {
                    uploaded: function(button, response, errorCode, errorString){
                        var res = Ext.decode(response);
                        var rr = {
                            responseText: response
                        };
                        if (res.success) {
                            scope.fireEvent('updateFile', scope, rr);
                        }
                        else {
                            if (res.errors[0]['id'] == 'file') {
                                Ext.Msg.show({
                                    title: lang('Error'),
                                    msg: lang('File type is not allowed?'),
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.MessageBox.ERROR
                                });
                            }
                        }
                    },
                    ready : this.disableEnableButtons.createDelegate(this)
                }
            });
            this.buttons.push(this.scanBtn);
        }
        
        this.browseBtn = new OSDN.UploadButton({
            uploadUrl: scope.updateUrl,
            input_name: 'RemoteFile',
            text: lang('Upload'),
            tooltip: lang('You can upload next formats: {0}!', this.allowedFormats.join(', ')),
            parameters: scope._parameters.createDelegate(scope),
            listeners: {
                afterupload: function (self, response, options) {
                    var res = Ext.decode(response.responseText);
                    if (res.success) {
                        scope.fireEvent('updateFile', self, response, options);
                        return;
                    }
                    if (res.errors && res.errors[0]['id'] == 'file') {
                        Ext.Msg.show({
                            title: lang('Error'),
                            msg: lang('File type is not allowed!'),
                            buttons: Ext.Msg.OK,
                            fn: function (b){},
                            icon: Ext.MessageBox.ERROR
                        });
                    }
                },
                beforeupload: function () {
                    if (!scope.form.getForm().isValid()) {
                        return false;
                    }
                },
                failedupload: function (a,b,c) {
                }
            }
        })
        this.buttons.push(this.browseBtn);
        
        if (this.file_id) {
            this.saveButton = new Ext.Button({
                text: lang('Save'),
                handler: function(){
                    this.updateFile();
                },
                minWidth: 75,
                scope: this
            });
            this.buttons.push(this.saveButton);
        }
        
        this.buttons.push({
            text: lang('Cancel'),
            minWidth: 75,
            handler: function() {
                this.close();
            },
            scope: this
        });     
        
        OSDN.Files.Edit.superclass.initComponent.apply(this, arguments);
        
        this.addEvents('load', 'updateFile', 'failureUpdate');
        
        this.form.on('actioncomplete', function (form, action) {
            var self = this;
            this.disableEnableButtons();
            if (action.type == 'load' && action.result.data.id) {
                var file = action.result.data; 
                this._fileInfo = new Ext.Panel({
                    height: 22,
                    border: false,
                    defaults: {
                        border: false
                    },
                    items: [{
                        xtype: 'panel',
                        html: '<div align="right"><nobr><a href="' + self.downloadUrl(file['id']) + '">' + file['originalfilename'] + '</a> ( ' + Ext.util.Format.fileSize(file['size']) + ' ) </nobr></div>'
                    }]
                });
                self.form.add(this._fileInfo);
                self.form.doLayout();
            }
        }, this)
        
        this.form.on('ready', function () {
            this.disableEnableButtons();
        }, this);
    },
    
    openScanConfiguration: function () {
        var c = new OSDN.Documents.Configuration();
        c.showInWindow();
        c.on('update', function () {
            this.scanBtn.update();
        }, this, {single: true});
    },
    
    disableEnableButtons: function() {
        if (this.form.getForm().isValid()) {
            if (this.scanBtn) {
                if (this.scanBtn.isReady()) {
                    this.scanBtn.enable();
                }
            }
            if (this.saveButton) {
                this.saveButton.enable();
            }
            this.browseBtn.enable();
        } else {
            if (this.scanBtn) {
                this.scanBtn.disable();
            }
            if (this.saveButton) {
                this.saveButton.disable();
            }
            this.browseBtn.disable();
        }
    },
    
    onRender: function () {
        OSDN.Files.Edit.superclass.onRender.apply(this, arguments);
        this.load();
    },
    
    _parameters: function (){
        var params  = {}, k;
        
        params = this.params;
        
        Ext.apply(params, {
            description: this.form.getForm().findField('description').getValue()
        });
        
        if (this.file_id) {
            params.file_id = this.file_id
        }
        return params;
    },
    
    load: function(params) {
    	if (!params) {
    		params = {};
    	}
    	if (params.file_id) {
    		this.file_id = params.file_id;
    		this.params.file_id = params.file_id;
    	}
    	
        if (this.file_id) {
        	params.file_id = this.file_id;
            this.form.getForm().load({
                url: this.loadUrl,
                method: 'POST',
                params: params,
                waitMsg: true,
                success: function(form, options){
                    this.fireEvent('load');
                },
                scope: this
            });
        }
    },
    
    updateFile: function(callback) {
    	var scope = this;
        if (!this.file_id) {
            throw 'Cannot update. file_id is not found.';
        }
        
        var failure = function() {
            OSDN.Msg.error(lang('Update student failed. Try again.'));
            this.fireEvent('failureUpdate');
        };
        if (this.form.getForm().isValid()) {
            this.form.getForm().submit({
                url: this.updateUrl,
                params: this.params,
                success: function(form, options){
                    if (true !== options.result.success) {
                        failure();
                        return;
                    }
                    this.fireEvent('updateFile', this, Ext.encode(options.result), options);
                    if ('function' === typeof callback) {
                        callback();
                    }
                },
                failure: failure.createDelegate(this),
                scope: this
            });
        } else {
            this.fireEvent('failureUpdate');
        }
    } 

});

Ext.reg('OSDN.Files.Edit', OSDN.Files.Edit);