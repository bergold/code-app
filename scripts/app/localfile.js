define(function() {
    
    var lfile = {
        
        chooseDir: function(cb) {
            cb = cb || function() {};
            chrome.fileSystem.chooseEntry({
                type: "openDirectory"
            }, function(entry) {
                if (entry) {
                    cb(entry);
                } else {
                    cb(false);
                }
            });
        },
        
        restoreEntry: function(id, cb) {
            chrome.fileSystem.restoreEntry(id, cb);
        },
        
        retainEntry: function(etr) {
            return chrome.fileSystem.retainEntry(etr);
        },
        
        getPath: function(etr, cb) {
            chrome.fileSystem.getDisplayPath(etr, cb);
        },
        
        readDir: function(etr, cb) {
            var reader = etr.createReader();
            var etrs = [];
            var toArr = function (list) {
                return Array.prototype.slice.call(list || [], 0);
            };
            var read = function() {
                reader.readEntries(function(result){
                    if (!result.length) {
                        cb(etrs);
                    } else {
                        etrs = etrs.concat(toArr(result));
                        read();
                    }
                });
            };
            read();
        },
        
        createDir: function(name, dir, cb) {
            dir.getDirectory(name, {create: true}, cb);
        },
        
        removeDir: function(etr, cb) {
            cb = cb || function() {};
            etr.removeRecursively(cb);
        },
        
        renameDir: function() {
            
        },
        
        readFile: function(etr, cb) {
            etr.file(function(f) {
                var r = new FileReader();
                r.onloadend = function(e) {
                    cb(this.result);
                };
                r.readAsText(f);
            });
        },
        
        createFile: function(name, dir, cb) {
            dir.getFile(name, {create: true, exclusive: true}, cb);
        },
        
        deleteFile: function(etr, cb) {
            cb = cb || function() {};
            etr.remove(cb);
        },
        
        renameFile: function() {
            
        },
        
        writeFile: function(etr, text, cb) {
            cb = cb || function() {};
            etr.createWriter(function(writer) {
                writer.onwriteend = cb;
                writer.onerror = cb;
                
                var blob = new Blob([text], {type: 'text/plain'});
                writer.write(blob);
            });
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
