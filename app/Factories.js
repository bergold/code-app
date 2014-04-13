/*
 * File: Factories.js
 * Factories
 *
 * @author: Emil Bergold
 * @version: 1.0
 *
 */


// localfile-factory
codesocket.factory('localfile', function($q) {
    
    var lfile = {
        
        chooseDir: function() {
            var defered = $q.defer();
            chrome.fileSystem.chooseEntry({
                type: "openDirectory"
            }, function(entry) {
                if (entry) {
                    defered.resolve(entry);
                } else {
                    defered.reject(false);
                }
            });
            return defered.promise;
        },
        
        restoreEntry: function(id) {
            var defered = $q.defer();
            chrome.fileSystem.restoreEntry(id, function(entry) {
                if (entry) {
                    defered.resolve(entry);
                } else {
                    defered.reject(false);
                }
            });
            return defered.promise;
        },
        
        retainEntry: function(etr) {
            return chrome.fileSystem.retainEntry(etr);
        },
        
        getPath: function(etr) {
            var defered = $q.defer();
            chrome.fileSystem.getDisplayPath(etr, function(path) {
                defered.resolve(path);
            });
            return defered.promise;
        },
        
        readDir: function(etr) {
            var defered = $q.defer();
            var reader = etr.createReader();
            var etrs = [];
            var toArr = function (list) {
                return Array.prototype.slice.call(list || [], 0);
            };
            var read = function() {
                reader.readEntries(function(result){
                    if (!result.length) {
                        defered.resolve(etrs);
                    } else {
                        etrs = etrs.concat(toArr(result));
                        read();
                    }
                });
            };
            read();
            return defered.promise;
        },
        
        createDir: function(name, dir) {
            var defered = $q.defer();
            dir.getDirectory(name, {create: true}, function(entry) {
                if (entry)
                    defered.resolve(entry);
                else
                    defered.reject(false);
            });
            return defered.promise;
        },
        
        removeDir: function(etr) {
            var defered = $q.defer();
            etr.removeRecursively(function() {
                defered.resolve(true);
            }, function(e) {
                defered.reject(e);
            });
            return defered.promise();
        },
        
        renameDir: function() {
            
        },
        
        readFile: function(etr) {
            var defered = $q.defer();
            etr.file(function(f) {
                var r = new FileReader();
                r.onloadend = function(e) {
                    defered.resolve(this.result);
                };
                r.readAsText(f);
            });
            return defered.promise;
        },
        
        createFile: function(name, dir) {
            var defered = $q.defer();
            dir.getFile(name, {create: true, exclusive: true}, function(entry) {
                defered.resolve(entry);
            }, function(e) {
                defered.reject(e);
            });
            return defered.promise;
        },
        
        deleteFile: function(etr) {
            var defered = $q.defer();
            etr.remove(function() {
                defered.resolve(true);
            }, function(e) {
                defered.reject(e);
            });
            return defered.promise;
        },
        
        renameFile: function() {
            
        },
        
        writeFile: function(etr, text) {
            var defered = $q.defer();
            etr.createWriter(function(writer) {
                writer.onwriteend = function() {
                    defered.resolve(true);
                };
                writer.onerror = function(e) {
                    defered.reject(e);
                };
                
                var bb = new BlobBuilder();
                bb.append(text);
                writer.write(bb.getBlob('text/plain'));
            });
            return defered.promise;
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
