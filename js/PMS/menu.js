Ext.ns('PMS');

PMS.Menu = [{
    xtype: 'box',
    autoEl: {
        tag: 'div',
        style: 'cursor: pointer;',
        qtip: 'e-head.ru',
        cls: 'e-head-logo'
    },
    listeners: {
        render: function(box) {
            box.el.on('click', function() {
                window.open('http://e-head.ru/');
            })
        }
    }
}, ' ', ' ', ' ', ' ', ' ', {
    text: 'Архив заказов',
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
    text: 'Контрагенты',
    iconCls: 'customers-icon',
    menu: [{
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
    }]
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
}, {
    text: 'Графики',
    iconCls: 'prod_schd-icon',
    menu: [{
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
    }]
}, '->', '-']; 