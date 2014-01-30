define(['storage', 'localfile', 'remotefile', 'communication'], function(storage, lfile, rfile, cmd) {
    
    var cP = function(name) {
        this._name = name;
        this._dir = null;
        this._config = {};
        this._local = undefined;
        this.ready = null;
    };
    
    cP.prototype.constructor = cP;
    
    cP.prototype.init = function() {
        
    };
    
    cP.prototype.save = function() {
        
    };
    
    cP.prototype.isLocal = function() {
        return this._local;
    };
    cP.prototype.isRemote = function() {
        return this._local === undefined ? undefined : !this._local;
    };
    
    cP.prototype.getLabel = function() {
        
    };
    cP.prototype.getFullPath = function() {
        
    };
    cP.prototype.getFiletree = function() {
        
    };
    
    cP.prototype.readFile = function() {
        
    };
    cP.prototype.writeFile = function() {
        
    };
    
    cP.prototype.create = function() {
        
    };
    cP.prototype.rename = function() {
        
    };
    cP.prototype.remove = function() {
        
    };
    
    
    var projects = {
        
        buffer: {},
        
        getList: function() {
            
        },
        
        open: function(name) {
            if (buffer[name]) {
                return buffer[name];
            } else {
                var p = new cP(name);
                p.init();
                this.buffer[name] = p;
                return p;
            }
        },
        
        remove: function(name) {
            
        }
        
    };
    
    return {
        list: projects.getList.bind(projects),
        open: projects.open.bind(projects),
        remove: projects.remove.bind(projects)
    };
    
});
