define(['project', 'editor', 'communication'], function(project, editor, cmd) {
    
    var tabs = {
        
        openproject: undefined,
        openfiles: [],
        filetree: undefined,
        
        loadProjects: function() {
            project.list(function(pl) {
                cmd.trigger("app.projectlistchanged", pl);
            });
        },
        
        chooseProject: function(name) {
            var p = project.open(name);
            this.openproject = p;
            this.openfiles = [];
            this.filetree = undefined;
            
            var r = function(pr) {
                pr.getFiletree((function(ft) {
                    this.filetree = ft;
                    cmd.trigger("app.filetreechanged", ft);
                }).bind(this));
            };
            if (p.ready) {
                r(p);
            } else {
                p.onready = r;
            }
            
        },
        
        getTabs: function() {
            return this.openfiles;
        },
        getTabsToSave: function() {
            
        },
        selectTab: function(ti) {
            for (var i = 0; i < this.openfiles; i++) this.openfiles[i].active = false;
            if (!this.openfiles[ti]) return false;
            this.openfiles[ti].active = true;
        },
        newTab: function(path) {
            var f = this.openproject.getEntryToPath(path);
            if (!f) {
                return cmd.trigger("error.FILE_NOT_FOUND", path), false;
            }
            var tab = {
                doc: editor.newDoc("", mode),
                entry: f,
                active: false
            };
            this.openfiles.push(tab);
            cmd.trigger("app.updatefiles");
            return tab;
        },
        saveTab: function() {
            
        },
        closeTab: function() {
            
        },
        
        getFiletree: function() {
            return this.filetree;
        },
        
    };
    
    cmd.on("tabs.new", function(data) {
        
    });
    
    return {
        loadProjects: tabs.loadProjects.bind(tabs),
        chooseProject: tabs.chooseProject.bind(tabs),
        getTabs: tabs.getTabs.bind(tabs),
        getFiletree: tabs.getFiletree.bind(tabs)
    };
    
});
