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
        var tools = items.map(function(item, idxItem) {
            item = item.trim();
            var tool = {tool: null};
            var parts = item.split(":");
            parts.forEach(function (part) {
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
                throw Error("[Matis.Process] Unknown tool `" + tool.tool + "` in link `" + link + "`!\n"
                            + didYouMean(tool.tool, that));
            }
            // Check for default input if it is not the first tool of the chain.
            if (idxItem > 0) {
                if (!tool.input) {
                    if (tool.tool.definition.input.length > 1) {
                        throw Error("[Matis.Process] Ambigous input specification in `" + item + "` for link `"
                                    + link + "`!\n"
                                    + "Tool `" + tool.tool.name() + "` has several inputs: "
                                    + tool.tool.definition.input.join(", "));
                    }
                    tool.input = tool.tool.definition.input[0];
                } else {
                    if (tool.tool.definition.input.indexOf(tool.input) == -1) {
                        throw Error("[Matis.Process] Tool `" + tool.input + "` has no input called `"
                                    + tool.tool.name() + "`!\nDefined input are: "
                                    + tool.tool.definition.input.join(", ")
                                    + "\n" + didYouMean(tool.input, tool.tool.definition.input));
                    }
                }
            }
            // Check for default output if it is not the last tool of the chain.
            if (idxItem < items.length - 1) {
                if (!tool.output) {
                    if (tool.tool.definition.output.length > 1) {
                        throw Error("[Matis.Process] Ambigous output specification in `" + item
                                    + "` for link `" + link + "`!\n"
                                    + "Tool `" + tool.tool.name() + "` has several outputs: "
                                    + tool.tool.output.join(", "));
                    }
                    tool.output = tool.tool.definition.output[0];
                } else {
                    if (tool.tool.definition.output.indexOf(tool.output) == -1) {
                        throw Error("[Matis.Process] Tool `" + tool.output + "` has no output called `"
                                    + tool.tool.name() + "`!\nDefined output are: "
                                    + tool.tool.definition.output.join(", ")
                                    + "\n" + didYouMean(tool.output, tool.tool.definition.output));
                    }
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


function didYouMean(word, words) {
    if (!Array.isArray(words)) {
        var arr=[], key;
        for (key in words) {
            arr.push(key);
        }
        words = arr;
    }

    return "Did you mean `" + findNearestWord(word, words) + "`?";
}


function findNearestWord(word, words) {
    var i;
    var curWord;
    var curDist;
    var bestDist = levenshtein(word, words[0]);
    var bestWord = words[0];
    for (i = 1; i < words.length ; i++) {
        curWord = words[i];
        curDist = levenshtein(word, curWord);
        if (curDist < bestDist) {
            bestDist = curDist;
            bestWord = curWord;
        }
    }
    return bestWord;
}


/**
 * Return the Levenshtein distance between `a` and `b`.
 * https://en.wikipedia.org/wiki/Levenshtein_distance
 */
function levenshtein(a, b) {
    var i, j, k;
    var d = [];

    var data = function(i, j, v) {
        var idx = i * b.length + j;
        if (typeof v === 'undefined') return d[idx];
        d[idx] = v;
    };

    for (i = 0 ; i <= a.length ; i++) {
        data(i, 0, i);
    }

    for (j = 0 ; j <= b.length ; j++) {
        data(0, j, j);
    }

    for (i = 1 ; i <= a.length ; i++) {
        for (j = 1 ; j <= b.length ; j++) {
            if (a.charAt(i) == b.charAt(j)) {
                data(i, j, data(i - 1, j - 1));
            } else {
                data(
                    i, j,
                    Math.min(
                        data(i, j - 1) + 1,
                        data(i - 1, j) + 1,
                        data(i - 1, j - 1) + 1
                    )
                );
            }
        }
    }
    return data(a.length, b.length);
}


module.exports = function(defineTools, links) {
    return new Process(defineTools, links);
};
