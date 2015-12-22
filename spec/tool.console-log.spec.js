var Matis = require("../index");

function fixture(path) {
    return Path.join(__dirname, "fixtures", path);
}


describe('tools.ConsoleLog', function() {
    var tool = Matis.tools.ConsoleLog();
    
    it('should provide expected inputs.', function() {
        expect(tool.definition.input).toEqual(["any"]);
    });
    it('should provide expected outputs.', function() {
        expect(tool.definition.output).toEqual(["any"]);
    });
    
    it('should have some tests.', function(done) {
        fail("No test defined yet!");
        done();
    });
});
