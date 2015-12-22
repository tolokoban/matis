var Path = require("path");

var Matis = require("../index");

function fixture(path) {
    return Path.join(__dirname, "fixtures", path);
}


describe('tools.BaseName', function() {
    var tool = Matis.tools.BaseName();
    
    it('should provide expected inputs.', function() {
        expect(tool.definition.input).toEqual(["path"]);
    });
    it('should provide expected outputs.', function() {
        expect(tool.definition.output).toEqual(["basename"]);
    });

    it('should output the base name of __filename', function(done) {
        tool.exec({path: __filename}, function(outputs) {
            expect(outputs.basename).toBe(Path.basename(__filename));
            done();
        });
        done();
    });
});
