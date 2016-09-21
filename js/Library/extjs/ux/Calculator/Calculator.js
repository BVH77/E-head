/** 
 * @class Ext.ux.Calculator 
 * @extends Ext.Component 
 * Simple calculator class. 
 * @constructor 
 * Create a new Calculator 
 * @param {Object} config The config object 
 * @author Toby Stuart, Nullity, edits by Troy McCabe 
 */ 
Ext.ux.Calculator = Ext.extend(Ext.Component, { 
    /** 
     * @cfg {string} number  
     * number placeholder for the value in the textbox 
     */ 
    number: '0', 
     
    /** 
     * @cfg {string} num1  
     * number placeholder for internal use by the calculator 
     */ 
    num1: '', 
     
    /** 
     * @cfg {string} num2  
     * number placeholder for internal use by the calculator 
     */ 
    num2: '', 
     
    /** 
     * @cfg {string} operator  
     * operator placeholder which operator is pressed 
     */ 
    operator: '', 
     
    /** 
     * @cfg {string} memValue  
     * number placeholder for the memory value in the textbox 
     */ 
    memValue: '0', 
     
    /** 
     * @cfg {string} addToNum  
     * [yes/no/reset] Whether to add the value if the user types another number if there is already in one in the textfield 
     */ 
    addToNum: 'no', 
     
    /** 
     * @cfg {boolean} showOkButton  
     * Whether to show the ok button at the bottom of the calculator 
     */ 
    showOkButton: false, 
     
    /** 
     * @cfg {boolean} showTips  
     * Whether to show the quicktips over the memory functions and such 
     */ 
    showTips: true, 
     
    /** 
     * initialize the Component 
     */ 
    initComponent : function(){ 
        //call the initComponent method of the superclass 
        Ext.ux.Calculator.superclass.initComponent.call(this); 
    }, 
     
    /** 
     * Function that fires on render of the component 
     * @param {object} container 
     * The container of the calculator 
     * @param {string} position 
     * The position of the component in the container 
     */ 
    onRender : function(container, position) { 
        //insert the initial div 
        var el = container.createChild({tag : 'div'}); 

        //create the styled div inside 
        this.standardDiv = el.createChild({tag: 'div', id: 'ux-calc-div-' + this.id, cls:'ux-calc', style: 'float: left;'}); 
         
        //create the table with all the correct css 
        this.stTable = this.standardDiv.createChild({tag: 'table', cellspacing: 0, cellpadding: 0, width: 300, cls: 'ux-calc-container'}); 

        //set the maxcolumns for later table creation 
        var maxCols = 5; 

        //create the array of buttons, what function to call, the tip, and what keys will trigger them 
        var stBtns = 
        [ 
            [{label: '&nbsp;', func: 'memStore', id: 'memStore_' + this.id}, {label: 'C', func: 'clear', keys: [27], tip: 'Clear All'}, {label: 'CE', func: 'clear', tip: 'Clear Entry'}, {label: 'BS', func: 'clear', keys: [22], tip: 'Backspace'}, {label: '/', func: 'operation', keys: [111, 191]}], 
            [{label: 'MC', func: 'memory', tip: ' Memory Clear'}, {label: '7', func: 'enterDigit', keys: [55, 103]}, {label: '8', func: 'enterDigit', keys: [56, 104]}, {label: '9', func: 'enterDigit', keys: [57, 105]}, {label: '*', func: 'operation', keys: [106]}], 
            [{label: 'MR', func: 'memory', tip: 'Memory Recall'}, {label: '4', func: 'enterDigit', keys: [52, 100]}, {label: '5', func: 'enterDigit', keys: [53, 101]}, {label: '6', func: 'enterDigit', keys: [54, 102]}, {label: '-', func: 'operation', keys: [109]}], 
            [{label: 'MS', func: 'memory', tip: 'Memory Store'}, {label: '1', func: 'enterDigit', keys: [49, 97]}, {label: '2', func: 'enterDigit', keys: [50, 98]}, {label: '3', func: 'enterDigit', keys: [51, 99]}, {label: '+', func: 'operation', keys: [107]}], 
            [{label: 'M+', func: 'memory', tip: 'Memory Add'}, {label: '+/-', func: 'plusminus'}, {label: '0', func: 'enterDigit', keys: [48, 96]}, {label: '.', func: 'enterDot', keys: [110, 190]}, {label: '=', func: 'equals', keys: [10, 13]}], 
            [{label: 'OK', func: 'ok'}] 
        ]; 

        //create the keymap 
        this.keyMap = new Ext.KeyMap(el, {}); 

        //create the row 
        var row = this.stTable.createChild({tag: 'tr'}).child('tr'); 
         
        //create an inition cell 
        var cell = Ext.get(row.dom.appendChild(document.createElement('td'))); 
         
        //set the colspan of the initial cell 
        cell.dom.colSpan = maxCols; 

        //put the input box inside the initial cell 
        this.inputBox = new Ext.form.TextField({ 
            id: this.id, 
            name: this.id, 
            width: 300,
            height: 45,
            style: 'font-size: 36px;',
            readOnly: true, 
            cls: 'ux-calc-input', 
            value: '0' 
        }); 
        this.inputBox.render(cell); 

        //loop through all the buttons 
        for (i = 0; i < stBtns.length; i++) { 
            //if showOkButton is false, and it's the last button 
            if (!this.showOkButton && i == stBtns.length - 1) { 
                //break the for loop 
                break; 
            } 

            //set the active button 
            var btn = stBtns[i]; 
             
            //create a new table row 
            var row = this.stTable.createChild({tag:'tr'}).child('tr'); 

            //loop through the current button options 
            for (j = 0; j < btn.length; j++) { 
                //append a cell for each button 
                var cell = Ext.get(row.dom.appendChild(document.createElement('td'))); 
                 
                //set the options for the button (cell) 
                cell.dom.id = btn[j].id || Ext.id(); 
                cell.dom.innerHTML = btn[j].label; 
                cell.dom.width = '60'; 
                cell.dom.align = 'center'; 
                cell.dom.valign = 'center'; 

                //switch the function, and get the css class 
                switch (btn[j].func) { 
                    case 'enterDigit': 
                        var cls = 'ux-calc-digit'; 
                        break; 
                    case 'operation': 
                        var cls = 'ux-calc-operator'; 
                        break; 
                    case 'equals': 
                        var cls = 'ux-calc-equals'; 
                        break; 
                    case 'clear': 
                        var cls = 'ux-calc-memory'; 
                        break; 
                    case 'memory': 
                        var cls = 'ux-calc-memory'; 
                        break; 
                    case 'memStore': 
                        var cls = 'ux-calc-memstore'; 
                        break; 
                    case 'ok': 
                        var cls = 'ux-calc-ok'; 
                        break; 
                    default: 
                        cls = 'ux-calc-misc'; 
                     
                } 

                cell.dom.className = cls; 

                //if j = the total elements and is less than the maxCols 
                if (j == btn.length - 1 && j < maxCols - 1) { 
                    //set the colspan 
                    cell.dom.colSpan = (maxCols - j+1); 
                } 

                //if the function is not memstore 
                if (btn[j].func != 'memStore') { 
                    //add the mouseover effect 
                    cell.addClassOnOver('ux-calc-btn-hover'); 
                     
                    //append the listener 
                    cell.on('click', this.onClick, this, {button: btn[j]}); 
                } 

                //if the current button has keys assigned 
                if (btn[j].keys) { 
                    //add a key binding to the keymap 
                    this.keyMap.addBinding({ 
                        key: btn[j].keys, 
                        fn: this.onClick.createDelegate(this, [null, this, {button: btn[j], viaKbd: true, cell: cell}]), 
                        scope: this 
                    }); 
                } 

                //if tips are enabled, and there is one on this button 
                if (this.showTips && btn[j].tip) { 
                    //register the tip 
                    Ext.QuickTips.register({ 
                        target: cell, 
                        text: btn[j].tip 
                    }); 
                } 
            } 
        } 

        //enable the keymap 
        this.keyMap.enable(); 
         
        //set the element for reference 
        this.el = el;
        
        this.inputBox.focus(false, 50);
    }, 

    /** 
     * get's the value from the calculator's textbox 
     * @returns value from textbox 
     */ 
    getValue : function() { 
        return this.inputBox.getValue(); 
    }, 

    /** 
     * Set the textbox to the specified value 
     * @param {string} value 
     * The value to set the textbox to 
     */ 
    setValue : function(value) { 
        this.number = value; 
        this.inputBox.setValue(this.number); 
    }, 

    /** 
     * Function to handle clicks on the buttons 
     * @param {event} e 
     * the click event 
     * @param {object} el 
     * the element that was clicked on 
     * @param {object} opt 
     * options that are passed along 
     */ 
    onClick : function(e, el, opt) { 
        //did it come from the keyboard? 
        if (opt.viaKbd) { 
            //highlight what was hit 
            Ext.get(opt.cell).highlight('FF0000', {attr: 'color', duration: .3}); 
        } 

        //build the function 
        var s = 'this.' + opt.button.func + '(\'' + opt.button.label + '\');'; 
         
        //run it 
        eval(s); 
    }, 

    /** 
     * Update the display to reflect actions 
     */ 
    updateDisplay : function() { 
        //if it's infinity, reset it 
        if (this.number == 'Infinity') { 
            this.number = '0'; 
        } 

        //set the value 
        this.inputBox.setValue(this.number); 
    }, 

    /** 
     * function when the user hits a digit 
     * @param {integer} n 
     * an interger that is entered 
     */ 
    enterDigit : function(n) { 
        //if it's set to add to the number, just add it 
        if (this.addToNum == 'yes') { 
            this.number += n; 

            //handle decimal places 
            if (this.number.charAt(0) == 0 && this.number.indexOf('.') == -1) { 
                this.number = this.number.substring(1); 
            } 
        } 
        //not set to add the number 
        else { 
            //if it's set to reset, clear first 
            if (this.addToNum == 'reset') { 
                this.reset(); 
            } 

            //reset the number 
            this.number = n; 
            this.addToNum = 'yes'; 
        } 
         
        //update the display 
        this.updateDisplay(); 
    }, 

    /** 
     * function when the user hits a period 
     */ 
    enterDot : function() { 
        //if set to just add to the number, append the dot 
        if (this.addToNum == 'yes') { 
            //if it's not -1 
            if (this.number.indexOf('.') != -1) { 
                return; 
            } 

            this.number += '.'; 
        } 
        //else reset 
        else { 
            //reset the field 
            if (this.addToNum == 'reset') { 
                this.reset(); 
            } 

            //set the number 
            this.number = '0.'; 
            this.addToNum = 'yes'; 
        } 

        //update the display 
        this.updateDisplay(); 
    }, 

    /** 
     * function when plus or minus is pressed 
     */ 
    plusminus : function() { 
        //if there's nothing in the box, skip 
        if (this.number == '0') { 
            return; 
        } 

        //else, update the number (do the operation) 
        this.number = (this.number.charAt(0) == '-') ? this.number.substring(1) : '-' + this.number; 
         
        //update the display 
        this.updateDisplay(); 
    }, 

    /** 
     * Function to reset all the placeholders 
     */ 
    reset : function() { 
        //clear all back to orig 
        this.number = '0'; 
        this.addToNum = 'no'; 
        this.num1 = ''; 
        this.num2 = ''; 
        this.operator = ''; 
    }, 

    /** 
     * Function to fire on the clear buttons 
     * @param {string} o 
     * the button that was pressed 
     */ 
    clear : function(o) { 
        //call function depending on button 
        switch(o) { 
            case 'C': 
                this.clearAll(); 
                break; 
            case 'CE': 
                this.clearEntry(); 
                break; 
            case 'BS': 
                this.backspace(); 
                break; 
            default: 
                break; 
        } 
    }, 

    /** 
     * Function to clear all from the stuff 
     */ 
    clearAll : function() { 
        //reset it 
        this.reset(); 
         
        //update the display 
        this.updateDisplay(); 
    }, 

    /** 
     * Function to clear just the entry 
     */ 
    clearEntry : function() { 
        //set the number to 0 
        this.number = '0'; 
         
        //don't add to the number 
        this.addToNum = 'no'; 
         
        //update the display 
        this.updateDisplay(); 
    }, 

    /** 
     * function to remove just one digit 
     */ 
    backspace : function() { 
        //convert to string 
        var n = this.number + ''; 

        //if it's 0, skip 
        if (n == '0') { 
            return; 
        } 

        //remove one char 
        this.number = n.substring(0, n.length-1); 
         
        //update the display 
        this.updateDisplay(); 
    }, 

    /** 
     * Function to call correct memory function depending on button 
     * @param {string} 0 
     * the button that was pressed 
     */ 
    memory : function(o) { 
        //switch & call correct function depending on button 
        switch(o) { 
            case 'M+': 
                this.memStore(true); 
                break; 
            case 'MS': 
                this.memStore(); 
                break; 
            case 'MR': 
                this.memRecall(); 
                break; 
            case 'MC': 
                this.memClear(); 
                break; 
            default: 
                break; 
        } 
    }, 

    /** 
     * Function to store the value in memory 
     * @param {boolean} add 
     * whether to add it to the current stored value 
     */ 
    memStore : function(add) { 
        //if the number is 0, or not there, skip 
        if (!this.number || this.number == '0') { 
            return; 
        } 
        //otherwise 
        else { 
            //set the value (add if add is true) 
            this.memValue = (add === true) ? this.calculate(this.number, this.memValue, '+') : this.number; 

            //set the memDiv to show there is something in memory 
            var memDiv = Ext.get('memStore_' + this.id); 
            memDiv.dom.innerHTML = 'M'; 

            //register the quicktip if they are set to be shown 
            if (this.showTips) { 
                Ext.QuickTips.register({ 
                    target: memDiv, 
                    text: 'Memory: <b>' + this.memValue + '</b>' 
                }); 
            } 
        } 
    }, 

    /** 
     * Function to recall the value from memory 
     */ 
    memRecall : function() { 
        //if there is a value in memory 
        if (this.memValue != '0') { 
            //set the number 
            this.number = this.memValue; 

            //set the other numbers too 
            if (this.num1) { 
                this.num2 = this.memValue; 
            } 

            //update the display 
            this.updateDisplay(); 
        } 
    }, 

    /** 
     * Function to clear the value from memory 
     */ 
    memClear : function() { 
        //set the memory value to 0 
        this.memValue = '0'; 
         
        //clear the memory div 
        var memDiv = Ext.get('memStore_' + this.id); 
        memDiv.dom.innerHTML = '&nbsp;'; 

        //remove the quicktip 
        if (this.showTips) { 
            Ext.QuickTips.unregister(memDiv); 
        } 
    }, 

    /** 
     * function to check the accuracy of the result 
     * @param {double} result 
     * the result from the operation 
     * @returns the result of the mathematical operation 
     */ 
    accuracyCheck : function(result) {
        var i, n, j, k;
        var check;
        for (i = 0; i < 9; i++) {
          check = result * Math.pow(10, i);
          k = i + 1;
          n = Math.abs(Math.round(check) - check);
          j = Math.pow(10, -(12-i));
          if (n < j) {
            return this.round_extra_sf(Math.round(check) * Math.pow(10, -i));
          }
        }
        return this.round_extra_sf(result);
	},

    round_extra_sf : function(f) {
		var s=f.toPrecision(14);
		s=s.replace(/^([\+\-0-9\\.]*[1-9\.])0+((?:e[0-9\+\-]+)?)$/g,'$1$2');
		s=s.replace(/\.((?:e[0-9\+\-]+)?)$/g,'$1');
		return s;
	},
    
    /** 
     * Function to calculate the value 
     * @param {string} o1 
     * old value 
     * @param {string} o2 
     * new value 
     * @param {string} op 
     * operation to perform 
     * @returns the result of the operation 
     */ 
    calculate : function(o1, o2, op) { 
        //create the result variable 
        var result; 

        //if you want to = 
        if (op == '=') { 
            //set the result 
            result = o1 = o2; 
            o2 = ''; 
        } 
        //+, -, etc. 
        else { 
            //eval the value 
            result = eval('o1 + op + o2'); 
            result = eval(result); 
        } 

        //return the result 
        return result; 
    }, 

    /** 
     * Function to perform the operation on the values 
     * @param {string} op 
     * The operation to perform 
     */ 
    operation : function(op) { 
        //if num1 is blank 
        if (this.num1 == '' && typeof(this.num1) == 'string') { 
            //set num1 = the current textbox 
            this.num1 = parseFloat(this.number); 
             
            //set the operator 
            this.operator = op; 
             
            //change the option 
            this.addToNum = 'no'; 
        } 
        //it has something 
        else { 
            //if set to add to the number 
            if (this.addToNum == 'yes') { 
                //set num2 to the current value 
                this.num2 = parseFloat(this.number); 
                 
                //call the calculate function 
                this.num1 = this.calculate(this.num1, this.num2, this.operator); 
                 
                //set the number to the accuracy check's value 
                this.number = this.accuracyCheck(this.num1) + ''; 
                 
                //change the display 
                this.updateDisplay(); 
                 
                //set the operator 
                this.operator = op; 
                 
                //set the option 
                this.addToNum = 'no'; 
            } 
            //it's not set to add to the number 
            else { 
                //change the options 
                this.operator = op; 
                this.addToNum = 'no'; 
            } 
        } 
    }, 

    /** 
     * Function to equal the two values together 
     */ 
    equals : function() { 
        //if set to add to number 
        if (this.addToNum == 'yes') { 
            //if num1 is blank 
            if (this.num1 == '' && typeof(this.num1) == 'string') { 
                //change the options (set values) 
                this.operator = '='; 
                this.num1 = parseFloat(this.number); 
                this.addToNum = 'no'; 
            } 
            //num1 has a value 
            else { 
                //do the math 
                this.num2 = parseFloat(this.number); 
                this.num1 = this.calculate(this.num1, this.num2, this.operator); 
                this.number = this.accuracyCheck(this.num1) + ''; 
                 
                //change the options (set values) 
                this.updateDisplay(); 
                this.addToNum = 'reset'; 
            } 
        } 
        //not set to add to number 
        else { 
            //num1 is null - skip 
            if (this.num1 == '' && typeof(this.num1) == 'string') { 
                return; 
            } 
            //num1 has a value 
            else { 
                //if num2 has no value, set it to num1's value 
                if (this.num2 == '' && typeof(this.num2) == 'string') { 
                    this.num2 = this.num1; 
                } 

                //do the math on the numbers 
                this.num1 = this.calculate(this.num1, this.num2, this.operator); 
                this.number = this.accuracyCheck(this.num1) + ''; 
                 
                //change the config options 
                this.updateDisplay(); 
                this.addToNum = 'reset'; 
            } 
        } 
    }, 
     
    /** 
     * Function to align to the specified position in the element 
     */ 
    alignTo : function(el, pos) { 
        //if there's an element specified, move it 
        if (this.el) { 
            this.el.alignTo(el, pos); 
        } 
    }, 

    /** 
     * Function to handle the click of the ok button 
     */ 
    ok : function() { 
        //fire the 'hide' event 
        this.fireEvent('hide', this); 
    }, 
     
    /** 
     * Function to show the calculator 
     */ 
    show : function() { 
        //if this.el exists, show the calc and focus on it 
        if (this.el) { 
            this.el.show(); 
            this.inputBox.el.dom.focus(); 
        } 
    }, 

    /** 
     * Function to hide the calculator 
     */ 
    hide : function() { 
        //if the el exists and it's currently visible 
        if (this.el && this.el.isVisible()) { 
            this.el.hide(); 
        } 
    } 
}); 

//Register the xtype 
Ext.reg('calculator', Ext.ux.Calculator);