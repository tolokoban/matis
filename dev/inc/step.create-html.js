var Path = require("path");
var Matis = require('../../index');
var Template = require("./template");
var Package = require("../../package.json");


module.exports = function() {
    var process = Matis.Process(function() {
        this.DocPath = Matis.tools.Constant(Path.join(__dirname, "../../doc"));
        this.ListPages = Matis.tools.ReadDir();

        this.Start = Matis.tools.Nop();
        this.LoadMdCode = Matis.tools.LoadText('utf8');
        this.Markdown = require('./tool.markdown-it')();
        this.HtmlFilename = Matis.tools.PrefixSuffix({
            prefix: Path.join(__dirname, "../../gh-pages") + '/'
        });
        this.BaseName = Matis.tools.BaseName();
        this.ChangeExtension = Matis.tools.ChangeExtension({md: 'html'});
        this.Combine = {
            input: "body", output: "text", exec: function(inputs, resolve) {
                resolve({text: Template.file('page.tpl', {VERSION: Package.version, BODY: inputs.body}).out});
            }
        };
        this.SaveHTML = Matis.tools.SaveText('utf8');

        this.ForEachMD = Matis.tools.ForEach({
            tool: this.Start,
            output: "path"
        });


    }, [
        "DocPath > ListPages > ForEachMD",
        "Start > LoadMdCode   > Markdown        > Combine > text:SaveHTML",
        "Start > BaseName     > ChangeExtension > HtmlFilename > path:SaveHTML"
    ]);

    return { head: process.DocPath, tail: process.ForEachMD };
};
