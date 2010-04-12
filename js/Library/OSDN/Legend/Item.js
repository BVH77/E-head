Ext.ns('OSDN.Legend');

OSDN.Legend.Item = Ext.extend(Ext.BoxComponent, {

    /**
     * Legend color item
     * 
     * @param {String}
     */
    color: 'transparent',
    
    /**
     * Legend text label
     * 
     * @param {String}
     */
    text: 'Legend text',
    
    /**
     * Qtip text
     *
     * @param {String} 
     */
    qtip: '',
    
    cls: '',
    
	onRender: function(ct, position){
    	
    	var rectangle = {
            tag: 'div', 
            'class': 'rectangle', 
            html: '&#160;'
        };
        
        if (this.color) {
            rectangle.style = 'background-color: ' + this.color;
        }
        
        if (this.cls) {
            rectangle['class'] = this.cls;
        }
    	
    	this.el = ct.createChild({
    	    tag: 'ul',
    	    id: this.getId(),
            cls: 'x-osdn-legend',
            children: [
                {tag: 'li', children: [rectangle]},
                {tag: 'li', 'class': "text", html: this.text, 'ext:qtip': this.qtip || ""}
            ]
        }, position);
    	
    	OSDN.Legend.Item.superclass.onRender.apply(this, arguments); 
	}
});

Ext.reg('osdn.legend.item', OSDN.Legend.Item);