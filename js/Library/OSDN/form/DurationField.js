OSDN.form.DurationField = Ext.extend(Ext.form.Field, {

	maskRe: /^[\d:]$/,
	
    regex: /^[\d]{0,}:[0-5]\d$/,
    
    regexText: lang('Required format') + ': H:m',
    
    allowBlank: true,
	
    hiddenName: null,
    
    setValue: function(value) {
        var outval = OSDN.util.Format.minutesToTimeRenderer(value);
        OSDN.form.DurationField.superclass.setValue.call(this, outval);
        this.updateHidden();
    },
    
    updateHidden: function() {
        if (this.hiddenField) {
            var v = String(this.getValue()).split(':');
            this.hiddenField.value = parseInt(v[0])*60 + parseInt(v[1]);
        }
    },
    
    onRender: function() {
        OSDN.form.DurationField.superclass.onRender.apply(this, arguments);
        
        if(this.hiddenName) {
            this.hiddenField = this.el.insertSibling({
                tag: 'input', 
                type: 'hidden', 
                name: this.hiddenName, 
                id: this.hiddenId || this.hiddenName
            }, 'before', true);
            
            this.updateHidden();
            this.el.dom.removeAttribute('name');
        }
    },
    
    onBlur: function() {
        OSDN.form.DurationField.superclass.onBlur.call(this, arguments);
        var val = this.getValue();
        if (val.indexOf(':') < 0) {
        	this.setRawValue(val + ':00');
        }
        this.updateHidden();
    }
    
});

Ext.reg('osdn.form.durationfield', OSDN.form.DurationField);