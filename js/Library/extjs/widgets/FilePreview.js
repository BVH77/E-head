Ext.ns('OSDN');

OSDN.FilePreview = Ext.extend(Ext.Panel, {
    
    height: 525,
    
    width: 379,
    
    modal: true,
    
    autoHeight: true,
    
    border: false,
    
    resizable: false,
    
    allowMultipage: true,
    
    baseUrl: '',
    
    fileUrl: '',
    
    type: 'pdf',
    
    initComponent: function() {
    	this._allowedTypes = {
            bmp: 0,
            jpeg: 1,
            jpg: 1,
            tiff: 2,
            tif: 2,
            png: 3,
            pdf: 4
        }; 
        if (this.fileUrl && this.type) {
        	this.loadFile(this.fileUrl, this.type);
        }
        OSDN.FilePreview.superclass.initComponent.apply(this, arguments);
    },
    
    isSupportedFormat: function (type) {
    	if (!type && this.type) {
    		type = this.type;
    	}
    	if (!type) {
    		return false;
    	}
    	return ('undefined' != typeof this._allowedTypes[type] 
    	   &&  (Ext.isIE || (this._allowedTypes[type] <= 3 && this._allowedTypes[type] != 2)));
    },
    
    loadFile: function (url, type) {
    	
    	if (this.DinamicWebTwain) {
    		this.DinamicWebTwain.destroy();
    	}
    	if (this.rendered) {
    		this._render(url, type);
    	} else {
        	this.on('render', function () {
                this._render(url, type);
            }, this);
    	}
    }, 
    
    _render: function (url, type) {
    	
    	if (!type && url) {
    		for (var i = url.length - 1; i >= 0 && url.charAt(i) != '.'; i--);
    		if (i >= 0 && i < url.length - 1) {
    			type = url.substr(i + 1);
    		}
    	}
    	type = type.toLocaleLowerCase();
    	if (Ext.isIE) {
    		if ('undefined' != typeof this._allowedTypes[type]) {
    			this.DinamicWebTwain = new OSDN.DinamicWebTwain({
                    height: this.height,
                    width: this.width
                });
                this.add(this.DinamicWebTwain);
                this.DinamicWebTwain.on('ready', function () {
                	
//                    this.getEl().mask(lang('Loading'), 'x-mask-loading');
//                    this.DinamicWebTwain.on('internettransferpercentage', function (sPercent, pbCancel) {
//                    	alert(sPercent);
//                        this.getEl().unmask();
//                    }, this);
                	
                	
                	if (this.allowMultipage && (this._allowedTypes[type] == 2 || this._allowedTypes[type] == 4)) {
                		this.DinamicWebTwain.setParam('MaxImagesInBuffer', 100);
                		this.DinamicWebTwain.setParam('IfTiffMultiPage', 1);
                	} else {
                		this.DinamicWebTwain.setParam('CurrentImageIndexInBuffer', 0);
                	}
                	
                    this.DinamicWebTwain.HTTPDownloadEx({
                    	url        : url,
                    	fileType   : this._allowedTypes[type]
                    });
                    
                    this.getWebTwain().on('mouseclick', function () {
                        this.fireEvent('mouseclick', this, arguments);
                    }, this);
                    
                    this.fireEvent('ready');
                    
                }, this);
    		}
        } else {
        	if (!OSDN.empty(this._allowedTypes[type]) && this._allowedTypes[type] <= 3 && this._allowedTypes[type] != 2) {
        		var el = this.getEl().createChild( {
                    tag: 'img', 
                    src: url,
                    style: 'border: 1px solid #d5cfcf;cursor:pointer;',
                    width: this.width
                });
                el.on('click', function () {
                	this.fireEvent('mouseclick', this, arguments);
                }, this);
        	}
        }
    },
    
    getWebTwain: function () {
    	return this.DinamicWebTwain;
    }
});

Ext.reg('osdn.filepreview', OSDN.FilePreview);