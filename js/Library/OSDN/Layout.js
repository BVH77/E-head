Ext.namespace('OSDN.Layout');

OSDN.Layout.TabPanel = Ext.extend(Ext.TabPanel, {
    
	activeTab: 0,
    
    activeItem: 0,
    
    defaults: {
        closable: true
    },
	
	enableTabScroll: true,
	
	initComponent: function() {
		OSDN.Layout.TabPanel.superclass.initComponent.apply(this, arguments);
	},

    /**
     * Check if the comp ids present in Component manager storage
     * then this component is present and we can activate it
     * 
     * @param {Object} comp
     */
    add: function(comp) {
        if (typeof comp.id === 'string') {
            var c = Ext.getCmp(comp.id);
            if (c) {
                this.setActiveTab(c);
                return c;
            }
        }
		var cmp = OSDN.Layout.TabPanel.superclass.add.apply(this, arguments);
        cmp.show();
        return cmp;
	}   
    	
});

//OSDN.Layout.Tree = Ext.extend(Ext.tree.TreePanel, {
//    
//    title: 'Меню',
//    
//    rootVisible: false,
//     
//    autoHide: true,
//    
//    initComponent: function() {
//        
//        this.loader = new Ext.tree.TreeLoader({
//            url: link('default', 'index', 'get-menu'),
//            baseAttrs: {
//                singleClickExpand: true
//            }
//        });
//        
//        this.root = new Ext.tree.AsyncTreeNode({
//            expanded: true,
//            singleClickExpand: true
//        });
//        this.tools = [{
//            id: 'refresh',
//            qtip: lang('Refresh'),
//            handler: function(event, toolEl, panel){
//                panel.getRootNode().reload();
//            }
//        }];
//        
//        OSDN.Layout.Tree.superclass.initComponent.apply(this, arguments);
//        this.on({
//            click: this.onNodeClick.createDelegate(this),
//            beforeload: function(node) {
//                this.getEl().mask(lang('Loading data'));
//            },
//            load: function() {
//                this.getEl().unmask();
//            },
//            scope: this
//        });
//    },
//    
//    onNodeClick: function(node, e) {
//        if (!node.isLeaf()) {
//            return;
//        }
//        
//        e.stopEvent();
//        if (!node.attributes.disabled) {
//            eval(node.attributes.handler);
//        }
//    }
//
//});

                    
OSDN.Layout.Workspace = Ext.extend(Ext.Viewport, {
 
    layout: 'border',
	
	username: '%username%',
	
    rolename: '%rolename%',
    
    initComponent: function() {
        
//        this.tree = new OSDN.Layout.Tree({
//            region: 'west',
//            width: 160,
//            margins: '1 0 1 1',
//            cmargins: '1 5 1 1',
//            split: true,
//            collapsible: true   
//        });

        this.menuToolbar = new Ext.Toolbar({
            region: 'north',
            height: 30,
            items: [{
                xtype: 'box',
                autoEl: {
                    tag: 'div',
                    style: 'cursor: pointer;',
                    qtip: 'quarant.ru',
                    cls: 'logo_garant'
                },
                listeners: {
                    render: function(box) {
                        box.el.on('click', function() {
                            window.open('http://quarant.ru/');
                        })
                    }
                }
            }, ' ', '-', {
                text: 'Заказы',
                iconCls: 'orders-icon',
                hidden: !acl.isView('orders'),
                handler: function() {
                    OSDN.System.Layout.getTabPanel().add({
                        iconCls: 'orders-icon',
                        xtype: 'PMS.Orders.Layout',
                        id: 'PMS.Orders.Layout'
                    });
                }
            }, {
                text: 'Архив',
                iconCls: 'archive-icon',
                hidden: !acl.isView('archive'),
                handler: function() {
                    OSDN.System.Layout.getTabPanel().add({
                        iconCls: 'archive-icon',
                        xtype: 'PMS.Orders.Archive',
                        id: 'PMS.Orders.Archive'
                    });
                }
            }, {
                text: 'Заказчики',
                iconCls: 'customers-icon',
                hidden: !acl.isView('customers'),
                handler: function() {
                    OSDN.System.Layout.getTabPanel().add({
                        title: 'Заказчики',
                        iconCls: 'customers-icon',
                        entity: 'customers',
                        xtype: 'PMS.ContragentsListAbstract',
                        id: 'PMS.Customers.List'
                    });
                }
            }, {
                text: 'Поставщики',
                iconCls: 'suppliers-icon',
                hidden: !acl.isView('suppliers'),
                handler: function() {
                    OSDN.System.Layout.getTabPanel().add({
                        title: 'Поставщики',
                        iconCls: 'suppliers-icon',
                        entity: 'suppliers',
                        xtype: 'PMS.ContragentsListAbstract',
                        id: 'PMS.Suppliers.List'
                    });
                }
            }, {
                text: 'Субподрядчики',
                iconCls: 'subcontractors-icon',
                hidden: !acl.isView('subcontractors'),
                handler: function() {
                    OSDN.System.Layout.getTabPanel().add({
                        title: 'Субподрядчики',
                        iconCls: 'subcontractors-icon',
                        entity: 'subcontractors',
                        xtype: 'PMS.ContragentsListAbstract',
                        id: 'PMS.Subcontractors.List'
                    });
                }
            }, {
                text: 'Менеджер доступа',
                iconCls: 'accounts_manager-icon',
                hidden: !acl.isView('admin'),
                handler: function() {
                    OSDN.System.Layout.getTabPanel().add({
                        iconCls: 'accounts_manager-icon',
                        xtype: 'osdn.acl.layout',
                        id: 'osdn.acl.layout'
                    });
                }
            }, '-', {
                text: 'График производства',
                iconCls: 'prod_schd-icon',
                hidden: !acl.isView('admin'),
                handler: function() {
                    window.open(OSDN.ABSOLUTE_PATH + '/orders/report/schedule-production');
                }
            }, {
                text: 'График монтажа',
                iconCls: 'mount_schd-icon',
                hidden: !acl.isView('admin'),
                handler: function() {
                    window.open(OSDN.ABSOLUTE_PATH + '/orders/report/schedule-mount');
                }
            }, {
                text: 'План работ',
                iconCls: 'work_schd-icon',
                hidden: !acl.isView('admin'),
                handler: function() {
                    window.open(OSDN.ABSOLUTE_PATH + '/orders/report/planning');
                }
            }, '->', '-', this.username + ' (' + this.rolename + ')', {
                text: 'Выход',
                iconCls: 'exit-icon',
                handler: function() {
                    window.location.href = '/default/authenticate/logout';
                }
            }] 
        });
        
        this.tp = new OSDN.Layout.TabPanel({
            region: 'center',
            margins: '1 1 1 1',
            border: true,
			defaults: {
				border: false,
                closable: true
			},
            tree: this.tree
        });
                
        this.items = [this.tp, this.menuToolbar];
        OSDN.Layout.Workspace.superclass.initComponent.apply(this, arguments);
    },
	
	getTabPanel: function() {
		return this.tp;
	},
    
    getMenu: function() {
        return this.tree;
    },
    
    createComponent: function(cmp) {
        
        switch (typeof cmp) {
            case 'undefined':
            case 'object':
                if (typeof cmp.id != undefined) {
                    var id = cmp.id;
                    var component = Ext.getCmp(id);
                    return component || Ext.ComponentMgr.create(cmp); 
                } 
                throw 'The component id is missing.';
                break;
                
            default:
                throw 'The component is wrong';
        }
    }
    
});