var Tool = require('../../index').Tool;
var Markdown = require("markdown-it")();


module.exports = function() {
    return Tool({
        input: "md", output: "html",
        exec: function(input, resolve, reject) {
            resolve({html: Markdown.render(input.md)});
        }
    });
};
