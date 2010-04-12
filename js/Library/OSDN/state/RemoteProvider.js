Ext.ns('OSDN.state');

/**
 * @class OSDN.state.RemoteProvider
 * @extends Ext.state.Provider
 * The default Provider implementation which saves state via cookies.
 * <br />Usage:
 <pre><code>
   var rp = new OSDN.state.RemoteProvider({
       savePath: "/json/default/state/save",
   });
   Ext.state.Manager.setProvider(rp);
 </code></pre>
 * @cfg {String} savePath - URL to save state  
 * @cfg {int} interval - interval between states save in milliseconds  
 * @constructor Create a new RemoteProvider
 * @param {Object} config The configuration object
 * @version $Id: RemoteProvider.js 6672 2009-02-09 12:19:33Z bvh $
 */
OSDN.state.RemoteProvider = function(config) {
    OSDN.state.RemoteProvider.superclass.constructor.call(this);
    Ext.apply(this, config);
    this.state = OSDN.States || [];
    Ext.TaskMgr.start({
    	run: this.saveState,
    	interval: this.interval,
    	scope: this
    });
};

Ext.extend(OSDN.state.RemoteProvider, Ext.state.Provider, {
	
	savePath: null,
	
	interval: 1000 * 60, // 1 minute 
	
	//private
    changed: false,
	
    isEmpty: function() {
        return OSDN.empty(this.state);
    },
    
    reset: function() {
    	this.state = {};
    	this.changed = true;
    	this.saveState();
    },
    
    set: function(name, value) {
        OSDN.state.RemoteProvider.superclass.set.call(this, name, value);
        this.changed = true;
    },
    
    saveState: function(callback) {
    	if (this.changed) {
    		var out = {};
    		for (var i in this.state) {
    			if ('function' != Ext.type(this.state[i])) {
                    out[i] = this.state[i];
    			}
    		}
        	Ext.Ajax.request({
        	    url: this.savePath,
        	    params: {data: Ext.encode(out)},
        	    callback: ('function' == typeof callback) ? callback : Ext.emptyFn,
        	    scope: this
        	});
        	this.changed = false;
    	} else {
    	   ('function' == typeof callback) ? callback() : Ext.emptyFn() ;
    	}
    }
});