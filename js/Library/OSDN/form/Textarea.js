Ext.ns('OSDN.form');

OSDN.form.TextArea = Ext.extend(Ext.form.TextArea, {
    
	enableKeyEvents: true,
	
    /**
     * Numeric rows
     * 
     * @param {Boolean}
     */
    enumerable: false,
    
    /**
     * Left offset in enumerable field
     * 
     * @param {Number} 
     */
    enumOffset: 37,
    
    /**
     * Total numbers
     * 
     * @param {Number}
     */
    enumCount: 1000,
    
    /**
     * Border visibility
     * 
     * @param {Boolean}
     */
    border: true,
    
    onRender: function(ct, position) {
        
        this.cls = 'x-osdn-form-textarea';
        if (true === this.enumerable) {
            this.cls += '-enumerable';
        }
        
        if (false == this.border) {
            this.cls += ' x-osdn-form-textarea-noborder';
        }
        
        OSDN.form.TextArea.superclass.onRender.apply(this, arguments);
        
        if (true === this.enumerable) {
            
            var a = [];
            for (var i = 1; i < this.enumCount; i++) {
                a.push(i);
            }
            
            
            var cls = 'x-form-textarea x-form-field x-osdn-form-textarea-enum';
            if (false == this.border) {
                cls += '-noborder';
            }
            
            var enumf = ct.createChild({
                tag: 'textarea',
                cls: cls,
                autocomplete: "off",
                html: a.join("\n")
            });
            
            var el = this.getEl().dom;
            var f = function() {
                var el = enumf.dom;
                var ta = this.getEl().dom;
                
                el.scrollTop   = ta.scrollTop;
                el.style.top   = ta.offsetTop + 'px';
                el.style.left  = (ta.offsetLeft - this.enumOffset) + "px";
                
                var h = this.getSize()['height'];
                if (h > 6) {
                    h -= 6;
                    if (false == this.border) {
                        h += 2;
                    }
                    enumf.setHeight(h + 'px');
                }
            }.createDelegate(this);
            
            el.onkeydown = f;
            el.onmousedown = f;
            el.onblur = f;
            el.onfocus = f;
            el.mouseover = f;
            el.mouseup = f;
            el.onscroll = f;
            this.on('resize', f, this);
        }
    },
    
    insertAtPosition: function(text, restorePosition) {
        
    	if (restorePosition) {
    		var pos = this.getCaretPosition();
            var scroll = this.getEl().getScroll();
    	}
        var t = this.getEl().dom;
        if (Ext.isIE) {      // IE
            this.focus();
            var sel = document.selection.createRange();
            sel.text = text;
        } else {
            if (t.selectionStart || t.selectionStart == '0') {      // Mozilla|Netscape
                var startPos = t.selectionStart;
                var endPos = t.selectionEnd;
                t.value = 
                    t.value.substring(0, startPos) +
                    text +
                    t.value.substring(endPos, t.value.length);
            } else {
                t.value += text;
            }
        }
        if (restorePosition) {
        	this.setCaretPosition(pos);
            this.getEl().scrollTo('left', scroll.left);
            this.getEl().scrollTo('top', scroll.top);
        }
    },
	
	getCaretPosition: function() {
		var pos = 0;
		var el = this.getEl();
		do {
		    if (Ext.isIE) {
				var sel = document.selection.createRange();
				var clone = sel.duplicate();
				sel.collapse(true);
				clone.moveToElementText(el.dom);
				clone.setEndPoint('EndToEnd', sel);
				pos = clone.text.length;
				break;
			}	
			
			pos = el.dom.selectionStart;
			
		} while (false);
		return pos;
	},
	
	setCaretPosition: function(pos) {
		pos = parseInt(pos, 10);
		if (isNaN(pos)) {
			pos = 0;
		}
		
		this.selectText(pos, pos);
		return this;
	},
	
	initEvents: function() {
        
		OSDN.form.TextArea.superclass.initEvents.apply(this, arguments);
		
		var e = new Ext.KeyMap(this.getEl(), [{
            key: 's',
            ctrl: true,
            handler: function(k, e) {
				switch(k) {
					case 83:
					   this.fireEvent('save', this);
					   break;
				}
	        },
	        stopEvent: true,
			scope: this
        }, {
			key: "\t",
			handler: function(k, e) {
				var scroll = this.getEl().getScroll();
				var pos = this.getCaretPosition();
				this.insertAtPosition("\t");
				this.setCaretPosition(pos + "\t".length);
				this.getEl().scrollTo('left', scroll.left);
				this.getEl().scrollTo('top', scroll.top);
			},
			stopEvent: true,
			scope: this
		}]);
	},
    
    setSize: function(w, h) {
        if (true === this.enumerable && w) {
            if (typeof w == 'object') {
                w.width -= this.enumOffset; // -2
            } else {
                w -= this.enumOffset; // -2
            }
        }
        
        OSDN.form.TextArea.superclass.setSize.apply(this, [w, h]);
    }
});

Ext.reg('osdn.form.textarea', OSDN.form.TextArea);