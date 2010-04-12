Ext.namespace('OSDN.Documents.Manager');

OSDN.Documents.Manager.DocumentTypeFiles = Ext.extend(Ext.grid.GridPanel, {
    
    border: false,
    
    loadMask: true,
    
    listUrl: link('student', 'documents', 'get-document-type-files'),
	
	entity_id: null,
	
	allowedDocumentTypes: null,
	
    initComponent: function() {

        this.autoExpandColumn = Ext.id();        
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
				field: 'name', 
				direction: 'ASC'
			},
            fields: [
				{name: 'file_id'},
				{name: 'name'},
				{name: 'required'},
				{name: 'type_id'},
				{name: 'originalfilename'},
				{name: 'type'},
				{name: 'size'}
            ] 
        });
        
        this.columns = [{
			id: this.autoExpandColumn,
            header: lang('name'),
            dataIndex: 'name',
			renderer: function (value, metadata, record) {
				if (record.get('required') == 1) {
					value = ['<div style="color:red;" >', value, '</div>'].join(''); 
				}
				return value;
			}
        }, {
            header: lang('file name'),
            dataIndex: 'originalfilename',
            width: 130
        }, {
			
			header: lang('size'),
            dataIndex: 'size',
			renderer: Ext.util.Format.fileSize,
			width: 80
		}];
        
        var filtersPlugin = new Ext.grid.GridFilters({
            filters: [
                {type: 'string',  dataIndex: 'name'},
				{type: 'string',  dataIndex: 'originalfilename'}
            ]
        });
        
        var actionsPlugin = new OSDN.grid.Actions({
            autoWidth: true,
            items: [function (g, rowIndex) {
				var record = g.getStore().getAt(rowIndex);
				if (!record.get('file_id')) {
					return false;
				}
                
				var text = [
                    record.get('originalfilename'),
                    ' ( ', Ext.util.Format.fileSize(record.get('size')), 
                    ' )'
                ].join('');
                
				return {
					text: lang('Download ({0})', Ext.util.Format.fileSize(record.get('size'))),
					qtip: text, 
	                iconCls: 'added-file',
	                handler: self.download
				};
			}]
        });
       
        this.plugins = [filtersPlugin, actionsPlugin];
		
        OSDN.Documents.Manager.DocumentTypeFiles.superclass.initComponent.apply(this, arguments);
        
        this.on('render', function() {
			this.load();
        });
		
		this.on('rowdblclick', function (g, rowIndex){
			g.download(g, rowIndex);
		}, this);
        
		this.addEvents('beforeupload', 'afterupload');
    },
	
	download: function (g, rowIndex) {
		var self = this;
		var record = g.getStore().getAt(rowIndex);
		if (record.get('file_id')) {
			location.href = g.downloadUrl(record.get('file_id'));
			
		} else {
			
		}
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
	
    dummyFunc: function() {
        OSDN.Msg.info('In progress...');
    },

    downloadUrl: function (id) { 
        return link('student', 'documents', 'download', {id: id}, 'html');
    }    
});

Ext.reg('osdn.documents.manager.documenttypefiles', OSDN.Documents.Manager.DocumentTypeFiles);