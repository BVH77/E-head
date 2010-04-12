Ext.namespace('OSDN.Documents.Manager');

OSDN.Documents.Manager.PlannedDocuments = Ext.extend(Ext.grid.GridPanel, {
    
    loadMask: true,
    
    iconCls: 'osdn-documents',
    
    module: 'student',
    
    allowedFormats: [
		'pdf',
    	'xls',
        'doc',
        'tif',
        'jpeg',
        'png'
	],
	
	entity_id: null,
	
	allowedDocumentTypes: null,
	
	resource: false,
	
	viewConfig: {
		getRowClass: function (record, index, rowParams, store ) {
			if (record.get('presence') == '0') {
                return 'osdn-document-requested';
			} else if (record.get('presence') == '1' 
		         && record.get('requested_date')
		         && record.get('received_date')
            ) {
				return 'osdn-document-received';
			}
		}
	},
	 
	
	//private
    _prepareUrls: function() {
    	var self = this;
        var a = {
            listUrl: link(this.module, 'documents', 'get-planned-documents'),
			downloadUrl: function (id) { 
				return link(self.module, 'documents', 'download', {id: id}, 'html');
			},
			loadUrl: link(this.module, 'documents', 'get-document'),
			updateUrl: link(this.module, 'documents', 'update-document'),
			scanUrl: link(this.module, 'documents', 'scan-document', null, 'html'),
			deleteUrl: link(this.module, 'documents', 'delete-document'),
			deleteFileUrl: link(this.module, 'documents', 'delete-file'),
			documentSoursesUrl: link(this.module, 'documents', 'get-document-sourses')
        };
        
        for(var i in a) {
            if (!this[i]) {
                this[i] = a[i];
            }
        }
        return this;
    },
	
    initComponent: function() {
        //permissions
        this.isAddAllowed = this.resource ? acl.isAdd.apply(acl, this.resource): false;
        this.isUpdateAllowed = this.resource? acl.isUpdate.apply(acl, this.resource): false;
        this.isDeleteAllowed = this.resource? acl.isDelete.apply(acl, this.resource): false;
        //permissions
    	
    	this._prepareUrls();
    	
    	this.tools = [{
            id: 'refresh',
            qtip: lang('Refresh'),
            handler: function() {
                this.getStore().reload();
            },
            scope: this
        }];
    	
		var self = this;
		
		this.store = new Ext.data.GroupingStore({
            url: this.listUrl, 
            base_params:{
                entity_id: this.entity_id
            },
            reader: new Ext.data.JsonReader({
                root: 'rows',
                totalProperty: 'total'
            }, [
                {name: 'id'},
                {name: 'name'},
                {name: 'required'},
                {name: 'expired_date_required'},
                {name: 'presence'},
                {name: 'question'},
                {name: 'order'},
                {name: 'title'},
                {name: 'sourseName'},
                {name: 'subject'},
                {name: 'type_id'},
                {name: 'file_id'},
                {name: 'requested_date', type: 'date', dateFormat: OSDN.date.DATE_TIME_FORMAT_SERVER},
                {name: 'received_date', type: 'date', dateFormat: OSDN.date.DATE_TIME_FORMAT_SERVER},
                {name: 'originalfilename'},
                {name: 'type'},
                {name: 'templates'},
                {name: 'size'},
                {name: 'category_id'},
                {name: 'category_name'},
                {name: 'comments'}
            ]),
            sortInfo: {
                field: 'order', 
                direction: 'ASC'
            },
            remoteSort: false,
            groupField: 'category_id'
        });
        
        this.view = new Ext.grid.GroupingView({
            //hdCtxIndex: 1, // for propertly enable/disable grouping !!!
            startCollapsed: false,
            // don't remove this span, because div apply native extjs styles
            groupTextTpl: '<span qtip="{[values.rs[0].get("category_name") != null ? values.rs[0].get("category_name") : "' + lang('Without category') + '"]}" ' 
                + ' style="white-space: nowrap; overflow: hidden; display: block;">'
                + '{[values.rs[0].get("category_name") != null ? values.rs[0].get("category_name") : "' + lang('Without category') + '"]}'
                + '</span>'
        });
        
		var rendererValue = function (value, metadata, record) {
			var qtip = '', text = ''; 
			if (record.get('file_id')) {
				text = [record.get('originalfilename'),' ( ', Ext.util.Format.fileSize(record.get('size')), ' )'].join('');
				qtip = 'qtip="' + text + '"';
				return '<div ' + qtip + '> ' + (value || '&nbsp;') + ' </div>';
			} else {
				return value || '&nbsp;';
			}
		} 
		
        this.columns = [new Ext.grid.RowNumberer(), {
            hidden: true,
            dataIndex: 'category_id'
        }, {
            header: lang('title'),
            dataIndex: 'name',
            sortable: false, 
			id: this.autoExpandColumn = Ext.id(),
			renderer: function (value, metadata, record) {
				if (record.get('required') == 1) {
					value = ['<div style="color:red;" >', value, '</div>'].join(''); 
				}
				return rendererValue(value, metadata, record);
			}
        }, {
            header: lang('Location'),
            dataIndex: 'sourseName',
            sortable: false,
            width: 120,
			renderer: rendererValue
        }, {
			header: lang('Subject'),
            dataIndex: 'subject',
            sortable: false,
            hidden: true,
			renderer: rendererValue
		}, {
            header: lang('Requested date'),
            dataIndex: 'requested_date',
            width: 120,
            sortable: false,
            renderer: function (v) {
            	if (v) {
            	   return v.format(OSDN.date.DATE_TIME_WITHOUT_SECONDS_FORMAT);
            	} 
            	return '';
            }
        }, {
            header: lang('Received date'),
            dataIndex: 'received_date',
            width: 120,
            sortable: false,
            renderer: function (v) {
                if (v) {
                   return v.format(OSDN.date.DATE_TIME_WITHOUT_SECONDS_FORMAT);
                } 
                return '';
            }
        }, {
            header: lang('Comments'),
            dataIndex: 'comments',
            width: 60, 
            renderer: function (value, metadata, record, rowIndex,  colIndex, store) {
                if (!record.get('id')) {
                   return null;
                }
                metadata.attr = " style='cursor:pointer;' ";
                return '<div class="osdn-comment-add" style="float:right;width:16px;height:15px;">&nbsp;</div><div style="padding-left:16px;" align="center">' + value + '</div>';
            } 
        }, {
            sortable: false,
            dataIndex: 'presence',
            hideable: false, 
            width: 25,
            fixed: true,
            sortable: false,
            menuDisabled: true,
            renderer: function(value, metadata, record, rowIndex, colIndex, store) {
                if (record.get('presence') === null) {
                	metadata.attr = " style='cursor:pointer;' qtip = '" + lang('Make request') + "'";
                    metadata.css = 'osdn-document-add-request';
                } else if (record.get('presence') == '0') {
                    metadata.attr = " style='cursor:pointer;' qtip = '" + lang('Remove request') + "'";
                    metadata.css = 'osdn-document-delete-request';
                } else if (record.get('presence') == '1' 
                     && record.get('requested_date')
                     && record.get('received_date')
                ) {
                	metadata.attr = "qtip = '" + lang('Requested document was added') + "'";
                    metadata.css = 'osdn-document-requested-added';
                }
            }
        }];
        
        var filtersPlugin = new Ext.grid.GridFilters({
            filters: [
                {type: 'string',  dataIndex: 'name'},
                {type: 'string',  dataIndex: 'sourseName'},
				{type: 'string',  dataIndex: 'title'}
            ]
        });
        
        var items = [];
        
        if (acl.isView('document', 'commentary')) {
            items.push(function (g, rowIndex) {
                var record = g.getStore().getAt(rowIndex);
                if (!record.get('id') || record.get('presence') != 1) {
                    return false;
                }
                return {
                    text: lang('Comentaries'),
                    iconCls: 'osdn-comments',
                    handler: g.onCommentaryClick,
                    scope: g
                }
            });
            if (this.isAddAllowed) {
                items.push(function (g, rowIndex) {
                    var record = g.getStore().getAt(rowIndex);
                    if (!record.get('id') || record.get('presence') != 1) {
                        return false;
                    }
                    return "-";
                });
            }
        }
        
        if (this.isAddAllowed) {
        	items.push(function (g, rowIndex) {
        		var record = g.getStore().getAt(rowIndex); 
                var docName = record.get('name');
                return {
                    text: lang('Add {0} document', docName),
                    iconCls: 'osdn-document-add',
                    handler: record.get('presence') === '0' && record.get('id')? self.edit : self.add 
                }
            });
            items.push(function(g, rowIndex){
            	var record = g.getStore().getAt(rowIndex);
                if (!record.get('id')) {
                    return false;
                }
                if (record.get('presence') != 1) {
                    return false;
                }
                return "-";
            });
        }
        
        if (this.isUpdateAllowed) {
        	items.push(function(g, rowIndex){
                var record = g.getStore().getAt(rowIndex);
                var docName = record.get('name');
                if (record.get('presence') !== null) {
                    return false;
                }
                return {
                    text: lang('Make request of document `{0}` ', docName),
                    iconCls: 'osdn-document-add-request',
                    handler: g.makeRequest
                }
            });
        }
        
        
        if (this.isUpdateAllowed) {
        	items.push(function (g, rowIndex) {
        		var record = g.getStore().getAt(rowIndex);
                if (!record.get('id')) {
                    return false;
                }
                if (record.get('presence') != 1) {
                    return false;
                }
                return {
                    text: lang('Edit'),
                    iconCls: 'osdn-document-edit',
                    handler: self.edit
                }
            });
        }
        
        if (this.isDeleteAllowed) {
        	items.push(function (g, rowIndex) {
        		var record = g.getStore().getAt(rowIndex);
                if (!record.get('id')) {
                    return false;
                }
                if (record.get('presence') != 1) {
                    return false;
                }
                return {
                    text: lang('Delete'),
                    iconCls: 'osdn-document-delete',
                    handler: function(g, rowIndex) {
                        var doc_id = g.getStore().getAt(rowIndex).get('id');
                        OSDN.Documents.Manager.Delete({
                            params:{
                                id: doc_id
                            },
                            url: g.deleteUrl,
                            success: function () {
                                g.getStore().reload();
                            }
                        });
                    }
                }
            });
        }
        
        items.push(function (g, rowIndex) {
            var record = g.getStore().getAt(rowIndex);
            if (!record.get('file_id')) {
                return false;
            }
            var text = [record.get('originalfilename'),' ( ', Ext.util.Format.fileSize(record.get('size')), ' )'].join('');
            return {
                text: lang('Download ({0})', Ext.util.Format.fileSize(record.get('size'))),
                qtip: text, 
                iconCls: 'added-file',
                handler: g.download
            }
        });
        
        items.push(function (g, rowIndex) {
            var record = g.getStore().getAt(rowIndex);
            var templates = Ext.decode(record.get('templates'));
            
            if (templates.length == 0 || 0 == items.length) {
                return false;
            }
            
            return "-";
        });
        
        items.push(function (g, rowIndex) {
            var record = g.getStore().getAt(rowIndex);
            var templates = Ext.decode(record.get('templates'));
            if (templates.length == 0) {
                return false;
            }
            var subitems = [];
            
            Ext.each(templates, function (v){
                subitems.push({
                    text: v['description'] + ' ( ' + v['originalfilename'] + ' - ' + Ext.util.Format.fileSize(v['size']) + ' )',
                    qtip: v['description'] + ' ( ' + v['originalfilename'] + ' - ' + Ext.util.Format.fileSize(v['size']) + ' )',
                    iconCls: 'added-file',
                    handler: function () {
                        g._download(v['id']);
                    }
                });
            }, this);
            
            return {
                text: lang('Templates'),
                iconCls: 'osdn-templates',
                menu: {
                    items: subitems
                }
            }
        });
        
        
        if (this.isUpdateAllowed) {
            items.push(function (g, rowIndex) {
                var record = g.getStore().getAt(rowIndex);
                if (record.get('presence') != '0') {
                    return false;
                }
                return "-";
            });
    
            
            items.push(function(g, rowIndex){
                var record = g.getStore().getAt(rowIndex);
                var docName = record.get('name');
                if (record.get('presence') != '0') {
                    return false;
                }
                return {
                    text: lang('Delete request of document `{0}` ', docName),
                    iconCls: 'osdn-document-delete-request',
                    handler: function (g, rowIndex) {
                        OSDN.Documents.Manager.Delete({
                            params:{
                                id: record.get('id')
                            },
                            url: g.deleteUrl,
                            success: function () {
                                g.load();
                            }
                        });
                    }
                }
            });
        }
        
        var actionsPlugin = new OSDN.grid.Actions({
            autoWidth: true,
            items: items
        });
	   
        this.plugins = [filtersPlugin, actionsPlugin];
		
        OSDN.Documents.Manager.PlannedDocuments.superclass.initComponent.apply(this, arguments);
        
		this.on({
            render:  function() {
                this.load();
            },
            rowdblclick: function (g, rowIndex){
                var record = g.getStore().getAt(rowIndex);
                /*if (record.get('file_id')) {
                    self.download(g, rowIndex);
                } else*/ if (record.get('id')) {
                    if (g.isUpdateAllowed) {
                        self.edit(g, rowIndex);
                    }                   
                } else {
                    if (g.isAddAllowed) {
                        self.add(g, rowIndex);
                    }
                }
            },
            cellclick: function (grid, rowIndex, columnIndex, e) {
            	var record = grid.getStore().getAt(rowIndex);
                var fieldName = grid.getColumnModel().getDataIndex(columnIndex);
                
                if (OSDN.empty(this.resource)) {
                    return;
                }
                             
                if ('presence' == fieldName) {
                    if(record.get('presence') === null) {
                        grid.makeRequest(grid, rowIndex);
                    } else if (record.get('presence') == '0') {
                        OSDN.Documents.Manager.Delete({
                            params:{
                                id: record.get('id')
                            },
                            url: grid.deleteUrl,
                            success: function () {
                                grid.getStore().reload();
                            }
                        });
                    }
                } else if ('comments' == fieldName) {
                    if (record.get('id')) {
                       grid.onCommentaryClick.call(grid, grid, rowIndex);
                    }
                }
            },
            scope: this
		});
        
		this.addEvents('beforeupload', 'afterupload');
    },
    
    makeRequest: function (g, rowIndex) {
    	Ext.Msg.show({
            title: lang('Question'),
            msg: lang('Are you sure?'),
            buttons: Ext.Msg.YESNO,
            fn: function (b){
                if ('yes' == b) {
                    var record = g.getStore().getAt(rowIndex);
                    record.set('presence', 0);
                    Ext.Ajax.request({
                        url: g.updateUrl,
                        params: {
                        	title:  record.get('name'),
                            document_type_id: record.get('type_id'),
                            entity_id: g.entity_id,
                            presence: 0
                        },
                        success: function (response) {
                            var r = OSDN.decode(response.responseText);
                            if (r.success) {
                                record.commit();
                                g.getStore().reload();
                            }
                        }
                    });
                }
            },
            icon: Ext.MessageBox.QUESTION
        });
    	
    	
    	
    },
	
	_download: function (file_id) {
		location.href = this.downloadUrl(file_id);
	},
	
	download: function (g, rowIndex) {
		var self = this;
		var record = g.getStore().getAt(rowIndex);
		if (record.get('file_id')) {
			g._download(record.get('file_id'));
		} else {
			
		}
	},
	
	add: function (g, rowIndex) {
		var record = g.getStore().getAt(rowIndex);
		var type_id = record.get('type_id');
		var type_name = record.get('name');
		
		var w = new OSDN.Documents.Manager.Edit({
			disabledTitle: type_name,
			question: record.get('question'),
			expired_date_required: record.get('expired_date_required') == 1,
			allowedFormats: g.allowedFormats,
			documentSoursesUrl: g.documentSoursesUrl,
			loadUrl: g.loadUrl,
			updateUrl: g.updateUrl,
			scanUrl: g.scanUrl,
			entity_id: g.entity_id,
			document_type_id: type_id,
			permissions: g.isAddAllowed
		});
		w.on('updateFile', function (){
			g.load();
			w.close();
		}, this);
		w.show();
	},
	
	edit: function (g, rowIndex) {
		var record = g.getStore().getAt(rowIndex);		
		var doc_id = record.get('id');
		var type_id = record.get('type_id');
		var type_name = record.get('name');
		var w = new OSDN.Documents.Manager.Edit({
			disabledTitle: type_name,
			question: record.get('question'),
			expired_date_required: record.get('expired_date_required') == 1,
			allowedFormats: g.allowedFormats,
			documentSoursesUrl: g.documentSoursesUrl,
			loadUrl: g.loadUrl,
			updateUrl: g.updateUrl,
			scanUrl: g.scanUrl,
			deleteFileUrl: g.deleteFileUrl,
			downloadUrl: g.downloadUrl,
			doc_id: doc_id,
			entity_id: g.entity_id,
			document_type_id: type_id,
			permissions: g.isUpdateAllowed
		});
		w.on('updateFile', function (){
			g.getStore().on('load', function () {
        		var index = g.getStore().findBy(function (record) {
        			return record.get('id') == doc_id;
        		}, g);
        		if (!index) {
        			index = 0;
        		} 
        		g.getSelectionModel().selectRow(index);
			}, g, {single:true});
			g.load();
			w.close();
		}, this);
		w.on('deleteFile', function (){
			g.getStore().on('load', function () {
        		var index = g.getStore().findBy(function (record) {
        			return record.get('id') == doc_id;
        		}, g);
        		if (!index) {
        			index = 0;
        		} 
        		g.getSelectionModel().selectRow(index);
			}, g, {single:true});
			g.load();
		}, this);
		w.show();
	},
	
	load: function (p) {
        if (p && p.entity_id) {
            this.entity_id = p.entity_id; 
        }
        if (this.entity_id) {
        	var params = {
                entity_id:  this.entity_id
            };
            if (this.allowedDocumentTypes !== null) {
                params.allowedDocumentTypes = Ext.encode(this.allowedDocumentTypes);
            }
        	
			this.getStore().load({
                params: params
            });
        }
	},
	
	/**
     * Callback handler for commentary click
     * 
     * @param {Ext.util.Observable} e
     * @param {Ext.Element} el
     */
    onCommentaryClick: function(g, rowIndex) {
        var id = g.getStore().getAt(rowIndex).get('id');
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
                entityId: id,
                resource: ['document', 'commentary']
            }],
            scope: this
        });
        w.show();
        w.on('close', function() {
            this.getStore().reload();
        }, this);
    },
    
    dummyFunc: function() {
        OSDN.Msg.info('In progress...');
    }
    
});

Ext.reg('OSDN.Documents.Manager.PlannedDocuments', OSDN.Documents.Manager.PlannedDocuments);