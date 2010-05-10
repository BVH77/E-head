// replace the Ext.decode native method
Ext.decode = OSDN.decode;

String.prototype.ucFirst = function() {
    return this.substr(0,1).toUpperCase() + this.substr(1,this.length);
};

link = OSDN.link;

lang = function(phrase) {
    return phrase;
};

// prevent errors on console calls
if(typeof console == 'undefined') {
    console = {
        log: function() {
            var args = [];
            for (var i = 0, l = arguments.length; i < l; i++) {
               args.push(arguments[i]);
            }
            
            if (Ext.debug) {
                Ext.log(args);
            } else {
                alert(args.join(" \n"));
            }
        }
    };
}