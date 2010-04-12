Ext.namespace('OSDN.Accounts');

OSDN.Accounts.AccountsCombo = Ext.extend(OSDN.form.ComboBox, {
    
    displayField: 'name',
    
    valueField: 'id',
    
    hiddenName: 'account_id',

    triggerAction: 'all',
    
    autoLoad: false,
    
    extended: false,
    
    initComponent: function() {
        
        var fields = ['id', 'name'];
        if (this.extended) {
            fields.push('email');
        }
        
        this.store = new Ext.data.Store({
            url: link('accounts', 'index', 'get-accounts'),
            params: {
                email: this.extended
            },
            reader: new Ext.data.JsonReader({
                root: 'accounts',
                id: 'id'
            }, fields),
            autoLoad: this.autoLoad,
            scope: this
        });
        
        if (true === this.extended) {
            this.store.on('load', function(store, records, options) {
                Ext.each(records, function(r) {
                    r.set(this.displayField, r.get(this.displayField) + ' (' + (r.get('email') || lang('Email is not specified')) + ')');
                }, this); 
                store.commitChanges();
            }, this);
        }
        OSDN.Accounts.AccountsCombo.superclass.initComponent.apply(this, arguments);
    }

});

Ext.reg('osdn.accounts.accounts-combo', OSDN.Accounts.AccountsCombo)