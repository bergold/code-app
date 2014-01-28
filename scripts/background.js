var Background = function() {};
    
/**
 * @return {boolean}
 * True if the system window frame should be shown. It is on the systems where
 * borderless window can't be dragged or resized.
 */
Background.prototype.ifShowFrame = function() {
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
};

Background.prototype.newWindow = function() {
    var options = {
        id: 'appWindow',
        frame: (this.ifShowFrame() ? 'chrome' : 'none'),
        minWidth: 400,
        minHeight: 400,
        width: 700,
        height: 700
    };


    chrome.app.window.create('app.html', options, function(win) {
        win.onClosed.addListener(this.onWindowClosed.bind(this, win));
    }.bind(this));
};

Background.prototype.launch = function(d) {
    this.newWindow();
};

Background.prototype.onWindowClosed = function(win) {
    
};


var bg = new Background();
chrome.app.runtime.onLaunched.addListener(bg.launch.bind(bg));
