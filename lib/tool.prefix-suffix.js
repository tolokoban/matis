var Tool = require("./tool");

/**
Surround `text`with a `prefix` and a `suffix`.

## Options
* __prefix__ {string}: the string to prepend to `text`.
* __sufffix__ {string}: the string to append to `text`.

## Inputs
* {string} __text__: Text to surround with a `prefix` and `suffix`.

## Outputs
* {string} __text__: The surrounded text.

## See also
[Matis.tools.ConcatStrings](tools.ConcatStrings.html)

*/
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
