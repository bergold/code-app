/*
 * File: Factories.js
 * Factories:
 *   tabs         0%
 *   project     80%
 *   localfile  100%
 *   remotefile   0%
 *   ftp          0%
 *   storage    100%
 *   util       100%
 *
 * @author: Emil Bergold
 * @version: 1.0
 *
 */


// tabs-factory
codesocket.factory('tabs', function($q, project, util) {
    
    var openfiles  = [];
    var actproject = null;
    
    var getProject = function()  { return actproject; };
    var setProject = function(p) { actproject = p; };
    
    var getFiles       = function() { return openfiles; };
    var getFilesToSave = function() { return openfiles.filter(function(f, i, _) { return !f.clean; }); };
    var openFile = function(fileentry) {
        var nd = editor.newDoc("", util.getMode(fileentry.name));
        actproject.readFile(fileentry).then(function(data) {
            nd.setValue(data);
            nd.markClean();
            editor.enable();
        });
        var tab = {
            doc: nd,
            entry: f,
            active: false,
            clean: true
        };
        var i = this.openfiles.push(tab);
        this.selectTab(i-1);
        return tab;
    };
    var selectFile = function(i) {};
    var saveFile = function(i) {};
    var saveAllFiles = function() {};
    var closeFile = function(i) {};
    
    var getFiletree = function() { return actproject !== null ? actproject.getFiletree() : false };
    
    return {
        getProject: getProject,
        setProject: setProject,
        
        file: {
            all: getFiles,
            toSave: getFilesToSave,
            open: openFile,
            select: selectFile,
            save: saveFile,
            saveAll: saveAllFiles,
            close: closeFile
        },
        
        getFiletree: getFiletree
    };
    
});


