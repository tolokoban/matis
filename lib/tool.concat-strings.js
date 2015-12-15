var Tool = require("./tool");

/**
 * Concat all the inputs in one output. 
 * 
 * @param {array[string]} inputs - Array inputs' names.
 *
 * * __input__: Thisn tool has a variable number of inputs specified by the `inputs` argument.
 * * __output__
 *     * {string} `text` - The resulting concatenated string.
 */
module.exports = function(inputs) {
    return Tool({
        name: "ConcatStrings",
        input: inputs.slice(),
        output: "text",
        exec: function(input, resolve, reject) {
            var result = '';
            inputs.forEach(function (inputName) {
                result += input[inputName];                
            });
            resolve({text: result});
        }
    });
};
