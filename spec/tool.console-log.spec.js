var Matis = require("../index");

function fixture(path) {
    return Path.join(__dirname, "fixtures", path);
}


describe('tools.ConsoleLog', function() {
    it('should provide expected inputs.', function() {
        var tool = Matis.tools.ConsoleLog();    
        expect(tool.definition.input).toEqual(["any"]);
    });
    it('should provide expected outputs.', function() {
        var tool = Matis.tools.ConsoleLog();    
        expect(tool.definition.output).toEqual(["any"]);
    });
    
    it('should accept syntax `ConsoleLog(logger)`.', function(done) {
        var logMsg = 'Not initialized yet!';
        var tool = Matis.tools.ConsoleLog(function(msg) {
            logMsg = msg;
        });
        tool.exec(
            {any: 27},
            function(outputs) {
                expect(logMsg).toEqual("log: 27");
                done();
            }
        );
    });
});
