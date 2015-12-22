var Matis = require("../index");

function fixture(path) {
    return Path.join(__dirname, "fixtures", path);
}


describe('{{NAME}}', function() {
    var tool = Matis.{{NAME}}();
    
    it('should provide expected inputs.', function() {
        expect(tool.definition.input).toEqual({{INPUTS}});
    });
    it('should provide expected outputs.', function() {
        expect(tool.definition.output).toEqual({{OUTPUTS}});
    });
    
    it('should have some tests.', function(done) {
        fail("No test defined yet!");
        done();
    });
});
