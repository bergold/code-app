define(['storage', 'localfile', 'remotefile', 'communication'], function(storage, lfile, rfile, cmd) {
    
    var cP = function(name) {
        this._name = name;
        this._dir = undefined;
        this._config = {};
        this.ready = false;
        this.onready = function() {};
    };
    
    cP.prototype.constructor = cP;
    
    cP.prototype.init = function(remote) {
        storage.get("project-"+this._name, (function(items) {
            if (items['project-'+this._name]) {
                this._config = JSON.parse(items['project-'+this._name]);
                if (this._config.remote) {
                    this.ready = true;
                    this.onready(this);
                } else {
                    lfile.restoreEntry(this._config.dirid, (function(etr) {
                        this._dir = etr;
                        this.ready = true;
                        this.onready(this);
                    }).bind(this));
                }
            } else {
                if (remote) {
                    this._config = {
                        "remote": true,
                        "ftp": {
                            "server": '',
                            "port": '',
                            "un": '',
                            "pw": '',
                            "path": ''
                        }
                    };
                    
                } else {
                    this._config = {
                        "remote": false,
                        "dirid": undefined
                    };
                    console.log(this._config);
                    lfile.chooseDir((function(etr) {
                        if (etr) {
                            this._dir = etr;
                            this._config.dirid = lfile.retainEntry(etr);
                            console.log(this._config);
                            this.ready = true;
                            this.onready(this);
                            this.save();
                        }
                    }).bind(this));
                }
            }
        }).bind(this));
    };
    
    cP.prototype.save = function() {
        var p = {};
        p['project-'+this._name] = JSON.stringify(this._config);
        storage.set(p);
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
        
        buffer: {},
        
        getList: function(cb) {
            storage.get("projects", function(i) {
                cb(i['projects'] ? i['projects'].split(',') : []);
            });
        },
        
        add: function(name) {
            this.getList(function(a) {
                if (a.indexOf(name) < 0) {
                    a.push(name);
                    storage.set({"projects":a.join(',')});
                }
            });
        },
        
        /*
         *
         */
        create: function(remote, config) {
            
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
                this.add(name);
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
