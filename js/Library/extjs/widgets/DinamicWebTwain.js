Ext.ns('OSDN');


/**
 * @version $Id:  $
 */

OSDN.DinamicWebTwain = Ext.extend(Ext.Panel, {
    
    autoScroll: false,
    
    baseUrl: '',
    
    layout: 'fit',
    
    padding: 0,
    
    border: false,

    twainConfig: {},
    
    baseUrl: null,
    
    hideMode: 'offsets', 
    
    height: 525,
    
    width: 379,
    
    downloadConfig: {},
    
    uploadConfig: {},
    
    scanConfig: {},
    
    baseUrl: '',
    
    initComponent: function() {
    	
    	var config = {
            _cx: "3784",
            _cy: "4128",
            JpgQuality: "80",
            Manufacturer: "DynamSoft Corporation",
            ProductFamily: "Dynamic Web TWAIN",
            ProductName: "Dynamic Web TWAIN",
            VersionInfo: "Dynamic Web TWAIN 5.0.1",
            TransferMode: "0",
            BorderStyle: "0",
            FTPUserName: "",
            FTPPassword: "",
            FTPPort: "21",
            HTTPUserName: "",
            HTTPPassword: "",
            HTTPPort: "80",   
            ProxyServer: "",
            IfDisableSourceAfterAcquire: "0",
            IfShowUI: "-1",
            IfModalUI: "-1",
            IfTiffMultiPage: "0",
            IfThrowException: "0",
            MaxImagesInBuffer: "1",
            TIFFCompressionType: "0",
            IfFitWindow: "-1",
            IfSSL: "0"
    	}
    	
    	config = Ext.apply(config, this.twainConfig);
    	
    	this._twainId = Ext.id();
    	
    	var tpl_array = [
    	    '<object CLASSID = "clsid:5220cb21-c88d-11cf-b347-00aa00a28331" VIEWASTEXT>',
                '<PARAM NAME="LPKPath" VALUE="'+this.baseUrl+'/DynamicWebTwain/DynamicWebTwain.lpk">',
            '</object>',
            '<object height="'+this.height+'" width="'+this.width+'" id="'+this._twainId+'" codeBase="'+this.baseUrl+'/DynamicWebTwain/DynamicWebTWAIN.cab#version=5,0,1" classid="clsid:E7DA7F8D-27AB-4EE9-8FC0-3FEC9ECFE758" VIEWASTEXT>'
        ];
        for (var k in config) {
        	tpl_array.push(['<PARAM NAME="',k,'" VALUE="',config[k],'">']);
        }
        tpl_array.push('</object>');
        
        var tpl = new Ext.XTemplate(tpl_array);
        
        
        OSDN.DinamicWebTwain.superclass.initComponent.apply(this, arguments);
        
        this.on('render', function () {
            tpl.overwrite(this.body);
            this.onReady.defer(1500, this);
        }, this);
    },
    
    //x-hidden
    
    setScanConfigs: function (scanConfig) {
        this.scanConfig = scanConfig;
    },
    
    getScanConfigs: function (scanConfig) {
        return this.scanConfig;
    },
    
    getScanConfig: function (name) {
        return this.scanConfig[name];
    },
    
    setScanConfig: function (name, value) {
        this.scanConfig[name] = value;
    },
    
    scan: function (scanConfig) {
        if (!this.getTwainDom()) {
            OSDN.Msg.error(lang('ActiveX is not allowed'));
            return;
        }
        if (scanConfig) {
            this.setScanConfigs(scanConfig);
        }
    
        if (this.getTwainDom().SourceCount == 0) {
            OSDN.Msg.error(lang('Scanner is not set'));
            return;
        }
        
        var sourceIndex = this.getScanConfig('ScanSource');
        
        if (this.getTwainDom().SourceCount <= sourceIndex) {
            OSDN.Msg.error(lang('Uncorrect scanner configuration'));
            return;
        }
        
        sourceIndex = Math.min(sourceIndex, this.getTwainDom().SourceCount - 1);
        
        var imageType = this.getScanConfig('imageType');
        
        with(Ext.isIE){
            try {
                this.getTwainDom().SelectSourceByIndex(sourceIndex);
            } catch(e) {
                OSDN.Msg.error(lang('Scanner is not set or drivers are not installed'));
                return;
            }
            this.getTwainDom().IfShowUI = this.getScanConfig('ifShowUI');
            this.getTwainDom().OpenSource();
        
            this.getTwainDom().PixelType = this.getScanConfig('pixelType');
        
            this.getTwainDom().SetViewMode(1, 1);
            
            this.getTwainDom().IfDisableSourceAfterAcquire = true; //???
        
            this.getTwainDom().Resolution = this.getScanConfig('Resolution');
            
            this.getTwainDom().IfDuplexEnabled = this.getScanConfig('IfDuplexEnabled');
            
            this.getTwainDom().IfFeederEnabled = this.getScanConfig('IfFeederEnabled');
            
            if (imageType == 'tif' || imageType == 'pdf' ) {
                if (OSDN.empty(this.twainConfig['MaxImagesInBuffer'])) {
                    this.getTwainDom().MaxImagesInBuffer = 100;
                }
                //if (OSDN.empty(this.twainConfig['IfTiffMultiPage'])) {
                    this.getTwainDom().IfTiffMultiPage = 1;
                //}
                //if (OSDN.empty(this.twainConfig['IfAutoFeed'])) {
                    this.getTwainDom().IfAutoFeed = true;
                //}
            }
            
            this.getTwainDom().AcquireImage();
        }
    },
    
    setUploadConfigs: function (uploadConfig) {
        this.uploadConfig = uploadConfig;
    },
    
    getUploadConfigs: function (uploadConfig) {
        return this.uploadConfig;
    },
    
    getUploadConfig: function (name) {
        return this.uploadConfig[name];
    },
    
    setUploadConfig: function (name, value) {
        this.uploadConfig[name] = value;
    },
    
    upload: function (uploadConfig) {
        if (uploadConfig) {
            this.setUploadConfigs(uploadConfig);
        }    
    
        var imageType = this.getUploadConfig('imageType');
    
        var txt_fileName = this.getUploadConfig('fileName') || 'scanned-document';
    
        var currentPathName = this.getUploadConfig('url') || (unescape(location.pathname + location.search));
        var strActionPage = currentPathName;
        
        var params = 'function' == typeof this.getUploadConfig('params')? this.getUploadConfig('params')(): this.getUploadConfig('params'); 
        
        var p = [];
        for (var i in params) {
            p.push(i + '=' + params[i]);
        }
        strActionPage += '?' + p.join('&');
        
        strHostIP = this.getUploadConfig('host') || OSDN.HOST;
        
        if (!OSDN.empty(this.getUploadConfig('HTTPPort'))) {
            this.getTwainDom().HTTPPort = this.getUploadConfig('HTTPPort');        
        }
        if (!OSDN.empty(this.getUploadConfig('IfSSL'))) {
            this.getTwainDom().IfSSL = this.getUploadConfig('IfSSL');        
        }
        
        if (Ext.isSecure) {
            if (!this.getUploadConfig('HTTPPort')) {
                this.getTwainDom().HTTPPort = 443;
            }
            if (!this.getUploadConfig('IfSSL')) {
                this.getTwainDom().IfSSL = true;
            }
        }
        
        if(imageType == 'tif' ){
            this.getTwainDom().HTTPUploadAllThroughPostAsMultiPageTIFF(
                 strHostIP,
                 strActionPage,
                 txt_fileName + "." + imageType);
        }
        else if(imageType == 'pdf' ){
            this.getTwainDom().HTTPUploadAllThroughPostAsPDF(
                 strHostIP,
                 strActionPage,
                 txt_fileName + "." + imageType);
        } else {
            var imageTypeIndex;
            if (imageType == 'bmp') {
                imageTypeIndex = 0;
            } else if (imageType == 'jpg') {
                imageTypeIndex = 1;
            } else if (imageType == 'tif') {
                imageTypeIndex = 2;
            } else if (imageType == 'png') {
                imageTypeIndex = 3;
            } else if (imageType == 'pdf') {
                imageTypeIndex = 4;
            }
            
            this.getTwainDom().HTTPUploadThroughPostEx(
                strHostIP,
                0,
                strActionPage,
                txt_fileName + "." + imageType,
                imageTypeIndex);
        }
        if (this.getTwainDom().ErrorCode != 0 ) {
            this.fireEvent('uploadError', 
                this, 
                this.getTwainDom().HTTPPostResponseString,
                this.getTwainDom().ErrorCode,
                this.getTwainDom().ErrorString
            );
        }
        this.fireEvent('uploaded', 
            this, 
            this.getTwainDom().HTTPPostResponseString,
            this.getTwainDom().ErrorCode,
            this.getTwainDom().ErrorString
        );
        this.getTwainDom().CloseSource();
    },
    
    HTTPDownloadEx: function (downloadConfig) {
    	if (downloadConfig) {
            this.setDownloadConfigs(downloadConfig);
        }
    	
    	if (!OSDN.empty(this.getDownloadConfig('HTTPPort'))) {
            this.getTwainDom().HTTPPort = this.getDownloadConfig('HTTPPort');        
        }
        if (!OSDN.empty(this.getDownloadConfig('IfSSL'))) {
            this.getTwainDom().IfSSL = this.getDownloadConfig('IfSSL');        
        }
        
        if (Ext.isSecure) {
            if (!this.getDownloadConfig('HTTPPort')) {
                this.getTwainDom().HTTPPort = 443;
            }
            if (!this.getDownloadConfig('IfSSL')) {
                this.getTwainDom().IfSSL = true;
            }
        }
        
        var strHostIP = this.getDownloadConfig('host') || OSDN.HOST;
        
        var currentPathName = this.getDownloadConfig('url') || (unescape(location.pathname + location.search));
        
        var fileType = this.getDownloadConfig('fileType');
        
        
        this.getTwainDom().HTTPDownloadEx(strHostIP, currentPathName, fileType);
    },
    
    setDownloadConfigs: function (downloadConfig) {
        this.downloadConfig = downloadConfig;
    },
    
    getDownloadConfigs: function (downloadConfig) {
        return this.downloadConfig;
    },
    
    getDownloadConfig: function (name) {
        return this.downloadConfig[name];
    },
    
    setDownloadConfig: function (name, value) {
        this.downloadConfig[name] = value;
    },
    
    getScanners: function () {
        var i, scanners = {};
        if (this.getTwainDom().SourceCount > 0) {
            for(i = 0; i < this.getTwainDom().SourceCount; i++)
            {
                scanners[i] = this.getTwainDom().SourceNameItems(i);
            }
        }
        return scanners;
    },
    
    
    getTwainEl: function () {
        if (!this._twain) {
        	this._twain = Ext.get(this._twainId); 
        }
        return this._twain;
    },
    
    getTwainDom: function () {
        return this.getTwainEl().dom;
    },
    
    checkIfImagesInBuffer: function() {
        return this.getTwainDom().HowManyImagesInBuffer > 0;
    },

    totalImagesCount: function() {
        return this.getTwainDom().HowManyImagesInBuffer;
    },

    removeAllImages: function()  {
        if (this.checkIfImagesInBuffer()) {
            this.getTwainDom().RemoveAllImages();
        }
    },

    showImageEditor: function() {
        this.getTwainDom().ShowImageEditor();
    },
    
    closeSource: function () {
        this.getTwainDom().CloseSource();
    },
    
    getParam: function (name) {
        return this.getTwainDom()[name];
    },
    
    setParam: function (name, value) {
        return this.getTwainDom()[name] = value;
    },
    
    onReady: function () {
    	Ext.each([
    	   'ImageAreaDeSelected',
    	   'ImageAreaSelected',
    	   'MouseClick',
    	   'MouseDoubleClick',
    	   'MouseMove',
    	   'MouseRightClick',
    	   'PreTransfer',
    	   'PreAllTransfers',
           'PostTransfer',
           'PostAllTransfers',
           'TopImageInTheViewChanged',
           'TransferCancelled',
           'TransferError',
           'InternetTransferPercentage'
    	], function (item) {
    		this.getTwainEl().on(item.toLocaleLowerCase(), this['on' + item], this);
    	}, this);
    	
    	if (OSDN.empty(this.twainConfig['IfSSL']) && Ext.isSecure) {
            if (OSDN.empty(this.twainConfig['HTTPPort'])) {
                this.getTwainDom().HTTPPort = 443;
            }
            this.getTwainDom().IfSSL = true;
        }
    	this.fireEvent('ready');
    },
    
    onImageAreaDeSelected: function () {
        this.fireEvent.apply(this, ['imageareadeselected', this].concat(arguments));
    },
    
    onImageAreaSelected: function () {
        this.fireEvent.apply(this, ['imageareaselected', this].concat(arguments));
    },
    
    onMouseClick: function () {
    	this.fireEvent.apply(this, ['mouseclick', this].concat(arguments));
    },
    
    onMouseDoubleClick: function () {
        this.fireEvent.apply(this, ['onmousedoubleclick', this].concat(arguments));
    },
    
    onMouseMove: function () {
        this.fireEvent.apply(this, ['mousemove', this].concat(arguments));
    },
    
    onMouseRightClick: function () {
        this.fireEvent.apply(this, ['mouserightclick', this].concat(arguments));
    },

    onPreTransfer: function () {
        this.fireEvent.apply(this, ['pretransfer', this].concat(arguments));
    },
    
    onPreAllTransfers: function () {
        this.fireEvent.apply(this, ['prealltransfers', this].concat(arguments));
    },
    
    onPostTransfer: function () {
        this.fireEvent.apply(this, ['posttransfer', this].concat(arguments));
    },
    
    onPostAllTransfers: function () {
        this.fireEvent.apply(this, ['postalltransfers', this].concat(arguments));
    },
    
    onTopImageInTheViewChanged: function () {
        this.fireEvent.apply(this, ['topimageintheviewchanged', this].concat(arguments));
    },
    
    onTransferCancelled: function () {
        this.fireEvent.apply(this, ['transfercancelled', this].concat(arguments));
    },
    
    onTransferError: function () {
        this.fireEvent.apply(this, ['transfererror', this].concat(arguments));
    },
    
    onInternetTransferPercentage: function () {
        this.fireEvent.apply(this, ['internettransferpercentage', this].concat(arguments));
    }
});


Ext.reg('osdn.dinamicwebtwain', OSDN.DinamicWebTwain);