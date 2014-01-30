require.config({
    baseUrl: 'scripts/app',
    paths: {
        lib: '../lib',
        mode: '../mode'
    }
});

require(['lib/jquery', 'tabs', 'settings', 'communication'], function($, tabs, settings, cmd) {
    
    cmd.on("app.close", function() {
        chrome.app.window.current().close();
    });
    
    cmd.on("app.maximize", function() {
        chrome.app.window.current().isMaximized() ? chrome.app.window.current().restore() : chrome.app.window.current().maximize();
    });
    
    // ui-bindings
    $("[data-cmd]").each(function() {
        $(this).on($(this).attr("data-evt"), (function(evt) {
            cmd.trigger($(this).attr("data-cmd"), evt);
        }).bind(this));
    });
    
});
