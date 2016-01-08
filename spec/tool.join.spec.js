var Matis = require("../index");

function fixture(path) {
    return Path.join(__dirname, "fixtures", path);
}


describe('tools.Join', function() {

    it('should provide expected inputs.', function() {
        var tool = Matis.tools.Join();
        expect(tool.definition.input).toEqual(["array"]);
    });
    it('should provide expected outputs.', function() {
        var tool = Matis.tools.Join();
        expect(tool.definition.output).toEqual(["text"]);
    });

    it('should join with a glue.', function(done) {
        var tool = Matis.tools.Join(",");
        tool.exec(
            {array: ['a', 'b', 'c']},
            function(outputs) {
                expect(outputs.text).toBe("a,b,c");
                done();
            }
        );
    });

    it('should join without any glue.', function(done) {
        var tool = Matis.tools.Join();
        tool.exec(
            {array: ['a', 'b', 'c']},
            function(outputs) {
                expect(outputs.text).toBe("abc");
                done();
            }
        );
    });
});
