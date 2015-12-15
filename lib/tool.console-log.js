var Tool = require("./tool");

/**
 * This tool is used for debug  purpose. The input is displayed with the
 * `console.log()` function, then sent to the output unchanged.
 */
module.exports = function(prefix) {
    if (typeof prefix === 'undefined') prefix = 'any: ';

    return Tool({
        name: "ConsoleLog",
        input: "any",
        output: "any",
        exec: function(input, resolve, reject) {
            console.log(prefix + JSON.stringify(input.any, null, 3));
            resolve(input);
        }
    });
};
