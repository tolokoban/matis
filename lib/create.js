var Tool = require("./tool");


var RX_VALID_TOOLNAME = new RegExp("^[A-Z][a-z0-9_$]*$");
var RX_VALID_IONAME = new RegExp("^[a-z][a-z0-9_$]*$");


module.exports = function(tools, links) {
    var toolname;
    var tool;
    for (toolname in tools) {
        if (!RX_VALID_TOOLNAME.test(toolname)) {
            throw Error("[Matis.Create] Invalid tool's name `" + toolname + "`!\n"
                        + "Valid names start with an uppercase latin letter and can contain only digits, latin letters, underscores and dollars signs.");
        }
        tool = tools[toolname];
        if (!Tool.isTool(tool)) {
            // This is a definition.
            tools[toolname] = tool = Tool(tool);
        }
        tool.name(toolname);
    }

    return tools;
};
