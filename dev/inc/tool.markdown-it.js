var Tool = require('../../index').Tool;
var Highlight = require('highlightjs/highlight.pack');
var Markdown = require('markdown-it')({
  highlight: function (str, lang) {
    if (lang && Highlight.getLanguage(lang)) {
      try {
        return Highlight.highlight(lang, str).value;
      } catch (__) {}
    }
 
    try {
      return Highlight.highlightAuto(str).value;
    } catch (__) {}
 
    return ''; // use external default escaping 
  }    
});


module.exports = function() {
    return Tool({
        input: "md", output: "html",
        exec: function(input, resolve, reject) {
            resolve({html: Markdown.render(input.md)});
        }
    });
};
