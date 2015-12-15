var Matis = require("../index");

describe('tools.ForEach', function() {
    describe("input's length is output's length", function() {
        var uppercase =  Matis.Tool({
            input: 'text', output: 'text',
            exec: function(input, resolve, reject, absorb) {
                resolve({text: input.text.toUpperCase()});
            }
        });
        var looper = Matis.tools.ForEach({ tool: uppercase, output: 'text' });
        [['a'], ['fi', 'Hi'], ['o', 'h', 'l']].forEach(function (item) {
            var caption = 'should be ok with ' + item.length + " item" 
                    + (item.length > 1 ? 's' : '');
            it(caption, function(done) {
                var expected = item.map(function(x) { return x.toUpperCase(); });
                looper.exec(
                    {text: item},
                    function(input) {
                        expect(input.text).toEqual(expected);
                        done();
                    }
                );
            });
        });
    });

    describe("input is empty", function() {
        var uppercase =  Matis.Tool({
            input: 'text', output: 'text',
            exec: function(input, resolve, reject, absorb) {
                resolve({text: input.text.toUpperCase()});
            }
        });
        var looper = Matis.tools.ForEach({ tool: uppercase, output: 'text' });
        it('shold return []', function(done) {
            looper.exec(
                {text: []},
                function(input) {
                    expect(input.text).toEqual([]);
                    done();
                }
            );
        });
    });
});
