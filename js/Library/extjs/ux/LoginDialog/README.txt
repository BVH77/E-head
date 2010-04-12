License : LGPLv3 http://www.opensource.org/licenses/lgpl-3.0.html
Author  : Albert Varaksin
Version : 1.0 Beta

About LoginDialog
===========================
This is a simple login dialog extension for Ext 2.x library

Some days ago I was looking for a nice login dialog for my web application to avoid spending time on creating one. Maybe I am blind or otherwise unfortunate and missed something - but I didn't find any that would suit my needs.

The only extension I found was Ext.ux.Domino.LoginMenu by galdaka ( http://extjs.com/learn/Extension:Domino_authentication ) but that seemed rather over complicated and not flexible enough for my simple needs. But I did take few ideas and an icon from there. (Thanks Galdaka!)

Anyway this is what I created and hope you will find it useful. It's free and open source. Would be nice if you credit me but that's up to you.

How it works
==============
Simple! You create an instance of it and pass at least 2 config options
a) the server URL where to submit form data and b) the path where the images are
stored (they are sort of optional. Doesn't break the functionality if missing)

The server has to return the response in JSON format:
{
    success : true or false,
    message : 'the message to show if login failed'
}

And that's IT! You can also customize the loginDialog to suit your needs better.
Anyway here is a small example:

    <script type="text/javascript" src="/LoginDialog.js"></script>
    <script type="text/javascript">
        Ext.onReady (function () {
            var loginDlg = new Ext.ux.albeva.LoginDialog({
                url : '/auth/login', // where the request is submitted to
                basePath : "/images" // do not add trailing slash!
            });
        });
    </script>

Of course you need to load ExtJS library as well. The dialog has some more 
useful config options, some methods and callback events.


Config options
==============
title : String
    The title of the LoginDialog window

message : String
    The message to show on the dialog window

failMessage : String
    Default error message shown when login fails.
    Server may return a custom message. If so then
    server message is displayed instead
    Default : Unable to log in

waitMessage : String
    Message shown when request is sent to the server (Action.waitMsg)
    Default : Logging in ...
    
loginButton : String
    Text on the login button
    Default : Login
    
cancelButton : String
    If set then a secondary button will be shown with text provided. For example "Cancel"
    Default : Null

usernameLabel : String
    Field title for username
    Default : Username

usernameField : String
    Username field name

usernameId : String
    Username field id
    Default : Ext.id()

usernameVtype : String
    Username field validation
    Default : alphanum

passwordLabel : String
    Field title for password
    Default : Password

passwordField : String
    Password field name

passwordId : String
    Password field id
    Default : Ext.id()

passwordVtype : String
    Password field validation
    Default : alphanum

url : String
    URL where the request is submitted
    Required config option!

basePath : String
    Path where the images are located
    Default : /

method : String
    The method used to submit the request
    Default : post
    
modal : Bool
    Is the dialog modal or not?
    Default : false


Methods :
=========
show (element)
    This will show the LoginDualog. element is for animation (Ext.Window::show())

close ()
    This will close (and destroy) the dialog window.
    
cancel ()
    This will cancel (quit) the window. Will send cancel event

submit ()
    Submit the login form

setMessage (String : msg)
    Set the LoginDialog message


Events :
==========
cancel (DialogWindow wnd)
    Is fired when cancel button (if set) was pressed. If returns false then
    cancel is aborted.

show (DialogWindow wnd)
    Is fired when dialog is fully loaded and visible.

submit (DialogWindow wnd, Object values)
    Is fired when login details are about to be submitted.
    Returning false will cancel

success (DialogWindow wnd, Ext.form.Action action)
    Is fired when login was successful. Returning false will
    prevent LoginDialog from closing.

failure (DialogWindow wnd, Ext.form.Action action, String message)
    Is fired when login was not successful. Error message is also passed
    to the event handler.
