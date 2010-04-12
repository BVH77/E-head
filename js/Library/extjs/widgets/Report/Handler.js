Ext.ns('OSDN.Report');

OSDN.Report.Handler = function(config) {
    
    Ext.apply(this, config || {});
    
    this.run();
};

OSDN.Report.Handler.prototype = {
    
    module: null,
    
    controller: null,
    
    report: null,
  
    params: null,
     
    allowedFormats: {},
    
    run: function() {
        
        Ext.Ajax.request({
            url: link(this.module, this.controller, 'save'),
            params: this.params,
            method: 'POST',
            callback: function(options, success, response) {
                var res = OSDN.decode(response.responseText);
                if (true != success || true != res.success) {
                    OSDN.Msg.error('Report generation failed.');
                    return;
                }
                 
                var w = new OSDN.Report.Window(Ext.apply({
                    module: this.module,
                    controller: this.controller,
                    action: this.report,
                    params: {
                        uniq: res.uniq
                    }
                }, this.allowedFormats || {}));
                w.show();
            },
            scope: this
        });
    }
};