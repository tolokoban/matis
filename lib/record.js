var FS = require("fs");
var Path = require("path");
var Tool = require('./tool');


/**
 * * __path__ {string}: File in which the activity will be recorded.
 * * __tool__ {Tool}: Tool we want to record the activity.
 */
module.exports = function(path, tool) {
    if (typeof path !== 'string') {
        throw Error("[Record] `path` must be a string!");
    }
    if (!Tool.isTool(tool)) {
        throw Error("[Record] `tool`must be a Tool!");
    }

    FS.writeFileSync(
        path,
        JSON.stringify(depends(tool), null, 2),
        'utf8'
    );

    var flush = function(log) {
        var fd = FS.openSync(path, 'a');
        FS.writeSync(fd, "," + JSON.stringify(log) + "\n");
        FS.closeSync(fd);
    };

    Tool.debug({
        onInput: function(tool, input) {
            flush({action: 'IN', tool: tool.name(), input: input});
        },
        onOutput: function(tool, output) {
            flush({action: 'OUT', tool: tool.name(), output: output});
        },
        onPost: function(srcTool, srcOutput, dstTool, dstInput, value, output) {
            flush({
                action: 'POST', 
                src: srcTool.name(), srcAtt: srcOutput,
                dst: dstTool.name(), dstAtt: dstInput,
                value: value,
                output: output
            });
        }
    });


    return tool;
};


function depends(rootTool) {
    var dependencies = {};
    var dep;
    var fringe = [rootTool];
    var tool;

    while (fringe.length > 0) {
        tool = fringe.pop();
        if (dependencies[tool.name()]) continue;
        dep = {
            input: tool.definition.input.slice(),
            output: tool.definition.output.slice(),
            links: {}
        };
        if (tool.definition.children) {
            if (!Array.isArray(tool.definition.children)) {
                tool.definition.children = [tool.definition.children];
            }
            tool.definition.children.forEach(function (child) {
                fringe.push(child);
            });
            dep.children = tool.definition.children.map(function(item) {
                return item.name();
            });
        }
        tool.definition.output.forEach(function (outputName) {
            dep.links[outputName] = [];
        });
        dependencies[tool.name()] = dep;
        tool.links.forEach(function (link) {
            var target = link.target;
            var targetName = target.name();
            dep.links[link.output].push({target: targetName, input: link.input});
            fringe.push(target);
        });
    }

    return dependencies;
}
