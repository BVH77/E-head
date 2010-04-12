Ext.ns('OSDN.Documents.Manager');

OSDN.Documents.Manager.GeneralDocuments = Ext.extend(Ext.grid.GridPanel, {
    
	autoExpandColumn: Ext.id(),
	
    loadMask: true,
    
    module: 'student',
    
	entity_id: null,
	
	resource: false,
	
	iconCls: 'osdn-documents',
	
	allowedFormats: OSDN.AllowedExtensions || [],
	
    initComponent: function() {

    	//permissions
    	this.isAddAllowed = this.resource? acl.isAdd.apply(acl, this.resource): false;
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
		
        this.ds = new Ext.data.JsonStore({
            url: this.listUrl,
            root: 'rows',
			base_params:{
				entity_id: this.entity_id
			},
            totalProperty: 'total',
            remoteSort: false,
            sortInfo: {
				field: 'title', 
				direction: 'ASC'
			},
            fields: [
				{name: 'id'},
				{name: 'title'},
				{name: 'sourseName'},
				{name: 'subject'},
				{name: 'type_id'},
				{name: 'file_id'},
				{name: 'originalfilename'},
				{name: 'comments'},
				{name: 'type'},
				{name: 'size'}
            ] 
        });
        
		var rendererValue = function(value, metadata, record) {
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
            header: lang('title'),
            dataIndex: 'title',
            width: 120,
			renderer: function (value, metadata, record, rowIndex,  colIndex, store) {
				var qtip = '', text = ''; 
				if (record.get('file_id')) {
					text = [record.get('originalfilename'),' ( ', Ext.util.Format.fileSize(record.get('size')), ' )'].join('');
					qtip = 'qtip="' + text + '"';
					return '<div ' + qtip + '> ' + (value || '&nbsp;') + ' <span  class="added-file">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></div>';
				} else {
					return value || '&nbsp;';
				}
			}
        }, {
            header: lang('Location'),
            dataIndex: 'sourseName',
            width: 120,
			renderer: rendererValue
        }, {
			id: this.autoExpandColumn,
			header: lang('Subject'),
            dataIndex: 'subject',
			renderer: rendererValue
		}, {
			header: lang('Comments'),
            dataIndex: 'comments',
            width: 60, 
            renderer: function (value, metadata, record, rowIndex,  colIndex, store) {
            	metadata.attr = " style='cursor:pointer;' ";
            	return '<div class="osdn-comment-add" style="float:right;width:16px;height:15px;">&nbsp;</div><div style="padding-left:16px;" align="center">' + value + '</div>';
            } 
		}];
        
        var filtersPlugin = new Ext.grid.GridFilters({
            filters: [
                {type: 'string',  dataIndex: 'sourseName'},
				{type: 'string',  dataIndex: 'title'}
            ]
        });
        
        var items = [];
        
        if (acl.isView('document', 'commentary')) {
            items.push({
                text: lang('Comentaries'),
                iconCls: 'osdn-comments',
                handler: this.onCommentaryClick,
                scope: this
            });
            if (this.isAddAllowed) {
            	items.push("-");
            }
        }
        
        if (this.isAddAllowed) {
        	items.push({
                text: lang('Add'),
                iconCls: 'osdn-document-add',
                handler: self.add.createDelegate(self)
            });
            items.push("-");
        }
        if (this.isUpdateAllowed) {
        	items.push({
                text: lang('Edit'),
                iconCls: 'osdn-document-edit',
                handler: self.edit
            });
        }
        if (this.isDeleteAllowed) {
            items.push({
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
                            self.load();
                        }
                    });
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
                handler: self.download
            }
        });
        
        var actionsPlugin = new OSDN.grid.Actions({
            autoWidth: true,
            items: items
        });
       
        this.plugins = [filtersPlugin, actionsPlugin];
		
        var bbarItems = [];
        if (this.isAddAllowed) {
        	bbarItems.push({
                text: lang('Add'),
                iconCls: 'osdn-document-add',
                handler: self.add.createDelegate(self)
            });
        }
        if (bbarItems.length > 0) {
            this.bbar = bbarItems;
        }
		
        OSDN.Documents.Manager.GeneralDocuments.superclass.initComponent.apply(this, arguments);
        
        this.on('render', function() {
			this.load();
        });
		
		this.on('rowdblclick', function(g, rowIndex){
			var record = g.getStore().getAt(rowIndex);
			if (record.get('id')) {
				if (g.isUpdateAllowed) {
				    g.edit(g, rowIndex);
				}
			} else {
				if (g.isAddAllowed) {
				    g.add(g, rowIndex);
				}
			}
		}, this);
		
		this.on('cellclick', function(g, rowIndex, columnIndex, e) {
			var dataIndex = g.getColumnModel().getDataIndex(columnIndex);
			if (dataIndex == 'comments') {
				g.onCommentaryClick.call(g, g, rowIndex);
			}
    	}, this);
        
		this.addEvents('beforeupload', 'afterupload');
    },
    
     // private
    _prepareUrls: function() {
    	var module = this.module;
        var a = {
            listUrl: link(this.module, 'documents', 'get-general-documents'),
			downloadUrl: function (id) { 
				return link(module, 'documents', 'download', {id: id}, 'html');
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
	
	download: function(g, rowIndex) {
		var self = this;
		var record = g.getStore().getAt(rowIndex);
		if (record.get('file_id')) {
			location.href = g.downloadUrl(record.get('file_id'))
		} else {
			
		}
	},
	
	add: function(g, rowIndex) {
		var self = this;
		var w = new OSDN.Documents.Manager.Edit({
			allowedFormats: self.allowedFormats,
			documentSoursesUrl: self.documentSoursesUrl,
			loadUrl: self.loadUrl,
			updateUrl: self.updateUrl,
			scanUrl: self.scanUrl,
			entity_id: self.entity_id,
			permissions: self.isAddAllowed
		});
		w.on('updateFile', function() {
			self.load();
			w.close();
		}, this);
		w.show();
	},
	
	edit: function(g, rowIndex) {
		var doc_id = g.getStore().getAt(rowIndex).get('id');
		var w = new OSDN.Documents.Manager.Edit({
			allowedFormats: g.allowedFormats,
			documentSoursesUrl: g.documentSoursesUrl,
			loadUrl: g.loadUrl,
			updateUrl: g.updateUrl,
			scanUrl: g.scanUrl,
			deleteFileUrl: g.deleteFileUrl,
			downloadUrl: g.downloadUrl,
			doc_id: doc_id,
			entity_id: g.entity_id,
			permissions: g.isUpdateAllowed
		});
		w.on('updateFile', function() {
			g.getStore().on('load', function() {
        		var index = g.getStore().findBy(function(record) {
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
		w.on('deleteFile', function() {
			g.load();
		}, this);
		w.show();
	},
	
	load: function(p) {
        if (p && p.entity_id) {
            this.entity_id = p.entity_id; 
        }
        if (this.entity_id) {
			this.getStore().load({
                params: {
					entity_id: this.entity_id
                }
            });
        }
	},
	
    dummyFunc: function() {
        OSDN.Msg.info('In progress...');
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
            layout: 'fit',
            iconCls: 'osdn-comments',
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
    }
});

Ext.reg('OSDN.Documents.Manager.GeneralDocuments', OSDN.Documents.Manager.GeneralDocuments);