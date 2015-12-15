var Path = require("path");
var Tool = require('../../index').Tool;

module.exports = function() {
    return Tool({
        input: "name", output: "md",
        exec: function(input, resolve, reject) {
            var name = input.name;
            resolve({md: "\n<a name='" + name + "'></a>\n### " + name + "\n\n"});
        }
    });
};
