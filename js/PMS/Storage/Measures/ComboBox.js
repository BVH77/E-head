Ext.ns('PMS.Storage.Measures');

PMS.Storage.Measures.ComboBox = Ext.extend(xlib.form.ComboBox, {

    typeAhead: true,
    editable: false,
    triggerAction: 'all',
    lazyRender: true,
    mode: 'local',
    displayField: 'name',
    selectFirst: true,

    initComponent: function() {
        
        this.store = new Ext.data.JsonStore({
            autoDestroy: true,
            storeId: 'MeasuresStore',
            root: 'data',
            idProperty: 'name',
            fields: ['name'],
            data: { 
                data: [
                    {name: 'шт.'}, 
                    {name: 'л'}, 
                    {name: 'кг'}, 
                    {name: 'м'}, 
                    {name: 'кв.м'}, 
                    {name: 'куб.м'}
                ]
            }
        })
        
        PMS.Storage.Measures.ComboBox.superclass.initComponent.apply(this, arguments);
    }
});

Ext.reg('PMS.Storage.Measures.ComboBox', PMS.Storage.Measures.ComboBox);