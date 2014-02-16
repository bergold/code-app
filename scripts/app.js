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
        var tree = document.createDocumentFragment();
        var addfiles = function(subdir) {
            var folder = document.createElement("div");
            for (var i = 0; i < subdir.files.length; i++) {
                var entry = document.createElement("div");
                if (subdir.files[i].isFile) {
                    entry.setAttribute("class", "file");
                    entry.innerHTML = ["<span class=\"icon\"></span>", "<span class=\"label\">", subdir.files[i].name, "</span>"].join('');
                } else {
                    entry.setAttribute("class", "dir closed");
                    entry.innerHTML = ["<span class=\"icon icon-dir-closed\"></span>", "<span class=\"label\">", subdir.files[i].dir.name, "</span>"].join('');
                    entry.appendChild(addfiles(subdir.files[i]));
                }
                folder.appendChild(entry);
            }
            return folder;
        };
        tree.appendChild(addfiles(ft));
        $(".tree").append(tree);
    });
    
    
    // ui-bindings
    $("body").on("click", "[data-click]", function(evt) {
        cmd.trigger($(this).attr("data-click"), evt);
    });
    
    
    // load app
    settings.load(function() {
        
        if (settings("project") !== null) {
            tabs.chooseProject(settings("project"));
            $("body").removeClass("no-editor");
        }
        
    });
    
});
