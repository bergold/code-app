define(['lib/jquery', 'communication', 'util'], function($, cmd, util) {
    
    var ui = {
        
        initClickLayer: function(white, onclick) {
            $(".overlays .clicklayer").off().on("click", function(e) {
                $(this).removeClass("active white");
                onclick(e);
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
        
        
        showWindow: function(name) {
            $(".window."+name).addClass("active");
            this.initClickLayer(true, function() {
                $(".window."+name).removeClass("active");
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
    
    return ui;
    
});
