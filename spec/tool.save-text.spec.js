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
        var saveText = Matis.tools.SaveText('utf-8');
        saveText.exec(
            {path: fixture('savetext.txt'), text: "Youpi!\nHourra!"},
            function(output) {
                expect(output.path).toBe(fixture('savetext.txt'));
                done();
            },
            function(err) {
                done.fail(err);
            }
        );
    });
});
