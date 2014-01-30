define(function() {
    
    var lfile = {
        
        chooseDir: function() {
            
        },
        
        readDir: function() {
            
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
