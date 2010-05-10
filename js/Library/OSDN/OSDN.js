Ext.ns('OSDN');

Ext.apply(OSDN, function() {

    /**
     * Event manager
     * @param {Ext.util.Event}
     */    
    var event = new Ext.util.Event();
    
    var regDecode = /^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/;
    
    /**
     * Event listeners collection
     * @param {Array}
     */
    var eventListeners = [];

    var link = function(module, controller, action, params, router, absolute) {
        if (true === /\.js$/.test(module)) {
            return module;
        }
        
        var p = [];
        for (k in params) {
            p.push(k);
            p.push(params[k]);
        }
        
        var type = 'json';
        var link = [];
        if (router != 'html') {
            link.push(type);
        }
        
        link = link.concat([module, controller, action]).concat(p).join('/');
        if (!/\/$/.test(link)) {
            link += '/';
        }
        
        return link;
    };
    
    return {
        
        /**
         * Add callback functions in stack and call all it after
         * OSDN.applicationInitialization
         * 
         * @param {Function} f        The callback function
         * @param {Int} index         The index of execution  OPTIONAL
         * @return void
         */
        onReady: function(f, index) {
            if (!index) {
                var index = 1;
                for(var i = 0; i < eventListeners.length; i++) {
                    if (a[i][0] > max) {
                        max = eventListeners[i][0];
                    }
                }                
            }
            eventListeners.push([index, f]);
        },
        
        /**
         * Execute all callbacks and also start the dispatch of application
         * 
         * @return void
         */
        applicationInitialization: function() {
            
            if (arguments.length > 0 && 'function' == Ext.type(arguments[0])) {
                this.onReady(arguments[0], arguments[1] || 1);
            }
            
            eventListeners.sort(function(a, b) {
                a = parseInt(a, 10);
                b = parseInt(b, 10);
                
                if (a > b) return 1;
                if (a < b) return -1;
                return 0;
            });    
        
            Ext.each(eventListeners, function(i) {
                event.addListener(i[1]);
            });
            
            Ext.onReady(function() {
                event.fire();
            });
        },
        
        /**
         * Decode json string
         * And catch exceptions when decoding process failed.
         * 
         * @param {Object} value
         * @return string|false
         */
        decode: function(value) {
            try {
                return regDecode.test(value) && eval('(' + value + ')');
            } catch (e) {
                if (true !== OSDN.DEBUG) {
                    return false;
                }
                if (Ext.isGecko) {
                    if (window.console && 'function' == typeof console.log) {
                        console.log(value);
                    }
                } else {
                    alert("Error in json decode!\n" + value);
                }
                
                return false;
            }
        },
        
        /**
         * Clone object
         * @param {Object}
         * 
         * @return {Object} The cloned object
         */
        clone: function(o) {
            if(!o || 'object' !== typeof o) {
                return o;
            }
            var c = 'function' === typeof o.pop ? [] : {};
            var p, v;
            for(p in o) {
                if(o.hasOwnProperty(p)) {
                    v = o[p];
                    if(v && 'object' === typeof v) {
                        c[p] = OSDN.clone(v);
                    } else {
                        c[p] = v;
                    }
                }
            }
            return c;
        },
        
        /**
         * Check if variable is empty
         * @param {mixed} v
         * @return {Boolean}
         */
        empty: function(v) {
            var e = v === "" || 
                    v === 0  || 
                    v === "0" || 
                    v === null || 
                    v === false ||
                    v === undefined ||  
                    (Ext.isArray(v) && v.length === 0);
                
            if ('object' == Ext.type(v)) {
                e = true;
                for(var i in v) {
                    e = false;
                    break;
                }
            }
            return e;
        },
        
        link: link,
        
        alink: function(module, controller, action, params, router) {
            return OSDN.link(module, controller, action, params, router, true);
        }
    }
}());