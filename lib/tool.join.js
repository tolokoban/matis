var Tool = require("./tool");

/**
 * Join all elements of an array with a `glue`.
 * 
 * * __param__ 
 *     * {string} glue - Text to add between two elements of the `array`.
 * * __input__
 *     * {array[string]} `array` - Array of strings to join with the `glue`.
 * * __output__
 *     * {string} `text` - The resulting joined array..
 */
module.exports = function(glue) {
    if (typeof glue === 'undefined') glue = '';

    return Tool({
        name: "Join",
        input: "array",
        output: "text",
        exec: function(input, resolve, reject) {
            if (typeof input.array.join === 'function') {
                resolve({text: input.array.join(glue)});
            } else {
                resolve({text: input.array});
            }
        }
    });
};
