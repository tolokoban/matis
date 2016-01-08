var FS = require("fs");
var Tool = require("./tool");
var Exec = require("child_process").exec;

/**
Execute a shell command and outputs `stdout` and `stderr`.

## Options
* __cwd__ {string}: current working directory of the child process.
* __env__ {object}: environment key-value pairs.
* __encoding__ {string}: (default: 'utf8').
* __shell__ {string}: shell to execute the command with (Default: '/bin/sh' on UNIX, 'cmd.exe' on Windows, The shell should understand the -c switch on UNIX or /s /c on Windows. On Windows, command line parsing should be compatible with cmd.exe.).
* __timeout__ {number}: (default: 0).
* __maxBuffer__ {number}: largest amount of data (in bytes) allowed on stdout or stderr - if exceeded child process is killed (Default: 200*1024).
* __killSignal__ {string}: (default: 'SIGTERM').
* __uid__ {number}: sets the user identity of the process.
* __gid__ {number}: sets the group identity of the process.


## Inputs
* __command__ {string}: the command to run, with space-separated arguments.

## Outputs
* __command__ {string}: a copy of the corresponding input.

## Examples


*/
module.exports = function(options) {
    return Tool({
        name: "LoadStream",
        input: 'command',
        output: ["strout", "stderr", "command"],
        exec: function(input, resolve, reject) {
            Exec(input.command, options, function(err, stdout, stderr) {
                if (err) return reject.call(this, err);
                resolve.call(this, {stdout: stdout, stderr: stderr});
            });
        }
    });
};
