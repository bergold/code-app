define(['storage', 'localfile', 'remotefile', 'communication'], function(storage, lfile, rfile, cmd) {
    
    var cP = function(name) {
        this._name = name;
        this._dir = undefined;
        this._config = {};
        this._local = undefined;
        this.ready = false;
    };
    
    cP.prototype.constructor = cP;
    
    cP.prototype.init = function() {
        storage.get("project."+this._name, (function(items) {
            if (items['project'+this._name]) {
                
            } else {
                
            }
        }).bind(this));
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
    
    cP.prototype.getEntryToPath = function(path) {
        
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
        
        getList: function() { // ???
            
        },
        
        /*
         * opens a project
         * @param {string} name Name des Projekts
         * @return {cP} new or existing project
         */
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
