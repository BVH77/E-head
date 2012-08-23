Ext.ns('PMS.Orders.Edit');

PMS.Orders.Edit.MountBudgetView = Ext.extend(Ext.Panel, {
    
    title: 'Смета',
    
    layout: 'fit',
    
    cls: 'x-border-top',
    
    region: 'south',
            
    height: 270,
    
    autoScroll: true,
            
    border: false,
    
    initComponent: function() {

        this.template = new Ext.XTemplate(
            '<style>#t td {border-style: solid; border-color: #99BBE8; ' +
            'border-width: 0 0 1px; padding: 3px;}</style>' +
            '<table id="t" width="100%" cellspacing="0">' +
            '<tr style="text-align: center; font-weight: 900; background-color: #FCF400;">' +
            '<td>Наименование</td>' +           
            '<td width="70">Ед. изм.</td>' +           
            '<td width="70">Кол-во</td>' +           
            '<td width="70">Цена</td>' +           
            '<td width="70">Сумма</td>' +           
            '<td width="70">Наценка</td>' +           
            '<td width="70">Стоимость</td>' +
            '</tr>' +
            '<tr><td colspan="7" style="background-color: lightgreen;">' +
            '<b>Выезд на замеры (Москва и обл.)</b></td></tr>' +
            '<tr>' +
            '<td align="left">Выезд технического специалиста</td>' +
            '<td align="center">смена</td>' +
            '<td align="center">{f1_qty}</td>' +
            '<td align="right">{f1_price} р.</td>' +
            '<td align="right">{f1_summ} р.</td>' +
            '<td align="center">{f1_margin}</td>' +
            '<td align="right">{f1_total} р.</td>' +
            '</tr>' +
            '<tr>' +
            '<td align="left">Транспортные расходы: {f2_dest} {f2_distance}</td>' +
            '<td align="center">км</td>' +
            '<td align="center">{f2_qty}</td>' +
            '<td align="right">{f2_price} р.</td>' +
            '<td align="right">{f2_summ} р.</td>' +
            '<td align="center">{f2_margin}</td>' +
            '<td align="right">{f2_total} р.</td>' +
            '</tr>' +
            '<tr>' +
            '<td colspan="4"></td>' +
            '<td align="right" style="background-color: #FCF400;">{g1_summ} р.</td>' +
            '<td></td>' +
            '<td align="right" style="background-color: #FCF400;">{g1_total} р.</td>' +
            '</tr>' +
            '<tr><td colspan="7" style="background-color: lightgreen;">' +
            '<b>Выезд на замеры (другой город)</b></td></tr>' +
            '<tr>' +
            '<td align="left">Билеты туда и обратно: {f3_transport}, {f3_people} человек</td>' +
            '<td align="center">ед.</td>' +
            '<td align="center">{f3_qty}</td>' +
            '<td align="right">{f3_price} р.</td>' +
            '<td align="right">{f3_summ} р.</td>' +
            '<td align="center">{f3_margin}</td>' +
            '<td align="right">{f3_total} р.</td>' +
            '</tr>' +
            '<tr>' +
            '<td align="left">Командировочные, питание: {f4_people} человек, {f4_days} дней</td>' +
            '<td align="center">чел/дни</td>' +
            '<td align="center">{f4_qty}</td>' +
            '<td align="right">{f4_price} р.</td>' +
            '<td align="right">{f4_summ} р.</td>' +
            '<td align="center">{f4_margin}</td>' +
            '<td align="right">{f4_total} р.</td>' +
            '</tr>' +
            '<tr>' +
            '<td align="left">Командировочные, проживание: {f5_people} человек, {f5_days} дней</td>' +
            '<td align="center">чел/дни</td>' +
            '<td align="center">{f5_qty}</td>' +
            '<td align="right">{f5_price} р.</td>' +
            '<td align="right">{f5_summ} р.</td>' +
            '<td align="center">{f5_margin}</td>' +
            '<td align="right">{f5_total} р.</td>' +
            '</tr>' +
            '<tr>' +
            '<td colspan="4"></td>' +
            '<td align="right" style="background-color: #FCF400;">{g2_summ} р.</td>' +
            '<td></td>' +
            '<td align="right" style="background-color: #FCF400;">{g2_total} р.</td>' +
            '</tr>' +
            '<tr><td colspan="7" style="background-color: lightgreen;">' +
            '<b>Монтаж (Москва и область)</b></td></tr>' +
            '<tr>' +
            '<td align="left">Автовышка {f6_params}</td>' +
            '<td align="center">смена</td>' +
            '<td align="center">{f6_qty}</td>' +
            '<td align="right">{f6_price} р.</td>' +
            '<td align="right">{f6_summ} р.</td>' +
            '<td align="center">{f6_margin}</td>' +
            '<td align="right">{f6_total} р.</td>' +
            '</tr>' +
            '<tr>' +
            '<td align="left">Автокран {f7_params}</td>' +
            '<td align="center">смена</td>' +
            '<td align="center">{f7_qty}</td>' +
            '<td align="right">{f7_price} р.</td>' +
            '<td align="right">{f7_summ} р.</td>' +
            '<td align="center">{f7_margin}</td>' +
            '<td align="right">{f7_total} р.</td>' +
            '</tr>' +
            '<tr>' +
            '<td align="left">Монтажные работы, бригада: {f8_people} человек, {f8_days} дней</td>' +
            '<td align="center">чел/часы</td>' +
            '<td align="center">{f8_qty}</td>' +
            '<td align="right">{f8_price} р.</td>' +
            '<td align="right">{f8_summ} р.</td>' +
            '<td align="center">{f8_margin}</td>' +
            '<td align="right">{f8_total} р.</td>' +
            '</tr>' +
            '<tr>' +
            '<td align="left">Доставка (грузовая техника): {f9_params}</td>' +
            '<td align="center">смена</td>' +
            '<td align="center">{f9_qty}</td>' +
            '<td align="right">{f9_price} р.</td>' +
            '<td align="right">{f9_summ} р.</td>' +
            '<td align="center">{f9_margin}</td>' +
            '<td align="right">{f9_total} р.</td>' +
            '</tr>' +
            '<tr>' +
            '<td align="left">Транспортные расходы по Москве</td>' +
            '<td align="center">смена</td>' +
            '<td align="center">{f10_qty}</td>' +
            '<td align="right">{f10_price} р.</td>' +
            '<td align="right">{f10_summ} р.</td>' +
            '<td align="center">{f10_margin}</td>' +
            '<td align="right">{f10_total} р.</td>' +
            '</tr>' +
            '<tr>' +
            '<td colspan="4"></td>' +
            '<td align="right" style="background-color: #FCF400;">{g3_summ} р.</td>' +
            '<td></td>' +
            '<td align="right" style="background-color: #FCF400;">{g3_total} р.</td>' +
            '</tr>' +
            '<tr><td colspan="7" style="background-color: lightgreen;">' +
            '<b>Командировочные (если монтаж в другом городе)</b></td></tr>' +
            '<tr>' +
            '<td align="left">Транспортные расходы: {f11_dest} {f11_distance}</td>' +
            '<td align="center">км</td>' +
            '<td align="center">{f11_qty}</td>' +
            '<td align="right">{f11_price} р.</td>' +
            '<td align="right">{f11_summ} р.</td>' +
            '<td align="center">{f11_margin}</td>' +
            '<td align="right">{f11_total} р.</td>' +
            '</tr>' +
            '<tr>' +
            '<td align="left">Командировочные, питание: {f12_people} человек, {f12_days} дней</td>' +
            '<td align="center">чел/дни</td>' +
            '<td align="center">{f12_qty}</td>' +
            '<td align="right">{f12_price} р.</td>' +
            '<td align="right">{f12_summ} р.</td>' +
            '<td align="center">{f12_margin}</td>' +
            '<td align="right">{f12_total} р.</td>' +
            '</tr>' +
            '<tr>' +
            '<td align="left">Командировочные, проживание: {f13_people} человек, {f13_days} дней</td>' +
            '<td align="center">чел/дни</td>' +
            '<td align="center">{f13_qty}</td>' +
            '<td align="right">{f13_price} р.</td>' +
            '<td align="right">{f13_summ} р.</td>' +
            '<td align="center">{f13_margin}</td>' +
            '<td align="right">{f13_total} р.</td>' +
            '</tr>' +
            '<tr>' +
            '<td colspan="4"></td>' +
            '<td align="right" style="background-color: #FCF400;">{g4_summ} р.</td>' +
            '<td></td>' +
            '<td align="right" style="background-color: #FCF400;">{g4_total} р.</td>' +
            '</tr>' +
            '<tr><td colspan="7" style="background-color: lightgreen;">' +
            '<b>Дополнительно</b></td></tr>' +
            '<tr>' +
            '<td align="left">Утилизация конструкций</td>' +
            '<td align="center">контейнер</td>' +
            '<td align="center">{f14_qty}</td>' +
            '<td align="right">{f14_price} р.</td>' +
            '<td align="right">{f14_summ} р.</td>' +
            '<td align="center">{f14_margin}</td>' +
            '<td align="right">{f14_total} р.</td>' +
            '</tr>' +
            '<tr>' +
            '<td align="left">Непредвиденные расходы (ложный выезд и др.): {f15_descr}</td>' +
            '<td align="center"></td>' +
            '<td align="center">{f15_qty}</td>' +
            '<td align="right">{f15_price} р.</td>' +
            '<td align="right">{f15_summ} р.</td>' +
            '<td align="center">{f15_margin}</td>' +
            '<td align="right">{f15_total} р.</td>' +
            '</tr>' +
            '<tr>' +
            '<td align="left">Непредвиденные расходы (ложный выезд и др.): {f16_descr}</td>' +
            '<td align="center"></td>' +
            '<td align="center">{f16_qty}</td>' +
            '<td align="right">{f16_price} р.</td>' +
            '<td align="right">{f16_summ} р.</td>' +
            '<td align="center">{f16_margin}</td>' +
            '<td align="right">{f16_total} р.</td>' +
            '</tr>' +
            '<tr>' +
            '<td align="left">Непредвиденные расходы (ложный выезд и др.): {f17_descr}</td>' +
            '<td align="center"></td>' +
            '<td align="center">{f17_qty}</td>' +
            '<td align="right">{f17_price} р.</td>' +
            '<td align="right">{f17_summ} р.</td>' +
            '<td align="center">{f17_margin}</td>' +
            '<td align="right">{f17_total} р.</td>' +
            '</tr>' +
            '<tr>' +
            '<td colspan="4"></td>' +
            '<td align="right" style="background-color: #FCF400;">{g5_summ} р.</td>' +
            '<td></td>' +
            '<td align="right" style="background-color: #FCF400;">{g5_total} р.</td>' +
            '</tr>' +
            '<tr><td colspan="7">&nbsp;</td></tr>' +
            '<tr style="background-color: #FCF400;">' +
            '<td align="right" colspan="3"><b>ИТОГО:</b></td>' +
            '<td align="right" colspan="2"><b>{grand_summ} р.</b></td>' +
            '<td align="right" colspan="2"><b>{grand_total} р.</b></td>' +
            '</tr>' +
            '</table>'
        );
        
        PMS.Orders.Edit.MountBudgetView.superclass.initComponent.apply(this, arguments);
    },
    
    fillPanel: function(data) {
        data = this.calc(data);
        this.update(this.template.apply(data));
    },
    
    calc: function(data) {
        
        var grand_summ = 0, grand_total = 0;
        
        data.f1_margin = 1.25;
        data.f2_margin = 1.30;
        data.f3_margin = 1.25;
        data.f4_margin = 1.25;
        data.f5_margin = 1.25;
        data.f6_margin = 1.30;
        data.f7_margin = 1.30;
        data.f8_margin = 1.30;
        data.f9_margin = 1.30;
        data.f10_margin = 1.30;
        data.f11_margin = 1.30;
        data.f12_margin = 1.25;
        data.f13_margin = 1.25;
        data.f14_margin = 1.30;
        data.f15_margin = 1;
        data.f16_margin = 1;
        data.f17_margin = 1;
        
        for (var i=1; i<=17; i++) {
            
            var summ = parseFloat(data['f' + i + '_qty']) * parseFloat(data['f' + i + '_price']),
                total = summ * parseFloat(data['f' + i + '_margin']);
            
            data['f' + i + '_summ'] = summ.toFixed(2);
            data['f' + i + '_total'] = total.toFixed(2);
            
            grand_summ = grand_summ + parseFloat(summ); 
            grand_total = grand_total + parseFloat(total);
        }
        
        data.grand_summ = grand_summ.toFixed(2); 
        data.grand_total = grand_total.toFixed(2);
        
        // Calc GROUPS
        
        // group 1
        var g_summ = 0, g_total = 0;
        for (var i=1; i<=2; i++) {
            g_summ = g_summ + parseFloat(data['f' + i + '_summ']); 
            g_total = g_total + parseFloat(data['f' + i + '_total']);
        }
        data.g1_summ = g_summ.toFixed(2);
        data.g1_total = g_total.toFixed(2);
        
        // group 2
        var g_summ = 0, g_total = 0;
        for (var i=3; i<=5; i++) {
            g_summ = g_summ + parseFloat(data['f' + i + '_summ']); 
            g_total = g_total + parseFloat(data['f' + i + '_total']);
        }
        data.g2_summ = g_summ.toFixed(2);
        data.g2_total = g_total.toFixed(2);
        
        // group 3
        var g_summ = 0, g_total = 0;
        for (var i=6; i<=10; i++) {
            g_summ = g_summ + parseFloat(data['f' + i + '_summ']); 
            g_total = g_total + parseFloat(data['f' + i + '_total']);
        }
        data.g3_summ = g_summ.toFixed(2);
        data.g3_total = g_total.toFixed(2);
        
        // group 4
        var g_summ = 0, g_total = 0;
        for (var i=11; i<=13; i++) {
            g_summ = g_summ + parseFloat(data['f' + i + '_summ']); 
            g_total = g_total + parseFloat(data['f' + i + '_total']);
        }
        data.g4_summ = g_summ.toFixed(2);
        data.g4_total = g_total.toFixed(2);
        
        // group 5
        var g_summ = 0, g_total = 0;
        for (var i=14; i<=17; i++) {
            g_summ = g_summ + parseFloat(data['f' + i + '_summ']); 
            g_total = g_total + parseFloat(data['f' + i + '_total']);
        }
        data.g5_summ = g_summ.toFixed(2);
        data.g5_total = g_total.toFixed(2);
        
        return data;
    }
});
