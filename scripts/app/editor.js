define(['lib/jquery', 'lib/codemirror', 'settings'], //, 
        // 'mode/clike', 'mode/css', 'mode/htmlmixed', 'mode/javascript', 'mode/perl', 
        // 'mode/php', 'mode/ruby', 'mode/sass', 'mode/sql', 'mode/xml'], 
       function($, codemirror, settings) {
    
    var editor = {
        
        myEditor: codemirror($("#editor")[0], { lineNumbers: true }),
        
        setDoc: function(doc, mode) {      // sets the document or creates a new one
            doc = typeof doc === "string" ? codemirror.Doc(doc, mode) : doc;
            return this.myEditor.swapDoc(doc);
        },
        
        setTheme: function(theme) {          // sets the theme of the editor
            this.myEditor.setOption("theme", theme);
        },
        
        doc: function() {                  // returns the active document
            return this.myEditor.getDoc();
        }
        
    };
    
    return {
        cm: editor.myEditor,
        setDoc: editor.setDoc.bind(editor),
        setTheme: editor.setTheme.bind(editor),
        doc: editor.doc.bind(editor)
    };
    
});
