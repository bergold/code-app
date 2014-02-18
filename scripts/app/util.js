define({
    
    EXTENSION_ICONS: {
        "file-css": ["css", "js", "php", "json"],
        "file-xml": ["html", "htm", "htmls", "xhtml", "xml", "xaml"],
        "file-zip": ["zip", "rar"],
        "image": ["jpg", "jpeg", "png", "gif", "bmp", "psd", "xcf"]
    },
    
    getFileName: function(a) {
        var i = a.lastIndexOf('.');
        return i < 0 ? a : a.substr(0, i);
    },
    
    getFileExtension: function(a, withdot) {
        var i = a.lastIndexOf('.');
        return i < 0 ? "" : a.substr(i + (withdot ? 0 : 1));
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
