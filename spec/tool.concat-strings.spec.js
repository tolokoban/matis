var Matis = require("../index");

function fixture(path) {
    return Path.join(__dirname, "fixtures", path);
}


describe('tools.ConcatStrings', function() {
    var tool = Matis.tools.ConcatStrings();
    
    it('should provide expected inputs.', function() {
        expect(tool.definition.input).toEqual([]);
    });
    it('should provide expected outputs.', function() {
        expect(tool.definition.output).toEqual([]);
    });
    
    it('should have some tests.', function(done) {
        fail("No test defined yet!");
        done();
    });
});
