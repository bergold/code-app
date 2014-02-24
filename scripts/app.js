require.config({
    baseUrl: 'scripts/app',
    paths: {
        lib: '../lib',
        mode: '../mode'
    }
});

require(['lib/jquery', 'tabs', 'settings', 'communication', 'ui'], function($, tabs, settings, cmd, ui) {
    
    
    // cmd-bindings
    cmd.on("app.close", function() {
        chrome.app.window.current().close();
    });
    cmd.on("app.maximize", function() {
        chrome.app.window.current().isMaximized() ? chrome.app.window.current().restore() : chrome.app.window.current().maximize();
    });
    
    cmd.on("app.projectlistchanged", function(pl) {
        var a = JSON.parse($(".sidebar .menubar .entry").removeClass("disabled").attr("data-menu"));
        a = a.splice(-2);
        if (Object.keys(pl).length > 0) a.unshift("|");
        for (var i in pl) {
            a.unshift({ "label": pl[i].label + " (" + i + ")", "cmd": "tabs.chooseproject", "data": i });
        }
        $(".sidebar .menubar .entry").attr("data-menu", JSON.stringify(a));
        
        $(".window.projects .all").empty();
        $(".window.projects .local").empty();
        $(".window.projects .remote").empty();
        for (var i in pl) {
            $(".window.projects .all").append(ui.createProjectEntry(pl[i]));
            if (pl[i].remote) {
                $(".window.projects .remote").append(ui.createProjectEntry(pl[i]));
            } else {
                $(".window.projects .local").append(ui.createProjectEntry(pl[i]));
            }
        }
    });
    
    cmd.on("app.projectchanged", function(p) {
        $(".sidebar .menubar .entry .projectlabel").text(p.getLabel());
        $(".tree").empty();
    });
    
    cmd.on("app.filetreechanged", function(ft) {
        var addfiles = function(subdir) {
            var elm = $("<div></div>");
            
            for (var i = 0; i < subdir.folder.length; i++) {
                $("<div></div>").addClass("dir closed").append(ui.createEntry(subdir.folder[i].dir.name, "arrow-right")).append(addfiles(subdir.folder[i]).addClass("subdir")).appendTo(elm);
            }
            
            for (var i = 0; i < subdir.files.length; i++) {
                ui.createEntry(subdir.files[i].name).addClass("file").appendTo(elm);
            }
            
            return elm;
        };
        $(".tree").empty().append(addfiles(ft));
    });
    
    
    // ui-bindings
    $("body").on("click", "[data-click]", function(evt) {
        var e = { trigger: this, event: evt };
        var d = $(this).attr("cmd-data");
        if (d) e.data = d;
        cmd.trigger($(this).attr("data-click"), e);
    });
    $("body").on("click", "[data-menu]", function(evt) {
        $(this).hasClass("disabled") || ui.createMenu(this);
    });
    $("body").on("click", ".tabs [data-tab]", function(evt) {
        var c = $(this).attr("data-tab");
        $(this).parent().find(".entry").removeClass("active");
        $(this).addClass("active");
        $(this).parents(".tabs").find(".tab").removeClass("active").parent().find("."+c).addClass("active");
        if ($(this).parents(".tabs").find(".currenttab").size() > 0) {
            $(this).parents(".tabs").find(".currenttab").val(c);
        }
    });
    
    $(".tree").on("click", ".dir", function(evt) {
        $(this).toggleClass("closed").find(".entry:eq(0) .icon").toggleClass("icon-arrow-right icon-arrow-down");
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
        
        tabs.loadProjects();
        
    });
    
});
