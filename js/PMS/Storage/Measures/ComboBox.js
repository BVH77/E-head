Ext.ns('PMS.Storage.Measures');

PMS.Storage.Measures.ComboBox = Ext.extend(xlib.form.ComboBox, {

    typeAhead: true,
    editable: false,
    triggerAction: 'all',
    lazyRender: true,
    mode: 'remote',
    displayField: 'name',
    selectFirst: true,

    initComponent: function() {
        
        this.store = new Ext.data.JsonStore({
            url: link('storage', 'measures', 'get-all'),
            autoDestroy: true,
            storeId: 'MeasuresStore',
            root: 'data',
            idProperty: 'name',
            fields: ['name']
        })
        
        PMS.Storage.Measures.ComboBox.superclass.initComponent.apply(this, arguments);
    }
});

Ext.reg('PMS.Storage.Measures.ComboBox', PMS.Storage.Measures.ComboBox);