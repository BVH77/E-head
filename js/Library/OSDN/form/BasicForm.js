Ext.ns('OSDN.form');

OSDN.form.BasicForm = Ext.extend(Ext.form.BasicForm, {
    
    constructor: function() {
        
        OSDN.form.BasicForm.superclass.constructor.apply(this, arguments);
    },
    
    /**
     * Retrieve fields collection from basic form
     * 
     * @return {Ext.util.MixedCollection}
     */
    getFields: function() {
        return this.items;
    }
});