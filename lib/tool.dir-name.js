var Path = require("path");
var Tool = require("./tool");

/**
 * Return the base name of `path`.
 * 
 * * __input__
 *     * {string} `path` - Path to which we want to extract the basename.
 * * __output__
 * * {string} `basename`  - Basename of `path`.
 */
/****************************************
## Matis.tools.BaseName()


****************************************/
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
