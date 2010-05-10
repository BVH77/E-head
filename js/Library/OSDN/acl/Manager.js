Ext.ns('xlib');

/**
 * Default acl manager
 * 
 * @version $Id: Manager.js 9298 2009-06-03 06:57:41Z uerter $
 */
xlib.AclManager = function() {
    
    var privileges = OSDN.Acl.Storage.Privileges || {};
    var permissions = OSDN.Acl.Storage.Permissions || {};
    var resources = new Ext.util.MixedCollection();
    var disabled = OSDN.Acl.Storage.isSuperAdministrator();
//    var workflowPermissions = OSDN.Acl.Storage.getWorkflowPermissions() || {};
    
    
    Ext.each(OSDN.Acl.Storage.getResources(), function(i, index) {
        resources.add(i[0], {
            name: i[1],
            parent: i[2] || false
        });
    });
    
    return {
        
        isView: function() {
            if (disabled) {
                return true;
            }
            
            var resourceId = this.fetchResource.apply(this, arguments);
            return this.isAllowedPrivilege(resourceId, OSDN.Acl.Storage.getPrivileges().view);
        },
        
        isAdd: function() {
            if (disabled) {
                return true;
            }
            
            var resourceId = this.fetchResource.apply(this, arguments);
            return this.isAllowedPrivilege(resourceId, OSDN.Acl.Storage.getPrivileges().add);
        },
        
        isUpdate: function() {
            if (disabled) {
                return true;
            }
            
            var resourceId = this.fetchResource.apply(this, arguments);
            return this.isAllowedPrivilege(resourceId, OSDN.Acl.Storage.getPrivileges().update);
        },
        
        isDelete: function() {
            if (disabled) {
                return true;
            }
            
            var resourceId = this.fetchResource.apply(this, arguments);
            return this.isAllowedPrivilege(resourceId, OSDN.Acl.Storage.getPrivileges()['delete']);
        },
        
        isAllowedPrivilege: function(resourceId, privilege) {
            
            var collection = OSDN.Acl.Storage.getPermissions()[resourceId];
            if (!collection || !Ext.isArray(collection)) {
                return false;
            }

            if (-1 == collection.indexOf(new String(privilege).toString())) {
                return false;
            }
            
            return true;
        },
        
        isAllowedWorkflow: function(name, step) {
            
            name = String(name).toLowerCase();
            
            if (!Ext.isArray(workflowPermissions[name])) {
                return false;
            }
            
            return -1 != workflowPermissions[name].indexOf(String(step).toLowerCase());
        },
        
        fetchResource: function(resource) {
            
            var resourceId = false;
            for (var i = 0, l = arguments.length; i < l; i++) {
                var resourceId = this.fetchByParent(arguments[i], resourceId);
                if (false == resourceId) {
                    break;
                }
            }
            
            if (false === resourceId) {
                var p = [];
                for(var i = 0, l = arguments.length; i < l; i++) {
                    p.push(arguments[i]);
                }
                
                if (OSDN.DEBUG) {
                    Ext.Ajax.request({
                        url: link('admin', 'acl', 'insert-resource'),
                        params: {
                            resource: p.join(',')
                        },
                        scope: this
                    });
                }
            }
            
            return resourceId;
        },
        
        fetchByParent: function(resource, parent) {
            
            var resource = resource.toLowerCase();
            var resourceId = false;
            
            var resourceObj = resources.find(function(item, key) {
                if (resource == item.name) {
                    if (false == parent || item.parent == parent) {
                        resourceId = key;
                        return true;
                    }
                }
            });
            
            return resourceId;
        }
    };
}();

acl = xlib.AclManager;