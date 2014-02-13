define(['storage'], function(storage) {
    
    var prefs = function(key, val) {
        if (!this.ready) {
            return false;
        }
        
        if (val === undefined) {
            return this.buffer[key];
        } else {
            buffer[key] = val;
            storage.set({prefs: JSON.stringify(this.buffer)});
        }
    };
    
    prefs.DEF = {
        project: null,
        projects: []
    };
    
    prefs.buffer = {};

    prefs.ready = false;

    prefs.load = function(cb) {
        
        cb = cb || function() {};
        this.buffer = Object.create(this.DEF);
        
        storage.get("prefs", (function(item) {
            console.log(item);
            var p = item.length > 0 && item.prefs !== undefined ? item.prefs : {};
            var i, p = JSON.parse(p);
            for (i in p) {
                if (this.DEF[i] !== undefined) {
                    this.buffer[i] = p[i];
                }
            }
            this.ready = true;
            cb();
        }).bind(this));
        
    };
    
    return prefs;
    
});
