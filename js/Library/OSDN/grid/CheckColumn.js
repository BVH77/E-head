Ext.ns('OSDN.grid');

OSDN.grid.CheckColumn = Ext.extend(Ext.grid.CheckColumn, {

    menuDisabled: true,
    
    width: 60,
    
    fixed: true,
    
    header: '&nbsp;',
    
    renderer: function(v, metadata, record, rowIndex, colIndex, store) {
        
        switch (Ext.type(v)) {
            case 'object':
            case 'array':
                
                break;
            
            default:
                var v = parseInt(v, 10);
                arguments[0] = !isNaN(v) && 1 == v;
        }
        
        var o = {
            cc: this,
            grid: this.grid,
            colorCls: null,
            color: null,    
            qtip: null,
            checked: false,

            setColorCls: function(cls) {
                this.colorCls = cls;
                return this;
            },
            
            setColor: function(c) {
                this.color = c;
                return this;
            },
            
            setQtip: function(qtip) {
                this.qtip = qtip;
                return this;
            },
            
            setChecked: function(checked) {
                this.checked = checked === true;
                return this;
            },
            
            setDisabled: function(disabled) {
                this.disabled = disabled === true;
                return this;
            }
        };
        o.setChecked(v);
        
        this.compose.apply(o, arguments);
        
        if (o.colorCls) {
            metadata.css += ' ' + o.colorCls;
        }
        
        if (o.color) {
            metadata.attr += String.format('style:"{0}"', o.color);
        }
        metadata.css += ' x-grid3-check-col-td';
        
        var h = ['<div'];
        if (o.qtip) {
            h.push(String.format('qtip="{0}"', o.qtip));
        }
        
        var cls = [];
        if (this.disabled || o.disabled || -1 == v) {
            cls.push(this.disabledCls);
            metadata.css += ' grid-check-column-disabled';
        }
        
        cls.push('x-grid3-check-col' + (o.checked ? '-on' : ''));
        cls.push('x-grid3-cc-' + this.id);
        h.push(String.format('class="{0}"', cls.join(' ')));
        return h.join(' ');
    },
    
    // override this function for custom functionality
    compose: function(v, metadata, record, rowIndex, colIndex, store) 
    {}
});