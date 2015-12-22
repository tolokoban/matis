var Path = require("path");
var Matis = require("../index");

function fixture(path) {
    return Path.join(__dirname, "fixtures", path);
}


describe('tools.ShellExec', function() {
    var tool = Matis.tools.ShellExec();

    it('should provide expected inputs.', function() {
        expect(tool.definition.input).toEqual(["command"]);
    });
    it('should provide expected outputs.', function() {
        expect(tool.definition.output).toEqual(["strout","stderr"]);
    });

    [['', '']].forEach(function (testcase) {
        it('should read stdout and stderr.', function(done) {
            var stdout = testcase[0];
            var stderr = testcase[1];
            var shell = Matis.tools.ShellExec({cwd: Path.join(__dirname, "fixtures")});
            shell.exec(
                {command: 'node echo.js "' + stdout + '" "' + stderr + '"'},
                function(outputs) {
                    expect(outputs.stdout.trim()).toBe(stdout);
                    expect(outputs.stderr.trim()).toBe(stderr);                    
                    done();
                },
                function(err) {
                    done.fail(err);
                });
        });
    });
});
