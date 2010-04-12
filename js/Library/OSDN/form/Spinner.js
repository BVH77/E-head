OSDN.form.Spinner = Ext.extend(Ext.ux.form.Spinner, {

    initComponent: function() {
        OSDN.form.Spinner.superclass.initComponent.apply(this, arguments);
        this.on('spin', function() {
            this._validate();
        }, this);
    },
     
    onBlur: function() {
        this._validate();
        var v = this.getValue();
        if(String(v) !== String(this.startValue)) {
            this.fireEvent('change', this, v, this.startValue);
            
            if (this.hiddenField) {
                this.setValue(v);
            }
        }
    },
    
    setValue: function(v) {
    
        if (null === v) {
            v = '';
        }
        
        if ('object' == typeof this.strategy) {
            switch (this.strategy.type) {
                case 'money':
                    
                    this.value = v;
                    if (this.rendered) {
                        var v = parseFloat(v);

                        var b = isNaN(v) ||
                            (this.strategy.minValue !== null && v < this.strategy.minValue) ||
                            (this.strategy.maxValue !== null && v > this.strategy.maxValue)
                            || v === null || v === undefined;
                        
                        var rawValue = '';
                        if (!b) {
                            rawValue = this.strategy._format(v);
                        }
                    
                        this.setRawValue(rawValue);
                    }
                    
                default:
            }
            
            this.updateHidden();
            
        } else {
            Ext.ux.form.Spinner.superclass.setValue.apply(this, arguments);
        }
        
        this._validate();
    },
    
    // private
    _validate: function() {
        if (this.validateOnBlur) {
            if (false === this.validate()) {
                this.markInvalid();
            } else {
                this.clearInvalid();
            }    
        }
    }
});

Ext.reg('osdnspinner', OSDN.form.Spinner);