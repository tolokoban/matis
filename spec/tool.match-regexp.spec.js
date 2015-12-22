var Matis = require("../index");

function fixture(path) {
    return Path.join(__dirname, "fixtures", path);
}


describe('tools.MatchRegexp', function() {
    var tool = Matis.tools.MatchRegexp();

    it('should provide expected inputs.', function() {
        expect(tool.definition.input).toEqual(["text"]);
    });
    it('should provide expected outputs.', function() {
        expect(tool.definition.output).toEqual(["yes","no"]);
    });

    describe('should match', function() {
        [
            ["^[a-z]+$", 'ulla', "whole text"],
            ["[a-z]+$", '3615ulla', "part of text"],
            ["[a-z]+", 'Miss ulla!', "part of text"]
        ].forEach(function (testcase) {
            var pattern = testcase[0];
            var text = testcase[1];
            var caption = 'whole text';
            it(caption + '.', function(done) {
                tool = Matis.tools.MatchRegexp(pattern);
                tool.exec(
                    {text: text},
                    function(outputs) {
                        expect(outputs.no).not.toBeDefined();
                        expect(outputs.yes).toBeDefined();
                        expect(outputs.yes).toBe(text);
                        done();
                    },
                    function(err) {
                        done.fail(err);
                    }
                );
            });
        });
    });

    describe('should not match', function() {
        [
            ["^[a-z]+$", '3615ulla', "whole text"],
            ["[a-z]+$", '3615', "part of text"],
            ["[a-z]+", '! ?', "part of text"]
        ].forEach(function (testcase) {
            var pattern = testcase[0];
            var text = testcase[1];
            var caption = 'whole text';
            it(caption + '.', function(done) {
                tool = Matis.tools.MatchRegexp(pattern);
                tool.exec(
                    {text: text},
                    function(outputs) {
                        expect(outputs.yes).not.toBeDefined();
                        expect(outputs.no).toBeDefined();
                        expect(outputs.no).toBe(text);
                        done();
                    },
                    function(err) {
                        done.fail(err);
                    }
                );
            });
        });
    });
});
