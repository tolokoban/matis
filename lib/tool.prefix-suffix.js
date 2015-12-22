var Tool = require("./tool");

/****************************************
## tools.PrefixSuffix({prefix: ..., suffix: ...})

Surround `text`with a `prefix` and a `suffix`.

### Inputs

* {string} __text__: Text to surround with a `prefix` and `suffix`.

### Outputs

* {string} __text__: The surrounded text.

*****************************************/
module.exports = function(options) {
    if (typeof options === 'undefined') options = {};
    if (typeof options.prefix === 'undefined') options.prefix = '';
    if (typeof options.suffix === 'undefined') options.suffix = '';

    return Tool({
        name: "PrefixSuffix",
        input: "text",
        output: "text",
        exec: function(input, resolve, reject) {
            resolve({text: options.prefix + input.text + options.suffix});
        }
    });
};
