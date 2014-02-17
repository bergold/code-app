require.config({
    baseUrl: 'scripts/app',
    paths: {
        lib: '../lib',
        mode: '../mode'
    }
});

require(['lib/jquery', 'tabs', 'settings', 'communication'], function($, tabs, settings, cmd) {
    
    
    // cmd-bindings
    cmd.on("app.close", function() {
        chrome.app.window.current().close();
    });
    cmd.on("app.maximize", function() {
        chrome.app.window.current().isMaximized() ? chrome.app.window.current().restore() : chrome.app.window.current().maximize();
    });
    
    cmd.on("app.filetreechanged", function(ft) {
        var createEntry = function(name, icon) {
            return $("<div></div>").addClass("entry").append("<span class=\"icon icon-"+icon+"\"></span>").append("<span class=\"label\">"+name+"</span>");
        };
        var addfiles = function(subdir) {
            var elm = $("<div></div>");
            
            for (var i = 0; i < subdir.folder.length; i++) {
                $("<div></div>").addClass("dir closed").append(createEntry(subdir.folder[i].dir.name, "dir")).append(addfiles(subdir.folder[i]).addClass("subdir")).appendTo(elm);
            }
            
            for (var i = 0; i < subdir.files.length; i++) {
                createEntry(subdir.files[i].name, "file").addClass("file").appendTo(elm);
            }
            
            return elm;
        };
        $(".tree").append(addfiles(ft));
    });
    
    
    // ui-bindings
    $("body").on("click", "[data-click]", function(evt) {
        cmd.trigger($(this).attr("data-click"), evt);
    });
    
    $(".tree").on("click", ".dir", function(evt) {
        $(this).toggleClass("closed");
        evt.stopPropagation();
    });
    $(".tree").on("click", ".file", function(evt) {  
        evt.stopPropagation();
    });
    
    
    // load app
    settings.load(function() {
        
        if (settings("project") !== null) {
            tabs.chooseProject(settings("project"));
            $("body").removeClass("no-editor");
        }
        
    });
    
});
