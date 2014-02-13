define(['storage'], function(storage) {
    
    var prefs = function(key, val) {
        return getset(key, val);
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
            var p = item.prefs !== undefined ? item.prefs : "{}";
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
    
    var getset = (function(key, val) {
        if (!this.ready) {
            return false;
        }
        
        if (val === undefined) {
            return this.buffer[key];
        } else {
            this.buffer[key] = val;
            storage.set({prefs: JSON.stringify(this.buffer)});
        }
    }).bind(prefs);
    
    return prefs;
    
});
