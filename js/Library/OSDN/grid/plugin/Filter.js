Ext.ns('OSDN.grid.plugin');

OSDN.grid.plugin.Filter = Ext.extend(Ext.grid.GridFilters, {
    
    searchable: false,
    
    searchField: null,
    
    isSearchable: function() {
        return this.searchable && String(this.getSearchField().getValue()).length > 0;
    },
    
    init: function(g) {
        
        OSDN.grid.plugin.Filter.superclass.init.apply(this, arguments);
        
        if (this.searchable && g instanceof Ext.grid.GridPanel) {
             g.getColumnModel().on('hiddenchange', function(cm, colIndex, hidden) {
                this.reload();
            }, this);
        }
    },
    
    getFilterData: function() {
        
        var filters = [];
        var searchable = this.isSearchable();
        var searchableCollection = [];
        
        this.filters.each(function(f) {
            
            if (OSDN.empty(f.getValue())) {
                f.active = false;
            }
            
            if (f.active) {
                var d = [].concat(f.serialize(this));
                for (var i = 0, len = d.length; i < len; i++) {
                    filters.push({
                        field: f.dataIndex,
                        data: d[i]
                    });
                }
            }
            
            if (searchable) {
                switch (f.type) {
                    case 'string':
                    case 'date':
                    case 'numeric':
                        if (false !== f.searchable) {
                            var cm = this.grid.getColumnModel();
                            var colIndex = cm.findColumnIndex(f.dataIndex);
                            if (-1 != colIndex && !cm.isHidden(colIndex)) {
                                searchableCollection.push(f.dataIndex);
                                f.active = true;
                            }
                        }
                }
            }
        }, this);
        
        if (searchable && searchableCollection.length > 0) {
            filters.push({
                field: searchableCollection.join(','),
                data: {
                    type: 'search',
                    value: this.getSearchField().getValue(),
                    field: ''
                }
            });
        }
        
        return filters;
    },
    
    /**
	 * Method factory that generates a record validator for the filters
	 * active at the time of invokation.
	 * 
	 * @private
	 * // FIXME
	 */
//	getRecordFilter : function() {
//    	
//    	var f = this.getFilterData();
//    	
//    	return function(record) {
//    		
//    		for (var i = 0; i < f.length; i++) {
//    			
//    			switch(f[i].data.type) {
//					case 'search':
//						var fields = f[i].field.split(/\s?,\s?/g);
//						
//						var results = [];
//						for(var i = 0; i < fields.length; i++) {
//							var val = record.get(fields[i]);
//							
//							if(typeof val != "string") {
//								results.push(f[i].data.value.length == 0);
//								continue;
//							}
//							
//							results.push(val.toLowerCase().indexOf(f[i].data.value.toLowerCase()) > -1);
//						}
//						
//						return results.indexOf(true) != -1; 
//						break;
//					
//					default:
//						
//						var val = record.get(f[i].field);
//						if(typeof val != "string") {
//							return f[i].data.value.length == 0;
//						}
//						
//						return val.toLowerCase().indexOf(f[i].data.value.toLowerCase()) > -1;
//						break;
//				}
//    		}
//    	}
//    	
//    	return true;
//	},
    
    getSearchField: function(config) {
        if (!this.searchField) {
            this.searchable = true;
            this.searchField = new OSDN.form.SearchField({
                width: 250,
                enableKeyEvents: true
            });
            if (config) {
                Ext.apply(this.searchField, config);
            }
            
            var f = function() {
                if (this.searchField.getValue().length > 0) {
                    this.searchField.showClearBtn();
                } else {
                    this.searchField.hideClearBtn();
                }
                
                this.reload();
                updateTask.cancel();
            };
            var updateTask = new Ext.util.DelayedTask(f, this);
            
            this.searchField.on({
                keyup: function(event) {
                    updateTask.delay(this.updateBuffer);
                },
                click: f,
                clear: function() {
                    this.reload();
                },
                scope: this
            });
        }
        
        return this.searchField;
    }
});