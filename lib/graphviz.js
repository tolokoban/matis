var FS = require("fs");
var Path = require("path");


/**
 * * __path__ {string}: Path of the record file.
 */
module.exports = function(path) {
    var content = FS.readFileSync(path, 'utf8');
    var records = JSON.parse('[' + content.toString() + ']');
    var record = records[0];
    var outputPath = changeExtension(path, '.dot');
    var fd = FS.openSync(outputPath, 'w');
    // Number of data passed through each link.
    var stats;

    FS.writeSync(fd, "digraph Matis {\nnode[shape=box];\n");

    createTools(fd, record);
    stats = createStats(fd, records);
    createLinks(fd, record, stats);

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
    }
}


/**
 * Create links
 */
function createLinks(fd, record, stats) {
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
    // Cluster.
    var cluster = ['T1'];

    for (toolname in record) {
        tooldef = record[toolname];
        for (output in tooldef.links) {
            // Index will be used to find the graphviz record <f0>, <f1>, ...
            outputIndex = tooldef.output.indexOf(output);
            links = tooldef.links[output];
            links.forEach(function (link) {
                var target = record[link.target];
                var inputIndex = target.input.indexOf(link.input);
                var linkId = 'T' + tooldef.id + ":O" + outputIndex
                        + "->" + 'T' + target.id + ":I" + inputIndex;
                var stat = stats[linkId];
                FS.writeSync(fd, '  ' + linkId + "[weight=9"
                             + (stat ? ',fontsize=9,label=' + stat.count
                                : ',style=dashed')
                             + "];\n");
            });
            if (Array.isArray(tooldef.children)) {
                // Connect to the children. Usefull for `for-each` for example.
                tooldef.children.forEach(function (child) {
                    var target = record[child];
                    var id = 'T' + target.id;
                    if (cluster.indexOf(id) == -1) {
                        cluster.push(id);
                    }
                    target.input.forEach(function (inputName, idx) {
                        FS.writeSync(fd, '  T' + tooldef.id
                                     + ":I" + idx + "->T" + target.id + ":I" + idx
                                     + "[color=blue"
                                     + (idx == 0 ? ',style=bold' : '')
                                     + "];\n");
                    });
                    findFreeOutputs(fd, tooldef, child, record);
                });
            }
        }
    }
    //FS.writeSync(fd, "\n  subgraph cluster{node[shape=none];" + cluster.join(';') + "}\n");
}


function createStats(fd, records) {
    var record = records[0];
    var execCount = {};
    var links = {};
    var toolname;
    var tooldef;
    var stats;

    FS.writeSync(fd, '\n');
    FS.writeSync(fd, '  node[shape=circle,fontsize=9,margin=0];\n');
    records.forEach(function (item, idx) {
        if (idx == 0) return;

        var id;

        if (item.action == 'POST') {
            var srcTool = record[item.src];
            var dstTool = record[item.dst];
            id = 'T' + srcTool.id + ":O" + srcTool.output.indexOf(item.srcAtt)
                + '->T' + dstTool.id + ":I" + dstTool.input.indexOf(item.dstAtt);
            if (!links[id]) {
                links[id] = {count: 1};
            } else {
                links[id].count++;
            }
        } else {
            var tool = record[item.tool];
            id = item.tool;
            if (!execCount[id]) {
                execCount[id] = {input: 0, output: 0};
            }
            if (item.action == 'IN') {
                execCount[id].input++;
            }
            else if (item.action == 'OUT') {
                execCount[id].output++;
            }
        }
    });

    var key = 0;
    for (toolname in execCount) {
        key++;
        tooldef = record[toolname];
        stats = execCount[toolname];
        if (stats.input == stats.output) {
            FS.writeSync(fd, "  S" + key + '[color=grey,fontcolor=grey,label="'
                         + stats.input + '"];');
        } else {
            FS.writeSync(fd, "  S" + key + '[color=red,style=filled,fontcolor=white,label="'
                         + '+' + stats.input + "\\n-" + stats.output
                         + '"];');
        }
        FS.writeSync(fd, "T" + tooldef.id + ":T -> S" + key
                     + "[color=grey,weight=999];\n");
    }
    FS.writeSync(fd, '\n');

    return links;
}


function changeExtension(path, ext) {
    var pos = path.lastIndexOf('.');
    if (path < 0) path = 0;
    return path.substr(0, pos) + ext;
}


/**
 * Look for all free  outputs. An output is free as soon  as it is not
 * linked to an input.
 */
function findFreeOutputs(fd, parent, childname, record) {
    // Root tool.
    var root = record[childname];
    // The work still to do.
    var fringe = [childname];
    // All the tools already visited, stored by names.
    var visited = {};
    // Current tool's name.
    var toolname;
    // Current tool's definition.
    var tooldef;
    // Current output's attribute.
    var outputAttrib;

    while (fringe.length > 0) {
        toolname = fringe.pop();
        if (visited[toolname]) continue;

        visited[toolname] = 1;
        tooldef = record[toolname];
        for (outputAttrib in tooldef.links) {
            if (tooldef.links[outputAttrib].length == 0) {
                // This attribute is link to nothing.
                if (parent.output.indexOf(outputAttrib) > -1) {
                    // This attribute is part of the parent's output.
                    FS.writeSync(fd, '  T' + tooldef.id
                                 + ":O" + tooldef.output.indexOf(outputAttrib) 
                                 + "->T" + parent.id 
                                 + ":O" + parent.output.indexOf(outputAttrib)
                                 + "[color=red];\n");
                }
            } else {
                tooldef.links[outputAttrib].forEach(function (link) {
                    fringe.push(link.target);
                });
            }
        }
    }
}
