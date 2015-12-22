var Matis = require("../index");

describe('tools.ConcatStrings', function() {
    [
        [{a: 25}, "25"],
        [{a: "Hello", b: " world", c: "!"}, "Hello world!"],
        [{}, ""]
    ].forEach(function (item) {
        var values = item[0];
        var expected = item[1];
        var key;
        var inputs = [];
        for (key in values) {
            inputs.push(key);
        }
        it('with input ' + JSON.stringify(values), function(done) {
            Matis.tools.ConcatStrings(inputs).exec(
                values,
                function(output) {
                    expect(output.text).toBe(expected);
                    done();
                },
                function(err) {
                    fail(err);
                    done();
                }
            );
        });
    });
});
