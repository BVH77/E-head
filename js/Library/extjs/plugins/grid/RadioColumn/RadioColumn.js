Ext.grid.RadioColumn = function(config){
    Ext.apply(this, config);
    if(!this.id){
        this.id = Ext.id();
    }
    this.renderer = this.renderer.createDelegate(this);
};

Ext.grid.RadioColumn.prototype = {
	
	/**
	 * Set type radio activity
	 * Allowed types are:
	 *     1. vertical
	 *     2. horizontal
	 *     
	 * @param {string} type
	 */
    type: 'horizontal',
	
    qtip: '',
    
    init : function(grid){
        this.grid = grid;
        this.grid.on('render', function(){
            var view = this.grid.getView();
            view.mainBody.on('mousedown', this.onMouseDown, this);
        }, this);
    },

    onMouseDown : function(e, t) {
		var allowed = t.className && t.className.indexOf('x-grid3-cc-' + this.id) != -1;
        if(!allowed) {
			return;
	    }
        
        if (-1 != t.className.indexOf('-disabled')) {
            return false;
        }
        
		e.stopEvent();
		var g = this.grid;
        var index = g.getView().findRowIndex(t);
        var record = g.getStore().getAt(index);
		
		var row             = g.getView().findRowIndex(t);
        var col             = g.getView().findCellIndex(t);
        var field           = g.getColumnModel().getDataIndex(col);
        var originalValue   = +(record.get(this.dataIndex) == true);
        var value           = +(!originalValue);

        
        switch (this.type) {
			case 'vertical':
		    
			    if (originalValue) {
		            return;
		        }          
				
				var modifiedRecord = null;
				g.getStore().each(function(r) {
                    if (0 != r.get(this.dataIndex)) {
                        r.set(this.dataIndex, 0);
						modifiedRecord = r;
						return false;
	                }
	            }, this);
				record.set(this.dataIndex, this.inputValue);
				              
				if (null != modifiedRecord) {
					var len = g.getStore().getModifiedRecords().length;
					g.getStore().on("update", function(store, r, operation) {
						if (r.id == record.id && !record.isModified()) {
							modifiedRecord.commit();
						}
	                }, this, {
						single: true
					});
				}

			case 'horizontal':
			default:
			    record.set(this.dataIndex, this.inputValue);
		}
		
        var xe = {
            grid: g,
            record: record,
            field: field,
            value: this.inputValue,
            originalValue: originalValue,
            row: row,
            column: col
        };
		
        g.fireEvent('afteredit', xe, g);
    },

    renderer : function(v, p, record){
		if (typeof v == 'boolean') {
            v = parseInt(v, 10);
        }
        p.css += ' x-grid3-radio-col-td';
        
        var dom = ['<div '];
        if (this.qtip) {
            dom.push('qtip="' + this.qtip + '"');
        }
        dom.push('class="x-grid3-radio-col');
        if (v == this.inputValue) {
            dom.push('-on');
        }
        dom.push(' x-grid3-cc-' + this.id);
        
        if (true === this.disabled.apply(this, arguments)) {
            dom.push(' x-item-disabled');
        }
        
        dom.push('"></div>');
        return dom.join('');
    },
    
    /**
     * @see renderer arguments
     */
    disabled: function() {
        return false;
    }
};
