/**
 * @class OSDN.form.TimeDiapason
 * @extends Ext.form.Field
 * This class creates a time field using spinners.
 * @license: BSD
 * @author: Vasya D. (extjs id: vvvasya)
 * @constructor
 * Creates a new FieldPanel
 * @param {Object} config Configuration options
 */
Ext.namespace("OSDN.form");

OSDN.form.TimeDiapason = Ext.extend(Ext.form.Field, {
	
	defaultAutoCreate:{
     	tag:'input', 
     	type:'hidden'
	},
	
	allowBlank: true, 
	
	border: false,
	
	baseCls: null,
	
	timeFormat: 'H:i',
	
	interval: null,
	
	token: '-',

	_value: {},
	
	_startValue: null,
	
	_blurAllowed: true,
	
	minValue: '00:00',
	
	maxValue: '23:59',
	
	defaultMinValue: '09:00',
	
	defaultMaxValue: '09:00',
	
	allowClear: true,
	
	confirmFunction: function (f) {
		f(true);
	},

    // {{{
    /**
     * private
     * creates DateField and TimeField and installs the necessary event handlers
     */
    initComponent:function() {
    	var self = this;
    	
        // call parent initComponent
        OSDN.form.TimeDiapason.superclass.initComponent.call(this);

        this.minf = new Ext.form.TimeField({
			width:60,
			interval: this.interval,
			allowBlank: this.allowBlank,
			minValue: this.minValue,
            maxValue: this.maxValue,
            value:  this.defaultMinValue,
            format: this.timeFormat,
            style: {
            	verticalAlign: "top"
            },
			listeners:{
				blur:{
                 	scope:this, 
                 	fn:this.onBlurField
				},
                focus:{
                	scope:this, 
                	fn:this.onFocusField
				}
            }
		});
		
		this.maxf = new Ext.form.TimeField({
			width:60,
			interval: this.interval,
			allowBlank: this.allowBlank,
			minValue: this.minValue,
            maxValue: this.maxValue,
            value:  this.defaultMaxValue,
            format: this.timeFormat,
            style: {
            	verticalAlign: "top"
            },
			listeners:{
				blur:{
                 	scope:this, 
                 	fn:this.onBlurField
				},
                focus:{
                	scope:this, 
                	fn:this.onFocusField
				}
            }
		});
		
		if (this.allowClear) {
			this.trigger = new Ext.Button({
				iconCls : 'delete',
				style: {
	            	verticalAlign: "top"
	            },
				handler: function () {
					self.focus();
					if ('function' == typeof self.confirmFunction) {
						self._blurAllowed = false;
                        self.confirmFunction(function (clear) {
                        	if (clear) {
                        		this._blurAllowed = true;
                            	this.setValue(Ext.apply(this._value || {}, {
                                    start_time: null, 
                                    end_time:   null
                                }));
                                this.onBlurField.defer(200, this, [this.minf, true]);
                        	} else {
                        		this.focus();
                        		this._blurAllowed = true;
                        	}
//                            (function () {
//                                //self.fireEvent('blur', self);
//                                self.onBlurField(self.minf);
//                            }).defer(100);
                        }.createDelegate(self), self.getValue(), self);
					}
				}
			});
		}

        // relay events
        this.relayEvents(this.minf, ['focus', 'specialkey', 'invalid', 'valid']);
        this.relayEvents(this.maxf, ['focus', 'specialkey', 'invalid', 'valid']);

    }, // eo function initComponent
    // }}}
    // {{{
    
    /**
     * Validates a value according to the field's validation rules and marks the field as invalid
     * if the validation fails
     * @param {Mixed} value The value to validate
     * @return {Boolean} True if the value is valid, else false
     */
    validateValue : function(value){
        if (value && ( (value.start_time && value.end_time && value.start_time >= value.end_time) 
        	|| (value.start_time && !value.end_time)
        	|| (value.end_time && !value.start_time))) {
        	this.markInvalid(lang('Start time has to be less than end time'));
        	return false;
        }
    	
    	if(this.vtype){
            var vt = Ext.form.VTypes;
            if(!vt[this.vtype](value, this)){
                this.markInvalid(this.vtypeText || vt[this.vtype +'Text']);
                return false;
            }
        }
        
        if(typeof this.validator == "function"){
            var msg = this.validator(value);
            if(msg !== true){
                this.markInvalid(msg);
                return false;
            }
        }
        return true;
    },
    
    clearInvalid: function () {
    	this.maxf.clearInvalid();
    	this.minf.clearInvalid();
    },
    
    markInvalid: function () {
    	this.maxf.markInvalid.apply(this.maxf, arguments);
    	this.minf.markInvalid.apply(this.minf, arguments);
    },
    
    /**
     * private
     * Renders underlying DateField and TimeField and provides a workaround for side error icon bug
     */
    onRender:function(ct, position) {
        // don't run more than once
        if(this.isRendered) {
            return;
        }

        // render underlying hidden field
        OSDN.form.TimeDiapason.superclass.onRender.call(this, ct, position);

        // render DateField and TimeField
        // create bounding table
        var t;
        
        var children = [
            {
            	tag:'td',
            	cls:'ux-start-datetime'
			},  {
            	tag:'td',
            	style: 'width: 12px; line-height:21px; text-align: center;',
            	html: '-'
			}, {
				tag:'td', 
				cls:'ux-end-datetime'
			}
        ]; 
        
        if (this.allowClear) {
	        children.push({
				tag:'td', 
				style: 'width: 4px;font-size:3px;',
				html: '&nbsp;'
			});
			
			children.push({
				tag:'td', 
				style: 'width: 23px;',
				cls:'ux-trigger-clear'
			});
        }
        
        t = Ext.DomHelper.append(ct, {tag:'table',style:'background: #fff; border-collapse:collapse',children:[
            {tag:'tr', children: children}
        ]}, true);


        this.tableEl = t;
        this.wrap = t.wrap({cls:'x-form-field-wrap'});
        this.wrap.on("mousedown", this.onMouseDown, this, {delay:10});

        // render fields
        this.minf.render(t.child('td.ux-start-datetime'));
        this.maxf.render(t.child('td.ux-end-datetime'));
        if (this.allowClear) {
        	this.trigger.render(t.child('td.ux-trigger-clear'));
        }

        // workaround for IE trigger misalignment bug
        if(Ext.isIE && Ext.isStrict) {
            t.select('input').applyStyles({top:0});
        }

        this.on('specialkey', this.onSpecialKey, this);
        this.minf.el.swallowEvent(['keydown', 'keypress']);
        this.maxf.el.swallowEvent(['keydown', 'keypress']);

        // create icon for side invalid errorIcon
        if('side' === this.msgTarget) {
            var elp = this.el.findParent('.x-form-element', 10, true);
            this.errorIcon = elp.createChild({cls:'x-form-invalid-icon'});

            this.minf.errorIcon = this.errorIcon;
            this.maxf.errorIcon = this.errorIcon;
        }

        // setup name for submit
        this.el.dom.name = this.hiddenName || this.name || this.id;

        // we're rendered flag
        this.isRendered = true;

        // update hidden field
        this.updateHidden();

    }, // eo function onRender
    // }}}
    // {{{
    /**
     * private
     */
    adjustSize:Ext.BoxComponent.prototype.adjustSize,
    // }}}
    // {{{
    /**
     * private
     */
    alignErrorIcon:function() {
        this.errorIcon.alignTo(this.tableEl, 'tl-tr', [2, 0]);
    },
    // }}}
    // {{{
    /**
     * private initializes internal dateValue
     */
    initDateValue:function() {
        this._value = {
        	start_time: '00:00', 
        	end_time: '00:00'
        };
    },
    // }}}
    // {{{
    /**
     * Calls clearInvalid on the DateField and TimeField
     */
    clearInvalid:function(){
        this.minf.clearInvalid();
        this.maxf.clearInvalid();
    }, // eo function clearInvalid
    // }}}
    // {{{
    /**
     * Disable this component.
     * @return {Ext.Component} this
     */
    disable:function() {
        if(this.isRendered) {
            this.minf.disabled = true;
            this.maxf.disabled = true;
            this.minf.onDisable();
            this.maxf.onDisable();
        }
        this.disabled = true;
        this.minf.disabled = true;
        this.maxf.disabled = true;
        this.fireEvent("disable", this);
        return this;
    }, // eo function disable
    // }}}
    // {{{
    /**
     * Enable this component.
     * @return {Ext.Component} this
     */
    enable:function() {
        if(this.rendered){
            this.minf.onEnable();
            this.maxf.onEnable();
        }
        this.disabled = false;
        this.minf.disabled = false;
        this.maxf.disabled = false;
        this.fireEvent("enable", this);
        return this;
    }, // eo function enable
    // }}}
    // {{{
    /**
     * private Focus date filed
     */
    focus:function() {
        this.minf.focus();
    }, // eo function focus
    // }}}
    // {{{
    /**
     * private
     */
    getPositionEl:function() {
        return this.wrap;
    },
    // }}}
    // {{{
    /**
     * private
     */
    getResizeEl:function() {
        return this.wrap;
    },
    // }}}
    // {{{
    
    getRawValue: function () {
    	var start_time = this.minf.getRawValue();
    	var end_time = this.maxf.getRawValue();
    	
    	if (start_time) {
        	start_time = Date.parseDate(start_time, this.timeFormat);
        	if (!start_time) {
        		start_time = Date.parseDate('00:00', this.timeFormat);
        	}
        	start_time = start_time.format(this.timeFormat);
    	}
    	
    	if (end_time) {
        	end_time = Date.parseDate(end_time, this.timeFormat);
            if (!end_time) {
                end_time = Date.parseDate('00:00', this.timeFormat);
            }
            end_time = end_time.format(this.timeFormat);
    	}
    	
    	this._value = Ext.apply(OSDN.clone(this._value) || {}, {
    		start_time: start_time, 
    		end_time:   end_time
    	});
    	return this._value;
    },
    
    /**
     * @return {Date/String} Returns value of this field
     */
    getValue:function() {
        return this.getRawValue();
    },
    // }}}
    // {{{
    /**
     * @return {Boolean} true = valid, false = invalid
     * private Calls isValid methods of underlying DateField and TimeField and returns the result
     */
    isValid:function() {
        return this.minf.isValid() && this.maxf.isValid() && this.validateValue(this.getValue());
    }, // eo function isValid
    // }}}
    // {{{
    /**
     * Returns true if this component is visible
     * @return {boolean} 
     */
    isVisible : function(){
        return this.minf.rendered && this.minf.getActionEl().isVisible();
    }, // eo function isVisible
    // }}}
    // {{{
    /** 
     * private Handles blur event
     */
    onBlurField:function(f, force) {
    	
    	if (!this._blurAllowed) {
    		return false;
    	}
    	
        // called by both DateField and TimeField blur events

        // revert focus to previous field if clicked in between
        if(this.wrapClick) {
            if (f) { 
            	f.focus();
            }
            this.wrapClick = false;
        }

        // update underlying value
        
        this.updateHidden();

        // fire events later
        (function() {
            if((!this.minf.hasFocus && !this.maxf.hasFocus) || force) {
                var v = this.getValue();
                //if(v.start_time !== this._startValue.start_time || v.end_time !== this.startValue.end_time) {
                    this.fireEvent("change", this, v, this._startValue);
                //}
                this.hasFocus = false;
                if (this.isValid()) {
                	this.fireEvent('blur', this);
                }
            }
        }).defer(100, this);

    }, // eo function onBlur
    // }}}
    // {{{
    /**
     * private Handles focus event
     */
    onFocusField:function() {
    	
    	this.clearInvalid();
    	
        if(!this.hasFocus){
            this.hasFocus = true;
            this._startValue = this.getValue();
            this.fireEvent("focus", this);
        }
    },
    // }}}
    // {{{
    /**
     * private Just to prevent blur event when clicked in the middle of fields
     */
    onMouseDown:function(e) {
        if(!this.disabled) {
            this.wrapClick = 'td' === e.target.nodeName.toLowerCase();
        }
    },
    // }}}
    // {{{
    /**
     * private
     * Handles Tab and Shift-Tab events
     */
    onSpecialKey:function(t, e) {
        var key = e.getKey();
        if(key === e.TAB) {
            if(t === this.minf && !e.shiftKey) {
                e.stopEvent();
                this.maxf.focus();
            }
            if(t === this.maxf && e.shiftKey) {
                e.stopEvent();
                this.minf.focus();
            }
        }
        // otherwise it misbehaves in editor grid
        if(key === e.ENTER) {
            this.updateValue();
        }

    }, 
    
    /**
     * private
     * Sets correct sizes of underlying DateField and TimeField
     * With workarounds for IE bugs
     */
    setSize:function(w, h) {
    	if (w && typeof w == 'object') {
    		h = w.height;
    		w = w.width;
    	}
    	
        if(!w) {
            return;
        }
        
        if (!h) {
        	h = 21;
        }
        
        if (this.allowClear) {
	        var width = Math.max(Math.round(w /2) - 16, 55);
	        this.minf.setSize(width, h);
	        this.maxf.setSize(width, h);
	        var ww = 2 * width + 33;
        } else {
        	var width = Math.max(Math.round(w /2) - 1, 40);
	        this.minf.setSize(width, h);
	        this.maxf.setSize(width, h);
	        var ww = 2 * width + 2;
        }
        
        /*if(Ext.isIE) {
        	ww += 20;
        }*/
        OSDN.form.TimeDiapason.superclass.setSize.call(this, ww, h);

        if(Ext.isIE) {
            /*this.minf.el.up('td').setWidth(width);
            this.maxf.el.up('td').setWidth(width);*/
        }
        
        
        /*this.minf.setSize(w - this.timeWidth - 4, h);
        this.maxf.setSize(this.timeWidth, h);

        if(Ext.isIE) {
            this.minf.el.up('td').setWidth(w - this.timeWidth - 4);
            this.maxf.el.up('td').setWidth(this.timeWidth);
        }*/
    }, // eo function setSize
    // }}}
    // {{{
    /**
     * @param {Mixed} val Value to set
     * Sets the value of this field
     */
    setValue:function(val) {
        return this.setRawValue(val);
    }, // eo function setValue
    
    setRawValue: function (v) {
		if(this.rendered) {
			this.minf.setRawValue(v && v.start_time ? v.start_time : null );
			this.maxf.setRawValue(v && v.end_time ? v.end_time : null);
		}
		this._value =  v || {};
        this.updateValue();
    },
    // }}}
    // {{{
    /**
     * Hide or show this component by boolean
     * @return {Ext.Component} this
     */
    setVisible: function(visible){
        if(visible) {
            this.minf.show();
            this.maxf.show();
        }else{
            this.minf.hide();
            this.maxf.hide();
        }
        return this;
    }, // eo function setVisible
    // }}}
    //{{{
    show:function() {
        return this.setVisible(true);
    }, // eo function show
    //}}}
    //{{{
    hide:function() {
        return this.setVisible(false);
    }, // eo function hide
    //}}}
    // {{{
        /**
     * private Updates the underlying hidden field value
     */
    updateHidden:function() {
        if(this.isRendered) {
            var value = this._value.start_time + ' - ' + this._value.end_time;
            this.el.dom.value = value;
        }
    },
    
    /**
     * private Updates all
     */
    updateValue:function() {
        this.updateHidden();
        return;
    }, // eo function updateValue
    
    /**
     * @return {Boolean} true = valid, false = invalid
     * callse validate methods of DateField and TimeField
     */
    validate:function() {
        return this.isValid();
    }, // eo function validate
    
    /**
     * Returns renderer suitable to render this field
     * @param {Object} Column model config
     */
    renderer: function(field) {
        var renderer = function(val) {
        	if (!(val && val.start_time && end_time)) {
        		return ''
        	}
        	return [val.start_time, ' - ', val.end_time].join('');
        };
        return renderer;
    } // eo function renderer
}); // eo extend

Ext.reg('OSDN.form.TimeDiapason', OSDN.form.TimeDiapason);
