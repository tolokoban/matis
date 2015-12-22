var Matis = require("../index");

function fixture(path) {
    return Path.join(__dirname, "fixtures", path);
}


describe('tools.Constant', function() {
    var tool = Matis.tools.Constant();
    
    it('should provide expected inputs.', function() {
        expect(tool.definition.input).toEqual(["void"]);
    });
    it('should provide expected outputs.', function() {
        expect(tool.definition.output).toEqual(["value"]);
    });
    
    it('should have some tests.', function(done) {
        fail("No test defined yet!");
        done();
    });
});
