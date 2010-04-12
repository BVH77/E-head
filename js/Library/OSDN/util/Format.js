Ext.namespace('OSDN.util');


OSDN.util.Format = function(){

    return {

        /**
         * Format a number as currency
         * @param {Number/String} value The numeric value to format
         * @return {String} The formatted currency string
         */
        toMoney: function(v, separator, format) {
            separator = separator || ',';
            format = format || '';
            
            v = (Math.round((v - 0) * 100)) / 100;
            v = (v == Math.floor(v)) ? v + ".00" : ((v * 10 == Math.floor(v * 10)) ? v + "0" : v);
            v = String(v);
            var ps = v.split('.');
            var whole = ps[0];
            var sub = ps[1] ? '.' + ps[1] : '.00';
            var r = /(\d+)(\d{3})/;
            while (r.test(whole)) {
                whole = whole.replace(r, '$1' + separator + '$2');
            }
            v = whole + sub;
            if (v.charAt(0) == '-') {
                return '-' + format + v.substr(1);
            }
            return format + v;
        },
		
		/**
		 * if date is zero then return '' or return by specified format
		 * @param {Object} format
		 */
        dateRenderer : function(format, altText) {
            return function(v) {
                return Ext.util.Format.date(v, 'U') != 0 ? Ext.util.Format.date(v, format) : altText || '';
            };
        },
		
		/**
		 * @param int (minutes)
		 * @return string (hours:minutes)
		 */
        minutesToTimeRenderer : function(v) {
        	var hours = Math.floor(v/60);
        	var minutes = v%60;
            return hours + ':' + (minutes < 10 ? '0' + minutes : minutes);
        },
        
        /**
         * @param int (seconds)
         * @return string (hours:minutes)
         */
        secondsToTimeRenderer : function(v) {
        	var days = Math.floor(v/(24*3600));
        	v = v%(24*3600);
        	var hours = Math.floor(v/3600);
        	v = v%3600;
        	var minutes = Math.floor(v/60);
            return (days? days + ' d ': '') + (hours? hours + ' h ': '') + (minutes? minutes + ' m': '');
        },
        
        nl2br: function(str) {
            return String(str).replace(/([^>]?)\n/g, '$1'+ '<br />');
        }
		
    };
}();