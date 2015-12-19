var Tool = require("./tool");

/****************************************
__ChangeExtension(options)__

An extension is the string after the last occurence of a dot (`.`) in a `path`.   This tool replaces  extensions with other one.

## Options
Object describing which changes have to be made.
For  instance `{less:  'css'}`  means that  the  tool must  replace extensions `.less` with `.css`.

## Input
* __path__: The path of which we want to change the extension.

## Output
* __path__: The  path with the  new extension. If the  extension is not part of the _options_, the output is the same as the input.

## Example
```js
var change = Matis.tools.ChangeExtension({less: 'css', md: 'html'});
```
*****************************************/
module.exports = function(extensions) {
    if (typeof extensions === 'undefined') {
        throw Error("[tools.ChangeExtension] missing mandatory argument `extensions`!");
    }

    return Tool({
        name: "ChangeExtension",
        input: "path",
        output: "path",
        exec: function(input, resolve, reject) {
            var path = input.path;
            if (typeof path !== 'string') {
                return reject.call(this, "[" + this.name() 
                                   + "] `path` must be a string and not " + (typeof path));
            }
            var extPos = path.lastIndexOf('.');
            if (extPos > -1) {
                // If there is no extension, `path` remains unchanged.
                var ext = path.substr(extPos + 1);
                var replacement = extensions[ext];
                if (typeof replacement === 'string') {
                    path = path.substr(0, extPos + 1) + replacement;
                }
            }
            resolve.call(this, {path: path});
        }
    });
};
