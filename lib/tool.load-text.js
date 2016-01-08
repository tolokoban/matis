var FS = require("fs");
var Tool = require("./tool");

/**
Load a text from a `path`.

## Options
As a string, this is the encoding. Otherwise, it has the same meaning as the argument in the [`fs.readFile(filename[, options], callback)`](https://nodejs.org/dist/latest-v4.x/docs/api/fs.html#fs_fs_readfile_filename_options_callback) function of NodeJS.

## Inputs
* __path__ {string}: path of the file to read.

## Outputs
* __text__ {text}: resulting text.

*/
module.exports = function(options) {
    if (typeof options === 'undefined') options = 'utf8';

    return Tool({
        name: "LoadText",
        input: "path",
        output: "text",
        exec: function(input, resolve, reject) {
            var path = input.path;
            if (typeof path !== 'string') {
                return reject.call(this, "[" + this.name()
                                   + "] `path` must be a string and not " + (typeof path));
            }
            FS.readFile(path, options, function(err, data) {
                if (err) {
                    reject.call(this, err);
                } else {
                    resolve.call(this, { text: data.toString() });
                }
            });
        }
    });
};
