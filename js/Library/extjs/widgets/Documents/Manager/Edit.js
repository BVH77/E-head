Ext.ns('OSDN.Documents.Manager');

OSDN.Documents.Manager.Edit = Ext.extend(OSDN.Window, {
	
    loadUrl: link('student', 'documents', 'get-document'),
	
	updateUrl: link('student', 'documents', 'update-document'),
	
	scanUrl: '/student/documents/scan-document', //link('student', 'documents', 'scan-document'),
	
	deleteFileUrl: link('student', 'documents', 'delete-file'),
	
	downloadUrl: function(id) {
		return link('student', 'documents', 'download', {id: id}, 'html');
	},
	
	documentSoursesUrl: link('student', 'documents', 'get-document-sourses'),
	
	disabledTitle: false,
    
	width: 400,
    
    modal: true,
    
	resizable: false, 
    
    autoHeight: true,
    
	doc_id: null,
	
	document_type_id: null,
	
	entity_id: null, 
	
	_fileInfo: null,
	
	saveBtn: null,
	
	browseBtn: null,
	
	allowedFormats: [],
	
	question: null,
	
	expired_date_required: false,
	
	permissions: false,
	
    initComponent: function() {
        
		var scope = this;
		
		this.tools = [];
		if (Ext.isIE) {
    		this.tools.push({
                id: 'gear',
                qtip: lang('Scanner settings'),
                handler: this.openScanConfiguration,
                scope: this
            });
		}
		
		if (this.doc_id) {
            this.tools.push({
            	id: 'plus',
                qtip: lang('Add comments'), 
                handler: this.onCommentaryClick,
                scope: this
            });
        }
		
		this._fileInfo = new Ext.Panel({
			height: 22,
			border: false,
			defaults: {
				border: false
			},
			items: [{
				xtype: 'panel',
				html: '<nobr><center>' + lang('Without file') + '</center></nobr>'
			}]
		});
		
		var items = [{
			xtype: 'textfield',
			fieldLabel: lang('Title'),
			name: 'title',
			value: this.disabledTitle ? this.disabledTitle : '',
			//disabled: this.disabledTitle ? true : false,
			readOnly: this.disabledTitle ? true : false,
			allowBlank: false,
			enableKeyEvents: true,
			listeners:{
				keyup: function(){
					scope.disableEnableButtons(scope.form.getForm().findField('document_storage_source_id').getValue())
				}
			}		
		}, {
			xtype: 'textfield',
			fieldLabel: lang('Author'),
			name: 'author',
			allowBlank: true,
			enableKeyEvents: true,
			listeners:{
				keyup: function(){
					scope.disableEnableButtons(scope.form.getForm().findField('document_storage_source_id').getValue())
				}
			}
		}/*, {
            xtype: 'osdndatefield',
            fieldLabel: lang('Date'),
            name: 'modified',
            hiddenName: 'modified',
            allowBlank: false,
            value: new Date()
        }*/, {
			xtype: 'osdndatefield',
			fieldLabel: lang('Expired date'),
			name: 'expired_date',
			hiddenName: 'expired_date',
			allowBlank: !this.expired_date_required,
//			value: new Date(),
			listeners: {
                change: function() {
                	scope.disableEnableButtons(scope.form.getForm().findField('document_storage_source_id').getValue())
                },
                select: function() {
                    scope.disableEnableButtons(scope.form.getForm().findField('document_storage_source_id').getValue())
                }
			}
		}, {
            xtype: 'xdatetime',
            fieldLabel: lang('Received date'),
            name: 'received_date',
            hiddenName: 'received_date',
            dateFormat: OSDN.date.DATE_FORMAT,
            timeFormat: OSDN.date.TIME_FORMAT,
            value: new Date(),
            listeners: {
                change: function() {
                    scope.disableEnableButtons(scope.form.getForm().findField('document_storage_source_id').getValue())
                },
                select: function() {
                    scope.disableEnableButtons(scope.form.getForm().findField('document_storage_source_id').getValue())
                }
            }
        }, {
			xtype: 'textarea',
			fieldLabel: lang('Subject'),
			name: 'subject',
			anchor: '-1',
			allowBlank: true
		}, {
			xtype: 'textarea',
			fieldLabel: lang('Keywords'),
			name: 'keywords',
			anchor: '-1',
			allowBlank: true
		},{
            xtype: 'osdncombo',
            store: new Ext.data.Store({
                proxy: new Ext.data.HttpProxy({
                    url: this.documentSoursesUrl
                }),
				//autoLoad:true,
                reader: new Ext.data.JsonReader({
                    root: 'rows'
                }, ['id', 'name'])
            }),
            displayField: 'name',
            valueField: 'id',
            hiddenName: 'document_storage_source_id',
            name: 'document_storage_source_id',
            fieldLabel: lang('Document source'),
            editable: false,
            resizable: true,
			allowBlank: false,
			triggerAction: 'all',
			value: 1,
			listeners: {
				ready: function (combo, value) {
					scope.disableEnableButtons(value);
				},
				select: function (combo, record, index) {
					scope.disableEnableButtons(record.data.id);
					if (record.data.id != 1) {
						if (scope.form.reader.jsonData) {
							var data = scope.form.reader.jsonData.data[0];
							if (data.fileData) {
								Ext.Msg.show({
									title: lang('Warning'),
									msg: lang('First delete connected file!'),
									buttons: Ext.Msg.OK,
									icon: Ext.MessageBox.WARNING
								});
								combo.setValue(data.document_storage_source_id);
								scope.disableEnableButtons(data.document_storage_source_id);
							}
						}
					}
				} 
			}
        }];
		
		if (this.doc_id) {
			if (this.question) {
				items.push({
					xtype: 'checkbox',
					fieldLabel: this.question,
					name: 'question_response',
					anchor: 0,
					inputValue: 1
				});
			}
			items.push(this._fileInfo);
		}
	
		
		this.form = new OSDN.form.FormPanel({
            autoScroll: false,
            autoHeight: true,
			labelWidth: 120,
            items: items,
            reader: new Ext.data.JsonReader({
                root: 'data'
            }, [
                'id', 
                'subject', 
                'title', 
                'author', 
                'keywords',
                {
                    name: 'expired_date', type:'date', 
                    dateFormat: OSDN.date.DATE_TIME_FORMAT_SERVER
                },
                {
                    name: 'received_date', type:'date', 
                    dateFormat: OSDN.date.DATE_TIME_FORMAT_SERVER
                },
                'question_response',
                'document_storage_source_id', 
                'fileData'
            ]),
            permissions: this.permissions
        });
		
		this.form.on('actioncomplete', function(form, action) {
			var self = this;
			
			form.findField('title').on('change', self.updateTitle.createDelegate(self));
			
			this.disableEnableButtons.createDelegate(this)(action.result.data.document_storage_source_id);
			if (action.result.data.fileData) {
				var file = action.result.data.fileData;
				
				var fileName = file['originalfilename'];
				for (var i = fileName.length - 1; i >= 0 && fileName.charAt(i) != '.'; i--);
                if (i >= 0 && i < fileName.length - 1) {
                    fileType = fileName.substr(i + 1);
                }
				
				if (scope._fileInfo) {
					scope.remove(scope._fileInfo);
				}
				
				var fitmp = new Ext.Panel({
			        items: [{
                        xtype: 'panel',
                        border: false,
                        html: '<nobr><a href="' + self.downloadUrl(file['id']) 
                            + '">' + file['originalfilename'] 
                            + '</a> ( ' + Ext.util.Format.fileSize(file['size']) 
                            + ' ) </nobr>'
                    }],
                    columnWidth: 1
				});
				
				var pp = new OSDN.PreviewPanel({
                    modal: true,
                    fileUrl: self.downloadUrl(file['id']),
                    type: fileType
                });
                
                if (pp.isSupportedFormat()) {
                	fitmp.add(pp);
                }
				
				this._fileInfo = new Ext.Panel({
					layout: 'column',
					layoutColumn: {
						columns: 2
					},
					border: false,
					defaults: {
						border: false
					},
					items: [fitmp, {
						xtype: 'panel',
						width: 90,
						items: [{
							xtype: 'button',
							minWidth: 90,
							text: lang('Delete'),
							handler: function() {
								OSDN.Documents.Manager.Files.Delete({
									url: self.deleteFileUrl,
									params: {
										id: action.result.data.id,
										file_id: file.id
									},
									success: function () {
										scope.remove(scope._fileInfo);
										this._fileInfo = new Ext.Panel({
											height: 22,
											border: false,
											defaults: {
												border: false
											},
											items: [{
												xtype: 'panel',
												html: '<nobr><center>' + lang('Without file') + '</center></nobr>'
											}]
										});
										self.form.add(this._fileInfo);
										self.form.doLayout();
										self.form.reader.jsonData.data[0].fileData = null;
										self.disableEnableButtons(self.form.getForm(). findField('document_storage_source_id').getValue());
										scope.fireEvent('deleteFile');
									}
								})
								
								
								
							}
						}]
					}]
				});
				self.form.add(this._fileInfo);
				self.doLayout();
			}
		}, this)

        this.items = [this.form];

		if (this.doc_id) {
			this.title = lang('Editing document');
		} else {
			if (this.document_type_id) {
				this.title = lang('Adding mandatory document');
			} else {
				this.title = lang('Adding general document');
			}
		}
        
		//this.bbar = new Ext.Toolbar({items: this.getBbar()}) 
		this.buttons = this.getBbar();
		
        OSDN.Documents.Manager.Edit.superclass.initComponent.apply(this, arguments);
        
        this.addEvents('load', 'updateFile', 'failureUpdate', 'deleteFile');
    },
    
    openScanConfiguration: function () {
    	var c = new OSDN.Documents.Configuration();
        c.showInWindow();
        c.on('update', function () {
            this.scanBtn.update();
        }, this, {single: true});
    },
	
	updateTitle: function () {
		var title;
		if (this.document_type_id) {
			title = lang('Editing mandatory document: "{0}" ', this.form.getForm().findField('title').getValue());
		} else {
			title = lang('Editing general document: "{0}" ', this.form.getForm().findField('title').getValue());
		}
		this.setTitle(title);
	},
	
	disableEnableButtons: function(documentType) {
		var formIsValid = this.form.getForm().isValid();
		
		if (!this.doc_id) {
			if (documentType == 1) {
				if (formIsValid) {
                    if (this.browseBtn) {
					   this.browseBtn.enable();
                    }
					if (this.scanBtn) {
						this.scanBtn.enable();
					}
				} else {
                    if (this.browseBtn) {
					   this.browseBtn.disable();
                    }
					if (this.scanBtn) {
						this.scanBtn.disable();
					}
				}
				this.saveBtn.disable();
			} else {
                if (this.browseBtn) {
				    this.browseBtn.disable();
                }
				if (this.scanBtn) {
					this.scanBtn.disable();
				}
				if (formIsValid) {
					this.saveBtn.enable();
				} else {
					this.saveBtn.disable();
				}
			}
		} else {
			if (documentType == 1) {
				if (formIsValid) {
                    if (this.browseBtn) {
					   this.browseBtn.enable();
                    }
					if (this.scanBtn) {
						this.scanBtn.enable();
					}
				} else {
                    if (this.browseBtn) {
					   this.browseBtn.disable();
                    }
					if (this.scanBtn) {
						this.scanBtn.disable();
					}
				}
				if (!this.form.reader.jsonData || !this.form.reader.jsonData.data[0].fileData) {
					this.saveBtn.disable();
				} else {
					if (formIsValid) {
						this.saveBtn.enable();
					} else {
						this.saveBtn.disable();
					}
				}
			} else {
                if (this.browseBtn) {
				    this.browseBtn.disable();
                }
				if (this.scanBtn) {
					this.scanBtn.disable();
				}
				if (formIsValid) {
					this.saveBtn.enable();
				} else {
					this.saveBtn.disable();
				}
			}
		}
	},
	
	getBbar: function () {
		var scope = this;
		
		var bbar = [];
		
		if (Ext.isIE) {
    		bbar.push({
    			iconCls : 'osdn-scanner-configuration',
                tooltip: lang('Scanner settings'), 
    			text: '',
    			minWidth: 16,
                handler: this.openScanConfiguration,
                scope: this
            });
            bbar.push(new Ext.Toolbar.Fill({own: true}));
            
            this.scanBtn = this.scanBtnFunc();
            bbar.push(this.scanBtn);
            this.scanBtn.on('ready', function () {
                this.disableEnableButtons(this.form.getForm().findField('document_storage_source_id').getValue());
            }, this);
		}
        
		this.browseBtn = this.browseBtnFunc();
		bbar.push(this.browseBtn);
		
		this.saveBtn = new Ext.Button({
			text: lang('Save'),
			handler: function(){
				this.updateFile();
			},
			minWidth: 75,
			scope: this
		});
		
		bbar.push(this.saveBtn);
		
		bbar.push({
            text: lang('Cancel'),
            minWidth: 75,
            handler: function() {
                this.close();
            },
            scope: this
        });		
        
		return bbar;
	},
	
	scanBtnFunc: function () {
		var scope = this;
		return new OSDN.ScanButton({
			url: this.scanUrl,
			text: lang('Scan'),
			parameters: scope._parameters.createDelegate(scope),
			iconCls: 'osdn-scan',
			listeners: {
				uploaded: function (button, response, errorCode, errorString) {
					var res = Ext.decode(response);
					if (res.success) {
						scope.fireEvent('updateFile');
					} else {
						if (res.errors[0]['id'] == 'file') {
							Ext.Msg.show({
								title: lang('Error'),
								msg: lang('File type is not allowed!'),
								buttons: Ext.Msg.OK,
								icon: Ext.MessageBox.ERROR
							});
						}
					}
				}
			}
		});
	},
	
	browseBtnFunc: function () {
		var scope = this;
		return new OSDN.UploadButton({
			uploadUrl: scope.updateUrl,
            input_name: 'RemoteFile',
            text: lang('Upload'),
            tooltip: lang('You can upload next formats: {0}!', this.allowedFormats.join(', ')),
			parameters: scope._parameters.createDelegate(scope),
			listeners: {
				afterupload: function (self, response, options) {
					var res = Ext.decode(response.responseText);
					if (res.success) {
						scope.fireEvent('updateFile');
						return;
					}
					if (res.errors[0]['id'] == 'file') {
						Ext.Msg.show({
							title: lang('Error'),
							msg: lang('File type is not allowed!'),
							buttons: Ext.Msg.OK,
							icon: Ext.MessageBox.ERROR
						});
					}
				},
				beforeupload : function() {
					if (!scope.form.getForm().isValid()) {
						return false;
					}
				}
			}
        });
	},
	
	onRender: function () {
		OSDN.Documents.Manager.Edit.superclass.onRender.apply(this, arguments);
		this.load();
	},
    
    load: function() {
		if (this.doc_id) {
			this.form.getForm().load({
				url: this.loadUrl,
				method: 'POST',
				params: {
					id: this.doc_id,
					document_type_id: this.document_type_id 
				},
				waitMsg: true,
				success: function(form, options){
					this.fireEvent('load');
				},
				scope: this
			});
		}
    },
	
    updateFile: function (callback) {
        var failure = function() {
            OSDN.Msg.error(lang('Update document failed. Try again.'));
			this.fireEvent('failureUpdate');
        };
        if (this.form.getForm().isValid()) {
			var params = {
				entity_id: this.entity_id
			} 
			if (this.doc_id) {
				params.id = this.doc_id; 
			}
			if (this.document_type_id) {
				params.document_type_id = this.document_type_id;				
			}
			
            this.form.getForm().submit({
                url: this.updateUrl,
                params: params,
                success: function(form, options){
                    if (true !== options.result.success) {
                        failure();
                        return;
                    }
					this.fireEvent('updateFile');
					this.close();
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
    },
    
    onCommentaryClick: function() {
    	if (this.doc_id) {
            var w = new Ext.Window({
                width: 600,
                height: 400,
                modal: true,
                iconCls: 'osdn-comments',
                layout: 'fit',
                title: lang('Comments'),
                items: [{
                    xtype: 'osdn.comments.tree',
                    title: false,
                    entityType: 'document',
                    controller: this.controller,
                    entityId: this.doc_id,
                    resource: ['document', 'commentary']
                }],
                scope: this
            }).show();
        }
    },
    
	_parameters: function () {
		var params  = {
			entity_id: this.entity_id,
			document_storage_source_id: this.form.getForm().findField('document_storage_source_id').getValue()
		};
		if (this.doc_id) {
			params.id = this.doc_id 
		}
		if (this.document_type_id) {
			params.document_type_id = this.document_type_id
		}
		
		var expired_date = this.form.getForm().findField('expired_date').getValue();
		if (expired_date) {
			expired_date = expired_date.format(OSDN.date.DATE_TIME_FORMAT_SERVER);
		}
		var received_date = this.form.getForm().findField('received_date').getValue();
		if (received_date) {
            received_date = received_date.format(OSDN.date.DATE_TIME_FORMAT_SERVER);
        }
		
		return Ext.apply(params, {
			title: this.form.getForm().findField('title').getValue(),
			author: this.form.getForm().findField('author').getValue(),
			subject: this.form.getForm().findField('subject').getValue(),
			keywords: this.form.getForm().findField('keywords').getValue(),
			expired_date: expired_date,
			received_date: received_date,
            document_storage_source_id: this.form.getForm().findField('document_storage_source_id').getValue(),
            question_response: this.form.getForm().findField('question_response')? 
                this.form.getForm().findField('question_response').getValue(): null
		});
	}
	
	
});

Ext.reg('OSDN.Documents.Manager.Edit', OSDN.Documents.Manager.Edit);