var FS = require("fs");
var Tool = require("./tool");

/**
Load a stream from a `path`.

## Options
As a string, this is the encoding. Otherwise, it has the same meaning as the argument in the [`fs.readFile(filename[, options], callback)`](https://nodejs.org/dist/latest-v4.x/docs/api/fs.html#fs_fs_readfile_filename_options_callback) function of NodeJS.

## Inputs
* __path__ {string}: path of the file to read.

## Outputs
* __stream__ {Buffer}: resulting stream.

*/
module.exports = function(options) {
    return Tool({
        name: "LoadStream",
        input: "path",
        output: "stream",
        exec: function(input, resolve, reject) {
            FS.readFile(input.path, options, function(err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ stream: data });
                }
            });
        }
    });
};
