Ext.namespace('OSDN');

OSDN.Window = Ext.extend(Ext.Window, {
    addButton : function(config, handler, scope){
        if (config.own) {
            if(!this.buttons) {
                this.buttons = [];
            } 
            this.buttons.push(config);
            return config;
        }
        return OSDN.Window.superclass.addButton.apply(this, arguments);
    }    
});
