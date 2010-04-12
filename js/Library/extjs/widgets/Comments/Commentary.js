Ext.ns('OSDN.Comments');

OSDN.Comments.CommentaryForm = Ext.extend(OSDN.form.FormPanel, {
    
    border: false,
    
    monitorResize: true,
    
    bodyStyle: {
        padding: '5px'
    },
    
    history: false,
    
    initComponent: function() {

        this.reader = new Ext.data.JsonReader({
            root: 'rows',
            id: 'id'
        }, ['title', 'bodytext', 'commenttype_id', 
            {name: 'account_id', mapping: 'notificated_account_id'},
            {name: 'action_id', mapping: 'notificated_action'},
            'history', 'creator_account_name'
        ]);
        
        this.initialConfig.reader = this.reader;    // hack for basicform
        var combo = new OSDN.form.ComboBox({
            fieldLabel: lang('Comment type'),
            store: new Ext.data.Store({
                url: this.typesUrl,
                reader: new Ext.data.JsonReader({
                    root: 'types',
                    id: 'id'
                }, ['id', 'name']),
                autoLoad: true,
                scope: this
            }),
            valueField: 'id',
            displayField: 'name',
            triggerAction: 'all',
            editable: false,
            hiddenName: 'commenttype_id',
            name: 'commenttype_id',
            anchor: '0'
        });
        
        this.items = [];

        if (this.history) {
            this.items.push({
                xtype: 'fieldset',
                dataIndex: 'history',
                title: lang('History'),
                collapsible: true,
                maxHeight: true,
                autoHeight: true,
                autoScroll: true
            });
        } else {
            this.items.push({
                fieldLabel: lang('Title'),
                name: 'title'
            });
        }
        
        this.items = this.items.concat([{
            name: 'bodytext',
            xtype: 'textarea',
            fieldLabel: lang('Text'),
            allowBlank: true,
            height: 100,
            anchor: '-1'        // fix facking bug in IE
        }, combo, {
            xtype: 'osdn.accounts.accounts-combo',
            fieldLabel: lang('Email address'),
            anchor: '0',
            name: 'account_id',
            extended: true,
            autoLoad: true,
            disabled: true
        }, {
            xtype: 'combo',
            fieldLabel: lang('Action'),
            store: [
                [1, lang('Response is needed')],
                [2, lang('Notification only')]
            ],
            triggerAction: 'all',
            mode: 'local',
            editable: false,
            name: 'action_id',
            hiddenName: 'action_id',
            disabled: true
        }]);
        
        OSDN.Comments.CommentaryForm.superclass.initComponent.apply(this, arguments);
        combo.on('select', function(c, record) {
            this.onSelectValue(record.get('id'));
        }, this);
        
        this.getForm().on('actioncomplete', function(f, action) {
            if (action.type == 'load') {
                this.onSelectValue(action.result.data.commenttype_id, true);
                this.onShowReply(action.result.data);
            }
        }, this);
    },
    
    onShowReply: function(data) {
        
        if (this.history && data.history) {
            var t = new Ext.XTemplate(
                '<ol style="list-style: decimal outside; margin-left: 23px">',
                '<tpl for=".">',
                    '<li>',
                    '<b>{title}</b><br />',
                    '{[fm.nl2br(values.bodytext)]}<br />',
                    '<div style="float: right"><i>{[lang("Owner:")]} {[values.creator_account_name || lang("Anonymous")]}</i>&nbsp;</div><br style="clear: both" />',
                    '<tpl if="3 == commenttype_id">',
                        '<i style="margin-left: 25px;">{[lang("Send to:")]}</i>&nbsp;&nbsp;',
                        '<a href=\'mailto: ',
                            '"{[values.name || lang("Anonymous")]}"',
                            ' &lt;{[(values.email || lang("Empty email"))]}&gt;',
                        '\'>',
                            '"{[values.name || lang("Anonymous")]}"',
                            ' &lt;{[(values.email || lang("Empty email"))]}&gt;',
                        '</a>',
                    '</tpl>',
                    '</li>',
                '</tpl>',
                '</ol>'
            ).compile();
            
            var history = null;
            this.items.each(function(i) {
                if (i.dataIndex == 'history') {
                    history = i;
                    return false;
                }
            }, this);
        
            if (history) {
                t.overwrite(history.body, data.history);
                var height = history.getSize()['height'];
                if (height < 150) {
                    return;
                } 
                
                history.body.setOverflow('auto');
                history.body.setHeight(150);
            }
        }

    },
    
    onSelectValue: function(id, load) {
        var accounts = this.getForm().findField('account_id');
        var action = this.getForm().findField('action_id');
        var commentaryType = this.getForm().findField('commenttype_id');
        
        var disabled = 3 != id;
        if (disabled && true === load) {
            accounts.reset();
            action.reset();
        }

        accounts.setDisabled(disabled || (!disabled && true === load));
        action.setDisabled(disabled || (!disabled && true === load));
        commentaryType.setDisabled(!disabled && true === load);
    }    
});

Ext.reg('osdn.comments.commentaryform', OSDN.Comments.CommentaryForm);