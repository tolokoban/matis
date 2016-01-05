var FS = require("fs");
var Tool = require("./tool");
var Exec = require("child_process").exec;

/****************************************

****************************************/
module.exports = function(options) {
    return Tool({
        name: "LoadStream",
        input: 'command',
        output: ["strout", "stderr"],
        exec: function(input, resolve, reject) {
            Exec(input.command, options, function(err, stdout, stderr) {
                if (err) return reject.call(this, err);
                resolve.call(this, {stdout: stdout, stderr: stderr});
            });
        }
    });
};


