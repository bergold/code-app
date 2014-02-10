define(function() {
    
    var lfile = {
        
        chooseDir: function(cb) {
            chrome.fileSystem.chooseEntry({
                type: "openDirectory"
            }, function(entry) {
                chrome.fileSystem.getWritableEntry(entry, cb);
            });
        },
        
        restoreEntry: function() {
            
        },
        
        retainEntry: function() {
            
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
        
        createDir: function() {
            
        },
        
        removeDir: function() {
            
        },
        
        renameDir: function() {
            
        },
        
        readFile: function() {
            
        },
        
        createFile: function() {
            
        },
        
        deleteFile: function() {
            
        },
        
        renameFile: function() {
            
        },
        
        writeFile: function() {
            
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
