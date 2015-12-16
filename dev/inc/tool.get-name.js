var Path = require("path");
var Tool = require('../../index').Tool;

module.exports = function() {
    return Tool({
        input: "path", output: "name",
        exec: function(input, resolve, reject) {
            var basename = Path.basename(input.path);
            var words = basename.substr(5, basename.length - 3).split('-');
            var finalName = '';
            words.forEach(function (word) {
                finalName += word.charAt(0).toUpperCase()
                    + word.substr(1).toLowerCase();                
            });
            resolve({name: 'Matis.tools.' + finalName.substr(0, finalName.length - 3)});
        }
    });
};
