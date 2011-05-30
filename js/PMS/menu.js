Ext.ns('PMS');

PMS.menuMessage = function() {
    xlib.Msg.info('Модуль доступен в платных тарифах'); 
}

PMS.Menu = function(username, rolename, roleId) {
	username = username || '';
	rolename = rolename || '';
	roleId = parseInt(roleId);
	return [{
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
	        PMS.System.Layout.getTabPanel().add({
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
	            PMS.System.Layout.getTabPanel().add({
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
	            PMS.System.Layout.getTabPanel().add({
	                title: 'Поставщики',
	                iconCls: 'suppliers-icon',
	                entity: 'suppliers',
	                xtype: 'PMS.ContragentsListAbstract',
	                id: 'PMS.Suppliers.List'
	            });
	        }
	    }]
	}, {
	    text: 'Планы',
	    iconCls: 'prod_schd-icon',
	    hidden: !acl.isView('orders'),
	    menu: [{
	        text: 'План производственных работ',
	        iconCls: 'prod_schd-icon',
            hidden: !acl.isView('orders', 'production'),
            handler: function() {
	            window.open('/orders/report/schedule-production');
	        }
	    }, {
	        text: 'План монтажных работ',
	        iconCls: 'mount_schd-icon',
            hidden: !acl.isView('orders', 'mount'),
	        handler: function() {
	            window.open('/orders/report/schedule-mount');
	        }
	    }, {
	        text: 'Сводный план работ',
	        iconCls: 'work_schd-icon',
            hidden: !acl.isView('orders'),
	        handler: function() {
	            window.open('/orders/report/planning');
	        }
	    }]
    }, {
	    text: 'Отчёты',
	    iconCls: 'prod_schd-icon',
        hidden: !acl.isView('reports'),
        menu: [{
            text: 'Менеджеры',
            iconCls: 'work_schd-icon',
            handler: function() {
                new PMS.Reports.Managers();
            }
        }, {
            text: 'Клиенты',
            iconCls: 'work_schd-icon',
            handler: function() {
                new PMS.Reports.Customers();
            }
        }, {
            text: 'Кадры',
            iconCls: 'work_schd-icon',
            handler: function() {
                new PMS.Reports.Staff();
            }
        }]
	}, '-', {
	    text: 'Склад',
	    iconCls: 'suppliers-icon',
        hidden: !acl.isView('storage'),
	    menu: [{
	        text: 'Наличие ТМЦ',
	        iconCls: 'suppliers-icon',
	        handler: function() {
	            PMS.System.Layout.getTabPanel().add({
	                iconCls: 'suppliers-icon',
	                xtype: 'PMS.Storage.Assets.Layout',
	                id: 'PMS.Storage.Assets.Layout'
	            });
	        }
	    }, {
	        text: 'Заявки на снабжение',
	        iconCls: 'suppliers-icon',
            handler: function() {
	            PMS.System.Layout.getTabPanel().add({
	                iconCls: 'suppliers-icon',
	                xtype: 'PMS.Storage.Requests.List',
	                id: 'PMS.Storage.Requests.List'
	            });
	        }
	    }]
	}, {
	    text: 'Кадры',
	    iconCls: 'customers-icon',
        hidden: !acl.isView('staff'),
        handler: function() {
            PMS.System.Layout.getTabPanel().add({
                iconCls: 'customers-icon',
                xtype: 'PMS.Staff.Layout',
                id: 'PMS.Staff.Layout'
            });
        } 
	}, {
	    text: 'Приказы и объявления',
	    iconCls: 'work_schd-icon',
        hidden: !acl.isView('notice'),
        handler: function() {
            PMS.System.Layout.getTabPanel().add({
                iconCls: 'work_schd-icon',
                xtype: 'PMS.Notice.List',
                id: 'PMS.Notice.List'
            });
        } 
	}, '-', {
	    text: 'Мониторинг автотранспорта',
	    iconCls: 'suppliers-icon',
        hidden: !acl.isView('notice'),
        handler: function() {
            window.open(link('admin', 'map', 'open', {}, 'html'));
        } 
	}, '->', {
		text: 'Учебник',
        iconCls: 'work_schd-icon',
        handler: function() {
			var url = 'http://e-head.ru/index.php/home/tutorial/tutorial-';
			var role = 'director';
			switch (roleId) {
				case 3: 
					role = 'manager';
					break;
				case 4: 
				case 5: 
					role = 'executor';
					break;
				case 7: 
					role = 'bookkeeper';
					break;
			}
            window.open(url + role);
        }
	}, {
		text: 'Менеджер доступа',
		iconCls: 'accounts_manager-icon',
		hidden: !acl.isView('admin'),
		handler: function() {
			PMS.System.Layout.getTabPanel().add({
				iconCls: 'accounts_manager-icon',
				xtype: 'xlib.acl.layout',
				id: 'xlib.acl.layout'
			});
		}
	}, new Ext.Toolbar.Button({
        text: 'Выход',
        tooltip: username + ' (' + rolename + ')',
        iconCls: 'exit-icon',
        handler: function() {
            window.location.href = '/index/logout';
        }
    })];
}