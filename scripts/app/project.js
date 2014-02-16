define(['storage', 'localfile', 'remotefile', 'communication'], function(storage, lfile, rfile, cmd) {
    
    var cP = function(name) {
        this._name = name;
        this._dir = undefined;
        this._config = {};
        this.ready = false;
    };
    
    cP.prototype.constructor = cP;
    
    cP.DEF_L_CONFIG = {
        remote: false,
        dirid: null
    };
    cP.DEF_R_CONFIG = {
        remote: true,
        ftp: {
            server: '',
            port: '',
            un: '',
            pw: '',
            path: ''
        }
    };
    
    
    cP.prototype.init = function(remote) {
        storage.get("project."+this._name, (function(items) {
            if (items['project'+this._name]) {
                this._config = JSON.parse(items['project'+this._name]);
                if (this._config.remote) {
                    this.ready = true;
                } else {
                    lfile.restoreEntry(this._config.dirid, (function(etr) {
                        this._dir = etr;
                        this.ready = true;
                    }).bind(this));
                }
            } else {
                if (remote) {
                    this._config = Object.create(cP.DEF_R_CONFIG);
                    
                } else {
                    this._config = Object.create(cP.DEF_L_CONFIG);
                    lfile.chooseDir((function(etr) {
                        if (etr) {
                            this._dir = etr;
                            this._config.dirid = lfile.retainEntry(etr);
                            this.ready = true;
                            this.save();
                        }
                    }).bind(this));
                }
            }
        }).bind(this));
    };
    
    cP.prototype.save = function() {
        
    };
    
    
    cP.prototype.isLocal = function() {
        return this._config && !this._config.remote;
    };
    cP.prototype.isRemote = function() {
        return this._config && this._config.remote;
    };
    
    cP.prototype.getLabel = function() {
        
    };
    cP.prototype.getFullPath = function() {
        
    };
    cP.prototype.getFiletree = function(cb) {
        if (this._config.remote) {
            
        } else {
            var basedir = {dir:this._dir, files:[]};
            var counter = 1;
            var readdir = function(subdir) {
                lfile.readDir(subdir.dir, function(dircontent) {
                    for (var i = 0; i < dircontent.length; i++) {
                        if (dircontent[i].isDirectory) {
                            var newdir = {dir:dircontent[i], files:[]};
                            subdir.files.push(newdir);
                            counter++;
                            readdir.call(this, newdir);
                        } else {
                            subdir.files.push(dircontent[i]);
                        }
                    }
                    counter--;
                    if (counter==0) {
                        cb(basedir);
                    }
                })
            };
            readdir.call(this, basedir);
            return basedir;
        }
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
         * opens a project and initializes it
         * @param {string} name Name des Projekts
         * @return {cP} new or existing project
         */
        open: function(name, remote) {
            if (this.buffer[name]) {
                return this.buffer[name];
            } else {
                var p = new cP(name);
                p.init(remote);
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
