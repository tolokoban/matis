var Path = require("path");

function fixture(path) {
    return Path.join(__dirname, "fixtures", path);
}


var Matis = require("../index");

describe('tools.LoadText', function() {
    it('should reject not existent file with `code: ENOENT`.', function(done) {
        var loadText = Matis.tools.LoadText('utf-8');
        loadText.exec(
            {path: "notfound.txt"},
            function(output) {
                done.fail("Should have failed because `notfound.txt` does not exist!");
            },
            function(err) {
                expect(err.code).toBe('ENOENT');
                done();
            }
        );
    });

    it('should load `utf-8` text-file.', function(done) {
        var loadText = Matis.tools.LoadText('utf-8');
        loadText.exec(
            {path: fixture('loadtext.txt')},
            function(output) {
                if (typeof output.text !== 'string') {
                    done.fail("`output.text` must be a string!");
                } else {
                    expect(output.text.trim()).toBe("ça c'est ありがとうございます !");
                    done();
                }
            },
            function(err) {
                done.fail(err);
            }
        );
    });
});
