Ext.ns('OSDN.Tools');

OSDN.Tools.Translation = Ext.extend(Ext.grid.EditorGridPanel, {
    
	id: 'osdn.tools.translation',
	
	loadMask: true,
	
	autoExpandColumn: 'translation_column',

    clicksToEdit: 1, 

    disableSelection: true,
	
	title: lang('Translation editor'),
	
	permissions: acl.isUpdate('admin', 'translation'),
	
	listUrl: link('admin', 'translation', 'get-list'),
	
	saveUrl: link('admin', 'translation', 'save'),

	viewConfig: {
        getRowClass : function(record, rowIndex, p, store) {
            return record.get('translation') == '' ? 'osdn-x-row-yellow' : '';
        }
    },
			
	initComponent: function() {
	    
		this.store = new Ext.data.JsonStore({
	        url: this.listUrl,
	        root: 'data',
	        totalProperty: 'total',
	        remoteSort: true,
	        sortInfo: {field: 'caption', direction: 'ASC'},
	        fields: [
	            {name: 'id'},
	            {name: 'alias'},
				{name: 'caption'},
	            {name: 'translation'},
	            {name: 'abbreviation'}
	        ]
	    });
		
		this.filters = new Ext.grid.GridFilters({
	        filters: [
	            {type: 'string',  dataIndex: 'alias'},
	            {type: 'string',  dataIndex: 'translation'},
	            {
	                type: 'list',  
	                dataIndex: 'caption', 
	                options: [
	                    {id:'1', text: lang('English')},
	                    {id:'2', text: lang('Dutch')}
	                ],
	                phpMode: true
	            }
	        ]}
	    );
		
		this.plugins = [this.filters];
		
		this.bbar = new OSDN.PagingToolbar({
            plugins: [this.filters],
            store: this.store,
            emptyMsg: lang('No translations')
        });
		
        this.columns = [{
            header: lang('Caption'),
            id: 'caption_column',
            dataIndex: 'alias',
            width: 300,
            sortable: true,
            renderer: Ext.util.Format.htmlEncode,
            renderer: function(v) {
                return OSDN.Msg.getQtipSpan(v, v);
            }
        }, {
            header: lang('Translation'),
            dataIndex: 'translation',
            id: 'translation_column',
            sortable: true,
            editor: new Ext.form.TextField({
                allowBlank: false
            }),
            renderer: function(v) {
                v = Ext.util.Format.htmlEncode(v);
                return OSDN.Msg.getQtipSpan(v, v);
            }
        }, {
            header: lang('Language'),
            dataIndex: 'caption',
            id: 'language_column',
            width: 80,
            sortable: true
        }];
		
		OSDN.Tools.Translation.superclass.initComponent.apply(this, arguments);
		this.on('afteredit', this.onAfterEdit, this);
		this.on('render', function() {
			this.getStore().load({
				params: {
					start: 0,
                    limit: 33
				}
			});
		}, this);
	},
	
	onAfterEdit: function(e) {

        Ext.Ajax.request({
            url: this.saveUrl,
            params: {
				id: e.record.get('id'),
				value: e.value
            },
            callback: function(options, success, response) {
                var resp = OSDN.decode(response.responseText);
                if (success && resp && resp.success) {
                    e.record.commit();
                } else {
                    e.record.reject();
                }
            }
        });
	}	
});

Ext.reg('osdn.tools.translation', OSDN.Tools.Translation);