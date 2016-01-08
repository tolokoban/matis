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

    describe("less outputs than inputs", function() {
        var matcher = Matis.tools.MatchRegexp('[aeiouy]');
        var looper = Matis.tools.ForEach({ tool: matcher, output: 'yes' });
        it('should be ok with ["f", "a", "b", "i", "e", "n"]', function(done) {
            looper.exec({
                text: ["f", "a", "b", "i", "e", "n"]
            }, function(input) {
                expect(input.yes).toEqual(['a', 'i', 'e']);
                done();
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
        it('should return []', function(done) {
            looper.exec(
                {text: []},
                function(input) {
                    expect(input.text).toEqual([]);
                    done();
                }
            );
        });
    });

    describe("many outputs", function() {
        it('should ', function(done) {
            var isJS = Matis.tools.MatchRegexp('\\.js$');
            var looper = Matis.tools.ForEach({ tool: isJS, output: ["yes", "no"]});
            looper.exec(
                { text: ["a.js", "b.html", "c.js", "d.js"] },
                function(outputs) {
                    expect(outputs.yes).toEqual(['a.js', 'c.js', 'd.js']);
                    expect(outputs.no).toEqual(['b.html']);
                    done();
                }
            );
        });
    });
});
