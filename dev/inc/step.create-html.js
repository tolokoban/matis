var Path = require("path");
var Matis = require('../../index');

module.exports = function() {

    var start = Matis.tools.Nop().name('start');
    var loadMdCode = Matis.tools.LoadText('utf8').name('load-md-code');
    var markdown = require('./tool.markdown-it')();
    var htmlFilename = Matis.tools.PrefixSuffix({
        prefix: Path.join(__dirname, "../../gh-pages") + '/'
    }).name('html-filename');
    var basename = Matis.tools.BaseName().name('basename');
    var changeExtension = Matis.tools.ChangeExtension({md: 'html'}).name('change-ext');
    var templateName = Matis.tools.Constant(Path.join(__dirname, '../../doc/page.tpl'))
            .name('template-name');
    var loadTemplate = Matis.tools.LoadText('utf8').name('load-tpl');
    var combine = require('./template')().name('combine');
    var saveHTML = Matis.tools.SaveText('utf8');

    start.link(templateName).link(loadTemplate).link(combine, 'template');
    start.link(loadMdCode).link(markdown).link(combine, 'text').link(saveHTML, 'text');
    start.link(basename).link(changeExtension).link(htmlFilename).link(saveHTML, 'path');


    var docPath = Matis.tools.Constant(Path.join(__dirname, "../../doc")).name('doc-path');
    var listPages = Matis.tools.ReadDir().name('list-pages');
    var foreachMD = Matis.tools.ForEach({
        tool: start,
        output: "path"
    }).name('foreach-md');


    return { head: docPath, tail: docPath.link(listPages).link(foreachMD) };
};
