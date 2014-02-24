define(['lib/jquery', 'lib/codemirror', 'settings',
        'mode/css', 
        'mode/htmlmixed', 
        'mode/javascript',
        'mode/php', 
        'mode/xml'], 
       function($, codemirror, settings) {
    
    var editor = {
        
        myEditor: codemirror($("#editor")[0], { lineNumbers: true }),
        
        setDoc: function(doc) {      // sets the document
            this.myEditor.swapDoc(doc);
        },
        
        newDoc: function(val, mode) {
            return codemirror.Doc(val, mode);
        },
        
        setTheme: function(theme) {          // sets the theme of the editor
            this.myEditor.setOption("theme", theme);
        },
        
        doc: function() {                  // returns the active document
            return this.myEditor.getDoc();
        },
        
        enable: function() {
            $("body").removeClass("no-editor");
        },
        
        disable: function() {
            $("body").addClass("no-editor");
        }
        
    };
    
    return {
        cm: editor.myEditor,
        setDoc: editor.setDoc.bind(editor),
        newDoc: editor.newDoc.bind(editor),
        setTheme: editor.setTheme.bind(editor),
        doc: editor.doc.bind(editor),
        enable: editor.enable.bind(editor),
        disable: editor.disable.bind(editor)
    };
    
});
