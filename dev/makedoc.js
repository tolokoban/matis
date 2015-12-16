var Path = require("path");
var Matis = require('../index');

//---------------
// Create tools.
var log = function(prefix) {
    if (typeof prefix === 'undefined') prefix = 'log: ';
    return Matis.tools.ConsoleLog(prefix);
};

var readdir = Matis.tools.ReadDir().name('readdir');
var outputPath = Matis.tools.Constant(Path.join(__dirname, '../README.md')).name('outputPath');
var savetext = Matis.tools.SaveText().name('savetext');
var tplName = Matis.tools.Constant(Path.join(__dirname, '../README.tpl')).name('tplName');
var tplContent = Matis.tools.LoadText('utf-8').name('tplContent');
var filter = Matis.tools.MatchRegexp("tool\\.[a-z0-9\\-]+\\.js$").name('filter');
var loadtext = Matis.tools.LoadText('utf-8').name('loadtext');
var firstcomment = require('./inc/tool.first-comment')().name('firstcomment');
var getname = require('./inc/tool.get-name')().name('getname');
var mdtitle = require('./inc/tool.md-title')().name('mdtitle');
var specialTags = require('./inc/tool.special-tags')().name('specialTags');
var concat = Matis.tools.ConcatStrings(["title", "comment"]).name('concat');
var finalconcat = Matis.tools.ConcatStrings(["template", "tools"]).name('finalconcat');
var join = Matis.tools.Join('\n').name('join');

var foreach = Matis.tools.ForEach({
    tool: filter,
    input: "text",
    output: "text"
});

//-------------
// Link tools.
readdir.link(outputPath).link(savetext, 'path');
readdir.link(tplName).link(tplContent).link('text', specialTags).link(finalconcat, 'template');

readdir.link(foreach);
filter.link('yes', loadtext).link('text', firstcomment).link(concat, 'comment');
filter.link('yes', getname).link(mdtitle).link(concat, 'title');

foreach.link(join).link(finalconcat, 'tools');

finalconcat.link(savetext, 'text');

//concat.link(log('concat: '));

//----------
// Execute.
Matis.Tool.debug(0);

Matis.Record("debug.rec", readdir).exec(
    {path: Path.join(__dirname, "..", "lib")}
);







