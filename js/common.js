link = OSDN.link;

var translation = new OSDN.Translation({locale: OSDN.LOCALE});
translation.parse(OSDN.Translation.Storage);
lang = function() {
    return translation.translate.apply(translation, arguments);
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