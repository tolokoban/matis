var FS = require("fs");
var Tool = require("./tool");

/**
 *
 * @param  {object|string}   options  -  As   a  string,  this   is  the
 * encoding. Otherwise, it  has the same meaning as the  argument in the
 * [`fs.readFile(filename[, options], callback)`](https://nodejs.org/dist/latest-v4.x/docs/api/fs.html#fs_fs_readfile_filename_options_callback) function. Default is `utf8`.
 */
module.exports = function(options) {
    if (typeof options === 'undefined') options = 'utf8';

    return Tool({
        name: "SaveText",
        input: ["path", "text"],
        output: "path",
        exec: function(input, resolve, reject) {
            FS.writeFile(input.path, input.text, options, function(err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve({path: input.path});
                }
            });
        }
    });
};
