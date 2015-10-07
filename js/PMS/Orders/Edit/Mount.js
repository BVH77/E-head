Ext.ns('PMS.Orders.Edit');

PMS.Orders.Edit.Mount = Ext.extend(Ext.Panel, {
    
    title: 'Монтаж',
    
	layout: 'fit',
    
    border: false,
    
    orderId: null,

    initComponent: function() {

        // this.southRegion = new PMS.Orders.Edit.MountBudgetView();
        
        this.items = [{
            region: 'center',
            border: false,
            layout: 'column',
            columns: 2,
            padding: 5,
            defaults: {
                layout: 'form',
                columnWidth: .4,
                border: false
            },
            items: [{
                items: [{
                    name: 'mount_start_planned',
                    hiddenName: 'mount_start_planned',
                    xtype: 'xlib.form.DateField',
                    fieldLabel: 'Начало - план',
                    disabled: !acl.isUpdate('orders', 'mount', 'start_planned')
                }]
            }, {
                items: [{
                    name: 'mount_start_fact',
                    hiddenName: 'mount_start_fact',
                    xtype: 'xlib.form.DateField',
                    fieldLabel: 'Начало - факт',
                    disabled: !acl.isUpdate('orders', 'mount', 'start_fact')
                }]
            }, {
                items: [{
                    name: 'mount_end_planned',
                    hiddenName: 'mount_end_planned',
                    xtype: 'xlib.form.DateField',
                    fieldLabel: 'Конец - план',
                    disabled: !acl.isUpdate('orders', 'mount', 'end_planned')
                }]
            }, {
                items: [{
                    name: 'mount_end_fact',
                    hiddenName: 'mount_end_fact',
                    xtype: 'xlib.form.DateField',
                    fieldLabel: 'Конец - факт',
                    disabled: !acl.isUpdate('orders', 'mount', 'end_fact')
                }]
            }, {
                items: [{
                    name: 'mount_budget',
                    xtype: 'numberfield',
                    fieldLabel: 'Бюджет монтажа',
                    disabled: !acl.isUpdate('orders', 'mount')
                }]
//                items: [{
//                    xtype: 'button',
//                    text: 'Заполнить смету',
//                    disabled: !acl.isUpdate('orders', 'mount'),
//                    handler: this.editForm,
//                    scope: this
//                }]
            }]
        }]; //, this.southRegion];
        
        PMS.Orders.Edit.Mount.superclass.initComponent.apply(this, arguments);
        
        // this.on('activate', this.fillPanel, this);
    },
    
    editForm: function() {
        var form = new PMS.Orders.Edit.MountBudgetForm({
            orderId:    this.orderId,
            listeners: {
                fomsaved: this.fillPanel,
                scope: this
            }
        });
        
        form.getForm().load({
            url: link('orders', 'budget', 'get'),
            params: {order_id: this.orderId},
            success: function() {
                form.calcFields();
            }
        });
    }, 
    
    fillPanel: function() {
        this.loadBudget(function(res) {
            try {
                var data = Ext.decode(res.responseText).data;
                if (!Ext.isEmpty(data)) {
                    this.southRegion.fillPanel(data);
                }
            } catch(e) {}
        });
    },
    
    loadBudget: function(succesFn) {
        Ext.Ajax.request({
            url: link('orders', 'budget', 'get'),
            params: {order_id: this.orderId},
            success: succesFn,
            failure: Ext.emptyFn,
            scope: this
        });
    }
});