define(['project', 'editor', 'communication', 'util'], function(project, editor, cmd, util) {
    
    var tabs = {
        
        openproject: undefined,
        openfiles: [],
        filetree: undefined,
        
        loadProjects: function() {
            project.list(function(pl) {
                cmd.trigger("app.projectlistchanged", pl);
            });
        },
        
        initProject: function(p) {
            this.openproject = p;
            this.openfiles = [];
            this.filetree = undefined;
            
            cmd.trigger("app.projectchanged", p);

            var thiz = this,
                r = function(pr) {
                pr.getFiletree(function(ft) {
                    thiz.filetree = ft;
                    cmd.trigger("app.filetreechanged", ft);
                });
            };
            if (p.ready) {
                r(p);
            } else {
                p.onready = r;
            }
        },
        
        chooseProject: function(name) {
            var p = project.open(name, this.initProject.bind(this));
        },
        
        newProject: function(label, ftp) {
            var config = {
                label: label,
                remote: ftp!==undefined,
            };
            if (ftp!==undefined) config.ftp = ftp;
            project.create(config, this.initProject.bind(this));
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
        openTab: function(path) {
            var f = this.getEntryToPath(path);
            if (!f) {
                return cmd.trigger("error.FILE_NOT_FOUND", path), false;
            }
            console.log(f);
            var tab = {
                doc: editor.newDoc("", util.getMode(f.name)),
                entry: f,
                active: false
            };
            this.openfiles.push(tab);
            editor.enable();
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
        
        
        getEntryToPath: function(path) {
            var p = path.split('.'),
                f = p.pop(),
                d = this.filetree;
            console.log(p, f, d);
            for (var i = 0; i < p.length; i++) {
                d = d.folder[p[i]];
            }
            return d.files[f];
        },
        
    };
    
    cmd.on("tabs.newproject", function(e) {
        var r = (e.tab=="remote");
        tabs.newProject(e.label, r ? e.ftp : undefined);
    });
    cmd.on("tabs.chooseproject", function(e) {
        tabs.chooseProject(e.data);
    });
    
    cmd.on("tabs.openfile", function(e) {
        tabs.openTab(e.data);
    });
    
    return {
        loadProjects: tabs.loadProjects.bind(tabs),
        chooseProject: tabs.chooseProject.bind(tabs),
        newProject: tabs.newProject.bind(tabs),
        getTabs: tabs.getTabs.bind(tabs),
        getFiletree: tabs.getFiletree.bind(tabs)
    };
    
});
