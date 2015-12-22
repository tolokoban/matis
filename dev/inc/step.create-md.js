var Path = require("path");
var Matis = require('../../index');
var Template = require("./template");


module.exports = function() {
    var process = Matis.Process(function() {
        this.ListTools = Matis.tools.ReadDir();
        this.FilterTool = Matis.tools.MatchRegexp("tool\\.[a-z0-9\\-]+\\.js$");
        this.LoadToolCode = Matis.tools.LoadText('utf8');
        this.ExtractComment = require('./tool.first-comment')();
        this.ToolName = require('./tool.get-name')();
        this.SpecExists = Matis.tools.ExistsFile();
        this.BlackHole = Matis.tools.BlackHole();
        this.SpecPath = {
            input: "path", output: "path", exec: function(inputs, resolve) {
                var basename = Path.basename(inputs.path, '.js');
                resolve({path: Path.join(__dirname, "../../spec/", basename + ".spec.js")});
            }
        };
        this.SpecTemplate = {
            input: ["name", "path"], output: "text", exec: function(inputs, resolve) {
                var path = Path.join(
                    __dirname, "../../lib",
                    Path.basename(inputs.path, '.spec.js') + '.js');
                var tool;
                try {
                    tool = require(path)();
                    console.log("!!! " + inputs.name + " : ", tool);                    
                }
                catch (e) {
                    console.log("### " + inputs.name + " : ", tool);                    
                    tool = {definition: {input: [], output: []}};
                }
                resolve({
                    text: Template.file(
                        "spec.js",
                        {
                            NAME: inputs.name.substr(0, inputs.name.length - 5),
                            INPUTS: JSON.stringify(tool.definition.input),
                            OUTPUTS: JSON.stringify(tool.definition.output)
                        }
                    ).out
                });
            }
        };
        this.ToolName2 = require('./tool.get-name')();
        this.MakeTitle = Matis.tools.PrefixSuffix({
            prefix: "# ", suffix: "\n\n"
        });
        this.Concat = Matis.tools.ConcatStrings(["title", "comment"]);
        this.MdFilename = Matis.tools.PrefixSuffix({
            prefix: Path.join(__dirname, "../../doc") + '/',
            suffix: '.md'
        });
        this.SaveSpec = Matis.tools.SaveText('utf8');
        this.SaveMd = Matis.tools.SaveText('utf8');
        this.ForEachJS = Matis.tools.ForEach({
            tool: this.FilterTool,
            output: "path"
        });
    }, [
        "FilterTool:yes > LoadToolCode > ExtractComment > comment:Concat",
        "FilterTool:yes > ToolName > MakeTitle > title:Concat",
        "FilterTool:yes > SpecPath > SpecExists:no > path:SaveSpec > BlackHole",
        "SpecExists:no  > ToolName2 > name:SpecTemplate > text:SaveSpec",
        "SpecExists:no  >             path:SpecTemplate",
        "SpecExists:yes > BlackHole",
        "Concat > text:SaveMd",
        "ToolName > MdFilename > path:SaveMd",
        "ListTools > ForEachJS"
    ]);


    return { head: process.ListTools, tail: process.ForEachJS };
};
