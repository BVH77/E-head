/**
 * Enable tabs to be positioned on the left side of a TabPanel. In order to make as few changes as possible, we reuse
 * the header element and place it on the left side
 * 
 * @constructor
 * @param {Object} cfg A config object
 *  @cfg {String} tabPosition 'top' (the ext default behaviour), 'bottom' (also ext default), 'left' (vertical tabs on the left side) or right (vertical tabs on the right side)
 *  @cfg {Number} tabWidth (only applies if verticalTabs is set to true)
 *  @cfg {String} textAlign 'left' or 'right', deafults to 'left' (only applies if verticalTabs is set to true)
 */

OSDN.TabPanel = Ext.extend(Ext.TabPanel, {

    tabWidth: 150,
    
    initComponent: function() {
        
        if (this.tabPosition == 'left' || this.tabPosition == 'right') {
            this.cls = this.cls || '';
            this.cls = 'x-osdn-tabpanel-vertical ' + this.cls;
            if (this.textAlign && this.textAlign == 'right') {
                this.cls = 'alignRight ' + this.cls;
            }
            
            this.cls = (this.tabPosition == 'left' ? 'leftTabs ' : 'rightTabs ') + this.cls;
            this.intendedTabPosition = this.tabPosition;
            this.verticalTabs = true;
            this.tabPosition = 'top';
        }
        
        OSDN.TabPanel.superclass.initComponent.apply(this, arguments);
    },
    
    afterRender: function(){
    
        OSDN.TabPanel.superclass.afterRender.call(this);

        if (this.verticalTabs) {
            this.header.setWidth(this.tabWidth);
            this.header.setHeight(this.height || this.container.getHeight());
        }
    },
    
    /**
     * Adjust header and footer size.
     * @param {Number} w width of the container
     * @return {Number} the body will be resized to this width
     */
    adjustBodyWidth: function(w){
    
        if (this.verticalTabs) {
            if (Ext.isIE6) {
            
                //I got the value "3" through trial and error; it seems to be related with the x-panel-header border; if the border
                //is set to "none", then this substraction is not necessary - but it does not seem related to the border width, margin or padding of any
                //of the panels so I dont know how to calculate it; please let me know if you have any idea what's going on here
                
                this.bwrap.setWidth(w - 3);
            }
            return w;
        } else {
            return OSDN.TabPanel.superclass.adjustBodyWidth.call(this, w);
        }
    },
    
    /**
     * Get the new body height and adjust the height of the tab strip if it is vertical.
     * @param h {Number}
     */
    adjustBodyHeight: function(h){
    
        if (this.verticalTabs) {
            this.header.setHeight(h + (this.tbar ? this.tbar.getHeight() : 0));
        }
        
        return OSDN.TabPanel.superclass.adjustBodyHeight.call(this, h);
    },
    
    /**
     * If the tab strip is vertical, we need to substract the "header" width.
     * @return {Number} The frame width
     */
    getFrameWidth: function(){
        return OSDN.TabPanel.superclass.getFrameWidth.call(this) + this.verticalTabs ? this.tabWidth : 0;
    },
    
    /**
     * If the tab strip is vertical, we don't need to substract it's height
     * @return {Number} The frame height
     */
    getFrameHeight: function(){
        return OSDN.TabPanel.superclass.getFrameHeight.call(this) - (this.verticalTabs ? this.header.getHeight() : 0);
    }
});

Ext.reg('osdn.tabpanel', OSDN.TabPanel);
