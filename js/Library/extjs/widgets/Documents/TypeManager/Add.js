Ext.namespace('OSDN.Documents.TypeManager');

OSDN.Documents.TypeManager.Add = Ext.extend(Ext.Window, {
	
	module: 'student',
	
	title: lang('Adding mandatory document'),
	
	createUrl: link('admin', 'student-document-types', 'update'),
	
	width: 270,
    
    modal: true,
    
    resizable: false,
    
    autoHeight: true,
    
    permissions: true,
    
    category_id: null,
    
    initComponent: function() {
    	
    	this._prepareUrls();
        
		var scope = this;
		
		this.form = new OSDN.form.FormPanel({
            autoScroll: false,
            autoHeight: true,
            permissions: this.permissions,
			labelWidth: 80,
            items: [{
				xtype: 		"textfield",
				fieldLabel: lang('Name'),
				name: 'name',
				allowBlank: false
			}, {
				xtype: 		"textfield",
				fieldLabel: lang('Abbreviation'),
				name: 'abbreviation',
				allowBlank: false
			}, {
				xtype: 		"textfield",
				fieldLabel: lang('Question'),
				name: 'question',
				allowBlank: true
			}, {
                xtype:      "checkbox",
                fieldLabel: lang('Expired date required'),
                name: 'expired_date_required',
                anchor: 0,
                inputValue: 1
            }, {
				xtype: 		"checkbox",
				fieldLabel: lang('Required'),
				name: 'required',
				anchor: 0,
				inputValue: 1
			}],
            reader: new Ext.data.JsonReader({
                root: 'data'
            }, [
                'name', 
				'abbreviation', 
				'required',
				'expired_date_required',
				'question'
            ])
        });

        this.items = [
			this.form
		];

		this.buttons = [];
		
		this.buttons.push({
			text: lang('Create'),
			handler: function(){
				this.create();
			},
			minWidth: 75,
			scope: this
		});

		
		this.buttons.push({
            text: lang('Cancel'),
            minWidth: 75,
            handler: function() {
                this.close();
            },
            scope: this
        });		
        
        OSDN.Documents.TypeManager.Add.superclass.initComponent.apply(this, arguments);
        
        this.addEvents('created', 'failureCreated');
    },
    
	//private
    _prepareUrls: function() {
    	var module = this.module;
        var a = {
			createUrl: link(module, 'document-types', 'update')
        };
        
        for(var i in a) {
            if (!this[i]) {
                this[i] = a[i];
            }
        }
        return this;
    },

	
    create: function(callback) {
        var failure = function() {
            OSDN.Msg.error(lang('Creating mandatory document failed. Try again.'));
			this.fireEvent('failureCreated');
        };
        if (this.form.getForm().isValid()) {
            this.form.getForm().submit({
                url: this.createUrl,
                params: {
                	category_id: this.category_id
                },
                success: function(form, options) {
                    if (true !== options.result.success) {
                        failure();
                        return;
                    }
					this.fireEvent('created', options.result);
					this.close();
                    if ('function' === typeof callback) {
                        callback();
                    }
                },
                failure: failure.createDelegate(this),
                scope: this
            });
        } else {
			this.fireEvent('failureCreated');
		}
    } 

});

Ext.reg('OSDN.Documents.TypeManager.Add', OSDN.Documents.TypeManager.Add);