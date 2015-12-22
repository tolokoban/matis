var Tool = require("./tool");


var RX_VALID_TOOLNAME = new RegExp("^[A-Z][A-Za-z0-9_$]*$");
var RX_VALID_IONAME = new RegExp("^[a-z][A-Za-z0-9_$]*$");


/**
 * @param {function} defineTools - Function registering the tools.
 * @param {array[string]} links - Links.
 *
 * @example
 * var Matis = require('matis');
 * var main = new Matis.Process(function() {
 *   this.SourcesPath = Matis.tools.Constant('./src');
 *   this.AllSources = Matis.tools.ReadDir();
 *   this.Zip = require('./zipper'))({level: 7});
 *   this.Loop = Matis.tools.ForEach({tool: this.Zip});
 * }, [
 *   "SourcePath > AllSources > Loop"
 * ])
 */
var Process = function(defineTools, links) {
    // Check arguments.
    if (!typeof defineTools === 'function') {
        throw Error("[Matis.Process] Argument `defineTools` must be a function!");
    }
    if (!Array.isArray(links)) links = [links];

    // Initialising tools.
    var tools = {};
    defineTools.call(tools);
    // Checking tools.
    // A tool is valid if its name and the name of its I/O are valid.
    var toolname;
    var tool;
    for (toolname in tools) {
        if (!RX_VALID_TOOLNAME.test(toolname)) {
            throw Error("[Matis.Process] Invalid tool's name `" + toolname + "`!\n"
                        + "Valid names start with an uppercase latin letter and can contain only digits, "
                        + "latin letters, underscores and dollars signs.");
        }
        tool = tools[toolname];
        // Tools can be provided as objects or just definitions.
        if (!Tool.isTool(tool)) {
            // This is a definition. Create the tool arround it.
            tools[toolname] = tool = Tool(tool);
        }
        // Check inputs' names.
        tool.definition.input.forEach(function (name) {
            if (!RX_VALID_IONAME.test(name)) {
                throw Error("[Matis.Process] Invalid input's name `" + name + "` for tool `"
                            + toolname + "`!\n"
                            + "Valid inputs' names start with a lowercase latin letter and can contain only "
                            + "digits, latin letters, underscores and dollars signs.");
            }
        });
        // Check outputs' names.
        tool.definition.output.forEach(function (name) {
            if (!RX_VALID_IONAME.test(name)) {
                throw Error("[Matis.Process] Invalid output's name `" + name + "` for tool `"
                            + toolname + "`!\n"
                            + "Valid outputs' names start with a lowercase latin letter and can contain only "
                            + "digits, latin letters, underscores and dollars signs.");
            }
        });
        tool.name(toolname, true);
        // Register this tool  as an attribute of  the process. Remember
        // that tool's names start with an uppercase latin letter.
        this[toolname] = tool;
        // Set parent.
        tool.process = this;
        // Is it the first  tool of the process? If yes,  it will be the
        // starting point.
        if (!this.start) {
            this.start = tool;
        }
    }

    // Set links.
    link.call(this, links);
};


/**
 * @return void
 */
Process.prototype.exec = function(input, resolve, reject) {
    return this.start.exec(input, resolve, reject);
};


function link(links) {
    var that = this;

    links.forEach(function (link) {
        link = link.trim();
        var i;
        // Elements of `items` are strings with this syntax: `[input:]Tool[:output]`.
        var items = link.split(">");
        // Elements of `tools` are object of form: `{input: 'path', tool: <Tool>, output: 'text'}`.
        var tools = items.map(function(item) {
            item = item.trim();
            var tool = {tool: null};
            var parts = item.split(":");
            parts.forEach(function (part, idx) {
                part = part.trim();
                if (part.charAt(0) == part.charAt(0).toUpperCase()) {
                    // Tool's name.
                    if (tool.tool) {
                        throw Error("[Matis.Process] Bad link syntax: `" + link + "`!\n"
                                    + "Problem with tool description `" + item + "` ; "
                                    + "two items with an uppercase: `" + tool.tool
                                    + "` and `" + part + "`!");
                    }
                    tool.tool = part;
                } else {
                    // I/O's name.
                    if (tool.tool) {
                        // This is an output.
                        tool.output = part;
                    } else {
                        // This is an input, because the tool has not yet been set.
                        tool.input = part;
                    }
                }
            });
            // Check if a tool has been defined.
            if (!tool.tool) {
                throw Error("[Matis.Process] No tool defined in `"
                            + item + "` of `" + link + "`!");
            }
            // Check  it  a  tool  with that  name  exists.  And  change
            // `tool.tool` with the Tool object in place of its name.
            if (that[tool.tool]) {
                tool.tool = that[tool.tool];
            } else {
                throw Error("[Matis.Process] Unknown tool `" + tool.tool + "` in link `" + item + "`!");
            }
            // Check for default input.
            if (!tool.input) {
                if (tool.tool.definition.input.length > 1) {
                    throw Error("[Matis.Process] Ambigous input specification in `" + item + "`!\n"
                                + "Tool `" + tool.tool.name() + "` has several inputs: "
                                + tool.tool.input.join(", "));
                }
                tool.input = tool.tool.definition.input[0];
            } else {
                if (tool.tool.definition.input.indexOf(tool.input) == -1) {
                    throw Error("[Matis.Process] Tool `" + tool.input + "` has no input called `"
                                + tool.tool.name() + "`!\nDefined input are: "
                                + tool.tool.definition.input.join(", "));
                }
            }
            // Check for default output.
            if (!tool.output) {
                if (tool.tool.definition.output.length > 1) {
                    throw Error("[Matis.Process] Ambigous output specification in `" + item + "`!\n"
                                + "Tool `" + tool.tool.name() + "` has several outputs: "
                                + tool.tool.output.join(", "));
                }
                tool.output = tool.tool.definition.output[0];
            } else {
                if (tool.tool.definition.output.indexOf(tool.output) == -1) {
                    throw Error("[Matis.Process] Tool `" + tool.output + "` has no output called `"
                                + tool.tool.name() + "`!\nDefined output are: "
                                + tool.tool.definition.output.join(", "));
                }
            }

            return tool;
        });
        // Source and destination tools of a link.
        var src, dst;
        for (i = 0 ; i < tools.length - 1 ; i++) {
            src = tools[i];
            dst = tools[i + 1];
            src.tool.link(src.output, dst.tool, dst.input);
        }
    });
}


module.exports = function(defineTools, links) {
    return new Process(defineTools, links);
};
