Ext.namespace('OSDN');

OSDN.ScanButton = Ext.extend(Ext.Button, {
	
	parameters: function(){ return {}},
	
	_isReady: false,
	
	scanningPreview: true,
	
	totalImages: null,
	
	initComponent: function() {
		OSDN.ScanButton.superclass.initComponent.apply(this, arguments);
		
		this.disable();
		
//		this.on('scannedError', function (button, response, errorCode, errorString) {
//			Ext.Msg.show({
//				title: lang('Error'),
//				msg: lang(errorString),
//				buttons: Ext.Msg.OK,
//				icon: Ext.MessageBox.ERROR
//			})
//		}, this);
		this.on('render', function () {
            this.createDinamicWebTwain();
		}, this);
	},
	
	update: function () {
		this.disable();
		if (this.wind) {
			this.wind.destroy(); 
		}
		this._isReady = false;
		this.createDinamicWebTwain();
	},
	
	createDinamicWebTwain: function () {
		this.DinamicWebTwain = new OSDN.DinamicWebTwain({
			uploadConfig: {
				url: this.url
			},
			width: 404,
			height: 550
		});
		
		this.DinamicWebTwain.on('ready', function () {
    		Ext.Ajax.request({
    			url: link('accounts', 'personal', 'get-scan-config'),
    			success: function (response) {
    				var res = Ext.decode(response.responseText);
    				if (res.data) {
    					this.DinamicWebTwain.setScanConfigs(res.data);
    					
    					Ext.apply(res.data, {
    					   params: this.parameters,
    					   url: this.url
                        });
                        
                        this.DinamicWebTwain.setUploadConfigs(res.data);
                        
                        var imageType = this.DinamicWebTwain.getScanConfig('imageType');

                        if (imageType == 'tif' || imageType == 'pdf' ) {
                            this.DinamicWebTwain.on('postalltransfers', this.scanned, this);
                        } else {
                        	this.DinamicWebTwain.on('posttransfer', this.scanned, this);
                        }
                        
                        this.DinamicWebTwain.on('uploaded', this.uploaded, this);
                        
                        this._ready();
    				}
    			},
    			scope: this
    		});
		}, this, {single: true});
		
        this.wind = new Ext.Window({
        	title: lang('Scanning preview'),
            modal: false,
            width: 415,
            renderTo: Ext.getBody(),
            autoHeight: true,
            autoShow: true,
            border: false,
            closable: false,
            items: [
                this.DinamicWebTwain
            ],
            hide : function(animateTarget, cb, scope) {
                if(this.activeGhost) { // drag active?
                    this.hide.defer(100, this, [animateTarget, cb, scope]);
                    return;
                }
                if(this.hidden || this.fireEvent("beforehide", this) === false) {
                    return;
                }
                if(cb) {
                    this.on('hide', cb, scope, {single:true});
                }
                this.hidden = true;
                if(animateTarget !== undefined) {
                    this.setAnimateTarget(animateTarget);
                }
                if(this.animateTarget) {
                    this.animHide();
                }else {
                    this.el.setLeftTop('-1000px', '-1000px');
                    this.afterHide();
                }
            },
            buttons : [{
            	text: lang('View'),
            	handler: function () {
                    this.DinamicWebTwain.showImageEditor();
            	},
            	scope: this
            },{
                text: lang('Scan'),
                handler: function () {
                	this.fireEvent('beforescan', this);
                    this.DinamicWebTwain.scan();
                },
                scope: this
            }, {
                text: lang('Save'),
                handler: function () {
                    this.DinamicWebTwain.upload();
                    this.wind.hide();
                },
                scope: this
            }, {
            	text: lang('Cancel'),
            	handler: function () {
            		if (confirm(lang('Are you sure? All scanned pages will be lost!'))) {
                        this.wind.hide();
                        this.DinamicWebTwain.removeAllImages();
            		}
            	},
                scope: this
            }],
            scope: this
        });

        this.wind.setPosition(-1000, -1000);
        this.wind.show();
        this.wind.hide();
        
    },
	
	handler: function () {
		this.DinamicWebTwain.scan();
		if (!this.scanningPreview) {
			this.DinamicWebTwain.upload();
		}
	},
	
	scanned: function (response, errorCode, errorString) {
		if (this.scanningPreview) {
    		this.wind.show();
    		this.wind.center();
		} else {
			this.fireEvent('scanned');
		}
	},
	
	uploaded: function (tw, response, errorCode, errorString) {
		if (!response) {
            response = Ext.encode({success: true});
		}
        this.DinamicWebTwain.closeSource();
        this.fireEvent('uploaded', this, response, errorCode, errorString);
	},
	
	getParams: function () {
		return this.parameters();
	},
	
	isReady: function() {
		return this._isReady;
	},
	
	_ready: function (handler) {
		this._isReady = true;
		this.enable();
		this.fireEvent('ready', this);
	}
	
});

Ext.reg('OSDN.ScanButton', OSDN.ScanButton);
