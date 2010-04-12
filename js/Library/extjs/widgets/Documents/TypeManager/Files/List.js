Ext.namespace('OSDN.Documents.TypeManager.Files');

OSDN.Documents.TypeManager.Files.List = Ext.extend(Ext.grid.GridPanel, {
	
	module: 'student',
    
	autoExpandColumn: Ext.id(),
	
    loadMask: true,
    
    fileListUrl: null,
	downloadUrl: null,
	loadUrl: null,
	updateUrl: null,
	scanUrl: null,
	deleteUrl: null,
	
	allowedFormats: [],
	
	document_type_id: null,
	
    initComponent: function() {

    	this._prepareUrls();
    	
		var self = this;
		
		this.tools = [{
            id: 'plus',
            qtip: lang('Add'),
            handler: this.add,
            scope: this
        }, {
		    id: 'refresh',
			qtip: lang('Refresh'),
		    handler: function() {
		        this.getStore().reload();
		    },
		    scope: this
		}];
		
        this.ds = new Ext.data.JsonStore({
            url: this.fileListUrl,
            root: 'data',
			base_params:{
				document_type_id: this.document_type_id
			},
            totalProperty: 'total',
            remoteSort: true,
            sortInfo: {
				field: 'originalfilename', 
				direction: 'ASC'
			},
            fields: [
				{name: 'id'},
                {name: 'description'},
				{name: 'originalfilename'},
                {name: 'type'},
				{name: 'size'}
            ] 
        });
		 		
        this.columns = [new Ext.grid.RowNumberer(), {
			id: this.autoExpandColumn,
            header: lang('Description'),
			hideable: false,
            dataIndex: 'description'
        },{
            header: lang('filename'),
            dataIndex: 'originalfilename',
			hidden:true,
			width: 70
        }, {
            header: lang('Size'),
            dataIndex: 'size',
			hidden:true,
            width: 40,
			renderer: function (value, metadata, record, rowIndex,  colIndex, store) {
				return Ext.util.Format.fileSize(value);
			}
        }, {
            header: lang('Type'),
            dataIndex: 'type',
			hidden:true,
            width: 80,
			renderer: function (value) {
				return value;
			}
        }];
        
        var filtersPlugin = new Ext.grid.GridFilters({
            filters: [
                {type: 'string',  dataIndex: 'description'},
                {type: 'string',  dataIndex: 'originalfilename'}
            ]
        });
        
        var actionsPlugin = new OSDN.grid.Actions({
            autoWidth: true,
            items: [{
				text: lang('Add'),
                iconCls: 'add',
                handler: self.add.createDelegate(self)
			}, "-" , {
				text: lang('Edit'),
                iconCls: 'edit',
                handler: self.edit
			}, {
				text: lang('Delete'),
                iconCls: 'delete',
                handler: self.del
			}, {
				text: lang('Download'),
                iconCls: 'added-file',
                handler: self.download
			}]
        });
		
        this.plugins = [filtersPlugin, actionsPlugin];
		
        OSDN.Documents.TypeManager.Files.List.superclass.initComponent.apply(this, arguments);
        
        this.on('render', function() {
			this.load();
        });
		
		this.on('rowdblclick', function (g, rowIndex){
			var record = g.getStore().getAt(rowIndex);
			/*if (record.get('file_id')) {
				self.download(g, rowIndex);
			} else*/ if (record.get('id')) {
				self.edit(g, rowIndex);
			} else {
				self.add(g, rowIndex);
			}
		}, this);
        
		this.addEvents('beforeupload', 'afterupload');
    },
    
	//private
    _prepareUrls: function() {
    	var module = this.module;
        var a = {
        	 fileListUrl: link(module, 'document-types', 'files-list'),
			downloadUrl: function (id) { 
				return link(module, 'document-types', 'download', {id: id}, 'html');
			},
			loadUrl: link(module, 'document-types', 'load-file'),
			updateUrl: link(module, 'document-types', 'update-file'),
			scanUrl: link(module, 'document-types', 'scan-file', null, 'html'),
			deleteUrl: link(module, 'document-types', 'delete-file')
        };
        
        for(var i in a) {
            if (!this[i]) {
                this[i] = a[i];
            }
        }
        return this;
    },

	
	download: function (g, rowIndex) {
		var record = g.getStore().getAt(rowIndex);
		if (record.get('id')) {
			location.href = g.downloadUrl(record.get('id'));
		} else {
			
		}
	},
	
	add: function (g, rowIndex) {
		var self = this;
		
		var w = new OSDN.Documents.TypeManager.Files.Edit({
			allowedFormats: self.allowedFormats,
			loadUrl: self.loadUrl,
			updateUrl: self.updateUrl,
			scanUrl:  self.scanUrl,
			document_type_id: self.document_type_id
		});
		w.on('updateFile', function (){
			self.load();
			w.close();
		}, this);
		w.show();
	},
	
	del: function (g, rowIndex) {
		var file_id = g.getStore().getAt(rowIndex).get('id');
		OSDN.Documents.TypeManager.Files.Delete({
			params:{
				file_id: file_id
			},
			url: g.deleteUrl,
			success: function () {
				g.load();
			}
		});
	},
	
	edit: function (g, rowIndex) {
		var file_id = g.getStore().getAt(rowIndex).get('id');
		var w = new OSDN.Documents.TypeManager.Files.Edit({
			allowedFormats: g.allowedFormats,
			loadUrl: g.loadUrl,
			updateUrl: g.updateUrl,
			downloadUrl: g.downloadUrl,
			scanUrl:  g.scanUrl,
			document_type_id: g.document_type_id,
			file_id: file_id
		});
		w.on('updateFile', function (){
			g.load();
			w.close();
		}, this);
		w.show();
	},
	
	load: function (p) {
        if (p && p.document_type_id) {
            this.document_type_id = p.document_type_id; 
        }
        if (this.document_type_id) {
			this.getStore().load({
                params: {
					document_type_id:	this.document_type_id
                }
            });
        }
	},
    
    dummyFunc: function() {
        OSDN.Msg.info('In progress...');
    }
    
});

Ext.reg('OSDN.Documents.TypeManager.Files.List', OSDN.Documents.TypeManager.Files.List);