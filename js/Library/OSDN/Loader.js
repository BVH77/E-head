/**
 * Universal loader
 * Can load javascript and append into head section if FF
 * or execute by method eval() for IE and Opera and now Safari also
 * 
 * @param {String}   urls 
 * @param {Function} f              callback function
 * @param {Boolean}  executeOnce    Execute only once current script
 */
Ext.namespace('OSDN.Loader', 'OSDN.Loader.FileConnections', 'OSDN.Loader.RunnedFunctions');

OSDN.Loader.LoadedScripts = [];

OSDN.Loader.LoadScript = function (urls, f, executeOnce) {
    Ext.getBody().mask(lang('Loading...'), 'x-mask-loading');
	
    if (!Ext.isArray(urls)) {
        urls = [urls];
    }
    var hash;
    
    if (!executeOnce || !(OSDN.Loader.RunnedFunctions[hash = OSDN.md5(f.toString())])) {
        
        if (executeOnce) {
             OSDN.Loader.RunnedFunctions[hash] = true;
        }
    
        var loader = function (urls, f) {

            var timeout = 500;
            var ff = function(records, options) {
                if (Ext.isIE || Ext.isOpera || Ext.isSafari) {
                    eval(records.responseText);
                } else {
                    var h = document.getElementsByTagName("head")[0];
                    var sc = document.createElement('script');
                    sc.type = 'text/javascript';
                    sc.innerHTML = records.responseText;
                    h.appendChild(sc);
                }
                loader(urls, f); 
            };
            
            if (!Ext.isArray(urls)) {
                urls = [urls];
            }
            
            url = urls.pop();
            
            if ("undefined" == typeof url) {
                if (f instanceof Function) {
                    f.defer(timeout);
                }
                (function(){
                    Ext.getBody().unmask();
                }).defer(500);
            } else {
                if (!OSDN.Loader.LoadedScripts[url]) {
                    OSDN.Loader.LoadedScripts[url] = true;
					Ext.Ajax.request({
                        url: url,
                        disableCaching: true,
                        method: 'GET',
                        success: ff,
                        failure: function() {
							Ext.getBody().unmask();
							OSDN.Msg.error('Destination source is not loaded.');
						}
                    });
                } else {
                    loader(urls, f);
                }
            }
        };
        
        var findUrls = function(urls) {
            
            var newUrls = [];
            
            for (var i = 0; i < urls.length; i++) {
                if (OSDN.Loader.FileConnections[urls[i]]) {
                    newUrls = newUrls.concat(findUrls(OSDN.Loader.FileConnections[urls[i]]));
                }
                
                if (!OSDN.Loader.LoadedScripts[urls[i]]) {
                    newUrls.push(urls[i]);
                } 
            }
            return newUrls;
        };
        loader(findUrls(urls).reverse(), f);
    }
};
load = OSDN.Loader.LoadScript;