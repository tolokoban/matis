var FS = require("fs");
var Tool = require("./tool");

/**
 * * __argument__:
 *     * {array[string]} `input`: Array of inputs' names. The first one is the array over which we will loop.
 *     * {array[string]} `output`: Array of outputs' names. They all are arrays.
 *     * {Tool} `tool`:
 */
module.exports = function(options) {
    if (typeof options.tool === 'undefined') {
        throw Error("[tools.ForEach] `options.tools` is mandatory!");
    }
    if (!Tool.isTool(options.tool)) {
        throw Error("[tools.ForEach] `options.tools` must be a Tool!");
    }
    if (typeof options.input !== 'undefined') {
        options.tool = options.tool.name();
        throw Error("[tools.ForEach] `options.input` must not be set! "
                    + "Inputs are the same as inputs of the inner tool.\n"
                    + JSON.stringify(options, null, '  '));
    }
    // Input of foreach is the input of the inner tool.
    options.input = options.tool.definition.input.slice();
    if (typeof options.output === 'undefined') {
        throw Error("[tools.ForEach] `options.output` is mandatory!");
    }

    return Tool({
        name: "ForEach",
        children: options.tool,
        input: options.input,
        output: options.output,
        exec: function(input, resolve, reject) {
            var that = this;
            var items = input[that.definition.input[0]];
            if (!Array.isArray(items)) items = [items];
            // The final output is an aggregation of the outputs of every iteration.
            var aggregatedOutput = {};
            // Init it with  arrays. At the end, each  array will have
            // the  same  length,  corresponding   to  the  number  of
            // iterations.
            that.definition.output.forEach(function (outputName) {
                aggregatedOutput[outputName] = [];
            });

            var count = items.length;
            if (count == 0) {
                // Nothing to loop.
                return resolve(aggregatedOutput);
            }

            // To know  if the process is  over, we have to  know if all
            // the inputs has been consumed.
            // The  `flags` array  has as  many items  as the  number of
            // iterations  in  the  for-each.  Each  time  an  input  is
            // consumed,  we mark  a `1`  in  the `flags`  array and  we
            // decrease  `count`. As  soon as  `count` is  null, we  can
            // resolve the for-each.
            var flags = [];
            items.forEach(function () {
                flags.push(0);
            });
            var progressCounter = function(output) {
                var tags = output.$tag;
                if (!Array.isArray(tags)) {
                    tags = [tags];
                }
                tags.forEach(function (tag) {
                    if (flags[tag] == 0) {
                        count--;
                    }
                    flags[tag]++;
                });
            };

            items.forEach(function (itm, tag) {
                var pack = {$tag: tag};
                that.definition.input.forEach(function (inputName, idx) {
                    if (idx == 0) {
                        pack[inputName] = itm;
                    } else {
                        // We loop on the first input only. The others
                        // are used repeatedly for each iteration.
                        pack[inputName] = input[inputName];
                    }
                });
                // Execute one iteration.
                options.tool.exec(
                    pack,
                    function(output) {
                        // `tools.ForEach` defines  its own  outputs. If
                        // its  child produces  other outputs,  they are
                        // swallowed.
                        var hasDataToExport = false;
                        var outputName;
                        for (var i = 0 ; i < that.definition.output.length ; i++) {
                            outputName = that.definition.output[i];
                            if (output[outputName] !== undefined) {
                                hasDataToExport = true;
                                break;
                            }
                        }
                        if (hasDataToExport) {
                            that.definition.output.forEach(function (outputName) {
                                aggregatedOutput[outputName].push(output[outputName]);
                            });
                        }
                        progressCounter(output);
                        if (count == 0) {
                            resolve(aggregatedOutput);
                        }
                    },
                    reject
                );
            });
        }
    });
};
