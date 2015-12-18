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

    FS.writeSync(fd, "digraph Matis {\nnode[shape=box];\n");

    createTools(fd, record);
    createLinks(fd, record);
    createStats(fd, records);

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
                FS.writeSync(fd, '  T' + tooldef.id + ":O" + outputIndex
                             + " -> "
                             + 'T' + target.id + ":I" + inputIndex
                             + "[weight=9];\n");
            });
            if (Array.isArray(tooldef.children)) {
                tooldef.children.forEach(function (child) {
                    var target = record[child];
                    var id = 'T' + target.id;
                    var outputs = tooldef.output.join(', ');
                    if (cluster.indexOf(id) == -1) {
                        cluster.push(id);
                    }
                    FS.writeSync(fd, '  T' + tooldef.id + ":T"
                                 + " -> "
                                 + 'T' + target.id + ":T"
                                 + '[color=green,weight=1,label="'
                                 + outputs
                                 + '"];\n');
                });
            }
        }
    }
    FS.writeSync(fd, "\n  subgraph cluster{node[shape=none];" + cluster.join(';') + "}\n");
}


function createStats(fd, records) {
    var record = records[0];
    var execCount = {};
    var toolname;
    var tooldef;
    var stats;

    FS.writeSync(fd, '\n');
    FS.writeSync(fd, '  node[shape=circle,fontsize=9];\n');
    records.forEach(function (item, idx) {
        if (idx == 0) return;

        var tool = record[item.tool];
        var id = item.tool;
        if (!execCount[id]) {
            execCount[id] = {input: 0, output: 0};
        }
        if (item.action == 'IN') {
            execCount[id].input++;
        }
        else if (item.action == 'OUT') {
            execCount[id].output++;
        }
    });

    var key = 0;
    for (toolname in execCount) {
        key++;
        tooldef = record[toolname];
        stats = execCount[toolname];
        if (stats.input == stats.output) {
            FS.writeSync(fd, "S" + key + '[color=grey,fontcolor=grey,label="'
                         + stats.input + '"];');
        } else {
            FS.writeSync(fd, "S" + key + '[color=grey,fontcolor=red,label="'
                         + '+' + stats.input + "\\n-" + stats.output
                         + '"];');
        }
        FS.writeSync(fd, "T" + tooldef.id + ":T -> S" + key
                     + "[color=grey,weight=999];\n");
    }

}


function changeExtension(path, ext) {
    var pos = path.lastIndexOf('.');
    if (path < 0) path = 0;
    return path.substr(0, pos) + ext;
}
