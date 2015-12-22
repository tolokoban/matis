var Path = require("path");

function fixture(path) {
    return Path.join(__dirname, "fixtures", path);
}


var Matis = require("../index");

var process = Matis.Process(function() {
    this.Start = Matis.tools.Nop().name('start');
    this.LoadBody = Matis.tools.LoadText('utf-8');
    this.LoadHead = Matis.tools.LoadText('utf-8');
    this.LoadFoot = Matis.tools.LoadText('utf-8');
    this.ChangeExtForHead = Matis.tools.ChangeExtension({js: "head"});
    this.ChangeExtForFoot = Matis.tools.ChangeExtension({js: "foot"});
    this.ExistsHead = Matis.tools.ExistsFile();
    this.ExistsFoot = Matis.tools.ExistsFile();
    this.ConstHead = Matis.tools.Constant("// Missing header.\n");
    this.ConstFoot = Matis.tools.Constant("// Missing footer.\n");
    this.Concat = Matis.tools.ConcatStrings(['head', 'body', 'foot']);
}, [
    "Start > LoadBody > body:Concat",    
    "Start > ChangeExtForHead > ExistsHead:yes > LoadHead > head:Concat",
    "Start > ChangeExtForFoot > ExistsFoot:yes > LoadFoot > foot:Concat",
    "ExistsHead:no > ConstHead > head:Concat",
    "ExistsFoot:no > ConstFoot > foot:Concat"
]);

describe('Process (1)', function() {
    it('should concat `process1a.js` with a header and a footer.', function(done) {
        process.exec(
            { any: fixture('process1a.js') },
            function (output) {
                if (output) {
                    expect(output.text).toEqual("/* Copyleft */var a = 27;// 2016-01-01");
                    done();
                }
            },
            function (err) {
                done.fail(err);
            }
        );
    });
});
