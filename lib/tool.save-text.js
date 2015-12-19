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
            var that = this;
            if (typeof input.path !== 'string') {
                return reject.call(
                    that,
                    "[" + that.name() + "] `path` must be a string and not a " 
                        + (typeof input.path) + "!"
                );
            }
            var text = input.text;
            if (text.toString === 'function') text = text.toString();
            FS.writeFile(input.path, text, options, function(err) {
                if (err) {
                    reject.call(that, err);
                } else {
                    resolve.call(that, {path: input.path});
                }
            });
        }
    });
};
