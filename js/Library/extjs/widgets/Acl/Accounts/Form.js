Ext.ns('OSDN.Acl.Accounts');

OSDN.Acl.Accounts.Form = Ext.extend(OSDN.form.FormPanel, {
    
    accountId: null,
    
    permissions: true,
    
    initComponent: function() {
        
        this.items = [{
            fieldLabel: 'Логин',
            name: 'login',
            disabled: true
        }, {
            fieldLabel: 'Имя',
            name: 'name'
        }, {
            fieldLabel: 'Email',
            name: 'email',
            vtype: 'email'
        }, {
            fieldLabel: 'Теолефон',
            name: 'phone',
            allowBlank: true
        }, {
            fieldLabel: 'Активно',
            xtype: 'checkbox',
            name: 'active',
            inputValue: 1
        }];
        
        this.reader = this.initialConfig.reader = new Ext.data.JsonReader({
            root: 'rows'
        }, [
            'login', 'name', 'email', 'phone', 'active'
        ]);
        
        OSDN.Acl.Accounts.Form.superclass.initComponent.apply(this, arguments);
    },
    
    getWindow: function() {
        var w = new OSDN.window.ModalContainer({
            title: 'Редактирование учётной записи',
            modal: true,
            width: 300,
            items: [this],
            buttons: [{
                text: 'Сохранить',
                handler: function() {
                    this.getForm().submit({
                        url: link('admin', 'accounts', 'update'),
                        params: {
                            id: this.accountId
                        },
                        waitMsg: 'Сохранение...',
                        success: function() {
                            w.close();
                        }, 
                        failure: function() {
                            OSDN.Msg.error('Сохранение не удалось.');
                        },
                        scope: this
                    });
                },
                scope: this
            }],
            scope: this
        });
        
        w.on('show', function() {
            this.getForm().load({
                url: link('admin', 'accounts', 'fetch'),
                params: {
                    id: this.accountId
                },
                scope: this
            });
        }, this);
        return w;
    }
});

Ext.reg('osdn.acl.accounts.form', OSDN.Acl.Accounts.Form);