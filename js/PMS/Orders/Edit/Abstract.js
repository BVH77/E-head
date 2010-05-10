Ext.ns('PMS.Orders.Edit');

PMS.Orders.Edit.Abstract = Ext.extend(Ext.grid.GridPanel, {
	
    loadURL: null,

    attachURL: null,
    
    removeURL: null,
    
    checkURL: null,
    
    orderId: null,
    
    entity: null,
    
    autoScroll: true,
    
    border: false,
    
    loadMask: {msg: 'Загрузка...'},
    
    permissions: true,
    
    stripeRows: true,
    
    layout: 'fit',
    
    initComponent: function() {
        
        var success = new Ext.grid.CheckColumn({
            header: 'Выпонено',
            width: 65,
            dataIndex: 'success',
            disabled: !acl.isUpdate(this.entity) || !this.permissions
        });
        
        this.autoExpandColumn = Ext.id();
        
        this.cm = new Ext.grid.ColumnModel([success, {
            header: 'Название',
            width: 200,
            dataIndex: 'name'
        }, {
            id: this.autoExpandColumn, 
            header: 'Описание',
            dataIndex: 'description',
            renderer: xlib.dateRenderer(OSDN.date.DATE_FORMAT)
        }]);
        
        this.cm.defaultSortable = true; 

        this.sm = new Ext.grid.RowSelectionModel({singleSelect: true});

        this.ds = new Ext.data.JsonStore({
            url: this.loadURL,
            baseParams: {
                orderId: this.orderId
            },
	        root: this.entity,
	        fields: [
	            {name: 'id'},
	            {name: 'name'},
                {name: 'success'},
                {name: 'date', type: 'date', dateFormat: OSDN.date.DATE_FORMAT_SERVER}
	        ]
	    });
        
        this.plugins = [success];
        
        if (this.permissions) {

            var actionsPlugin = new OSDN.grid.Actions({
    	        autoWidth: true,
    	        items: [{
                    text: 'Отсоединить',
                    iconCls: 'delete',
                    handler: this.onRemove,
                    scope: this,
                    hidden: !acl.isDelete(this.entity)
                }]
    	    });
            
            this.plugins.push(actionsPlugin);
            
            this.bbar = ['->', {
            	text: 'Присоединить',
            	iconCls: 'add',
            	handler: this.onAttach,
                scope: this,
                hidden: !acl.isAdd(this.entity)
            }];
	    
            this.on({
                afteredit: function(params) {
                    this.getSelectionModel().selectRow(params.row);
                    var value = params.value == '1' ? new Date() : null;
                    params.record.set('date', value);
                    this.onChangeRecord(params.record);
                },
                scope: this
            });
        }
        
        PMS.Orders.Edit.Abstract.superclass.initComponent.apply(this, arguments);
    },
    
    onChangeRecord: function(record) {
        var dt = record.get('date');
        this.el.mask('Запись...');
        Ext.Ajax.request({
           url: this.checkURL,
           params: { 
                id: record.get('id'),
                orderId: this.orderId,
                success: record.get('success'),
                date: dt ? dt.format(OSDN.date.DATE_FORMAT_SERVER) : ''
           },
           success: function(res){
                var errors = Ext.decode(res.responseText).errors;
                if (errors) {
                    xlib.Msg.error(errors[0].msg);
                    record.reject();
                    this.el.unmask();
                    return;
                }
                record.commit();
                this.el.unmask();
                this.getStore().load();
            },
            failure: function() {
                xlib.Msg.error('Ошибка связи с сервером.');
                record.reject();
                this.el.unmask();
            },
            scope: this
        });
    },
    
    onAttach: function(g, rowIndex) {
        var itemsList = new PMS.ContragentsListAbstract({entity: this.entity});
        //itemsList.purgeListeners();
        //itemsList.getBottomToolbar().hide();
        itemsList.on('rowdblclick', function(g, rowIndex) {
            this.attach(g.getStore().getAt(rowIndex).get('id'), this.orderId);
            wind.close();
        }, this);
        
        var wind = new Ext.Window({
            title: 'Присоединить',
            width: 800,
            height: 300,
            layout: 'fit',
            resizable: false,
            modal: true,
            items: [itemsList]
        });
        wind.show();
        
        itemsList.getStore().load({params: {start: 0, limit: 1000}});
	},
    
    attach: function(id) {
        this.el.mask('Запись...');
		Ext.Ajax.request({
            url: this.attachURL,
            params: {id: id, orderId: this.orderId},
            success: function(res){
                var errors = Ext.decode(res.responseText).errors;
                if (errors) {
                    xlib.Msg.error(errors[0].msg);
                    this.el.unmask();
                    return;
                }
                this.el.unmask();
                this.getStore().load();
            },
            failure: function() {
                xlib.Msg.error('Ошибка связи с сервером.');
                this.el.unmask();
            },
            scope: this
        });
    },
    
    onRemove: function(g, rowIndex) {
        Ext.Msg.show({
            title: 'Подтверждение',
            msg: 'Вы уверены?',
            icon: Ext.MessageBox.QUESTION,
            buttons: Ext.Msg.YESNO,
            fn: function(b) {
                if ('yes' == b) {
                    this.el.mask('Запись...');
                    Ext.Ajax.request({
                        url: this.removeURL,
                        params: {id: g.getStore().getAt(rowIndex).get('id'), orderId: this.orderId},
                        success: function(res){
                            var errors = Ext.decode(res.responseText).errors;
                            if (errors) {
                                xlib.Msg.error(errors[0].msg);
                                this.el.unmask();
                                return;
                            }
                            this.el.unmask();
                            g.getStore().load();
                        },
                        failure: function() {
                            xlib.Msg.error('Ошибка связи с сервером.');
                            this.el.unmask();
                        },
                        scope: this
                    });
                }
            },
            scope: this
        });
    },
    
    loadData: function(data) {
        this.getStore().loadData(data);
    }
});