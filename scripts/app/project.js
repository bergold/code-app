define(['storage', 'localfile', 'remotefile', 'communication', 'util'], function(storage, lfile, rfile, cmd, util) {
    
    var cP = function(name, config) {
        this._name = name;
        this._dir = undefined;
        this._config = config;
        this.ready = false;
        this.onready = function() {};
    };
    
    cP.prototype.constructor = cP;
    
    cP.prototype.init = function(dir) {
        if (this._config.remote) {
            this.ready = true;
            this.onready(this);
            
        } else {
            if (!this._dir && (dir || this._config.dirid)) {
                if (dir) {
                    this._config.dirid = lfile.retainEntry(dir);
                    this._dir = dir;
                    this.save();
                    this.ready = true;
                    this.onready(this);
                } else {
                    lfile.restoreEntry(this._config.dirid, (function(etr) {
                        this._dir = etr;
                        this.ready = true;
                        this.onready(this);
                    }).bind(this));
                }
            }
        }
        return this;
    };
    
    cP.prototype.save = function() {
        projects.set(this._name, this._config);
    };
    
    
    cP.prototype.isLocal = function() {
        return this._config && !this._config.remote;
    };
    cP.prototype.isRemote = function() {
        return this._config && this._config.remote;
    };
    cP.prototype.getConfig = function() {
        return this._config;
    };
    cP.prototype.getLabel = function() {
        return this._config.label;
    };
    
    cP.prototype.getFullPath = function() {
        
    };
    cP.prototype.getFiletree = function(cb) {
        if (this._config.remote) {
            
        } else {
            var basedir = {dir:this._dir, folder:[], files:[]};
            var counter = 1;
            var readdir = function(subdir) {
                lfile.readDir(subdir.dir, function(dircontent) {
                    for (var i = 0; i < dircontent.length; i++) {
                        if (dircontent[i].isDirectory) {
                            var newdir = {dir:dircontent[i], folder:[], files:[]};
                            subdir.folder.push(newdir);
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
        
        DEFAULT_CONFIG_LOCAL: {
            "label": "",
            "remote": false,
            "dirid": undefined
        },
        DEFAULT_CONFIG_REMOTE: {
            "label": "",
            "remote": true,
            "ftp": {
                "server": "",
                "port": "",
                "un": "",
                "pw": "",
                "path": ""
            }
        },
        
        buffer: undefined,
        
        /* 
         * Gets a list of all projects
         * @param {function} cb The callback | function({object} projects)
         */
        getList: function(cb) {
            if (this.buffer!==undefined) {
                cb(this.buffer);
                return;
            }
            storage.get("projects", (function(i) {
                this.buffer = i['projects'] ? JSON.parse(i['projects']) : {};
                cb(this.buffer);
            }).bind(this));
        },
        
        set: function(name, config) {
            this.getList((function(a) {
                a[name] = config;
                this.save();
            }).bind(this));
        },
        
        save: function() {
            this.buffer !== undefined && storage.set({ projects: JSON.stringify(this.buffer) });
        },
        
        
        
        /*
         * creates a new project
         * @param {string} label The string which is displayed in the app
         * @param {object} config
         */
        create: function(config, cb) {
            if (config.remote) {
                config = util.mergeObj(this.DEFAULT_CONFIG_REMOTE, config);
                
            } else {
                config = util.mergeObj(this.DEFAULT_CONFIG_LOCAL, config);
                lfile.chooseDir(function(etr) {
                    if (etr) {
                        var name = util.getLocalProjectname(etr.name);
                        cb((new cP(name, config)).init(etr));
                    } else {
                        cb(false);
                    }
                })
            }
        },
        
        /*
         * opens a project and initializes it
         * @param {string} name Name des Projekts
         * @return {cP} new or existing project
         */
        open: function(name, cb) {
            this.getList(function(b) {
                if (b[name]) {
                    cb((new cP(name, b[name])).init());
                } else {
                    cb(false);
                }
            });
        },
        
        /*
         * removes a project
         * @param {string} name The name of the project to remove
         */
        remove: function(name) {
            this.buffer[name] = undefined;
            this.save();
        }
        
    };
    
    return {
        list: projects.getList.bind(projects),
        create: projects.create.bind(projects),
        open: projects.open.bind(projects),
        remove: projects.remove.bind(projects)
    };
    
});
