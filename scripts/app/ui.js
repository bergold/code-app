define(['lib/jquery', 'communication', 'util'], function($, cmd, util) {
    
    var ui = {
        
        initClickLayer: function(white, onclick) {
            $(".overlays .clicklayer").off().on("click", function(e) {
                $(this).removeClass("active white");
                onclick.call(this, e);
            }).toggleClass("white", white).addClass("active");
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
            
            var menufrag = document.createDocumentFragment();
            for (var i=0; i<data.length; i++) {
                if (data[i] === "|") {
                    $("<div></div>").addClass("menuentry separator").appendTo(menufrag);
                } else {
                    $("<div></div>").text(data[i].label).addClass("menuentry").attr("data-click", data[i].cmd).appendTo(menufrag);
                }
            }
            var menu = $(".overlays .menu").empty().append(menufrag).css(offset).addClass("active");
            
            this.initClickLayer(false, function(e) {
                menu.removeClass("active").empty();
            });
        }, 
        
        /* Creates an entry for a file or directory in the sidebar
         * @param {string} name
         */
        createEntry: function(name, icon) {
            icon = icon || util.getFileIcon(name);
            return $("<div></div>").addClass("entry").append("<span class=\"icon icon-"+icon+"\"></span>").append("<span class=\"label\">"+name+"</span>");
        },
        
    };
    
    cmd.on("window.settings", function(e) {
        
    });
    cmd.on("window.about", function(e) {
        
    });
    
    return ui;
    
});
