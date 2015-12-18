var Matis = require("../index");

describe('Tracability', function() {
    describe('through `tools.Constant`', function() {
        var start = Matis.tools.Constant('START');
        ['foo', 'bar', 'toto'].forEach(function (tag, idx) {
            it('should keep tag at loop #' + (1 + idx), function(done) {
                start.exec(
                    {void: 'blabla', $tag: tag},
                    function(output) {
                        expect(output.$tag).toBe(tag);
                        done();
                    }
                );
            });
        });
    });

    describe('$tag', function() {
        it('should not create a new input in the mailbox', function(done) {
            var start = Matis.tools.Constant('BO');
            var concat = Matis.tools.ConcatStrings(["a", "b"]);
            start.link(concat, 'a');
            start.link(concat, 'b');
            start.exec(
                {$tag: "yoman", void: "blabla"},
                function(output) {
                    expect(output).toEqual({text: 'BOBO', $tag: 'yoman'});
                    done();
                }
            );
        });

        it('should trace multiple origins', function(done) {
            var start = Matis.tools.MatchRegexp('[aeiouy]', 'i');
            var concat = Matis.tools.ConcatStrings(["vowel", "consonant"]);
            start.link('yes', concat, 'vowel');
            start.link('no', concat, 'consonant');

            var resolve = function(output) {
                if (output) {
                    // Ignoring leak. Leaks are represented by a undefined `output`.
                    expect(output.text).toBe('iF');
                    expect(output.$tag).toEqual([1, 3]);
                    done();
                }
            };

            start.exec({$tag: 1, text: "F"}, resolve);
            start.exec({$tag: 2, text: "b"}, resolve);
            start.exec({$tag: 3, text: "i"}, resolve);
        });
    });
});
