var FS = require("fs");
var Path = require("path");

function fixture(path) {
    return Path.join(__dirname, "fixtures", path);
}


var Matis = require("../index");

describe('tools.SaveText', function() {
    it('should have two inputs.', function() {
        var saveText = Matis.tools.SaveText('utf-8');
        expect(saveText.definition.input).toEqual(["path", "text"]);
    });

    it('should have one output.', function() {
        var saveText = Matis.tools.SaveText('utf-8');
        expect(saveText.definition.output).toEqual(["path"]);
    });

    it('should save `utf-8` text-file.', function(done) {
        var path = fixture('savetext.txt');
        var text = "Youpi!\nC'est la fête.";
        var saveText = Matis.tools.SaveText('utf-8');
        saveText.exec(
            {path: path, text: text},
            function(output) {
                expect(output.path).toBe(path);
                expect(FS.readFileSync(path).toString()).toBe(text);
                done();
            },
            function(err) {
                done.fail(err);
            }
        );
    });

    it('should accept only one input if `path` is defined as option.', function(done) {
        var path = fixture('savetext.txt');
        var text = "Youpi!\nC'est la fête.";
        var saveText = Matis.tools.SaveText({
            encoding: 'utf-8',
            path: path
        });
        saveText.exec(
            {text: text},
            function(output) {
                expect(output.path).toBe(path);
                expect(FS.readFileSync(path).toString()).toBe(text);
                done();
            },
            function(err) {
                done.fail(err);
            }
        );
    });
});
