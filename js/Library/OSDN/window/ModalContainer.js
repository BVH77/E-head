Ext.ns('OSDN.window');

OSDN.window.ModalContainer = Ext.extend(Ext.Window, {
    
    resizable: false,
    
    /**
     * Allow cancel button
     */
    cancel: true,
    
    width: 300,
    
    cancelBtn: null,

    modal: true,
    
    /**
     * No need shadow because in ie when resize window
     * shadow not resizable
     */
    shadow: false,
    
    initComponent: function(){
    
        if (this.cancel) {
            this.cancelBtn = new Ext.Button({
                text: 'Отмена',
                handler: function() {
                    this.close();
                },
                scope: this
            });
            if (!Ext.isArray(this.buttons)) {
                this.buttons = [];
            }
            this.buttons.push(this.cancelBtn);
        }
        
        OSDN.window.ModalContainer.superclass.initComponent.apply(this, arguments);
    }        
});

Ext.reg('osdnwindow', OSDN.window.ModalContainer);
