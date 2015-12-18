var Tool = require("./tool");

/**
 * All not  linked ouptuts can  trigger a resolution.  But __BlackHole__
 * has no output. It is usefull to ignore some outputs.
 */
module.exports = function() {
    return Tool({
        name: "BlackHole",
        input: "any",
        exec: function(input, resolve) {}
    });
};
