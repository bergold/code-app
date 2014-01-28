define(function() {
    
    var cmd = {
        
        buffer: {},
        
        addListener: function (a, b) {
            if (undefined === buffer[a])
                buffer[a] = [];
            buffer[a].push(b);
        },
        
        trigger: function(a, b) {
            var c = buffer[a] || [];
            for (var i = 0; i < c.lenght; i++) {
                c[i](b);
            }
        }
        
    };
    
    return {
        addListener: cmd.add.bind(cmd),
        trigger: cmd.trigger.bind(cmd)
    };
    
});
