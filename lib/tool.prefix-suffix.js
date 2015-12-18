var Tool = require("./tool");

/**
 * Add a `prefix` and/or a `suffix` to `text`.
 * 
 * * __input__
 *     * {string} `text` - Text to surround with a `prefix` and `suffix`.
 * * __output__
 *     * {string} `text`  - The surrounded text.
 */
module.exports = function(options) {
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
