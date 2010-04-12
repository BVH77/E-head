Ext.namespace('OSDN.Documents.TypeManager');

OSDN.Documents.TypeManager.Delete = function (config) {
	Ext.Msg.show({
		title: lang('Question'),
		msg: lang('Are you sure?'),
		buttons: Ext.Msg.YESNO,
		fn: function (b){
			if ('yes' == b) {
				Ext.Ajax.request({
					url: config.url,
					success: function (response, options){
						if (!Ext.decode(response.responseText).success) {
							Ext.Msg.show({
							   title: lang('Error!'),
							   msg: lang('You cannot delete because some documents of this type are already uploaded!'),
							   buttons: Ext.Msg.OK,
							   icon: Ext.MessageBox.ERROR
							});
						} else {
							config.success(response, options);
						}
					},
					failure: function (response, options) {
						config.failure(response, options)
					},
					params: config.params || {}
				});
			}
		},
		icon: Ext.MessageBox.QUESTION
	});
}
