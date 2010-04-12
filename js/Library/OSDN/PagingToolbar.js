OSDN.PagingToolbar = Ext.extend(Ext.PagingToolbar, {

    displayInfo: true,
    
    pageSize: 30,
    
    plugins: [],
    
    variations: null,
    
    ps: null,
    
    psConfig: {},
    
    variations: null,
    
    forceLoad: true,
    
    initComponent: function() {
        
        if (false !== this.ps) {
            var o = Ext.applyIf(this.psConfig || {}, {
                stateId: this.stateId,
                pagingToolbar: this
            });
            
            if (this.variations) {
                o.variations = this.variations;
            }
            if (this.forceLoad != undefined) {
                o.forceLoad = this.forceLoad;
            }
            
            if (!Ext.isArray(this.plugins)) {
                this.plugins = [this.plugins];
            }
            
            this.ps = new Ext.ux.Andrie.pPageSize(o);
            this.plugins = this.plugins.concat(this.ps);
        }
        
        OSDN.PagingToolbar.superclass.initComponent.apply(this, arguments);
        
    },
    
    beforeLoad: function(store, options) {
        OSDN.PagingToolbar.superclass.beforeLoad.call(this);
        options.params = options.params || {};
        Ext.applyIf(options.params, {
            start: 0,
            limit: this.pageSize
        });
        return true;
    },
	
	/**
     * Change the active page
     * @param {Integer} page The page to display
     */
    changePage: function(page, refreshOnly){
		
		if (true === refreshOnly) {
		    var page = ((page-1) * this.pageSize).constrain(0, this.store.getTotalCount());
			var ps = {};
			ps[this.paramNames.start] = page;
            this.refreshOptions(ps);			
		} else {
		    OSDN.PagingToolbar.superclass.changePage.apply(this, arguments);	
		}
    },
	
	/**
	 * Refresh paging options
	 * 
	 * @param {Object} o
	 * @return {OSDN.PagingToolbar}
	 */
	refreshOptions: function(o) {
		var args = [this.getStore(), [], {params: o}];
        this.onLoad.apply(this, args);
		return this;  
	},
	
	//private
	/*updateInfo : function(){
        if(this.displayEl){
			var totalCount = this.store.getTotalCount();
			
			var count = this.store.getCount();
			if (this.ps ) {
				var d = this.getPageData();
				var ap = d.activePage;
				
				console.log(ap, d);
				//var ps = this.pageSize;
				//count = (ap * ps - ps).constrain(0, totalCount);
			}
			
			console.log(this.cursor, count);
            var msg = count == 0 ?
                this.emptyMsg :
                String.format(
                    this.displayMsg,
                    this.cursor+1, this.cursor+count, totalCount 
                );
            this.displayEl.update(msg);
        }
    },*/
	
	/**
	 * Retrieve store
	 * 
	 * @return {Ext.data.Store}
	 */
	getStore: function() {
		return this.store;
	}
});