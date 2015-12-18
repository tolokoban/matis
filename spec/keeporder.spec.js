var Matis = require("../index");

/**
 * This tool output its input after a random number of milliseconds.
 */
var delay = Matis.Tool({
    input: "any", output: "any",
    exec: function(input, resolve) {
        setTimeout(function() {
            resolve(input);
        }, Math.floor(Math.random() * 40));
    }
});

/**
 * When we send several inputs to a tool, the outputs must get in the same order.
 */
describe('When we send several inputs to a tool', function() {
    var foreach = Matis.tools.ForEach({output: "any", tool: delay});
    it('the outputs must get in the same order', function(done) {
        var list = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
        foreach.exec(
            {any: list},
            function(output) {
                expect(output.any).toEqual(list);
                done();
            }
        );
    });
});
