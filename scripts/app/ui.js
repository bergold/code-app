define(['lib/jquery', 'communication', 'util'], function($, cmd, util) {
    
    var ui = {
        
        initClickLayer: function(white, onclick) {
            var thiz = this;
            $(".overlays .clicklayer").off().on("click", function(e) {
                onclick.call(thiz, e);
            }).toggleClass("white", white).addClass("active");
        },
        
        clearClickLayer: function() {
            $(".overlays .clicklayer").removeClass("active white");
        },
        
        /* Creates a Menu
         * @param {jQuery.class} root The root-element with the assoziated menu-data
         */
        createMenu: function(root) {
            var data = JSON.parse($(root).attr("data-menu"));
            var offset = $(root).offset();
            offset.top += $(root).height() - 10;
            offset.left += 15;
            offset["max-height"] = ($(document).height() - offset.top - 80) + "px";
            
            var menu = $(".overlays .menu").empty();
            
            var cleanup = function() {
                menu.removeClass("active");
                this.clearClickLayer();
            };
            
            var menufrag = document.createDocumentFragment();
            for (var i=0; i<data.length; i++) {
                if (data[i] === "|") {
                    $("<div></div>").addClass("menuentry separator").appendTo(menufrag);
                } else {
                    var a = $("<div></div>").text(data[i].label).addClass("menuentry").attr("data-click", data[i].cmd).on("click", cleanup.bind(this)).appendTo(menufrag);
                    if (data[i].data) a.attr("cmd-data", data[i].data);
                }
            }
            menu.append(menufrag).css(offset).addClass("active");
            
            this.initClickLayer(false, cleanup.bind(this));
        }, 
        
        /* Creates an entry for a file or directory in the sidebar
         * @param {string} name
         */
        createEntry: function(name, icon) {
            icon = icon || util.getFileIcon(name);
            return $("<div></div>").addClass("entry").append("<span class=\"icon icon-"+icon+"\"></span>").append("<span class=\"label\">"+name+"</span>");
        },
        
        /* Creates an entry for a project in the projects window
         * @param {cP} p
         */
        createProjectEntry: function(p) {
            return $("<div></div>").text(p.label);
        },
        
        currentWindow: '',
        
        showWindow: function(name) {
            this.currentWindow = name;
            $(".window."+name).addClass("active");
            this.initClickLayer(true, function() {
                $(".window."+name).removeClass("active");
                this.clearClickLayer();
            });
        }
        
    };
    
    cmd.on("window.newproject", function(e) {
        ui.showWindow("newproject");
    });
    cmd.on("window.projects", function(e) {
        ui.showWindow("projects");
    });
    cmd.on("window.settings", function(e) {
        ui.showWindow("settings");
    });
    cmd.on("window.about", function(e) {
        ui.showWindow("about");
    });
    
    cmd.on("window.abort", function(e) {
        if (ui.currentWindow!=='') {
            $(".window."+ui.currentWindow).removeClass("active");
            ui.clearClickLayer();
        }
    });
    cmd.on("window.ok", function(e) {
        if (ui.currentWindow!=='') {
            var forms = $("form[data-submit]", ".window."+ui.currentWindow);
            if (forms.size() > 0) {
                forms.each(function() {
                    var c = $(this).attr("data-submit"), f = {};
                    $("input", this).each(function() {
                        util.objPush(f, $(this).attr("name"), $(this).val());
                    });
                    cmd.trigger(c, f);
                });
            }
        }
        cmd.trigger("window.abort");
    });
    
    
    return ui;
    
});
