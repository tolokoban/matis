var Matis = require("../index");

function fixture(path) {
    return Path.join(__dirname, "fixtures", path);
}


describe('tools.ConcatStrings', function() {
    it('should provide expected empty inputs.', function() {
        var tool = Matis.tools.ConcatStrings();    
        expect(tool.definition.input).toEqual([]);
    });
    it('should provide expected inputs.', function() {
        var tool = Matis.tools.ConcatStrings(["a", "b"]);    
        expect(tool.definition.input).toEqual(["a", "b"]);
    });
    it('should provide expected outputs.', function() {
        var tool = Matis.tools.ConcatStrings();            
        expect(tool.definition.output).toEqual(["text"]);
    });
    
    it('should keep verbatim an unique input.', function(done) {
        var tool = Matis.tools.ConcatStrings("text");
        tool.exec(
            {text: "Hello"},
            function(outputs) {
                expect(outputs.text).toBe("Hello");
                done();
            }
        );
    });

    it('should concat two inputs.', function(done) {
        var tool = Matis.tools.ConcatStrings(["a", "b"]);
        tool.exec(
            {a: "Hel", b: "lo"},
            function(outputs) {
                expect(outputs.text).toBe("Hello");
                done();
            }
        );
    });
});
