var Tool = require("./tool");

/**
 * Constants cas be used in many cases, such as default values.
 * 
 * * __argument__: the constant value this tool will always emit.
 * * __input__
 *     * {any} `void` - This input is just a trigger. It's value is ignored.
 * * __output__
 *     * {any} `value` - A constant value defined by the `value` argument.
 */
module.exports = function(value) {
    return Tool({
        name: "Constant",
        input: "void",
        output: "value",
        exec: function(input, resolve, reject) {
            resolve({value: value});
        }
    });
};
