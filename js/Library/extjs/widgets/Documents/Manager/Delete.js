Ext.namespace('OSDN.Documents.Manager');

OSDN.Documents.Manager.Delete = function (config) {
	Ext.Msg.show({
		title: lang('Question'),
		msg: lang('Are you sure?'),
		buttons: Ext.Msg.YESNO,
		fn: function (b){
			if ('yes' == b) {
				Ext.Ajax.request({
				   url: config.url,
				   success: config.success || function (){},
				   failure: config.failure || function (){},
				   params: config.params || {}
				});
			}
		},
		icon: Ext.MessageBox.QUESTION
	});
}