Ext.ns('OSDN.Documents');

OSDN.Documents.Configuration = Ext.extend(OSDN.form.FormPanel, {
    
    loadUrl: link('accounts', 'configuration', 'load-profile-settings'),
    
    saveUrl: link('accounts', 'configuration', 'save-profile-settings'),
    
    padding: "5px",
    
    permissions: acl.isUpdate('accounts', 'configuration'),
    
    initComponent: function(){
        
        this.reader = new Ext.data.JsonReader({
            root: 'data'
        }, [
            'scanner_imageType', 
            'scanner_pixelType', 
            'scanner_Resolution',
            'scanner_ScanSource',
            'scanner_IfFeederEnabled',
            'scanner_IfDuplexEnabled',
            'scanner_ifShowUI'
        ]);     
        
        this.initialConfig.reader = this.reader; 
        
        this.items = [{
        	title: null,
        	style: {
                padding: "0px"
            },
        	xtype: 'OSDN.ScanConfig'
        }];
        
        OSDN.Documents.Configuration.superclass.initComponent.apply(this, arguments);
        
        this.on('render', function () {
            this.load();
        }, this);
        
        this.addEvents('cancel', 'load', 'update', 'failureUpdate');
    },
    
    load: function() {
        this.getForm().load({
            url: this.loadUrl,
            method: 'POST',
            waitMsg: lang('Loading ...'),
            success: function(form, options) {
                this.fireEvent('load');
            },
            scope: this
        });
    },
    
    update: function(callback) {
        var self = this;
        
        var failure = function() {
            OSDN.Msg.error(lang('Update settings failed. Try again.'));
            this.fireEvent('failureUpdate');
        };
        
        if (this.getForm().isValid()) {
            this.getForm().submit({
                url: this.saveUrl,
                success: function(form, options){
                    if (true !== options.result.success) {
                        failure();
                        return;
                    }
                    //Ext.Msg.alert(lang('Status'), lang('Settings saved successfully.'));
                    Ext.Msg.show({
                        title:lang('Status'),
                        msg: lang('Settings saved successfully.'),
                        buttons: Ext.Msg.OK,
                        fn: function() {
                            self.fireEvent('update');
                            if ('function' === typeof callback) {
                                callback();
                            }
                        }
                    });
                },
                failure: failure.createDelegate(this),
                scope: this
            });
        } else {
            failure();
        }
    },
    
    showInWindow: function () {
    	var w = new Ext.Window({
            title: lang('Scanning settings'),
            iconCls: 'osdn-scanner-configuration',
            width: 350,
            modal: true,
            autoHeight: true,
            items: [this],
            buttons: [{
                text: lang('Save'),
                handler: function() {
                    this.update();
                    
                },
                minWidth: 55,
                scope: this,
                disabled: !acl.isUpdate('accounts', 'configuration')
            }, {
                text: lang('Cancel'),
                minWidth: 55,
                handler: function() {
                    w.close();
                },
                scope: this
            }]
        });
        this.on('update', function () {
            w.close();
        });
        w.show();
        return w;
    }
});