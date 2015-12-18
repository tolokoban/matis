var Path = require("path");
var Matis = require('../index');

//---------------
// Create tools.
var log = function(prefix) {
    if (typeof prefix === 'undefined') prefix = 'log: ';
    return Matis.tools.ConsoleLog(prefix);
};

var listTools = Matis.tools.ReadDir().name('list-tools');
var filterTool = Matis.tools.MatchRegexp("tool\\.[a-z0-9\\-]+\\.js$").name('filter-tool');
var loadToolCode = Matis.tools.LoadText('utf8').name('load-tool-code');
var extractComment = require('./inc/tool.first-comment')().name('extract-comment');
var toolName = require('./inc/tool.get-name')().name('tool-name');
var makeTitle = Matis.tools.PrefixSuffix({
    prefix: "# ", suffix: "\n\n"
});
var concat = Matis.tools.ConcatStrings(["title", "comment"]).name('concat');
var mdFilename = Matis.tools.PrefixSuffix({
    prefix: Path.join(__dirname, "..", "doc") + '/',
    suffix: '.md'
}).name('md-filename');
var saveMd = Matis.tools.SaveText('utf8').name('save-md');

var foreachJS = Matis.tools.ForEach({
    tool: filterTool,
    output: "text"
});

var docPath = Matis.tools.Constant(Path.join(__dirname, "..", "doc")).name('doc-path');
var listPages = Matis.tools.ReadDir().name('list-pages');


//-------------
// Link tools.
listTools.link(foreachJS);

filterTool.link('yes', loadToolCode).link('text', extractComment).link(concat, 'comment');
loadToolCode.link('path', toolName).link(makeTitle).link(concat, 'title');
concat.link(saveMd, 'text');
toolName.link(mdFilename).link(saveMd, 'path');

foreachJS.link(docPath).link(listPages);

//----------
// Execute.
Matis.Tool.debug(0);

Matis.Record("debug.rec", listTools).exec(
    {path: Path.join(__dirname, "..", "lib")}
);