// project-factory
codesocket.factory('project', function($q, storage, localfile, remotefile, util) {
    
    var cP = function(name, config) {
        this._name = name;
        this._dir = undefined;
        this._config = config;
    };
    
    cP.prototype.constructor = cP;
    
    cP.prototype.init = function(dir) {
        var deferred = $q.defer();
        if (this._config.remote) {
            deferred.resolve(this);
            
        } else {
            if (!this._dir && (dir || this._config.dirid)) {
                if (dir) {
                    this._config.dirid = localfile.retainEntry(dir);
                    this._dir = dir;
                    this.save();
                    deferred.resolve(this);
                } else {
                    localfile.restoreEntry(this._config.dirid).then(function(etr) {
                        this._dir = etr;
                        deferred.resolve(this);
                    }.bind(this));
                }
            }
        }
        return deferred.promise;
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
    
    cP.prototype.getFiletree = function() {
        if (this._config.remote) {
            
        } else {
            var basedir = {dir:this._dir, folder:[], files:[]};
            var readdir = function(subdir) {
                return localfile.readDir(subdir.dir).then(function(dircontent) {
                    var promises = [];
                    for (var i = 0; i < dircontent.length; i++) {
                        if (dircontent[i].isDirectory) {
                            var newdir = {dir:dircontent[i], folder:[], files:[]};
                            subdir.folder.push(newdir);
                            promises.push(readdir.call(this, newdir));
                        } else {
                            subdir.files.push(dircontent[i]);
                        }
                    }
                    return $q.all(promises);
                });
            };
            return readdir.call(this, basedir).then(function() {
                return basedir;
            });
        }
    };
    
    cP.prototype.readFile = function(etr) {
        if (this._config.remote) {
            
        } else {
            return localfile.readFile(etr);
        }
    };
    cP.prototype.writeFile = function(etr, text) {
        if (this._config.remote) {
            
        } else {
            
        }
    };
    
    cP.prototype.create = function() {
        if (this._config.remote) {
            
        } else {
            
        }
    };
    cP.prototype.rename = function() {
        if (this._config.remote) {
            
        } else {
            
        }
    };
    cP.prototype.remove = function() {
        if (this._config.remote) {
            
        } else {
            
        }
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
        getList: function() {
            var deferred = $q.defer();
            if (this.buffer!==undefined) {
                deferred.resolve(this.buffer);
            } else {
                storage.get("projects").then(function(i) {
                    this.buffer = i.projects || {};
                    deferred.resolve(this.buffer);
                }.bind(this));
            }
            return deferred.promise;
        },
        
        set: function(name, config) {
            this.getList().then(function(a) {
                a[name] = config;
                this.save();
            }.bind(this));
        },
        
        save: function() {
            if (this.buffer !== undefined)
                return storage.set({ projects: this.buffer });
        },
        
        
        
        /*
         * creates a new project
         * @param {string} label The string which is displayed in the app
         * @param {object} config
         */
        create: function(config) {
            if (config.remote) {
                config = angular.extend({}, this.DEFAULT_CONFIG_REMOTE, config);
                
            } else {
                config = angular.extend({}, this.DEFAULT_CONFIG_LOCAL, config);
                return localfile.chooseDir().then(function(entry) {
                    var name = util.getLocalProjectname(entry.name);
                    return (new cP(name, config)).init(entry).then(function(p) {
                        return p;
                    });
                });
            }
        },
        
        /*
         * opens a project and initializes it
         * @param {string} name Name des Projekts
         * @return {cP} new or existing project
         */
        open: function(name) {
            return this.getList().then(function(b) {
                if (b[name]) {
                    return (new cP(name, b[name])).init().then(function(p) {
                        return p;
                    });
                } else {
                    return $q.reject(false);
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


// localfile-factory
codesocket.factory('localfile', function($q) {
    
    var lfile = {
        
        chooseDir: function() {
            var deferred = $q.defer();
            chrome.fileSystem.chooseEntry({
                type: "openDirectory"
            }, function(entry) {
                if (entry) {
                    deferred.resolve(entry);
                } else {
                    deferred.reject(false);
                }
            });
            return deferred.promise;
        },
        
        restoreEntry: function(id) {
            var deferred = $q.defer();
            chrome.fileSystem.restoreEntry(id, function(entry) {
                if (entry) {
                    deferred.resolve(entry);
                } else {
                    deferred.reject(false);
                }
            });
            return deferred.promise;
        },
        
        retainEntry: function(etr) {
            return chrome.fileSystem.retainEntry(etr);
        },
        
        getPath: function(etr) {
            var deferred = $q.defer();
            chrome.fileSystem.getDisplayPath(etr, function(path) {
                deferred.resolve(path);
            });
            return deferred.promise;
        },
        
        readDir: function(etr) {
            var deferred = $q.defer();
            var reader = etr.createReader();
            var etrs = [];
            var toArr = function (list) {
                return Array.prototype.slice.call(list || [], 0);
            };
            var read = function() {
                reader.readEntries(function(result){
                    if (!result.length) {
                        deferred.resolve(etrs);
                    } else {
                        etrs = etrs.concat(toArr(result));
                        read();
                    }
                });
            };
            read();
            return deferred.promise;
        },
        
        createDir: function(name, dir) {
            var deferred = $q.defer();
            dir.getDirectory(name, {create: true}, function(entry) {
                if (entry)
                    deferred.resolve(entry);
                else
                    deferred.reject(false);
            });
            return deferred.promise;
        },
        
        removeDir: function(etr) {
            var deferred = $q.defer();
            etr.removeRecursively(function() {
                deferred.resolve(true);
            }, function(e) {
                deferred.reject(e);
            });
            return deferred.promise();
        },
        
        renameDir: function() {
            
        },
        
        readFile: function(etr) {
            var deferred = $q.defer();
            etr.file(function(f) {
                var r = new FileReader();
                r.onloadend = function(e) {
                    deferred.resolve(this.result);
                };
                r.readAsText(f);
            });
            return deferred.promise;
        },
        
        createFile: function(name, dir) {
            var deferred = $q.defer();
            dir.getFile(name, {create: true, exclusive: true}, function(entry) {
                deferred.resolve(entry);
            }, function(e) {
                deferred.reject(e);
            });
            return deferred.promise;
        },
        
        deleteFile: function(etr) {
            var deferred = $q.defer();
            etr.remove(function() {
                deferred.resolve(true);
            }, function(e) {
                deferred.reject(e);
            });
            return deferred.promise;
        },
        
        renameFile: function() {
            
        },
        
        writeFile: function(etr, text) {
            var deferred = $q.defer();
            etr.createWriter(function(writer) {
                writer.onwriteend = function() {
                    deferred.resolve(true);
                };
                writer.onerror = function(e) {
                    deferred.reject(e);
                };
                
                var bb = new BlobBuilder();
                bb.append(text);
                writer.write(bb.getBlob('text/plain'));
            });
            return deferred.promise;
        }
        
    };
    
    return {
        chooseDir: lfile.chooseDir.bind(lfile),
        restoreEntry: lfile.restoreEntry.bind(lfile),
        retainEntry: lfile.retainEntry.bind(lfile),
        readDir: lfile.readDir.bind(lfile),
        createDir: lfile.createDir.bind(lfile),
        removeDir: lfile.removeDir.bind(lfile),
        renameDir: lfile.renameDir.bind(lfile),
        readFile: lfile.readFile.bind(lfile),
        createFile: lfile.createFile.bind(lfile),
        deleteFile: lfile.deleteFile.bind(lfile),
        renameFile: lfile.renameFile.bind(lfile),
        writeFile: lfile.writeFile.bind(lfile),
    };
    
});


// remotefile-factory
codesocket.factory('remotefile', function() {
    return {};
});


// remotefile-factory
codesocket.factory('ftp', function() {
    return {};
});


// storage-factory
codesocket.factory('storage', function($q, default_settings) {
    return {
        get: function(keys) {
            var deferred = $q.defer();
            chrome.storage.local.get(keys, function(val) {
                deferred.resolve(val);
            });
            return deferred.promise;
        },
        
        set: function(pairs) {
            var deferred = $q.defer();
            chrome.storage.local.set(pairs, function() {
                deferred.resolve(true);
            });
            return deferred.promise;
        },
        
        clear: function() {
            chrome.storage.local.clear();
        },
        
        setDefault: function() {
            return this.set(default_settings);
        }
    };
});


// util-factory
codesocket.factory('util', function(EXTENSION_CM_MIMES, EXTENSION_ICONS) {
    return {
    
        getFileName: function(a) {
            var i = a.lastIndexOf('.');
            return i < 0 ? a : a.substr(0, i);
        },
        
        getFileExtension: function(a, withdot) {
            var i = a.lastIndexOf('.');
            return i < 0 ? "" : a.substr(i + (withdot ? 0 : 1));
        },
        
        getFileIcon: function(a) {
            for (var i in EXTENSION_ICONS) {
                if (EXTENSION_ICONS[i].indexOf(this.getFileExtension(a)) > -1) {
                    return i;
                }
            }
            return "file";
        }, 
        
        getMode: function(name) {
            return EXTENSION_CM_MIMES[this.getFileExtension("."+name)];
        },
        
        getLocalProjectname: function(a) {
            return a.replace(/[^a-z\-0-9]/gi, '');
        },
        
        objPush: function(obj, key, val) {
            var p = key.split('.'),
                k = p.pop();
                o = obj;
            for (var i = 0; i < p.length; i++) {
                if (o[p[i]] === undefined) {
                    o[p[i]] = {};
                }
                o = o[p[i]];
            }
            o[k] = val;
        }
    };
});

