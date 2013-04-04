Ext.ns('PMS.Organizer');

PMS.Organizer.Form = Ext.extend(xlib.form.FormPanel, {
    
    permissions: true,
    
    initComponent: function() {
        
	    var newDate = new Date().add(Date.HOUR, 1);
	    	
        this.items = [{
            xtype: 'hidden',
            name: 'id'
        }, {
        	layout: 'column',
        	border: false,
        	columns: 2,
        	defaults: {
	        	layout: 'form',
	        	labelWidth: 50,
	        	border: false,
	        	columnWidth: .5
        	},
	        items: [{
	        	items: [{
		            xtype: 'xlib.form.DateField',
		            format: 'd-m-Y',
		            fieldLabel: 'Дата',
		            allowBlank: false,
		            name: 'ondate',
		            hiddenName: 'ondate',
		            value: newDate
	        	}]
	        }, {
	        	items: [{
		        	xtype: 'timefield',
		            format: 'H:i',
		            increment: 60,
		            fieldLabel: 'Время',
		            allowBlank: false,
		            name: 'ontime',
		            value: newDate
	        	}]
	        }],
        }, {
            xtype: 'textarea',
            anchor: '100% 100%',
            hideLabel: true,
            name: 'text',
            allowBlank: true
        }];
        
        PMS.Organizer.Form.superclass.initComponent.apply(this, arguments);
    },
});