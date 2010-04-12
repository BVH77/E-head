Ext.ns('OSDN.form');

OSDN.form.VTypes = function() {
    
    var ssnRegExp = /^\d{9}$/;
    
    return {
        datetimerange: function(val, field) {

            var date = val;
            
            if (field.startDateTimeField) {
                var sd = Ext.getCmp(field.startDateTimeField);
                field.vtypeText = lang('Should be greater than {0}', 
                    sd.getValue().format(OSDN.date.DATE_TIME_FORMAT))
                return date>sd.getValue();
                
            } else if (field.endDateTimeField) {
                var ed = Ext.getCmp(field.endDateTimeField);
                field.vtypeText = lang('Should be less than {0}', 
                    ed.getValue().format(OSDN.date.DATE_TIME_FORMAT))
                return date < ed.getValue();
            }
            
            /* Always return true since we're only using this vtype
             * for after the vtype test)
             */
            return true;
        },
        
        daterange: function(val, field) {
            
            var date = field.parseDate(val);

            /* We need to force the picker to update values 
             * to recaluate the disabled dates display
             */  
            var dispUpd = function(picker) {
                var ad = picker.activeDate;
                picker.activeDate = null;
                picker.update(ad);
            };
            
            if (field.startDateField) {
                var sd = Ext.getCmp(field.startDateField);
                sd.maxValue = date;
                if (sd.menu && sd.menu.picker) {
                    sd.menu.picker.maxDate = date;
                    dispUpd(sd.menu.picker);
                }
            } else if (field.endDateField) {
                var ed = Ext.getCmp(field.endDateField);
                ed.minValue = date;
                if (ed.menu && ed.menu.picker) {
                    ed.menu.picker.minDate = date;
                    dispUpd(ed.menu.picker);
                }
            }
            /* Always return true since we're only using this vtype
             * to set the min/max allowed values (these are tested
             * for after the vtype test)
             */
            return true;
        },
      
        timerange: function(val, field) {
            
            var t = field.parseDate(val);
           
            if (field.startTimeField) {
                var st = Ext.getCmp(field.startTimeField);
                st.maxValue = t;
            } else if (field.endTimeField) {
                var et = Ext.getCmp(field.endTimeField);
                et.minValue = t;
            }
            return true;
        },
          
        password: function(val, field) {
            if (field.initialPassField) {
                var pwd = Ext.getCmp(field.initialPassField);
                return (val == pwd.getValue());
            }
            return true;
        },
        
        ssn: function (number, field) {
            
            var testssn;
            if (!ssnRegExp.test(number)) {
                return false;
            }
            number = '' + number;
            if (Ext.isIE) {
                testssn = number.charAt(0)*9 
                        + number.charAt(1)*8
                        + number.charAt(2)*7
                        + number.charAt(3)*6
                        + number.charAt(4)*5
                        + number.charAt(5)*4
                        + number.charAt(6)*3
                        + number.charAt(7)*2
                        - number.charAt(8)*1;
            } else {
                testssn = number[0]*9 
                        + number[1]*8
                        + number[2]*7
                        + number[3]*6
                        + number[4]*5
                        + number[5]*4
                        + number[6]*3
                        + number[7]*2
                        - number[8]*1;
            }
            return (testssn % 11 === 0) ? true : false ;
        }
    }; 
}();

Ext.apply(Ext.form.VTypes, OSDN.form.VTypes);