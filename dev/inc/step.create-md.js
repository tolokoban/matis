var Path = require("path");
var Matis = require('../../index');

module.exports = function() {
    var listTools = Matis.tools.ReadDir().name('list-tools');
    var filterTool = Matis.tools.MatchRegexp("tool\\.[a-z0-9\\-]+\\.js$").name('filter-tool');
    var loadToolCode = Matis.tools.LoadText('utf8').name('load-tool-code');
    var extractComment = require('./tool.first-comment')().name('extract-comment');
    var toolName = require('./tool.get-name')().name('tool-name');
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
        output: "path"
    }).name('foreach-js');


    filterTool.link('yes', loadToolCode).link('text', extractComment).link(concat, 'comment');
    //filterTool.O.yes(loadToolCode).text(extractComment)(concat.I.comment);
    filterTool.link('yes', toolName).link(makeTitle).link(concat, 'title');
    concat.link(saveMd, 'text');
    toolName.link(mdFilename).link(saveMd, 'path');

    return { head: listTools, tail: listTools.link(foreachJS) };
};
