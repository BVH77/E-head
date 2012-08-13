Ext.ns('PMS.Orders.Budget');

PMS.Orders.Budget.Groups = Ext.extend(Ext.grid.GridPanel, {
    
    actions: [],
    
    autoScroll: true,
    
    border: false,
    
    loadMask: {msg: 'Загрузка...'},
    
    stripeRows: true,
    
    layout: 'fit',
    
    viewConfig: {autoFill: true},
    
    loadURL: link('orders', 'budget-groups', 'get-list'),
    
    deleteURL: link('orders', 'budget-groups', 'delete'),
    
    permissions: acl.isUpdate('orders'),
    
    initComponent: function() {
        
        this.autoExpandColumn = Ext.id();
        
        this.cm = new Ext.grid.ColumnModel([{
            header: '№',
            width: 40,
            dataIndex: 'id',
            sortable: true
        }, {
            id: this.autoExpandColumn,
            width: 200,
            header: 'Название',
            dataIndex: 'name',
            sortable: true
        }]);
        
        this.cm.defaultSortable = true; 

        this.sm = new Ext.grid.RowSelectionModel({singleSelect: true});

        this.ds = new Ext.data.JsonStore({
            url: this.loadURL,
            autoLoad: true,
            root: 'data',
            fields: [
                {name: 'id'},
                {name: 'name'}
            ]
        });
        
        this.tbar = new Ext.Toolbar({
            items: [{
                text: 'Добавить',
                iconCls: 'add',
                handler: this.add.createDelegate(this),
                hidden: !this.permissions
            }, '->', {
                iconCls: 'x-tbar-loading',
                tooltip: 'Обновить',
                handler: function() {
                    this.getStore().reload();
                },
                scope: this
            }]
        });
        
        var actions = [{
            text: 'Редактировать',
            iconCls: 'edit',
            handler: this.edit.createDelegate(this),
            hidden: !this.permissions
        }, {
            text: 'Удалить',
            iconCls: 'delete',
            handler: this.onDelete,
            hidden: !this.permissions
        }];
        
        if (Ext.isArray(this.actions) && !Ext.isEmpty(this.actions)) {
            this.actions = this.actions.concat(actions);
        } else {
            this.actions = actions;
        }
        
        var actionsPlugin = new xlib.grid.Actions({
            autoWidth: true,
            items: this.actions
        });
        
        this.plugins = [actionsPlugin];
        
        PMS.Orders.Budget.Groups.superclass.initComponent.apply(this, arguments);
        
        if (this.permissions) {
            this.on('rowdblclick', this.onRowdblclick, this);
        }
    },
    
    onRowdblclick: function(g, rowIndex) {
        this.edit(g, rowIndex);
    },
   
    add: function(g, rowIndex) {
        var form = new PMS.Orders.Budget.GroupForm({permissions: this.permissions});
        var w = form.showInWindow({title: 'Добавление группы'});
        form.on('saved', function() {this.getStore().reload(); w.close();}, this);
        w.show();
    },
    
    edit: function(g, rowIndex) {
        var form = new PMS.Orders.Budget.GroupForm({
            permissions: this.permissions,
            itemId: this.getStore().getAt(rowIndex).get('id')
        });
        var w = form.showInWindow({title: 'Редактирование группы'});
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
                        url: g.deleteURL,
                        success: function(res) {
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