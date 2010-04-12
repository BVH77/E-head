Ext.ns('OSDN');

OSDN.PreviewPanel = Ext.extend(Ext.Panel, {
    
    width: 60,
    
    height: 86,
    
    border: false,
    
    resizable: false,
    
    fileUrl: '',
    
    type: 'pdf',
    
    initComponent: function() {
    	this.filePreview = new OSDN.FilePreview({
    		fileUrl: this.fileUrl,
    		allowMultipage: false,
            type: this.type,
            width: this.width,
            height: this.height
        });
        
    	this.items = [this.filePreview];
    	
    	OSDN.PreviewPanel.superclass.initComponent.apply(this, arguments);
    	
        this.filePreview.on('mouseclick', function () {
        	var fileUrl = this.fileUrl;
        	var w = new Ext.Window({
            	title: lang('File preview'),
            	modal: true,
            	autoHeight: true,
            	width: 394,
            	items: [
                    new OSDN.FilePreview({
                        fileUrl: this.fileUrl,
                        type: this.type
            	   })
                ],
            	scope: this,
            	buttons: [{
                    text: lang('Download'),
                    handler: function() {
                        location.href = fileUrl;
                    }
                }, {
            		text: lang('Close'),
            		handler: function() {
            			w.close();
            		}
            	}]
            });
            w.show();
	   }, this);
    	
    },
    
    isSupportedFormat: function (type) {
    	return this.filePreview.isSupportedFormat(type);
    }
});

Ext.reg('osdn.previewpanel', OSDN.PreviewPanel);
    