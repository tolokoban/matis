var Path = require("path");
var Matis = require("../index");

function fixture(path) {
    return Path.join(__dirname, "fixtures", path);
}


describe('tools.ReadDir', function() {
    var tool = Matis.tools.ReadDir();
    
    it('should provide expected inputs.', function() {
        expect(tool.definition.input).toEqual(["path"]);
    });
    it('should provide expected outputs.', function() {
        expect(tool.definition.output).toEqual(["files"]);
    });
    
    it('should have some tests.', function(done) {
        tool.exec(
            {path: fixture('readdir')},
            function(outputs) {
                expect(outputs.files).toEqual(
                    [
                        fixture('readdir/a.txt'),
                        fixture('readdir/b.txt'),
                        fixture('readdir/c.txt')
                    ]
                );
                done();
            }
        );
    });
});
