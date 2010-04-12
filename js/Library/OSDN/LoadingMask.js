if (typeof OSDN == 'undefined') {
    OSDN = {};
} 


/**
 * Simple loading mask
 * Display modal window on top
 * This function is singleton
 * You can't create this directly
 * Simple examle:
 * <code>
 * OSDN.LoadingMask
 * </code>
 */
OSDN.LoadingMask = function() {
    
    // signalize that loading mask container is already rendered
    var rendered = false;
    
    // loading mask container
    var container = null;
    
    // msg container
    var msg = null;
    
    // get document.body
    var body = document.getElementsByTagName('BODY')[0];

    // initialization of container
    if (false == rendered) {
    
        container = document.createElement('DIV');
        container.id = '-loading-mask';
        
        var loading = document.createElement('DIV');
        loading.id = 'osdn-loading';
        
        var indicator = document.createElement('DIV');
        indicator.className = 'osdn-loading-indicator';
        
        var text = document.createElement('DIV');
        text.className = 'osdn-loading-indicator-text';
        text.innerHTML = 'Загрузка...';
        
        msg = document.createElement('DIV');
        msg.id = 'osdn-msg';
        msg.className = 'osdn-loading-indicator-text-detail';
        
        // create container add add additional subcontainers        
        indicator.appendChild(text);
        indicator.appendChild(msg);
        loading.appendChild(indicator);
        container.appendChild(loading);
        container.style.display = 'none';
        body.appendChild(container);
        rendered = true;
    }
    
    return {
        
        // show mask at specified position 
        showAt: function(text, topOffset, leftOffset) {
        	if (topOffset) {
        	   loading.style.top = topOffset;
        	}
        	if (leftOffset) {
        	   loading.style.left = leftOffset;
        	}
            this.show(text);
        },
        
        // show mask
        show: function(text) {
            container.style.display = 'block';
            this.msg(text);
        },
        
        // hide mask
        hide: function() {
            container.style.display = 'none';
        },
        
        // set msg
        msg: function(text) {
            msg.innerHTML = text || '';
        },
        
        // destroy mask
        destroy: function () {
            if (rendered) {
                body.removeChild(container);
                rendered = false;
            }            
        }
    };
    
}();
