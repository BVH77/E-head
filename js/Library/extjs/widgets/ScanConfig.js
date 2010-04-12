Ext.ns('OSDN');

OSDN.ScanConfig = Ext.extend(Ext.Panel, {
	
	title: lang('Scanner options'),
	
	border: false,
	
	bodyBorder: false,
	
	layout: 'form',
	
	autoHeight: true,
	
	defaults: {
        anchor: '100%'
    },
    
    style: {
    	padding: "5px"
    },
	
	hidden: !Ext.isIE,
	
	initComponent: function(){
		if (Ext.isIE) {
			var scannerStore = new Ext.data.SimpleStore({fields: ['id', 'name'], data: []});
			 
			var ScanObject = new OSDN.ScanObject();
			
			this.scannerCombo = new OSDN.form.ComboBox({
				fieldLabel: lang('Scanners'),
				store: scannerStore,
				displayField: 'name',
				valueField: 'id',
				hiddenName: 'scanner_ScanSource',
				name: 'scanner_ScanSource',
				typeAhead: true,
				mode: 'local',
				triggerAction: 'all',
				editable: false,
				lazyInit: false,
				value: '0'
			});
			
			this.items = [{
				fieldLabel: lang('Image type'),
				xtype: 'osdncombo',
				store: new Ext.data.SimpleStore({
					fields: ['id', 'name'],
					data: [['tif', 'tif'], ['jpg', 'jpg'], ['pdf', 'pdf']]
				}),
				displayField: 'name',
				valueField: 'id',
				hiddenName: 'scanner_imageType',
				name: 'scanner_imageType',
				typeAhead: true,
				mode: 'local',
				triggerAction: 'all',
				editable: false,
				lazyInit: false,
		 		value: 'pdf'
			}, {
				fieldLabel: lang('Pixel type'),
				xtype: 'osdncombo',
				store: new Ext.data.SimpleStore({
					fields: ['id', 'name'],
					data: [['1', lang('gray')], ['2', lang('color')]]
				}),
				displayField: 'name',
				valueField: 'id',
				hiddenName: 'scanner_pixelType',
				name: 'scanner_pixelType',
				typeAhead: true,
				mode: 'local',
				triggerAction: 'all',
				editable: false,
				lazyInit: false,
		 		value: '1'
			}, {
				fieldLabel: lang('Resolution'),
				xtype: 'osdncombo',
				store: new Ext.data.SimpleStore({
					fields: ['id', 'name'],
					data: [['2', '200dpi'], ['3', '300dpi']]
				}),
				displayField: 'name',
				valueField: 'id',
				hiddenName: 'scanner_Resolution',
				name: 'scanner_Resolution',
				typeAhead: true,
				mode: 'local',
				triggerAction: 'all',
				editable: false,
				lazyInit: false,
				value: '2'
			}, {
				xtype:      "checkbox",
                fieldLabel: lang('If Use ADF'),
                name: 'scanner_IfFeederEnabled',
                anchor:0,
                inputValue: 1
            }, {
                xtype:      "checkbox",
                fieldLabel: lang('If Duplex'),
                name: 'scanner_IfDuplexEnabled',
                anchor:0,
                inputValue: 1
            }, {
                xtype:      "checkbox",
                fieldLabel: lang('if show UI'),
                name: 'scanner_ifShowUI',
                anchor:0,
                inputValue: 1
            }, this.scannerCombo];
			
			//scannerStore.loadData([[1,'ssss'], [2,'ssssdsds']]); 
			
		} else {
			this.items = [{
				border: false,
				html: lang('Scanning is available only in Internet Explorer')
			}];
		}
		
		OSDN.ScanConfig.superclass.initComponent.apply(this, arguments);
		
		if (Ext.isIE) {
			this.on('destroy', function (){
				ScanObject.remove();
			}, this);
			
			ScanObject.on('ready', function () {
				var scanners = ScanObject.getScanners.createDelegate(ScanObject)();
				if (scanners) {
					var sStore = [];
					for (i in scanners) {
						sStore.push([i, scanners[i]]);
					}
					if (sStore.length == 0) {
						scannerStore.loadData([['0', lang('Cannot detect any scanners!')]]);
						(function () {
							this.scannerCombo.setValue('0');
						}).createDelegate(this).defer(2500);
					} else {
						scannerStore.loadData(sStore);
					}
				} else {
					scannerStore.loadData([['0', lang('Cannot detect any scanners!')]]);
					this.scannerCombo.setValue('0');
				}
			}, this);
		}
		
	}
});

Ext.reg('OSDN.ScanConfig', OSDN.ScanConfig);