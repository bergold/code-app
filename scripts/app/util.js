define({
    
    EXTENSION_ICONS: {
        "file-css": [".css", ".js", ".php", ".json"],
        "file-xml": [".html", ".htm", ".htmls", ".xhtml", ".xml", ".xaml"],
        "file-zip": [".zip", ".rar"],
        "image": [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".psd", ".xcf"]
    },
    
    getFileName: function(a) {
        a = a.split('.');
        a.pop();
        return a.join('.');
    },
    
    getFileExtension: function(a) {
        var b = a.match(/\.[^\.]+$/);
        return b===null ? "." : b[0];
    },
    
    getFileIcon: function(a) {
        for (var i in this.EXTENSION_ICONS) {
            if (this.EXTENSION_ICONS[i].indexOf(this.getFileExtension(a)) > -1) {
                return i;
            }
        }
        return "file";
    }
    
});