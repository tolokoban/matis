var Matis = require("../index");

function fixture(path) {
    return Path.join(__dirname, "fixtures", path);
}


describe('tools.DirName', function() {
    var tool = Matis.tools.DirName();

    it('should provide expected inputs.', function() {
        expect(tool.definition.input).toEqual(["path"]);
    });
    it('should provide expected outputs.', function() {
        expect(tool.definition.output).toEqual(["basename"]);
    });

    it('should extrac basename.', function(done) {
        tool.exec(
            {path: "/home/tolokoban/file.js"},
            function(outputs) {
                expect(outputs.basename).toBe("file.js");
                done();
            }
        );
    });
});
