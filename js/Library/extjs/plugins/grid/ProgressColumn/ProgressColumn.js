Ext.grid.ProgressBarColumn = function(config){
    Ext.apply(this, config);
    if (!this.id) {
        this.id = Ext.id();
    }
    this.renderer = this.renderer.createDelegate(this);
};

Ext.grid.ProgressBarColumn.prototype = {
    
	qtip: '',
	
	init: function(grid){
        this.grid = grid;
        this.grid.on('render', function(){
            var view = this.grid.getView();
        }, this);
    },
    
	renderer: function(v, p, record){
        var text_front;
        var text_back;
        var style = '-yellow';
        var val = '';
        var text_post = '%';
        var progressQtip = '';
        if (v === false) {
            val = 0;
            text_post = '&nbsp;';
            progressQtip = this.qtip == '' ? lang('Max is not set') : this.qtip;
            progressQtip = ' qtip="' + progressQtip + '" ';
        } else {
    		text_post = this.myTpl ? this.myTpl.applyTemplate(record.data) : v + text_post;
            progressQtip = this.qtip == '' ? text_post : this.qtip;
            progressQtip = ' qtip="' + progressQtip + '" ';
            if (v > 30) style = '-orange';
            if (v > 75) style = '-green';
			if (v > 100) style = '-red';
    		val = v > 100 ? 100 : v;
        }
        
        if (this.text) {
            text_post = this.text;
        }
        
        text_front = (v < 55) ? '' : text_post;
        text_back = (v >= 55) ? '' : text_post;
        
		return String.format([
            '<div class="x-progress-wrap">',
                '<div class="x-progress-bar-inner">',
                    '<div class="x-progress-bar{0}" style="width:{1}%;">',
                        '<div ' + progressQtip + ' class="x-progress-text" style="width:100%; font-weight: normal;">{2}</div>',
                    '</div>',
                    '<div ' + progressQtip + ' class="x-progress-text x-progress-text-back" style="width:100%; font-weight: normal;">{3}</div>',
                 '</div>',
             '</div>'
        ].join(''), style, val, text_front, text_back);
    }
};