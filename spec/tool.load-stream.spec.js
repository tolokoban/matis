var Matis = require("../index");
var Path = require("path");


function fixture(path) {
    return Path.join(__dirname, "fixtures", path);
}


describe('tools.LoadStream', function() {
    var tool = Matis.tools.LoadStream();

    it('should provide expected inputs.', function() {
        expect(tool.definition.input).toEqual(["path"]);
    });
    it('should provide expected outputs.', function() {
        expect(tool.definition.output).toEqual(["stream"]);
    });

    it('should load `utf-8` text-file.', function(done) {
        var loadStream = Matis.tools.LoadStream('utf-8');
        loadStream.exec(
            {path: fixture('loadtext.txt')},
            function(output) {
                if (typeof output.stream.toString !== 'function') {
                    done.fail("Not a stream!");
                } else {
                    expect(output.stream.toString().trim()).toBe("ça c'est ありがとうございます !");
                    done();
                }
            },
            function(err) {
                done.fail(err);
            }
        );
    });
});
