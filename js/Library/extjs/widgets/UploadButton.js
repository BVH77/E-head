Ext.ns('OSDN');

OSDN.UploadButton = Ext.extend(Ext.Button, {
	
	uploadUrl: link('filemanager', 'index', 'upload'),
	
    input_name: 'RemoteFile',
	
    text: lang('Upload file'),
	
    hideParent: true,
    
    tooltip: lang('Upload file'),
	
    iconCls: 'ext-ux-uploaddialog-uploadstartbtn',
    
    input_file: null,
    
    original_handler: null,
    
    original_scope: null,
    
    autoUpload: true,
    
	parameters: function(){ return {}},
	
    button_container_class: '.x-btn-center em',
    
	_uploadMask: null,
			
	initComponent: function() {
		OSDN.UploadButton.superclass.initComponent.apply(this, arguments);
		this.addEvents('beforeupload', 'afterupload', 'failedupload', 'inputfilechange');
	},
	
    onDestroy: function(){
        OSDN.UploadButton.superclass.onDestroy.call(this);
        if (this.container) {
            this.container.remove();
        }
    },
	
	onRender: function(ct, position){
        OSDN.UploadButton.superclass.onRender.call(this, ct, position);
        this.createInputFile();
        //this.createInputFile.createDelegate(this).defer(500);
    },
    
     /**
     * @access private
     */
    createInputFile: function () {
    	this.input_file_id = Ext.id();
    	
        var button_container = this.el.child(this.button_container_class);
        button_container.position('relative');
        button_container.setStyle('display', 'block');
        button_container.setStyle('height', '21px');
        button_container.setStyle('cursor', 'pointer');
		var button_box = button_container.getBox();
        
        this.input_file_container = Ext.DomHelper.append(button_container, {
            tag: 'div',
            style: 'overflow: hidden; position: absolute; display: block; border: none; cursor: pointer; width: ' + button_box.width + 'px; height:20px'
        }, true);
        
		this.input_file = Ext.DomHelper.append(this.input_file_container, {
            tag: 'input',
            type: 'file',
            id: this.input_file_id,
            size: 1 ,
            name: this.input_name || Ext.id(this.el),
			style: "font-size:100px; position:relative; left:-280px;"            
        }, true);

        var input_box = this.input_file.getBox();
        
        this.input_file_container.setLeft('0px');
        this.input_file_container.setTop('0px');
        
        this.input_file_container.setOpacity(0.0);
        
        if (this.handleMouseEvents) {
            this.input_file.on('mouseover', this.onMouseOver, this);
            this.input_file.on('mousedown', this.onMouseDown, this);
        }
        
        if (this.tooltip) {
            if (typeof this.tooltip == 'object') {
                Ext.QuickTips.register(Ext.apply({
                    target: this.input_file
                }, this.tooltip));
            } else {
                this.input_file.dom[this.tooltipType] = this.tooltip;
            }
        }
        
        this.input_file.on('change', this.onInputFileChange, this);
        this.input_file.on('click', function(e){
            e.stopPropagation();
        });
    },
    
    /**
     * @access public
     */
    detachInputFile: function(no_create){
        if (typeof this.tooltip == 'object') {
            Ext.QuickTips.unregister(this.input_file);
        } else {
            this.input_file.dom[this.tooltipType] = null;
        }
        this.input_file.removeAllListeners();
        if (!(no_create || false)) {
            this.createInputFile();
        }
        return this.input_file;
    },
    
    /**
     * @access public
     */
    getInputFile: function(){
        return this.input_file;
    },
    
    /**
     * @access public
     */
    disable: function(){
        OSDN.UploadButton.superclass.disable.call(this);
        if (this.rendered) {
            Ext.get(this.input_file_id).dom.disabled = true;
		} else {
            this.on('render', function () {
               Ext.get(this.input_file_id).dom.disabled = true;
            }, this, {delay: 200})
        }
        
        
    },
    
    /**
     * @access public
     */
    enable: function(){
        OSDN.UploadButton.superclass.enable.call(this);
        if (this.rendered) {
        	Ext.get(this.input_file_id).dom.disabled = false;
        } else {
        	this.on('render', function () {
                Ext.get(this.input_file_id).dom.disabled = false;        		
        	}, this, {delay: 200})
        }
    },
    
    /**
     * @access public
     */
    destroy: function(){
        var input_file = this.detachInputFile(true);
        input_file.remove();
        input_file = null;
        OSDN.UploadButton.superclass.destroy.call(this);
    },
    
    /**
     * @access private
     */
    onInputFileChange: function(){
    	if (this.autoUpload) {
			this.uploadFile();
		}
        if (this.fireEvent('inputfilechange', this) && this.handler) {
            this.handler.call(this.scope, this);
        }
    },
	
	uploadFile: function(params) {
		var self = this;
		
		if (!this.fireEvent('beforeupload', this)) {
			return false;
		}
		
		if (!this._uploadMask) {
			this._uploadMask = new Ext.LoadMask(Ext.getBody(), {
				msg: lang("Please wait, uploading ... ")
			});
		}
		this._uploadMask.show();
		
		if (this.form) {
			Ext.destroy(this.form)
		}
		this.form = this.createForm();
		this.addFileToForm(this.form);
		
        Ext.Ajax.request({
            url: this.uploadUrl,
            params: Ext.apply(params || {}, this.parameters()),
            method: 'POST',
            form: this.form,
            isUpload: true,
            success: function (response, options) {
				self.fireEvent('afterupload', self, response, options);
				self._uploadMask.hide();
			},
            failure: function (response, options) {
				self.fireEvent('failedupload', self, response, options);
				self._uploadMask.hide();
			}
        });
    },
	
	addFileToForm: function(form){
        //var inputFile = this.detachInputFile();
        this.input_file.appendTo(form);
        this.detachInputFile();
    },
	
	createForm: function() {
        return Ext.DomHelper.append(Ext.getBody(), {
            tag: 'form',
            method: 'post',
            action: this.uploadUrl,
			enctype: "multipart/form-data",
            style: 'position: absolute; left: -1000px; top: -1000px; width: 0px; height: 0px'
        });
    }
});

Ext.reg('OSDN.UploadButton', OSDN.UploadButton);