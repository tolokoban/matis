var FS = require("fs");
var Tool = require("./tool");

/**
If `path` exists and is a file, send  it on the `yes` output, otherwise, send it on the `no`.

## Inputs
* __path__ {string}: path of the file we want to know if it exists.

## Outputs
* __yes__ {string}: path of the file if it exists.
* __no__{string}: path of the file if it does not exist.

 */
module.exports = function(options) {
    return Tool({
        input: "path",
        output: ["yes", "no"],
        exec: function(input, resolve, reject) {
            FS.stat(input.path, function(err, stats) {
                if (err) resolve.call(this, {no: input.path});
                else {
                    if (stats.isFile()) {
                        resolve.call(this, {yes: input.path});
                    } else {
                        resolve.call(this, {no: input.path});
                    }
                }
            });
        }
    });
};
