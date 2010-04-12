Ext.ns('OSDN.bar');

OSDN.bar.Progress = Ext.extend(Ext.util.Observable, {
    
    maxBoundary: 100,
     
    render: function() {
        
        var v = arguments[0];
        if (arguments.length > 1) {
            v = arguments;
        } else if (!Ext.isArray(arguments[0])) {
            v = [arguments[0]];
        }
        
        var colors = ['green', 'red', 'orange', 'yellow'];
        var bars = [];
        for(var i = 0; i < v.length; i++) {
            var width = 0;
            var qtip = '';
            
            switch(Ext.type(v[i])) {
                case 'object':
                    width = v[i].width;
                    qtip = String(v[i].qtip);
                    break;
                    
                default:
                    width = v[i];
                    break;
            }
            
            var width = parseInt(width, 10);
            if (!isNaN(width)) {
                if (OSDN.empty(qtip)) {
                    qtip = width + '%';
                } else {
                    qtip = String.format(qtip, width);
                }
                
                bars.push(String.format('<div class="x-progress-bar-item" style="width:{1}%;"><div class="x-progress-bar-{0}" qtip="{2}"></div></div>', colors[i], width, qtip));
            }
        }

        var text_back = '30% / 30% / 30%';
        var tpl = [
            '<div class="x-progress-wrap">',
                '<div class="x-progress-bar-inner">',
                    bars.join(''),
                 '</div>',
             '</div>'
        ].join('');
             
        var t = String.format(tpl, undefined, text_back);
        return t; 
    }
});

//var text_post = '%';
//var progressQtip = '';
//if(this.text){
//    text_post = this.text;
//}
//var text_front;
//var text_back;
//
//text_post = this.myTpl?this.myTpl.applyTemplate(record.data):v+text_post;
//progressQtip = this.qtip == ''?text_post:this.qtip;
//progressQtip = ' qtip="' + progressQtip + '" ';
//
//text_front = (v < 55) ? '' : text_post;
//text_back = (v >= 55) ? '' : text_post;     
//
//var style ='';
//this.colored = true;
//if (this.colored == true)
//{
//    //if (v <= 100 && v >85) style='-red';
//    if (v <= 100 && v >76) style='-green';
//    if (v <= 75  && v >31) style='-orange';
//    if (v <= 30 ) style='-yellow';
//    
//    if (v > 100) style='-red';
//    
//}
//var val = v > 100?100:v;
