var Tool = require("./tool");

/**
 * This tool is used for debug  purpose. The input is displayed with the
 * `console.log()` function, then sent to the output unchanged.
 */
module.exports = function(pattern, flags) {
    var rx = new RegExp(pattern, flags);
    
    return Tool({
        name: "MathRegexp",
        input: "text",
        output: ["yes", "no"],
        exec: function(input, resolve, reject) {
            try {
                if (rx.test(input.text)) {
                    resolve({yes: input.text});
                } else {
                    resolve({no: input.text});
                }
            } catch (ex) {
                reject(ex);
            }
        }
    });
};
