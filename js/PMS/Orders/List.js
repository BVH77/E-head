Ext.ns('PMS.Orders');

PMS.Orders.List = Ext.extend(Ext.grid.GridPanel, {
    
    loadLink: link('orders', 'index', 'get-list'),

    loadUsersURL: link('admin', 'accounts', 'get-accounts'),
    
    changeUserURL: link('orders', 'index', 'change-user'),
    
    loadMask: true,
	
    autoScroll: true,
    
    monitorResize: true,
    
    autoLoadData: true,
    
    stripeRows: true,
    
    viewConfig: {
        getRowClass: function(record) {
            var today = new Date();
            var sdf = record.get('success_date_fact');
            var sdp = record.get('success_date_planned');
            var psp = record.get('production_start_planned');
            var psf = record.get('production_start_fact');
            var pep = record.get('production_end_planned');
            var pef = record.get('production_end_fact');
            var msp = record.get('mount_start_planned');
            var msf = record.get('mount_start_fact');
            var mep = record.get('mount_end_planned');
            var mef = record.get('mount_end_fact');
            if (Ext.isDate(sdf)) {
                return 'x-row-success';
            }
            if (psp > sdp || pep > sdp || msp > sdp || mep > sdp) {
                return 'x-row-error';
            }
            if (Ext.isDate(sdp) && sdp < today) {
                return 'x-row-expired';
            }
        }
    },
    
    initComponent: function() {
        this.autoExpandColumn = Ext.id();
        this.sm = new Ext.grid.RowSelectionModel({singleSelect:true});
        this.ds = new Ext.data.JsonStore({
            baseParams: {Xfilter: 0},
            timeout: 300,
	        url: this.loadLink,
	        autoLoad: this.autoLoadData,
	        root: 'data',
	        totalProperty: 'totalCount',
	        remoteSort: true,
	        sortInfo: {field: 'success_date_planned', direction: 'ASC'},
	        fields: [
	            {name: 'id'},
	            {name: 'customer_id'},
	            {name: 'customer_name'},
	            {name: 'address'},
	            {name: 'description'},
	            {name: 'mount'},
	            {name: 'production'},
	            {name: 'production_start_planned', type: 'date', dateFormat: xlib.date.DATE_FORMAT_SERVER},
	            {name: 'production_start_fact', type: 'date', dateFormat: xlib.date.DATE_FORMAT_SERVER},
	            {name: 'production_end_planned', type: 'date', dateFormat: xlib.date.DATE_FORMAT_SERVER},
	            {name: 'production_end_fact', type: 'date', dateFormat: xlib.date.DATE_FORMAT_SERVER},
	            {name: 'mount_start_planned', type: 'date', dateFormat: xlib.date.DATE_FORMAT_SERVER},
	            {name: 'mount_start_fact', type: 'date', dateFormat: xlib.date.DATE_FORMAT_SERVER},
	            {name: 'mount_end_planned', type: 'date', dateFormat: xlib.date.DATE_FORMAT_SERVER},
	            {name: 'mount_end_fact', type: 'date', dateFormat: xlib.date.DATE_FORMAT_SERVER},
	            {name: 'success_date_planned', type: 'date', dateFormat: xlib.date.DATE_FORMAT_SERVER},
	            {name: 'success_date_fact', type: 'date', dateFormat: xlib.date.DATE_FORMAT_SERVER},
	            {name: 'cost'},
	            {name: 'advanse'},
	            {name: 'created', type: 'date', dateFormat: xlib.date.DATE_TIME_FORMAT_SERVER},
	            {name: 'creator_id'},
	            {name: 'creator_name'},
	            {name: 'suppliers'},
	            {name: 'subcontractors'},
	            {name: 'photos'},
	            {name: 'files'}
	        ]
	    });
	    this.filtersPlugin = new Ext.grid.GridFilters({
	        filters: [
	            {type: 'string',  dataIndex: 'customer'},
	            {type: 'string',  dataIndex: 'address'},
    	        {type: 'date',  dataIndex: 'success_date_planned', dateFormat: 'Y-m-d'},
    	        {type: 'date',  dataIndex: 'success_date_fact', dateFormat: 'Y-m-d'},
    	        {type: 'date',  dataIndex: 'created', dateFormat: 'Y-m-d'}
	    ]});
        var onDelete = function(g, rowIndex) {
            Ext.Msg.show({
                title: 'Подтверждение',
                msg: 'Вы уверены?',
                buttons: Ext.Msg.YESNO,
                fn: function(b) {
                    if ('yes' == b) {
                        Ext.Ajax.request({
                            url: link('orders', 'index', 'delete'),
                            success: function(res) {
                                var errors = Ext.decode(res.responseText).errors;
                                if (errors) {
                                    xlib.Msg.error(errors[0].msg);
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
        this.menuUsers = new Ext.menu.Menu({
            defaults: {
                group: 'users',
                checked: false,
                scope: this,
                handler: this.onChangeUser
            },
            listeners: {
                beforeshow: this.onMenuUsersShow,
                scope: this
            }
        });
	    var actionsPlugin = new xlib.grid.Actions({
	        autoWidth: true,
	        items: [{
                text: 'Редактировать',
                iconCls: 'edit',
                handler: this.onEdit,
                scope: this,
				hidden: !acl.isUpdate('orders')
        	}, {
                text: 'Удалить',
                iconCls: 'delete',
                handler: onDelete,
				hidden: !acl.isDelete('orders')
        	}, {
                text: 'Сменить пользователя',
                iconCls: 'user',
				hidden: !acl.isView('admin'),
                menu: this.menuUsers
            }]
	    });
	    this.filteringMenu = new Ext.menu.Menu({
	    	defaults: {
	    		checked: false,
	    		group: 'status',
                handler: function(button) {
                    this.filteringMenuButton.toggle(button.value);
                    this.getStore().baseParams = {Xfilter: button.value};
                    this.getStore().load();
                },
                scope: this
	    	},
            items:[{
                text: 'Все заказы',
                checked: true,
                value: 0
            }, {
                text: 'Текущие',
                value: 1
            }, {
            	text: 'Выполненные',
                value: 2
            }, {
            	text: 'Просроченные',
                value: 3
            }],
            scope: this
        });
        this.filteringMenuButton = new Ext.Toolbar.Button({ 
            text: 'Фильтр',
            iconCls: 'filter-icon',
            menu: this.filteringMenu
        });
        this.plugins = [this.filtersPlugin, actionsPlugin];
        this.tbar = new Ext.Toolbar({
            items: [{
                text: 'Новый заказ',
                iconCls: 'add',
                handler: function() {
                    this.onEdit(this, null);
                },
    			scope: this
            }, ' ', this.filtersPlugin.getSearchField({width:200}), 
            ' ', this.filteringMenuButton, ' '
            ],
            plugins: [new xlib.Legend.Plugin({
                items: [{
                    color: '#99FF99',
                    text: 'Выполненные'
                }, {
                    color: '#FFFF99',
                    text: 'Просроченные'
                }, {
                    color: '#FF9999',
                    text: 'Конфликт'
                }]
            })],
            scope: this
        });
        this.tbar.add(this.filteringMenuButton);
        this.bbar = new xlib.PagingToolbar({
            plugins: [this.filtersPlugin],
            store: this.ds
        });
		this.columns = [{
            header: '№', 
            dataIndex: 'id',
            width: 40,
            sortable: true
        }, {
            header: 'Заказчик', 
            id: this.autoExpandColumn,
            dataIndex: 'customer_name',
            sortable: true
        }, {
            header: 'Адрес', 
            dataIndex: 'address',
            width: 180,
            sortable: true
        }, {
            header: 'Сдача (план)',
            dataIndex: 'success_date_planned',
            renderer: xlib.dateRenderer(xlib.date.DATE_FORMAT),
            width: 90,
            sortable: true
        }, {
            header: 'Сдача (факт)',
            dataIndex: 'success_date_fact',
            renderer: xlib.dateRenderer(xlib.date.DATE_FORMAT),
            width: 90,
            sortable: true
        }, {
            header: 'Дата/время заказа',
            width: 120,
            sortable: true,
            renderer: xlib.dateRenderer(xlib.date.DATE_TIME_FORMAT),
            dataIndex: 'created'
        }, {
            header: 'Менеджер',
            width: 120,
            sortable: true,
            dataIndex: 'creator_name'
        }];
        PMS.Orders.List.superclass.initComponent.apply(this, arguments);
        this.on('rowdblclick', this.onEdit, this);
        this.getSelectionModel().on('rowselect', function(sm, rowIndex, record) {
            this.fireEvent('orderselect', record);
        }, this);
		this.getStore().on('load', function() {
			this.getSelectionModel().selectFirstRow();
	    }, this);
        if (acl.isView('admin')) {
            this.loadUsers();
        }
    },
	
    onEdit: function(g, rowIndex) {
        if (rowIndex === null) {
            var record = null;
            var id = null;
        } else {
            var record = g.getStore().getAt(rowIndex); 
            var id = record.get('id');
        }
        var editForm = new PMS.Orders.Edit({record: record}).showInWindow({
            listeners: {
                close: function() {
                    this.onCloseEditWin(id);
                },
                scope: this
            }
        });
    },
    
    onCloseEditWin: function(id) {
        this.getStore().on('load', function() {
            var index = this.getStore().findBy(function(r) {
                return r.get('id') == id;
            }, this);
            if (!index) {
                index = 0;
            } 
            this.getSelectionModel().selectRow(index);
        }, this, {single: true});
        this.getStore().reload();
    },
    
    loadUsers: function() {
        Ext.Ajax.request({
            url: this.loadUsersURL,
            params: {roleId: 0},
            success: function(res){
                try {
                    var list = Ext.decode(res.responseText).rows;
                    Ext.each(list, function(item) {
                        if (item.active != '0') {
                            this.menuUsers.add({
                                value: item.id,
                                text: item.name + ' (' + item.login + ')'
                            });
                        }
                    }, this);
                } catch(e) {}
            },
            failure: Ext.emptyFn,
            scope: this
        });
    },
    
    onMenuUsersShow: function(menu) {
        var userId = this.getSelectionModel().getSelected().get('creator_id');
        menu.items.each(function(item) {
            item.setDisabled(item.value == userId);
            return true;
        });
    },
    
    onChangeUser: function(button) {
        var orderId = this.getSelectionModel().getSelected().get('id');
        var userId = button.value;
        this.el.mask('Запись...');
        Ext.Ajax.request({
            url: this.changeUserURL,
            params: {orderId: orderId, userId: userId},
            success: function(res) {
                var errors = Ext.decode(res.responseText).errors;
                if (errors) {
                    xlib.Msg.error(errors[0].msg);
                    this.el.unmask();
                    return;
                }
                this.el.unmask();
                this.onCloseEditWin(orderId);
            },
            failure: function() {
                xlib.Msg.error('Ошибка связи с сервером.');
                this.el.unmask();
            },
            scope: this
        });
    }
});