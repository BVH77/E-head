Ext.ns('PMS.Organizer');

PMS.Organizer.Manager = Ext.extend(Ext.Component, {

    ActiveTasksCount: 0,
    
    initComponent: function() {
        
        this.getActiveTasksCount();
        
        PMS.Organizer.Manager.superclass.initComponent.apply(this, arguments);
    },
    
    getActiveTasksCount: function() {
    	
        Ext.Ajax.request({
            url: link('organizer', 'index', 'get-active-tasks-count'),
            callback: function (options, success, response) {
                var res = xlib.decode(response.responseText);
                if (true == success && res && true == res.success && res.count > 0) {
                    this.getWindow(new PMS.Organizer.List({
                        title: false
                    }), res.count).show();
                }
                var b = Ext.getCmp('Organizer-Button');
                if (b && b.setText) {
                    b.setText(b.getText() 
                    + ' <font color="red"><b>' + (res.count || 0) + '</b></font>'); 
                }
            },
            scope: this
        });
    },
    
    // Private functions 
    
    getWindow: function(content, count) {
         
        var w = new Ext.Window({
            title: 'Мои задачи <font color="red"><b>' + (count || 0) + '</b></font>',
            border: false,
            width: 700,
            height: 500,
            modal: true,
            layout: 'fit',
            items: [content],
            buttons: [{
                text: 'Закрыть',
                handler: function() {
                    w.close();
                }
            }]
        });
        
        return w;
    }
});

Ext.reg('PMS.Organizer.Manager', PMS.Organizer.Manager);