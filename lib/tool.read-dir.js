var FS = require("fs");
var Path = require("path");
var Tool = require("./tool");

/**
Return an array of files' names contained in the folder `path`.

## Inputs
* __path__ {string}: path from where to list existing files.

## Outputs
* __files__ {array[string]}: array of the  names of the files in the directory excluding `'.'` and `'..'`.

## See also
[Matis.tools.ForEach](tools.ForEach.html)

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
