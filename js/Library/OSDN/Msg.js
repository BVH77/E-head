Ext.namespace('OSDN.Msg');

OSDN.Msg = {
    error: function(msg, fn, animEl){
        var s = Ext.Msg.show({
            title: lang('Error message'),
            animEl: animEl,
            msg: msg,
            buttons: Ext.MessageBox.OK,
            fn: fn || Ext.emptyFn,
            icon: Ext.Msg.ERROR
        });
    },
    
    errorCollection: function(errors){
        var t = new Ext.XTemplate('<tpl for=".">', '<span>{msg}</span><br />', '</tpl>');
        OSDN.Msg.error(t.apply(errors));
    },
    
    confirm: function(msg, fn, scope){
        msg = msg || lang('Are you sure?');
        Ext.Msg.confirm(lang('Confirm'), msg, function(b){
            
            if (b == 'yes' && typeof fn === 'function') {
                fn.createDelegate(scope)();
            }
        });
    },
    
    info: function(msg, animEl) {
        Ext.Msg.show({
            animEl: animEl,
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.INFO,
            modal: true,
            title: lang('Information'),
            msg: msg
        });
    },
    
    getQtipSpan: function(tip, text) {
    	var t = new Ext.Template('<span style="overflow: hidden;" ext:qtip="{tip}">{text}</span>');
    	return t.apply({tip: tip, text: text});
    }
};


/*
 * 
 * @param {Object} t
 * @param {Object} s
 * example OSDN.ActionMsg.msg('Click','You clicked on "Action 1".');
 */
OSDN.ActionMsg = {
    createBox: function(t, s){
        return ['<div class="msg">',
                '<div class="x-box-tl"><div class="x-box-tr"><div class="x-box-tc"></div></div></div>',
                '<div class="x-box-ml"><div class="x-box-mr"><div class="x-box-mc"><h3>', t, '</h3>', s, '</div></div></div>',
                '<div class="x-box-bl"><div class="x-box-br"><div class="x-box-bc"></div></div></div>',
                '</div>'].join('');
    },
	msg : function(title, format){
            if(!msgCt){
                var msgCt = Ext.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
            }
            msgCt.alignTo(document, 't-t');
            var s = String.format.apply(String, Array.prototype.slice.call(arguments, 1));
            var m = Ext.DomHelper.append(msgCt, {html:OSDN.ActionMsg.createBox(title, s)}, true);
            m.slideIn('t').pause(3).ghost("t", {remove:true});
    }
};