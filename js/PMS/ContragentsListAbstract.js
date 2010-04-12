Ext.ns('PMS');

PMS.ContragentsListAbstract = Ext.extend(Ext.grid.GridPanel, {
	
    autoScroll: true,
    
    border: false,
    
    entity: null,
    
    loadMask: {msg: 'Загрузка...'},
    
    stripeRows: true,
    
    layout: 'fit',
    
    viewConfig: {autoFill: true},
	
    initComponent: function() {
        
        this.autoExpandColumn = Ext.id();
        
        this.cm = new Ext.grid.ColumnModel([{
            header: '№',
            width: 40,
            dataIndex: 'id'
        }, {
            width: 200,
            header: 'Название',
            dataIndex: 'name'
        }, {
            id: this.autoExpandColumn,
            header: 'Описание',
            dataIndex: 'description'
        }]);
        
        this.cm.defaultSortable = true; 

        this.sm = new Ext.grid.RowSelectionModel({singleSelect: true});

        this.ds = new Ext.data.JsonStore({
	        url: link('orders', this.entity, 'get-list'),
	        totalProperty: 'totalCount',
            autoLoad: true,
	        remoteSort: true,
	        root: 'data',
	        fields: [
	            {name: 'id'},
	            {name: 'name'},
                {name: 'description'}
	        ]
	    });
        
        this.bbar = new OSDN.PagingToolbar({
            store: this.ds,
            displayInfo: true,
            items: ['-', {
            	text: 'Добавить',
            	iconCls: 'add',
            	handler: this.add.createDelegate(this),
                hidden: !acl.isAdd(this.entity)
            }]
        });
        
        var actionsPlugin = new OSDN.grid.Actions({
	        autoWidth: true,
	        items: [{
                text: 'Добавить нового',
                iconCls: 'add',
                handler: this.add.createDelegate(this),
                hidden: !acl.isAdd(this.entity)
            }, '-', {
                text: 'Редактировать',
                iconCls: 'edit',
                handler: this.edit.createDelegate(this),
                hidden: !acl.isUpdate(this.entity)
            }, {
                text: 'Удалить',
                iconCls: 'delete',
                handler: this.onDelete,
                hidden: !acl.isDelete(this.entity)
            }]
	    });
	    
	    this.plugins = [new Ext.grid.GridFilters({
            filters: [
                {type: 'string',  dataIndex: 'name'},
                {type: 'string',  dataIndex: 'description'}
            ]}
        ), actionsPlugin];
		
        if (acl.isUpdate(this.entity)) {
            this.on('rowdblclick', this.edit, this);
        }
        
        PMS.ContragentsListAbstract.superclass.initComponent.apply(this, arguments);
    },
    
    add: function(g, rowIndex) {
		var form = new PMS.ContragentsFormAbstract({permissions: true, entity: this.entity});
		var w = form.showInWindow({title: 'Добавление'});
		form.on('saved', function() {this.getStore().reload(); w.close();}, this);
		w.show();
	},
	
	edit: function(g, rowIndex) {
		var form = new PMS.ContragentsFormAbstract({
            permissions: acl.isUpdate(this.entity),
            entity: this.entity,
			sid: this.getStore().getAt(rowIndex).get('id')
		});
        var w = form.showInWindow({title: 'Редактирование'});
		form.on('saved', function() {this.getStore().reload(); w.close();}, this);
		w.show();
	},
    
    onDelete: function(g, rowIndex) {
        Ext.Msg.show({
            title: 'Подтверждение',
            msg: 'Вы уверены?',
            buttons: Ext.Msg.YESNO,
            fn: function(b) {
                if ('yes' == b) {
                    Ext.Ajax.request({
                        url: link('orders', g.entity, 'delete'),
                        success: function(res){
                            var errors = Ext.decode(res.responseText).errors;
                            if (errors) {
                                OSDN.Msg.error(errors[0].msg);
                                return;
                            }
                            g.getStore().reload();
                        },
                        failure: Ext.emptyFn(),
                        params: {id: g.getStore().getAt(rowIndex).get('id')}
                    });
                }
            },
            icon: Ext.MessageBox.QUESTION
        });
    } 
});

Ext.reg('PMS.ContragentsListAbstract', PMS.ContragentsListAbstract);