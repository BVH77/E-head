Ext.ns('PMS.Orders');

PMS.Orders.Info = Ext.extend(Ext.Panel, {

    loadLink: link('orders', 'index', 'get-info'),
    
    autoScroll: true,
    
    layout: 'fit',
    
    monitorResize: true,
    
    initComponent: function() {
        var template = '<tpl for="."><table cellspacing="5" cellpadding="5" class="x-grid3-row">'+
                        '<tr><td width="150"><b>№ заказа:</b></td><td width="150">{id}</td>'+
                        '<td rowspan="0" class="x-osdn-border-left" style="padding-left: 8px;">'+
                            '<b>Поставщики:</b><br/>'+
                            '<tpl for="suppliers" if="values.suppliers">'+
                                '<li style="list-style-position: inside; list-style-type: {[values.success == 1 ? "disc" : "circle"]};">{name}'+
                            '</tpl>'+
                            '<br/><br/><b>Субподрядчики:</b><br/>'+
                            '<tpl for="subcontractors" if="values.subcontractors">'+
                                '<li style="list-style-position: inside; list-style-type: {[values.success == 1 ? "disc" : "circle"]};">{name}'+
                            '</tpl>'+
                        '</td></tr>'+
                        '<tr><td><b>Заказчик:</b></td><td>{customer_name}</td></tr>'+
                        '<tr><td><b>Адрес:</b></td><td>{address}</td></tr>'+
                        '<tr><td><b>Начало пр-ва (план):</b></td><td>{[this.dr(values.production_start_planned)]}</td></tr>'+
                        '<tr><td><b>Начало пр-ва (факт):</b></td><td>{[this.dr(values.production_start_fact)]}</td></tr>'+
                        '<tr><td><b>Конец пр-ва (план):</b></td><td>{[this.dr(values.production_end_planned)]}</td></tr>'+
                        '<tr><td><b>Конец пр-ва (факт):</b></td><td>{[this.dr(values.production_end_fact)]}</td></tr>'+
                        '<tr><td><b>Начало монтажа (план):</b></td><td>{[this.dr(values.mount_start_planned)]}</td></tr>'+
                        '<tr><td><b>Начало монтажа (факт):</b></td><td>{[this.dr(values.mount_start_fact)]}</td></tr>'+
                        '<tr><td><b>Конец монтажа (план):</b></td><td>{[this.dr(values.mount_end_planned)]}</td></tr>'+
                        '<tr><td><b>Конец монтажа (факт):</b></td><td>{[this.dr(values.mount_end_fact)]}</td></tr>'+
                        '<tr><td><b>Сдача (план):</b></td><td>{[this.dr(values.success_date_planned)]}</td></tr>'+
                        '<tr><td><b>Сдача (факт):</b></td><td>{[this.dr(values.success_date_fact)]}</td></tr>';
        if (acl.isView('orders', 'cost')) {
            template += '<tr><td><b>Стоимость:</b></td><td>{[this.nr(values.cost)]}</td></tr>'+
                        '<tr><td><b>Аванс:</b></td><td>{[this.nr(values.advanse)]}</td></tr>';
        }
        template += '<tr><td><b>Дата/время заказа:</b></td><td>{[this.dtr(values.created)]}</td></tr>'+
                    '<tr><td><b>Заказ добавил:</b></td><td>{creator_name}</td></tr>'+
                    '<tr><td colspan="2"><b>Описание заказа:</b></td></tr>'+
                    '<tr><td colspan="2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{[this.tr(values.description)]}</td></tr>'+
        '</table></tpl>'; 
        
        this.tpl = new Ext.XTemplate(template, {
                nr: function(v) {return v == null ? '' : v;}, 
                tr: function(v) {return v == null ? '' : v;}, 
                dr: OSDN.util.Format.dateRenderer(OSDN.date.DATE_FORMAT),
                dtr: OSDN.util.Format.dateRenderer(OSDN.date.DATE_TIME_FORMAT)
            }
        );
		
        PMS.Orders.Info.superclass.initComponent.apply(this, arguments);
    },
    
    loadData: function(record) {
        this.tpl.overwrite(this.body, record.data);
    }
});