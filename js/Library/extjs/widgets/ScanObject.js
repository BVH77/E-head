Ext.namespace('OSDN');

OSDN.ScanObject = Ext.extend(Ext.Component, {
	
	baseUrl: '',
	
	_hiddenElement: null,
	
	_hiddenId: null,
	
	initComponent: function(){
		
		this.title = null;
		this.border = false;
		this.hidden = true;
		
		OSDN.ScanObject.superclass.initComponent.apply(this, arguments);
		
		this.DinamicWebTwain = new OSDN.DinamicWebTwain();
		
		this._hiddenElement = Ext.DomHelper.append(Ext.getBody(), "<div style='position:absolute; left:-2000px;'></div>", true);
        this.DinamicWebTwain.render(this.getContainer());
		
		this.DinamicWebTwain.on('ready', function () {
            this.fireEvent('ready');
		}, this);
	},
	
	remove: function () {
		if (this.getContainer()) {
			this.getContainer().remove();
		}
	},
	
	getScanners: function () {
		return this.DinamicWebTwain.getScanners();;
	},
	
	getWebTwainObject: function () {
		return this.DinamicWebTwain.getTwainDom(); 
	},
	
	getContainer: function () {
		return this._hiddenElement;
	}
});