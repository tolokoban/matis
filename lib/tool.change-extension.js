var Tool = require("./tool");

/**
 * An extension is the string after the last occurence of a dot (`.`) in
 * a `path`.   This tool replaces  extensions with other one.   It never
 * fails: the `reject` function will never be called.
 * 
 * @param {object}  extensions -  Each attribute  name is  replaced with
 * it's  value. For  instance `{js:  'head'}` means  than the  extension
 * `.js`  must  be  replaced  with `.head`.  Other  files  names  remain
 * unchanged.
 */
module.exports = function(extensions) {
    return Tool({
        name: "ChangeExtension",
        input: "path",
        output: "path",
        exec: function(input, resolve, reject) {
            var path = input.path;
            var extPos = path.lastIndexOf('.');
            if (extPos > -1) {
                // If there is no extension, `path` remains unchanged.
                var ext = path.substr(extPos + 1);
                var replacement = extensions[ext];
                if (typeof replacement === 'string') {
                    path = path.substr(0, extPos + 1) + replacement;
                }
            }
            resolve({path: path});
        }
    });
};
