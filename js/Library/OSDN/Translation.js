/**
 * Simple translator
 * 
 * @version $Id: Translation.js 5627 2008-11-27 11:11:33Z flash $
 */
Ext.ns('OSDN');

OSDN.Translation = function(config) {
	Ext.apply(this, config || {});
	OSDN.Translation.superclass.constructor.call(this);
};

Ext.extend(OSDN.Translation, Ext.util.Observable, {
	
	storage: {},
	
	locale: 'en',
	
	add: function(alias) {
        this.storage[alias] = '';
		Ext.Ajax.request({
			url: link('default', 'index', 'add-new-translation'),
			params: {
				locale: this.locale,
				alias: alias
			},
			success: function(response) {
                var res = OSDN.decode(response.responseText);
                if (true === res.success) {
                	if (res.translation) {
                		this.storage[alias] = res.translation;
                	}
                    return;
                }
                //OSDN.Msg.error('Loading translation failed.');
            },
            failure: function() {
                //OSDN.Msg.error('Loading translation failed.');
            },
            scope: this
		});
	},
	
	translate: function(alias) {
        return alias;
        if ('string' !== typeof alias) {
            return '';
        }
        
        if (0 == alias.length) {
            return alias;
        }
        
        if (alias.length > 255) {
            alias = alias.substr(0, 255);
        }
		
        alias = alias.replace(/([^>]?)\n/g, '$1'+ '<br />').replace(/\r|\n/, '');
        
        if (undefined != this.storage[alias]) {
			var translation = this.storage[alias] || ('_' + alias)
		} else {
			var translation = '_' + alias;
			this.add(alias);
		}
		
		for (var i = 1; i < arguments.length; i++) {
	        translation = translation.replace(new RegExp("\{(" + (i - 1) + ")\}"), arguments[i]);
	    }
	    return translation;
	},
    
    parse: function(translations) {
        Ext.apply(this.storage, translations || {});
        return this;
    } 
});

Ext.reg('osdn.translation', OSDN.Translation);
