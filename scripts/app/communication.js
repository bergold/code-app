define(function() {
    
    var cmd = {
        
        buffer: {},
        
        addListener: function (a, b) {
            if (undefined === this.buffer[a])
                this.buffer[a] = [];
            this.buffer[a].push(b);
        },
        
        trigger: function(a, b) {
            console.log(this.buffer, a, this.buffer[a]);
            var c = this.buffer[a] || [];
            for (var i = 0; i < c.length; i++) {
                c[i](b);
            }
        }
        
    };
    
    return {
        buffer: cmd.buffer,
        on: cmd.addListener.bind(cmd),
        trigger: cmd.trigger.bind(cmd)
    };
    
});
