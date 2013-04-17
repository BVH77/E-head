Ext.ns('PMS.Organizer');

PMS.Organizer.Manager = Ext.extend(Ext.Component, {

    ActiveTasksCount: 0,
    
    initComponent: function() {
        
        this.getActiveTasksCount(function(count) {
            
            if (count > 0) {
                this.getWindow(new PMS.Organizer.List({
                    title: false
                })).show();
            }
            
            this.updateButton(count);
        });
        
        PMS.Organizer.Manager.superclass.initComponent.apply(this, arguments);
        
        
        // Periodic check tasks & update button  
        Ext.TaskMgr.start({
            run: function() {
                this.getActiveTasksCount(this.updateButton);
            },
            scope: this,
            interval: 60000 // = 1 munute
        });
    },
    
    getActiveTasksCount: function(f) {
    	
        Ext.Ajax.request({
            url: link('organizer', 'index', 'get-active-tasks-count'),
            callback: function(options, success, response) {
                var res = xlib.decode(response.responseText);
                if (true == success && res && true == res.success) {
                    f.call(this, res.count);
                }
            },
            scope: this
        });
    },
    
    updateButton: function(count) {
        
        var b = Ext.getCmp('Organizer-Button');
        
        if (b && b.setText) {
            var text = (b.srctext || 'Задачи') 
                     + ' <font color="red"><b>' + (count || 0) + '</b></font>';
            b.setText(text); 
        }
    },
    
    getWindow: function(content) {
         
        var w = new Ext.Window({
            title: 'Мои задачи',
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