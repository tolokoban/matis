var FS = require("fs");
var Tool = require("./tool");

/**
 * If  `path`  exists and  is  a  file, emit  it  on  the `yes`  output,
 * otherwise, emit it on the `no`.
 *
 * * __input__
 *     * {string} path - Path of the file we want know if it exists.
 * * __output__
 *     * {string} yes - Path of the file if it exists.
 *     * {string} no - Path of the file if it does not exist.
 */
module.exports = function(options) {
    return Tool({
        input: "path",
        output: ["yes", "no"],
        exec: function(input, resolve, reject) {
            FS.stat(input.path, function(err, stats) {
                if (err) reject(err);
                else {
                    if (stats.isFile()) {
                        resolve({yes: input.path});
                    } else {
                        resolve({no: input.path});
                    }
                }
            });
        }
    });
};
