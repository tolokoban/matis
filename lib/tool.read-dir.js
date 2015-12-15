var FS = require("fs");
var Path = require("path");
var Tool = require("./tool");

/**
 * Return an array of files' names contained in the folder `path`.
 * 
 * * __input__
 *     * {string} `path` - Path from where to list existing files.
 * * __output__
 * * {array[string]} `files`  - Array of the  names of the files  in the
         directory excluding `'.'` and `'..'`.
 */
module.exports = function() {
    return Tool({
        name: "ReadDir",
        input: "path",
        output: "files",
        exec: function(input, resolve, reject) {
            FS.readdir(input.path, function(err, files) {
                if (err) {
                    reject(err);
                } else {
                    resolve({files: files.map(function(itm) {
                        return Path.normalize(Path.join(input.path, itm));
                    })});
                }
            });
        }
    });
};
