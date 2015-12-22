var Matis = require("../index");

function fixture(path) {
    return Path.join(__dirname, "fixtures", path);
}


describe('tools.Join', function() {
    var tool = Matis.tools.Join();
    
    it('should provide expected inputs.', function() {
        expect(tool.definition.input).toEqual(["array"]);
    });
    it('should provide expected outputs.', function() {
        expect(tool.definition.output).toEqual(["text"]);
    });
    
    it('should have some tests.', function(done) {
        fail("No test defined yet!");
        done();
    });
});
