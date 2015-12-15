var Path = require("path");

function fixture(path) {
    return Path.join(__dirname, "fixtures", path);
}


var Matis = require("../index");

// Create tools.
var loadBody = Matis.tools.LoadText('utf-8');
var loadHead = Matis.tools.LoadText('utf-8');
var loadFoot = Matis.tools.LoadText('utf-8');
var changeExtForHead = Matis.tools.ChangeExtension({js: "head"});
var changeExtForFoot = Matis.tools.ChangeExtension({js: "foot"});
var existsHead = Matis.tools.ExistsFile();
var existsFoot = Matis.tools.ExistsFile();
var constHead = Matis.tools.Constant("// Missing header.\n");
var constFoot = Matis.tools.Constant("// Missing footer.\n");
var concat = Matis.tools.ConcatStrings(['head', 'body', 'foot']);

// Link tools.
loadBody.link('text', concat, 'body');
loadBody.link('path', changeExtForHead).link(existsHead).link('yes', loadHead).link('text', concat, 'head');
loadBody.link('path', changeExtForFoot).link(existsFoot).link('yes', loadFoot).link('text', concat, 'foot');
existsHead.link('no', constHead).link(concat, 'head');
existsFoot.link('no', constFoot).link(concat, 'foot');


describe('Process (1)', function() {
    it('should concat `process1a.js` with a header and a footer.', function(done) {
        loadBody.exec(
            { path: fixture('process1a.js') },
            function (output) {
                expect(output.text).toEqual("/* Copyleft */var a = 27;// 2016-01-01");
                done();
            },
            function (err) {
                done.fail(err);
            }
        );
    });
});

