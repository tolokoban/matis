var Matis = require("../index");
var Path = require("path");


function fixture(path) {
    return Path.join(__dirname, "fixtures", path);
}


describe('tools.ExistsFile', function() {
    var tool = Matis.tools.ExistsFile();

    it('should provide expected inputs.', function() {
        expect(tool.definition.input).toEqual(["path"]);
    });
    it('should provide expected outputs.', function() {
        expect(tool.definition.output).toEqual(["yes","no"]);
    });

    it('should say `no` if file does not exist.', function(done) {
        var path = fixture("this_file_does_not_exist");
        tool.exec(
            {path: path},
            function(outputs) {
                expect(outputs.no).toEqual(path);
                expect(outputs.yes).toBeUndefined();
                done();
            }
        );
    });

    it('should say `yes` if file does exist.', function(done) {
        var path = fixture("exists-file.txt");
        tool.exec(
            {path: path},
            function(outputs) {
                expect(outputs.yes).toEqual(path);
                expect(outputs.no).toBeUndefined();
                done();
            }
        );
    });
});
