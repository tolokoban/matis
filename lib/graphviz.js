var FS = require("fs");
var Path = require("path");


/**
 * * __path__ {string}: Path of the record file.
 */
module.exports = function(path) {
    var content = FS.readFileSync(path, 'utf8');
    var record = JSON.parse('[' + content.toString() + ']')[0];
    var outputPath = changeExtension(path, '.dot');
    var fd = FS.openSync(outputPath, 'w');

    FS.writeSync(fd, "digraph Matis {\nnode[shape=box];\n");

    createTools(fd, record);
    createLinks(fd, record);

    FS.writeSync(fd, "}");
    FS.closeSync(fd);
};


/**
 * Create tools
 */
function createTools(fd, record) {
    var toolname, tooldef, id = 0;

    for (toolname in record) {
        id++;
        tooldef = record[toolname];
        tooldef.id = id;
        FS.writeSync(
            fd, "  T" + id
                + "[shape=record,label=\"{{"
                + tooldef.input.map(function(itm, idx) {
                    return '<I' + idx + '> ' + itm;
                }).join('|')
                + "}|<T> " + toolname + "|{"
                + tooldef.output.map(function(itm, idx) {
                    return '<O' + idx + '> ' + itm;
                }).join('|')
                + "}}\"];\n");
        /*
         FS.writeSync(fd, "  subgraph cluster" + id + " {\n");
         FS.writeSync(fd, "    label=" + JSON.stringify(toolname) + ";\n");
         FS.writeSync(
         fd, "    T" + id
         + "[shape=record,label=\"{{"
         + tooldef.input.map(function(itm, idx) {
         return '<I' + idx + '> ' + itm;
         }).join('|')
         + "}|{"
         + tooldef.output.map(function(itm, idx) {
         return '<O' + idx + '> ' + itm;
         }).join('|')
         + "}}\"];\n");
         FS.writeSync(fd, "  }\n");
         */
    }
}


/**
 * Create links
 */
function createLinks(fd, record) {
    // String,
    var toolname;
    // { input: [...], output: [...], links: {...} }
    var tooldef;
    // Name of the linked output.
    var output;
    // Indef of `output` in the array `tooldef.output`.
    var outputIndex;
    // Array of links of `output`.
    var links;
    // One of these links.
    var link;

    for (toolname in record) {
        tooldef = record[toolname];
        for (output in tooldef.links) {
            // Index will be used to find the graphviz record <f0>, <f1>, ...
            outputIndex = tooldef.output.indexOf(output);
            links = tooldef.links[output];
            links.forEach(function (link) {
                var target = record[link.target];
                var inputIndex = target.input.indexOf(link.input);
                FS.writeSync(fd, '  T' + tooldef.id + ":O" + outputIndex
                             + " -> "
                             + 'T' + target.id + ":I" + inputIndex
                             + "[weight=999];\n");
            });
            if (Array.isArray(tooldef.children)) {
                tooldef.children.forEach(function (child) {
                    var target = record[child];                    
                    FS.writeSync(fd, '  T' + tooldef.id + ":T"
                                 + " -> "
                                 + 'T' + target.id + ":T"
                                 + "[color=green,weight=1,label=Uses];\n");
                });
            }
        }
    }
}


function changeExtension(path, ext) {
    var pos = path.lastIndexOf('.');
    if (path < 0) path = 0;
    return path.substr(0, pos) + ext;
}
