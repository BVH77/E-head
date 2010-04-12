Ext.ns('OSDN.grid');

OSDN.grid.Viewer = Ext.extend(Ext.Panel, {
    
    properties: {},
    
    autoScroll: true,
    
    /**
     * Set width for property
     * Apply directly to style
     * 
     * @param mixed
     */
    propertyWidth: '80px',
    
    traslateProperties: true,
    
    wrap: true,
    
    initComponent: function() {
        this.refresh();
        OSDN.grid.Viewer.superclass.initComponent.apply(this, arguments);
    },
    
    propertyRenderer: function (i, v) {
    	if (!i) {
    		return '';
    	}
    	return this.traslateProperties? lang(i): i;
    },
    
    valueRenderer: function (i, v) {
    	if (!v) {
    		return '';
    	}
        return this.wrap? '<pre>' + v + '</pre>': v;
    },
    
    setProperies: function(properties) {
        if ('object' != Ext.type(properties)) {
            throw 'Only object is allowed';
        }
        
        this.properties = properties;
        this.refresh();
        return this;
    },
    
    refresh: function() {
        var props = [];
        for(var i in this.properties) {
            var style = "";
            if (this.propertyWidth) {
                style += 'width: ' + this.propertyWidth;
            }
            props.push([
                '<tr class="x-grid3-hd-row x-grid3-row">',
                    '<td class="x-osdn-grid-viewer-property x-grid3-cell-inner" style="', style, '">', 
                        this.propertyRenderer(i, this.properties[i]) ,
                    '</td>',
                    '<td class="x-grid3-cell-inner">', 
                        this.valueRenderer(i, this.properties[i]), 
                    '</td>',
                '</tr>'
            ].join(''));
        }
        
        var html = "";
        if (0 != props.length) {
            html = '<table class="x-osdn-grid-viewer">' + props.join('') + '</table>';
        }
        this.setRawBody(html);
        return this; 
    },
    
    setRawBody: function(text) {
        if (this.rendered) {
        	Ext.getDom(this.body).innerHTML = text;
        } else {
            this.html = text;
        }
        return this;
    },
    
    clear: function() {
        if (this.rendered) {
        	Ext.getDom(this.body).innerHTML = '';
        } else {
            this.html = "";
        }
        
        return this;
    }
});

Ext.reg('osdn.grid.viewer', OSDN.grid.Viewer);
