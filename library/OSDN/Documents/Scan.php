<?php

/**
 * OSDN_Documents_Scan
 *
 * @category OSDN
 * @package OSDN_Documents
 *
 */
abstract class OSDN_Documents_Scan
{
    static public function display($view) {
        
        $strActionPage = array();
        foreach ((array)$view->params as $k => $v) {
            $strActionPage[] = "$k=$v";
        }
        if ($strActionPage) {
            $strActionPage = "&" . join("&", $strActionPage);
        } else {
            $strActionPage = "";
        }
        
        $baseUrl = $view->baseUrl();
        
        /**
         * @todo move all html code to template
         * dirname(__FILE__) . '/_files/scan.phtml');
         */
        echo <<<HTML
<html><body>
<script language="javascript" id="clientEventHandlersJS">
<!--
//====================Edit Image Group End==================//

function CheckIfImagesInBuffer() {
    return frmScan.DynamicWebTwain1.HowManyImagesInBuffer > 0;
}

top.OSDN.ScanButton.prototype.totalImagesCount = function() {
    return frmScan.DynamicWebTwain1.HowManyImagesInBuffer;
}


top.OSDN.ScanButton.prototype.removeAllImages = function()  {
    if (CheckIfImagesInBuffer()) {
        frmScan.DynamicWebTwain1.RemoveAllImages();
        top.OSDN.ScanButton.prototype.totalImages = 0;
    }
}

top.OSDN.ScanButton.prototype.showImageEditor = function() {
    frmScan.DynamicWebTwain1.ShowImageEditor();
}

function btnScan_onclick() {
	
	if (!frmScan.DynamicWebTwain1) {
		top.OSDN.ScanButton.prototype.scannedError(
			null,
			null,
			'ActiveX is not allowed'
		);
		return;
	}

	if (frmScan.DynamicWebTwain1.SourceCount == 0) {
		top.OSDN.ScanButton.prototype.scannedError(
			null,
			null,
			'Scanner is not set'
		);
		return;
	}
	
	var sourceIndex = {$view->ScanSource};
	
	if (frmScan.DynamicWebTwain1.SourceCount <= sourceIndex) {
		top.OSDN.ScanButton.prototype.scannedError(
			null,
			null,
			'Uncorrect scanner configuration'
		);
		return;
	}
	
	sourceIndex = Math.min(sourceIndex, frmScan.DynamicWebTwain1.SourceCount - 1);
	
	var imageType = '{$view->ScanConfig['imageType']}';
	
	var pixelType = '{$view->ScanConfig['pixelType']}';
	
	var Resolution = '{$view->ScanConfig['Resolution']}';
	
	var ifShowUI = parseInt('{$view->ScanConfig['ifShowUI']}');
	
	var IfFeederEnabled = parseInt('{$view->ScanConfig['IfFeederEnabled']}');
	
	var IfDuplexEnabled = parseInt('{$view->ScanConfig['IfDuplexEnabled']}');
	
	var i;
    with(document.all){
    	try{
        	frmScan.DynamicWebTwain1.SelectSourceByIndex(sourceIndex);
		} catch(e) {
    		top.OSDN.ScanButton.prototype.scannedError(
    			null,
    			null,
    			'Scanner is not set or drivers are not installed'
    		);
    		return;
    	}
	    frmScan.DynamicWebTwain1.IfShowUI = ifShowUI;
	    frmScan.DynamicWebTwain1.OpenSource();
	
		frmScan.DynamicWebTwain1.PixelType = pixelType;
		//frmScan.DynamicWebTwain1.PixelType = 1;
	
        frmScan.DynamicWebTwain1.SetViewMode(1, 1);
		
	    frmScan.DynamicWebTwain1.IfDisableSourceAfterAcquire = true; //???
	    
    
	    frmScan.DynamicWebTwain1.Resolution = Resolution;
	    
	    frmScan.DynamicWebTwain1.IfDuplexEnabled = IfDuplexEnabled;
	    
	    frmScan.DynamicWebTwain1.IfFeederEnabled = IfFeederEnabled;
	    
        if (imageType == 'tif' || imageType == 'pdf' ) {
            //frmScan.DynamicWebTwain1.IfFeederEnabled = true ;
    	    //frmScan.DynamicWebTwain1.IfDuplexEnabled = false ;
    	    frmScan.DynamicWebTwain1.MaxImagesInBuffer = 100;
    		frmScan.DynamicWebTwain1.IfTiffMultiPage = 1;
    		frmScan.DynamicWebTwain1.IfAutoFeed = true;
        } else {
            //frmScan.DynamicWebTwain1.IfAutoFeed = false;
            //frmScan.DynamicWebTwain1.IfFeederEnabled = false;
        }
	    
	    frmScan.DynamicWebTwain1.AcquireImage();
	}
}

/*-----------------Save Image Group---------------------*/

function btnUpload_onclick()
{
//	var imageType = '{$view->ScanConfig['imageType']}';
//
//	var txt_fileName = 'scanned-document';
//
//	var CurrentPathName = unescape(location.pathname + location.search);
//	var strActionPage = CurrentPathName;
//
//	var params = top.OSDN.ScanButton.prototype.getParams();
//
//	var p = [];
//	for (i in params) {
//		p.push(i + '=' + params[i]);
//    }
//    strActionPage += '?' + p.join('&');
//
//	strHostIP = "{$_SERVER['SERVER_NAME']}";
//
//	//strActionPage += "&save=1";
//	/*strActionPage += "&title=" + document.getElementById('title').value;
//	strActionPage += "&author=" + document.getElementById('author').value;
//	strActionPage += "&subject=" + document.getElementById('subject').value;
//	strActionPage += "&keywords=" + document.getElementById('keywords').value;
//	strActionPage += "&comments=" + document.getElementById('comments').value;
//	strActionPage += "&type=" + document.getElementById('type').value;*/
//
//	if (location.href.substr(0, 5) == 'https') {
//		frmScan.DynamicWebTwain1.HTTPPort = 443;
//		frmScan.DynamicWebTwain1.IfSSL = true;
//	}
//
//
//	if(imageType == 'tif' ){
//        frmScan.DynamicWebTwain1.HTTPUploadAllThroughPostAsMultiPageTIFF(
//             strHostIP,
//             strActionPage,
//             txt_fileName + "." + imageType);
//    }
//    else if(imageType == 'pdf' ){
//        frmScan.DynamicWebTwain1.HTTPUploadAllThroughPostAsPDF(
//             strHostIP,
//             strActionPage,
//             txt_fileName + "." + imageType);
//    }
//    else{
//    	var imageTypeIndex;
//    	if (imageType == 'bmp') {
//    		imageTypeIndex = 0;
//    	} else if (imageType == 'jpg') {
//    		imageTypeIndex = 1;
//    	} else if (imageType == 'tif') {
//			imageTypeIndex = 2;
//    	} else if (imageType == 'png') {
//			imageTypeIndex = 3;
//    	} else if (imageType == 'pdf') {
//			imageTypeIndex = 4;
//    	}
//
//        frmScan.DynamicWebTwain1.HTTPUploadThroughPostEx(
//            strHostIP,
//            0,
//            strActionPage,
//            txt_fileName + "." + imageType,
//            imageTypeIndex);
//    }
//
//	if (frmScan.DynamicWebTwain1.ErrorCode != 0 ) {
//		top.OSDN.ScanButton.prototype.scannedError(
//			frmScan.DynamicWebTwain1.HTTPPostResponseString,
//			frmScan.DynamicWebTwain1.ErrorCode,
//			frmScan.DynamicWebTwain1.ErrorString
//		);
//	} else {
//		top.OSDN.ScanButton.prototype.scanned(
//			frmScan.DynamicWebTwain1.HTTPPostResponseString,
//			frmScan.DynamicWebTwain1.ErrorCode,
//			frmScan.DynamicWebTwain1.ErrorString
//		);
//	}
	
	top.OSDN.ScanButton.prototype.scanned();
}


function upload_scanned_data() {
    var imageType = '{$view->ScanConfig['imageType']}';

    var txt_fileName = 'scanned-document';

    var CurrentPathName = unescape(location.pathname + location.search);
    var strActionPage = CurrentPathName;
    
    var params = top.OSDN.ScanButton.prototype.getParams();
    
    var p = [];
    for (i in params) {
        p.push(i + '=' + params[i]);
    }
    strActionPage += '?' + p.join('&');
    
    strHostIP = "{$_SERVER['SERVER_NAME']}";
    
    if (location.href.substr(0, 5) == 'https') {
        frmScan.DynamicWebTwain1.HTTPPort = 443;
        frmScan.DynamicWebTwain1.IfSSL = true;
    }
    
    
    if(imageType == 'tif' ){
        frmScan.DynamicWebTwain1.HTTPUploadAllThroughPostAsMultiPageTIFF(
             strHostIP,
             strActionPage,
             txt_fileName + "." + imageType);
    }
    else if(imageType == 'pdf' ){
        frmScan.DynamicWebTwain1.HTTPUploadAllThroughPostAsPDF(
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
        
        frmScan.DynamicWebTwain1.HTTPUploadThroughPostEx(
            strHostIP,
            0,
            strActionPage,
            txt_fileName + "." + imageType,
            imageTypeIndex);
    }

    if (frmScan.DynamicWebTwain1.ErrorCode != 0 ) {
        top.OSDN.ScanButton.prototype.uplodedError(
            frmScan.DynamicWebTwain1.HTTPPostResponseString,
            frmScan.DynamicWebTwain1.ErrorCode,
            frmScan.DynamicWebTwain1.ErrorString
        );
    } else {
        top.OSDN.ScanButton.prototype.uploaded(
            frmScan.DynamicWebTwain1.HTTPPostResponseString,
            frmScan.DynamicWebTwain1.ErrorCode,
            frmScan.DynamicWebTwain1.ErrorString
        );
        frmScan.DynamicWebTwain1.CloseSource();
    }
}

//-->
</script>

<script language=javascript for=DynamicWebTwain1 event=OnPostAllTransfers>
<!--
    frmScan.DynamicWebTwain1.CurrentImageIndexInBuffer = 0;

    var imageType = '{$view->ScanConfig['imageType']}';
	if (imageType == 'tif' || imageType == 'pdf' ) {
        btnUpload_onclick();
    }
//-->
</script>

<script language=javascript for=DynamicWebTwain1 event=OnPostTransfer>
<!--

	var imageType = '{$view->ScanConfig['imageType']}';
	if (!(imageType == 'tif' || imageType == 'pdf' )) {
		btnUpload_onclick()
	}
//-->
</script>

<div id="windowholder">

    <form id="frmScan" action="{$view->link}" method="post" enctype="multipart/form-data" name="documents_form">
    <div>
    	<object CLASSID = "clsid:5220cb21-c88d-11cf-b347-00aa00a28331" VIEWASTEXT>
    		<PARAM NAME="LPKPath" VALUE="{$baseUrl}/DynamicWebTwain/DynamicWebTwain.lpk">
    	</object>
    	<object id="DynamicWebTwain1" codeBase="{$baseUrl}/DynamicWebTwain/DynamicWebTWAIN.cab#version=5,0,1" height="525" width="379"
    		classid="clsid:E7DA7F8D-27AB-4EE9-8FC0-3FEC9ECFE758" VIEWASTEXT >
    		<PARAM NAME="_cx" VALUE="3784">
    		<PARAM NAME="_cy" VALUE="4128">
    		<PARAM NAME="JpgQuality" VALUE="75">
    		<PARAM NAME="Manufacturer" VALUE="DynamSoft Corporation">
    		<PARAM NAME="ProductFamily" VALUE="Dynamic Web TWAIN">
    		<PARAM NAME="ProductName" VALUE="Dynamic Web TWAIN">
    		<PARAM NAME="VersionInfo" VALUE="Dynamic Web TWAIN 5.0.1">
    		<PARAM NAME="TransferMode" VALUE="0">
    		<PARAM NAME="BorderStyle" VALUE="0">
    		<PARAM NAME="FTPUserName" VALUE="">
    		<PARAM NAME="FTPPassword" VALUE="">
    		<PARAM NAME="FTPPort" VALUE="21">
    		<PARAM NAME="HTTPUserName" VALUE="">
    		<PARAM NAME="HTTPPassword" VALUE="">
    		<PARAM NAME="ProxyServer" VALUE="">
    		<PARAM NAME="IfDisableSourceAfterAcquire" VALUE="0">
    		<PARAM NAME="IfShowUI" VALUE="ON">
    		<PARAM NAME="IfModalUI" VALUE="-1">
    		<PARAM NAME="IfTiffMultiPage" VALUE="0">
    		<PARAM NAME="IfThrowException" VALUE="0">
    		<PARAM NAME="MaxImagesInBuffer" VALUE="1">
    		<PARAM NAME="TIFFCompressionType" VALUE="0">
    		<PARAM NAME="IfFitWindow" VALUE="-1">
    		
    		<PARAM NAME="HTTPPort" VALUE="80">
    		<PARAM NAME="IfSSL" VALUE="0">
    	</object>
    </div>
    </form>
</div>

<script>

    top.OSDN.ScanButton.prototype.upload = upload_scanned_data;
    
    top.OSDN.ScanButton.prototype.cancel = function () {
        frmScan.DynamicWebTwain1.CloseSource();
    }

	if (top.OSDN && top.OSDN.ScanButton) {
		top.OSDN.ScanButton.prototype._ready(btnScan_onclick);
	}
</script>
</body>
</html>
HTML;
    }
}