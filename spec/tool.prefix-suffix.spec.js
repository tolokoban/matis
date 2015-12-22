var Matis = require("../index");

function fixture(path) {
    return Path.join(__dirname, "fixtures", path);
}


describe('tools.PrefixSuffix', function() {
    var tool = Matis.tools.PrefixSuffix();
    
    it('should provide expected inputs.', function() {
        expect(tool.definition.input).toEqual(['text']);
    });
    it('should provide expected outputs.', function() {
        expect(tool.definition.output).toEqual(['text']);
    });

    [
        ['<', 'code', '>'],
        ['<', 'code'],
        [undefined, 'code', '>'],
        [undefined, 'code']
    ].forEach(function (testcase) {
        var prefix = testcase[0];
        var text = testcase[1];
        var suffix = testcase[2];
        var expected = (prefix || '') + text + (suffix || '');
        it('should surround `text`.', function(done) {
            var tool = Matis.tools.PrefixSuffix({prefix: prefix, suffix: suffix});
            tool.exec(
                {text: text},
                function(outputs) {
                    expect(outputs.text).toBe(expected);
                    done();
                }
            );
        });
    });
});
