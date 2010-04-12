/**
 * Free and simple to use loginDialog for ExtJS 2.x
 * 
 * @author Albert Varaksin
 * @license LGPLv3 http://www.opensource.org/licenses/lgpl-3.0.html
 * @version 1.0 beta
 */


/*
 * Put it into it's own namespace
 */
Ext.namespace('Ext.ux.albeva');


/**
 * Login dialog constructor
 * 
 * @param {Object}
 *            config
 * @extends {Ext.util.Observable}
 */
Ext.ux.albeva.LoginDialog = function (config)
{
    Ext.apply(this, config);
    
    // The CSS needed to style the dialog.
    // For perfomance this could be in a CSS file
    var css = ".ux-albeva-auth-lock-icon {background: url('" + this.basePath + "/lock-icon.gif') 0 6px no-repeat !important;}"
            + ".ux-albeva-auth-header {background:transparent url('"+this.basePath+"/login-big.gif') no-repeat center right;padding:12px;padding-right:45px;font-weight:bold;}"
            + ".ux-albeva-auth-header .error {color:red;}"
            + ".ux-albeva-auth-form {padding:10px;}";
    Ext.util.CSS.createStyleSheet(css, this._cssId);
    
    // LoginDialog events
    this.addEvents ({
        'show'      : true, // when dialog is visible and rendered
        'cancel'    : true, // When user cancelled the login
        'success'   : true, // on succesfful login
        'failure'   : true, // on failed login
        'submit'    : true  // about to submit the data
    });
    Ext.ux.albeva.LoginDialog.superclass.constructor.call(this, config);
    
    // head info panel
    this._headPanel = new Ext.Panel ({
        baseCls : 'x-plain',
        html    : this.message,
        cls     : 'ux-albeva-auth-header',
        region  : 'north',
        height  : 50
    });
    
    // set field id's
    this.usernameId = this.usernameId || Ext.id();
    this.passwordId = this.passwordId || Ext.id();
    
    this.extraFields = [];
    
    if (this.enabledRadius) {
        this.extraFields.push({
            xtype: 'textfield',
            name: 'digipass',
            fieldLabel: this.digipassLabel,
            maskRe: /^[\d]*$/,
            regex: /^[\d]{6}$/,
            regexText: this.digipassRegexText,
            allowBlank: true
        });
    }
    
    if (Ext.isArray(this.langs)) {
        var languages = [];
        Ext.each(this.langs, function(item){
            languages.push({
                boxLabel: item.caption,
                name: 'locale',
                checked: item['default'] || item.checked,
                inputValue: item.abbreviation
            })
        });
        
        if (languages.length > 0) { 
            this.extraFields.push({
                xtype: 'radiogroup',
                fieldLabel: this.languageLabel,
                name: 'locale',
                items: languages
            });
        }
    }
    
    var fields = [];
        
    if (Ext.isArray(this.topRegion)) {
        fields = fields.concat(this.topRegion);
    }
    
    fields = fields.concat([{
        xtype       : 'textfield',
        id          : this.usernameId,
        name        : this.usernameField,
        fieldLabel  : this.usernameLabel,
        vtype       : this.usernameVtype,
        allowBlank  : false
    }, {
        xtype       : 'osdnpasswordfield',
        id          : this.passwordId,
        name        : this.passwordField,
        fieldLabel  : this.passwordLabel,
        vtype       : this.passwordVtype,
        allowBlank  : false
    }].concat(this.extraFields));
    
    if (this.releaseInfo) {
    	fields.push({
    		xtype: 'label',
    		html: '<br/><div align="right">' + this.releaseInfo + '</div>'
    	});
    }
    
    // form panel
    this._formPanel = new Ext.form.FormPanel ({
        region      : 'center',
        autoHeight  : true,
        border      : false,
        bodyStyle   : "padding:10px;",
        labelWidth  : 100,
        defaults    : { width:160 },
        items : fields
    });
    
    // Default buttons and keys
    var buttons = [{
        text    : this.loginButtonText, 
        handler : this.submit,
        scope   : this
    }];
    var keys = [{
        key     : [10,13],
        handler : this.submit,
        scope   : this
    }];
    
    // if cancel button exists
    if (typeof this.cancelButton == 'string')
    {
        buttons.push({
            text    : this.cancelButton,
            handler : this.cancel,
            scope   : this
        });
        keys.push({
            key     : [27],
            handler : this.cancel,
            scope   : this
        });            
    }
    
    // create the window
    this._window = new Ext.Window ({
        width       : 320,
        autoHeight  : true,
        closable    : false,
        resizable   : false,
        modal       : this.modal,
        iconCls     : 'ux-albeva-auth-lock-icon',
        title       : this.title,
        buttons     : buttons,
        keys        : keys,
        shadow: false,
        items       : [this._headPanel, this._formPanel]
    });
    
    // when window is visible set focus to the username field
    // and fire "show" event
    this._window.on ('show', function () {
        Ext.getCmp(this.usernameId).focus(false, true);
        this.fireEvent('show', this);
    }, this);
    
    if (typeof this.success == 'function') {
        this.on('success', this.success, this);
    }
    
};


