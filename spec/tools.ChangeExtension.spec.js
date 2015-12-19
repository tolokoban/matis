var Path = require("path");
var Matis = require("../index");

describe('tools.ChangeExtension', function() {
    var change = Matis.tools.ChangeExtension({
        less: 'css', md: 'html'
    });
    [
        ['helloworld', 'md', 'html'],
        ['/var/usr/home/p', 'md', 'html'],
        ['http://tolokoban.org/file', 'md', 'html'],
        ['helloworld', 'less', 'css'],
        ['helloworld', 'txt', 'txt'],
        ['helloworld', 'bin', 'bin']
    ].forEach(function (itm) {
        var radix = itm[0];
        var ext1 = itm[1];
        var ext2 = itm[2];
        it(radix + "." + ext1 + " -> ." + ext2, function(done) {
            change.exec(
                {path: radix + "." + ext1},
                function(output) {
                    expect(output.path).toBe(radix + '.' + ext2);
                    done();
                }
            );
        });
    });
});
