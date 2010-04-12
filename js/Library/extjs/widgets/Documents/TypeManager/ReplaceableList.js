Ext.ns('OSDN.Documents.TypeManager');

OSDN.Documents.TypeManager.ReplaceableList = Ext.extend(Ext.grid.GridPanel, {
	
	module: 'student',

	listUrl: null,
	
	updateUrl: null,
	
    loadMask: true,
    
    category_id: 0, // All categories
    
    document_type_id: null,
    
    initComponent: function() {
    	
    	this._prepareUrls();
        
		this.store = new Ext.data.GroupingStore({
            url: link(this.module, 'document-types', 'get-replaceable-list'),
            reader: new Ext.data.JsonReader({
                root: 'rows',
                totalProperty: 'total'
            }, [
                {name: 'id'},
                {name: 'name'},
                {name: 'abbreviation'},
                {name: 'required'},
                {name: 'replaceable'},
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
		
        this.checkColumn = new Ext.grid.CheckColumn({
            header: lang('Replaceable'),
            dataIndex: 'replaceable',
            width: 70
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
		}, this.checkColumn];
		
		this.view = new Ext.grid.GroupingView({
            hdCtxIndex: 1, // for propertly enable/disable grouping !!!
            startCollapsed: false,
            scrollOffset: 22,
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
                
        this.plugins = [filtersPlugin, this.checkColumn];
		
        OSDN.Documents.TypeManager.ReplaceableList.superclass.initComponent.apply(this, arguments);
    },
    
	load: function () {
		this.getStore().load({params: {documentTypeId: this.document_type_id}});
	},
    
	clear: function () {
		this.getStore().removeAll();
	},
    
    //private
    _prepareUrls: function() {
        var module = this.module;
        var a = {
            updateUrl: link(module, 'document-types', 'update-replaceable')
        };
        
        for(var i in a) {
            if (!this[i]) {
                this[i] = a[i];
            }
        }
        return this;
    }
});

Ext.reg('OSDN.Documents.TypeManager.ReplaceableList', OSDN.Documents.TypeManager.ReplaceableList);