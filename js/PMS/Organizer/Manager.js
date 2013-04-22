Ext.ns('PMS.Organizer');

PMS.Organizer.Manager = Ext.extend(Ext.Component, {

    firstRun: true,
    
    initComponent: function() {
        
        PMS.Organizer.Manager.superclass.initComponent.apply(this, arguments);
        
        // Periodic check tasks & update button  
        Ext.TaskMgr.start({
            run: this.getActiveTasks,
            scope: this,
            interval: 60000 // = 1 munute
        });
    },
    
    getActiveTasks: function() {
        Ext.Ajax.request({
            url: link('organizer', 'index', 'get-active-tasks'),
            callback: this.processTasks,
            scope: this
        });
    },
    
    processTasks: function(options, success, response) {
        
        var result = xlib.decode(response.responseText);
        if (true != success || true != result.success) {
            return;
        }
                
        var b = Ext.getCmp('Organizer-Button'),
            count = result.totalCount || 0;
        
        if (b && b.setText) {
            b.setText('Задачи <font color="red"><b>' + count + '</b></font>'); 
        }
        
        if (count == 0) return;
        
        var msgArray = [],
            nearestTasks = [],
            now = new Date(),
            dateMargin = 1000 * 60 * 5; // = 5 minutes
            
        Ext.each(result.data, function(r) {
            
            var rDate = new Date((r.ondate).replace(/-/g, '/') + ' ' + r.ontime);
            var msg = rDate.format(xlib.date.DATE_TIME_WITHOUT_SECONDS_FORMAT) + ' ' + r.text;
        
            // skip feature tasks
            if (rDate.clearTime(true) > now.clearTime(true)) return true;
            
            if (rDate.getTime() < now.getTime()) {
                msg = '<font color="red">' + msg + '</font>';
            }
            
            msgArray.push(msg);
            
            // search for nearest task
            var dateSub = Math.abs(now.getTime() - rDate.getTime());
            if (dateSub < dateMargin) {
                nearestTasks.push(msg);
            }
            
        }, this);
        
        if (this.firstRun && msgArray.length) {
            Ext.Msg.alert('Задачи на сегодня', msgArray.join('<br />'));
            this.firstRun = false;
        } else if (nearestTasks.length) {
            Ext.Msg.alert('Задача', nearestTasks.join('<br />'));
        }
        
    }
    
});

Ext.reg('PMS.Organizer.Manager', PMS.Organizer.Manager);