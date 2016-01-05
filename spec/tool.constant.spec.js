var Matis = require("../index");

function fixture(path) {
    return Path.join(__dirname, "fixtures", path);
}


describe('tools.Constant', function() {
    it('should provide expected inputs.', function() {
        var tool = Matis.tools.Constant();    
        expect(tool.definition.input).toEqual(["void"]);
    });
    it('should provide expected outputs.', function() {
        var tool = Matis.tools.Constant();    
        expect(tool.definition.output).toEqual(["value"]);
    });
    
    it('should output a constant.', function(done) {
        var tool = Matis.tools.Constant(27);
        tool.exec({any: 4}, function(outputs) {
            expect(outputs.value).toBe(27);
            done();
        });
    });
});
