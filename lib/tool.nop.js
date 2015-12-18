var Path = require("path");
var Tool = require("./tool");

/**
 * Outpus the input verbatim.
 * 
 * Can be useful  as a synchronisation point, or to  dispatch the same
 * input to several outputs.
 */
module.exports = function() {
    return Tool({
        name: "Nop",
        input: "any",
        output: "any",
        exec: function(input, resolve, reject) {
            resolve({any: input.any});
        }
    });
};
