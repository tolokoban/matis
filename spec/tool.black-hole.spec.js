var Matis = require("../index");

function fixture(path) {
    return Path.join(__dirname, "fixtures", path);
}


describe('tools.BlackHole', function() {
    var tool = Matis.tools.BlackHole();
    
    it('should provide expected inputs.', function() {
        expect(tool.definition.input).toEqual(["any"]);
    });
    it('should provide expected outputs.', function() {
        expect(tool.definition.output).toEqual([]);
    });
});
