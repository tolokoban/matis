var Path = require("path");
var AT = require('../index');

//---------------
// Create tools.
var log = function(prefix) {
    if (typeof prefix === 'undefined') prefix = 'log: ';
    return AT.tools.ConsoleLog(prefix);
};

var readdir = AT.tools.ReadDir();
var outputPath = AT.tools.Constant(Path.join(__dirname, '../README.md'));
var savetext = AT.tools.SaveText();
var tplName = AT.tools.Constant(Path.join(__dirname, '../README.tpl'));
var tplContent = AT.tools.LoadText('utf-8');
var filter = AT.tools.MatchRegexp("tool\\.[a-z0-9\\-]+\\.js$");
var loadtext = AT.tools.LoadText('utf-8');
var firstcomment = require('./inc/tool.first-comment')();
var getname = require('./inc/tool.get-name')();
var mdtitle = require('./inc/tool.md-title')();
var concat = AT.tools.ConcatStrings(["title", "comment"]);
var finalconcat = AT.tools.ConcatStrings(["template", "tools"]);
var join = AT.tools.Join('\n');

var foreach = AT.tools.ForEach({
    tool: filter,
    input: "text",
    output: "text"
});

//-------------
// Link tools.
readdir.link(outputPath).link(savetext, 'path');
readdir.link(tplName).link(tplContent).link('text', finalconcat, 'template');

readdir.link(foreach);
filter.link('yes', loadtext).link('text', firstcomment).link(concat, 'comment');
filter.link('yes', getname).link(mdtitle).link(concat, 'title');

foreach.link(join).link(finalconcat, 'tools');

finalconcat.link(savetext, 'text');

//concat.link(log('concat: '));

//----------
// Execute.
readdir.exec(
    {path: Path.join(__dirname, "..", "lib")}
);







