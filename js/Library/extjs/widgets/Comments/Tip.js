Ext.ns('OSDN.Comments');

OSDN.Comments.Tip = Ext.extend(Ext.ToolTip, {

    title: lang('Comments viewer'),
    
    closable: true,

    id: null,
    
    entityType: null,
    
    controller: 'comments',
    
    initComponent: function() {

        if (OSDN.empty(this.id)) {
            throw 'The entity id cannot be empty.';
        }
        
        if (OSDN.empty(this.entityType)) {
            throw 'The entity type cannot be empty.';
        }
        
        this.autoLoad = Ext.apply(this.autoLoad || {}, {
            url: link(this.entityType, this.controller, 'get-list', {entityId: this.id})
        }, this);
        
        OSDN.Comments.Tip.superclass.initComponent.apply(this, arguments);
    }  
});
