define(function() {
    
    var s = {
        
        sAREA: 'local',
    
        get: function(keys, cb) {
            chrome.storage[this.sAREA].get(keys, cb);
        },
        
        set: function(items, cb) {
            cb = cb || function() {};
            chrome.storage[this.sAREA].set(items, cb);
        }
    
    };
    
    return {
        get: s.get.bind(s),
        set: s.set.bind(s)
    }
    
});
