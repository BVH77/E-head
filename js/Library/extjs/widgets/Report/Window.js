Ext.ns('OSDN.Report');

OSDN.Report.Window = Ext.extend(Ext.Window, {
    
    title: lang('Report dialog'),
    
    iconCls: 'osdn-reports',
    
    width: 300,
    
    height: 220,

    layout:'fit',

    pdf: true,
    xml: false,
    sxls: false,
    xls: true,
    rtf: true,
    
    module: null,
    controller: null,
    action: null,
    params: {},
    
    initComponent: function() {
        
        var formats = {
            pdf: 'PDF',
            xml: 'XML',
            sxls: 'Excel',
            xls: 'Excel',
            rtf: 'Word'
        };

        var iwidth = 128;
        var tpl = new Ext.XTemplate(
            '<tpl for=".">',
                '<a href="{url}" target="_blank" style="width: 128px; display: block; float: left;text-decoration: none" qtip="{qtip}">',
                    '<img width="128" height="128" src="{img}" title="{name}" qtip="{qtip}"/><br/>',
                    '<div style="text-align: center; width: 128px;color: #000"><b qtip="{qtip}">{shortName}</b></div>',
                 '</a>',
            '</tpl>'
        ).compile();

        var items = [];
        for(var i in formats) {
            if (!this[i]) {
                continue;
            }
            
            items.push(tpl.apply({
                img: '/images/fileformat/' + i + '.png',
                name: formats[i],
                shortName: formats[i],
                url: link(this.module, this.controller, this.action, Ext.apply(this.params || {}, {
                    format: i
                }), 'html'),
                qtip: lang('Click to download &quot;{0}&quot; report.', formats[i])
            }));
        }        
        
        this.width = (iwidth * items.length + 20) || 100; 
        
        this.items = [{
            border: false,
            autoScroll: true,
            html: items.join("\n")
        }];
        
        this.buttons = [{
            text: lang('Close'),
            handler: function() {
                this.close();
            },
            scope: this
        }];
        
        OSDN.Report.Window.superclass.initComponent.apply(this, arguments);
        this.on('render', function() {
            var b = this.items.first().body;
            b.select('a').on('click', function() {
                this.close.defer(50, this);    
            }, this);
            
        }, this, {delay: 50});
    }
});