var bg = {
    
    /**
     * @return {boolean}
     * True if the system window frame should be shown. It is on the systems where
     * borderless window can't be dragged or resized.
     */
    ifShowFrame: function() {
        var version = parseInt(navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
        var os = 'other';
        if (navigator.appVersion.indexOf('Linux') != -1) {
            os = 'linux';
        } else if (navigator.appVersion.indexOf('CrOS') != -1) {
            os = 'cros';
        } else if (navigator.appVersion.indexOf('Mac OS X') != -1) {
            os = 'mac';
        }
    
        return os === 'linux' && version < 27 ||
               os === 'mac' && version < 25;
    },
    
    newWindow: function() {
        var options = {
            id: 'appWindow',
            frame: (this.ifShowFrame_() ? 'chrome' : 'none'),
            minWidth: 400,
            minHeight: 400,
            width: 700,
            height: 700
        };
    
    
        chrome.app.window.create('index.html', options, function(win) {
            win.onClosed.addListener(this.onWindowClosed.bind(this, win));
        }.bind(this));
    },
    
    launch: function(d) {
        this.newWindow();
    },
    
    onWindowClosed: function(win) {
        
    }
    
};

chrome.app.runtime.onLaunched.addListener(bg.launch.bind(bg));
