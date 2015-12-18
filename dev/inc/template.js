var Tool = require('../../index').Tool;

module.exports = function() {
    return Tool({
        input: ["text", "template"], output: "text",
        exec: function(input, resolve, reject) {
            resolve.call(this, {text: input.template.replace('${BODY}', input.text)});
        }
    });
};
