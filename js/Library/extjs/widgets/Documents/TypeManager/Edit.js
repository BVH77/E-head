Ext.namespace('OSDN.Documents.TypeManager');

OSDN.Documents.TypeManager.Edit = Ext.extend(Ext.Window, {
	
	module: 'student',
	
	title: lang('Editing mandatory document'),
	
	loadUrl: null,
	
	updateUrl: null,
	
	scanUrl: null,
	
	width: 600,
	
	height: 540,
    
    modal: true,
    
	layout: 'border',
	
	document_type_id: null,
	
	category_id: null,
	
	allowedFormats: [],
	
	permissions: true,
    
    initComponent: function() {
    	
        this._prepareUrls();
    	
		this.form = new OSDN.form.FormPanel({
			title: null,
			border: true,
			region: 'center',
            autoScroll: false,
            border: false,
			cls: 'x-osdn-border-right x-osdn-border-bottom',
			labelWidth: 80,
			permissions: this.permissions,
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
                xtype: 'panel',
                border: false,
                layout: 'column',
                defaults: {
                    xtype: 'panel',
                    border: false,
                    layout: 'form'
                },
                items: [{
                    columnWidth: .4,
                    items: [{
        				xtype: 'checkbox',
        				fieldLabel: lang('Required'),
        				name: 'required',
        				anchor:0,
        				inputValue: 1,
                        listeners: {
                            check: this.onCheckRequired,
                            scope: this
                        }
                    }]
                }, {
                    columnWidth: .6,
                    labelWidth: 150,
                    items: [{
                        xtype: 'checkbox',
                        fieldLabel: lang('Expired date required'),
                        name: 'expired_date_required',
                        anchor: 0,
                        inputValue: 1
                    }]
                }]
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

        this.replaceableGrid = new OSDN.Documents.TypeManager.ReplaceableList({
            module: this.module,
            document_type_id: this.document_type_id,
            title: lang('Replaceable documents'),
            border: false,
            region: 'south',
            split: true,
            cls: 'x-osdn-border-top',
            height: 350
        });
        
        this.items = [this.form, {
			title: lang('Connected templates'),
			hideHeaders: true,
			module: this.module,
			allowedFormats: this.allowedFormats,
			//scanUrl: this.scanUrl,
			xtype: 'OSDN.Documents.TypeManager.Files.List',
            border: false,
			region: 'east',
            split: true,
            cls: 'x-osdn-border-left x-osdn-border-bottom',
			document_type_id: this.document_type_id,
			width: 220
		}, this.replaceableGrid];

		this.buttons = [{
			text: lang('Save'),
			handler: function() {
				this.save();
			},
			minWidth: 75,
			scope: this
		}, {
            text: lang('Cancel'),
            minWidth: 75,
            handler: function() {
                this.close();
            },
            scope: this
        }];		
        
        OSDN.Documents.TypeManager.Edit.superclass.initComponent.apply(this, arguments);
        
        this.on('load', function(options) {
            var data = options.result.data;
            var state = parseInt(data.required);
            this.replaceableGrid.setDisabled(!state);
            if (state) {
                this.replaceableGrid.load();            
            }
        }, this);
        
        this.addEvents('load', 'update', 'failureUpdated');
    },
    
	//private
    _prepareUrls: function() {
    	var module = this.module;
        var a = {
			loadUrl: link(module, 'document-types', 'load'),
			updateUrl: link(module, 'document-types', 'update'),
			scanUrl: link(module, 'document-types', 'scan-file', null, 'html')
        };
        
        for(var i in a) {
            if (!this[i]) {
                this[i] = a[i];
            }
        }
        return this;
    },

	
	onRender: function () {
		OSDN.Documents.TypeManager.Edit.superclass.onRender.apply(this, arguments);
		this.load();
	},
    
    load: function(p) {
		if (p && p.document_type_id) {
			this.document_type_id = p.document_type_id;
		}
		if (this.document_type_id) {
			this.form.getForm().load({
				url: this.loadUrl,
				method: 'POST',
				params: {
					id: this.document_type_id
				},
				waitMsg: true,
				success: function(form, options){
					this.fireEvent('load', options);
				},
				scope: this
			});
		}
    },
	
    save: function(callback) {
        var failure = function() {
            OSDN.Msg.error(lang('Saving mandatory document failed. Try again.'));
			this.fireEvent('failureUpdate');
        };
        if (this.form.getForm().isValid()) {
            this.form.getForm().submit({
                url: this.updateUrl,
				params: {
					id: this.document_type_id,
					category_id: this.category_id
				},
                success: function(form, options) {
                    if (true !== options.result.success) {
                        failure();
                        return;
                    }
					this.fireEvent('update');
					this.close();
                    if ('function' === typeof callback) {
                        callback();
                    }
                },
                failure: failure.createDelegate(this),
                scope: this
            });
        } else {
			this.fireEvent('failureUpdated');
		}
    },
    
    onCheckRequired: function(cb, check) {
        this.replaceableGrid.setDisabled(!check);
        if (!check) {
            this.checkReplaceable();
            this.replaceableGrid.clear();
        } else {
            this.replaceableGrid.load();
        }
    },
    
    checkReplaceable: function() {
        
    }
    
});

Ext.reg('OSDN.Documents.TypeManager.Edit', OSDN.Documents.TypeManager.Edit);