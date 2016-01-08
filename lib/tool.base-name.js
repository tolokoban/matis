var Path = require("path");
var Tool = require("./tool");

/**
Return the base name of `path`.

## Inputs
* {string} __path__ - Path to which we want to extract the basename.

## Outputs
* {string} __basename__ - Basename of `path`.

## Example
```js
var Matis = require('matis');

var baseName = Matis.tools.BaseName();
baseName.exec(
    { path: __filename },
    function(outputs) {
        console.log("Basename of " + __filename + " is " + outputs.basename);
    }
)
```
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
