var Path = require("path");
var Tool = require("./tool");

/**
Return the base name of `path`.

## Inputs
* __path__ {string}: path from which we want to extract the basename.

## Outputs
* __basename__ {string}: basename of `path`.
*/
module.exports = function() {
    return Tool({
        name: "BaseName",
        input: "path",
        output: "basename",
        exec: function(input, resolve, reject) {
            resolve({basename: Path.basename(input.path)});
        }
    });
};