// Extend the Observable class
Ext.extend (Ext.ux.albeva.LoginDialog, Ext.util.Observable, {
    
    /**
	 * LoginDialog window title
	 * 
	 * @type {String}
	 */
    title: 'Authenticate',
    
    /**
	 * The message on the LoginDialog
	 * 
	 * @type {String}
	 */
    message: 'Login to system',
    
    /**
	 * When login failed and no server message sent
	 * 
	 * @type {String}
	 */
    failMessage: 'Unable to log in',
    
    /**
	 * When submitting the login details
	 * 
	 * @type {String}
	 */
    waitMessage: 'Logging in ...',
    
    /**
	 * The login button text
	 * 
	 * @type {String}
	 */
    loginButtonText: 'Login',
    
    /**
     * Top region collection
     * 
     * @type {Array}
     */
    topRegion: [],
    
    /**
	 * Cancel button
	 * 
	 * @type {String}
	 */
    cancelButton: null,
    
    /**
	 * Username field label
	 * 
	 * @type {String}
	 */
    usernameLabel: 'Username',
    
    /**
	 * Username field name
	 * 
	 * @type {String}
	 */
    usernameField: 'username',
    
    /**
	 * Username field id
	 * 
	 * @type {String}
	 */
    usernameId: null,
    
    /**
	 * Username validation
	 * 
	 * @type {String}
	 */
    usernameVtype: 'alphanum',
    
    /**
	 * Password field label
	 * 
	 * @type {String}
	 */
    passwordLabel: 'Password',
    
    /**
	 * Passowrd field name
	 * 
	 * @type {String}
	 */
    passwordField: 'password',
    
    /**
	 * Password field id
	 * 
	 * @type {String}
	 */
    passwordId: null,
    
    /**
	 * Password field validation
	 * 
	 * @type {String}
	 */
    passwordVtype: 'alphanum',
    
    /**
	 * Request url
	 * 
	 * @type {String}
	 */
    url: '/auth/login/',
    
    /**
	 * Path to images
	 * 
	 * @type {String}
	 */
    basePath: '/',
    
    /**
	 * Form submit method
	 * 
	 * @type {String}
	 */
    method: 'post',
    
    /**
	 * Open modal window
	 * 
	 * @type {Bool}
	 */
    modal: true,
    
    /**
	 * Show radius field
	 * 
	 * @type {Bool}
	 */
    enabledRadius: false,
    
    /**
     * Digipass field label
     * 
     * @type {string}
     */
    digipassLabel: 'Digipass',
    
    /**
     * Digipass validation text
     * 
     * @type {string}
     */
    digipassRegexText: 'Field must contain only 6 digits [XXXXXX]',
    
    /**
	 * Language field label
	 * 
	 * @type {String}
	 */
    languageLabel: 'Language',
    
    /**
	 * CSS identifier
	 * 
	 * @type {String}
	 */
    _cssId: 'ux-albeva-auth-css',
    
    /**
	 * Head info panel
	 * 
	 * @type {Ext.Panel}
	 */
    _headPanel: null,
    
    /**
	 * Form panel
	 * 
	 * @type {Ext.form.FormPanel}
	 */
    _formPanel: null,
    
    /**
	 * The window object
	 * 
	 * @type {Ext.Window}
	 */
    _window: null,
    
    /**
	 * Set the LoginDialog message
	 * 
	 * @param {String}
	 *            msg
	 */
    setMessage: function (msg)
    {
        this._headPanel.body.update(msg);
    },
    
    
    /**
	 * Show the LoginDialog
	 * 
	 * @param {Ext.Element}
	 *            el
	 */
    show : function (el)
    {
        this._window.show(el);
    },
    
    
    /**
	 * Close the LoginDialog and cleanup
	 */
    close : function () 
    {
        this._window.close();
        this.purgeListeners();
        Ext.util.CSS.removeStyleSheet(this._cssId);
        var self = this;
        delete self;
    },
    
    
    /**
	 * Cancel the login (closes the dialog window)
	 */
    cancel : function ()
    {
        if (this.fireEvent('cancel', this))
        {
            this.close();
        }
    },
    
    
    /**
	 * Submit login details to the server
	 */
    submit : function ()
    {
        var form = this._formPanel.getForm();
        if (form.isValid())
        {
            if (this.fireEvent('submit', this, form.getValues()))
            {
                this.setMessage (this.message);
                form.submit ({
                    url     : this.url,
                    method  : this.method,
                    waitMsg : this.waitMessage,
                    success : this.onSuccess,
                    failure : this.onFailure,
                    scope   : this
                });
            }
        }
    },
    
    
    /**
	 * On success
	 * 
	 * @param {Ext.form.BasicForm}
	 *            form
	 * @param {Ext.form.Action}
	 *            action
	 */
    onSuccess : function (form,action)
    {
        if (this.fireEvent('success', this, action)) this.close();
    },
    
    
    /**
	 * On failures
	 * 
	 * @param {Ext.form.BasicForm}
	 *            form
	 * @param {Ext.form.Action}
	 *            action
	 */
    onFailure : function (form,action)
    {
        var msg = '';
        if (action.result && action.result.message) msg = action.result.message || this.failMessage;
        else msg = this.failMessage;
        this.setMessage (this.message + '<br /><span class="error">' + msg + '</span>');
        this.fireEvent('failure', this, action, msg);
    }
    
});
