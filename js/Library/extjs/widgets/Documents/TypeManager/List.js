Ext.namespace('OSDN.Documents.TypeManager');

OSDN.Documents.TypeManager.List = Ext.extend(Ext.grid.GridPanel, {
	
	module: 'student',

	listUrl: null,
	
	//function 
	downloadUrl: null,
	
	createUrl: null,
	
	loadUrl: null,
	
	updateUrl: null,
	
	scanUrl: null,
	
	deleteUrl: null,
	
	allowedFormats: [
		'pdf',
    	'xls',
        'doc',
        'tif',
        'jpeg',
        'png'
	],

    loadMask: true,
    
    resource: false,
    
    category_id: null,
    
    initComponent: function() {
    	
        //permissions
        this.isAddAllowed = this.resource? acl.isAdd.apply(acl, this.resource): false;
        this.isUpdateAllowed = this.resource? acl.isUpdate.apply(acl, this.resource): false;
        this.isDeleteAllowed = this.resource? acl.isDelete.apply(acl, this.resource): false;
        //permissions
    	
    	this._prepareUrls();
        
		var self = this;
		
		this.store = new Ext.data.GroupingStore({
            url: this.listUrl, 
            reader: new Ext.data.JsonReader({
                root: 'rows',
                totalProperty: 'total'
            }, [
                {name: 'id'},
                {name: 'name'},
                {name: 'abbreviation'},
                {name: 'required'},
                {name: 'files'},
                {name: 'category_id'},
                {name: 'category_name'}
            ]),
            sortInfo: {
                field: 'name', 
                direction: 'ASC'
            },
            remoteSort: true,
            groupField: 'category_id'
        });
		
        this.columns = [{
            hidden: true,
            dataIndex: 'category_id'
        }, {
			id: this.autoExpandColumn = Ext.id(),
            header: lang('Name'),
			sortable: true,
            dataIndex: 'name'
        }, {
            header: lang('Abbreviation'),
            dataIndex: 'abbreviation',
			sortable: true,
            width: 80
        }, {
			
			header: lang('Required'),
            dataIndex: 'required',
			sortable: true,
            width: 70,
			renderer: function (value) {
				if (value == 1) {
					return lang('Yes');
				} else {
					return lang('No');
				}
			}
		}];
		
		this.view = new Ext.grid.GroupingView({
            hdCtxIndex: 1, // for propertly enable/disable grouping !!!
            startCollapsed: false,
            forceFit: true,
            // don't remove this span, because div apply native extjs styles
            groupTextTpl: '<span qtip="{[values.rs[0].get("category_name") != null ? values.rs[0].get("category_name") : "' + lang('Without category') + '"]}" ' 
                + ' style="white-space: nowrap; overflow: hidden; display: block;">'
                + '{[values.rs[0].get("category_name") != null ? values.rs[0].get("category_name") : "' + lang('Without category') + '"]}'
                + '</span>'
        });
        
        var filtersPlugin = new Ext.grid.GridFilters({
            filters: [
                {type: 'string',  dataIndex: 'name'},
				{type: 'string',  dataIndex: 'abbreviation'}
            ]
        });
        
        var items = [];

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
                    OSDN.Documents.TypeManager.Delete({
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
        
        if (this.isAddAllowed) {
            items.push("-");
            items.push({
                text: lang('Add'),
                iconCls: 'osdn-document-add',
                handler: self.add.createDelegate(self)
            });
        }
        
        var actionsPlugin = new OSDN.grid.Actions({
            autoWidth: true,
            items: items
        });
       
        this.plugins = [filtersPlugin, actionsPlugin];
		
        OSDN.Documents.TypeManager.List.superclass.initComponent.apply(this, arguments);

		this.on('rowdblclick', function (g, rowIndex){
			if (g.isUpdateAllowed) {
                self.edit(g, rowIndex);
			}
		}, this);
        
		this.addEvents('beforeupload', 'afterupload');
    },
    
	download: function (file_id) {
		location.href = this.downloadUrl(file_id);
	},
	
	add: function (g, rowIndex) {
		var category_id = this.category_id;
		if (g) {
			category_id = g.getStore().getAt(rowIndex).get('category_id');
		}
		var w = new OSDN.Documents.TypeManager.Add({
			category_id: category_id,
			module: this.module,
			createUrl: this.createUrl
		});
		w.on('created', function (params){
			this.load();
			w.close();
			if (params.document_type_id) {
				this._edit(params.document_type_id, category_id);
			}
		}, this);
		w.show();
	},
	
	edit: function (g, rowIndex) {
		var id = g.getStore().getAt(rowIndex).get('id');
		var category_id = g.getStore().getAt(rowIndex).get('category_id');
		g._edit(id, category_id);
	},
	
	changeCategory: function (id, category_id) {
		var failure = function() {
            OSDN.Msg.error(lang('Saving mandatory document failed. Try again.'));
            this.fireEvent('failureUpdate');
        };
		Ext.Ajax.request({
            url: this.updateUrl,
            params: {
                id          : id,
                category_id : category_id
            },
            success: function(response, options) {
                var data = Ext.decode(response.responseText);
                if (true !== data.success) {
                    failure();
                    return;
                }
                this.fireEvent('update');
                this.load();
            },
            failure: failure.createDelegate(this),
            scope: this
        });
	},
	
	_edit: function (id, category_id) {
		if (category_id === undefined)  {
			category_id = this.category_id;
		}
		var self = this;
		var w = new OSDN.Documents.TypeManager.Edit({
			allowedFormats: self.allowedFormats,
			module: self.module,
			document_type_id: id,
			category_id: category_id
		});
		w.on('update', function (){
			self.getStore().on('load', function () {
        		var index = self.getStore().findBy(function (record) {
        			return record.get('id') == id;
        		}, self);
        		if (!index) {
        			index = 0;
        		} 
        		self.getSelectionModel().selectRow(index);
			}, self, {single:true});
			self.load();
			w.close();
		}, this);
		w.show();
	},
	
	load: function (p) {
		Ext.apply(this, p);
		this.getStore().load({
			params: {
                category_id: this.category_id
			}
		});
	},
	
    dummyFunc: function() {
        OSDN.Msg.info('In progress...');
    },
    
    //private
    _prepareUrls: function() {
        var module = this.module;
        var a = {
            listUrl: link(module, 'document-types', 'get-list'),
            downloadUrl: function (id) {
                return link(module, 'document-types', {id: id}, 'html');
            },
            createUrl: link(module, 'document-types', 'update'),
            loadUrl: link(module, 'document-types', 'load'),
            updateUrl: link(module, 'document-types', 'update'),
            scanUrl: link(module, 'document-types', 'scan-file', null, 'html'),
            deleteUrl: link(module, 'document-types', 'delete')
        };
        
        for(var i in a) {
            if (!this[i]) {
                this[i] = a[i];
            }
        }
        return this;
    }
});

Ext.reg('OSDN.Documents.TypeManager.List', OSDN.Documents.TypeManager.List);