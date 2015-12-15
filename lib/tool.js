var Tool = function(definition) {
    // Set name.
    this._name = definition.name || 'Tool';

    // Check `input`.
    if (typeof definition.input === 'undefined') {
        throw Error("[async-tools.Tool] Missing `input` in definition of " + this._name + ".\n"
                    + JSON.stringify(definition, null, 3));
    }
    if (!Array.isArray(definition.input)) {
        if (typeof definition.input !== 'string') {
            throw Error("[async-tools.Tool] Input must be a string or an array of strings!");
        }
        definition.input = [definition.input];
    }
    definition.input.forEach(function (inputName, idx) {
        if (typeof inputName !== 'string') {
            throw Error("[async-tools.Tool] Definiton of input #" + (idx + 1) + " must be a string!");
        }
    });

    // Check `output`.
    if (typeof definition.output === 'undefined') {
        definition.output = [];
    }
    if (!Array.isArray(definition.output)) {
        if (typeof definition.output !== 'string') {
            throw Error("[async-tools.Tool] Output must be a string or an array of strings!");
        }
        definition.output = [definition.output];
    }
    definition.output.forEach(function (outputName, idx) {
        if (typeof outputName !== 'string') {
            throw Error("[async-tools.Tool] Definiton of output #" + (idx + 1) + " must be a string!");
        }
    });

    // Init input mailbox.
    this.mailbox = [];

    // Storing definition.
    this.definition = definition;

    // Init links to other tools' inputs.
    this.links = [];

    // Init the context to pass to the `definition.exec` method.
    this.context = {};
};


/**
 * Accessor for attribute `name`. The name is not used internally. It is
 * just here for debug purpose.
 */
Tool.prototype.name = function(v) {
    if (typeof v === 'undefined') return this._name;
    this._name = v;
    return this;
};


/**
 * `Tool.link([outputName, ] target [, targerInputName])`
 * Link an output to the input of another tool.
 *
 * @param  {string} outputName  -  Name of  the outpu  to  link. Can  be
 * omitted if there is only one output available.
 * @param {Tool} target - Tool to connect with.
 * @param {string} targetInputName - Name of  the input of the target to
 * link with  `outputName`. Can be  omitted if  there is only  one input
 * available.
 *
 * @return `target`
 */
Tool.prototype.link = function(outputName, target, targetInputName) {
    // Array of output's names.
    var output = this.definition.output;

    // Linking is useless if there is no output.
    if (output.length < 1) {
        throw Error("[async-tools.link] This tool has no output. Linking is useless!");
    }

    // Check default value fot `outputName`.
    if (typeof outputName === 'object') {
        // Shift arguments.
        targetInputName = target;
        target = outputName;
        outputName = output[0];
        if (output.length > 1) {
            // Explicit output cannot be used if there are several outputs.
            throw Error("[async-tools.link] ("
                        + this.name() + " -> " + target.name()
                        + ") Please choose an output among " + JSON.stringify(output) + "!");
        }
    }
    if (!target || typeof target !== 'object' || typeof target.definition === 'undefined'
        || !Array.isArray(target.definition.input))
    {
        throw Error("[async-tools.link] Invalid target!");
    }
    if (target.definition.input.length < 1) {
        throw Error("[async-tools.link] Target has no input!");
    }
    if (typeof targetInputName === 'undefined') {
        targetInputName = target.definition.input[0];
        if (target.definition.input.length > 1) {
            // Explicit input cannot be used if there are several inputs.
            throw Error("[async-tools.link] ("
                        + this.name() + " -> " + target.name()
                        + ") Please choose an input among "
                        + JSON.stringify(target.definition.input) + "!");
        }
    }
    if (typeof targetInputName !== 'string') {
        throw Error("[async-tools.link] Target input's name must be a string!");
    }


    // Register this link.
    var link = {
        output: outputName,
        target: target,
        input: targetInputName
    };
    this.links.push(link);

    return target;
};


/**
 * @return void
 */
Tool.prototype.exec = function(input, resolve, reject, absorb) {
    var that = this;

    if (typeof resolve !== 'function') resolve = emptyFunction;
    if (typeof absorb !== 'function') absorb = emptyFunction;
    if (typeof reject !== 'function') reject = function(err) {
        console.error("[" + that.name() + ".reject] " + JSON.stringify(err));
    };

    this.definition.exec.call(
        this,
        input,
        function(output) {
            // Tracability. We  can know from  which input an  output is
            // produced.
            output.$tag = input.$tag;

            if (that.links.length < 1) {
                // There is no link. We can call `resolve`.
                resolve.call(that, output);
            } else {
                // If there is any link,  the resolution is postponed to
                // the following tools.
                var outputName, outputValue;
                // Propagation occurs when the  output is send through a
                // link.  But,  you  can  have a  link  on  an  output's
                // attribute which has not been set in `output`. In this
                // case, we must call `absorb`.
                var hasBeenPropagated = false;

                for (outputName in output) {
                    outputValue = output[outputName];
                    that.links.forEach(function (link) {
                        if (link.output == outputName) {
                            // A link  has been  found for  this output.
                            // We must post the value to the target.  If
                            // all the target's input have been provided
                            // a  value, the  `post` method  returns the
                            // whole input.
                            var targetInput = link.target.post(link.input, outputValue, input.$tag);
                            if (targetInput) {
                                hasBeenPropagated = true;
                                // If  `post`  returns  a  value  that
                                // means  that the  target's input  is
                                // full.
                                link.target.exec(targetInput, resolve, reject);
                            }
                        }
                    });
                }

                if (!hasBeenPropagated) {
                    absorb.call(that, output);
                }
            }
        },
        reject,
        absorb
    );
};


/**
 * A tool's input is a set of attributes. Any attribute can be linked to
 * an output attribute  of another tool. The tool  starts executing only
 * when  the whole  set of  input's  attributes is  defined. Because  of
 * asynchronousity, values can  be set in any order  and some attributes
 * can  get  several  values  before another  attribute  get  its  first
 * one. This method deals with this issue.
 *
 * Here is an example for a tool with 3 input's attributes A, B and C:
 *   post A: 41
 *   post A: 12
 *   post B: 33
 *   post A: 74
 *   post C: 45
 *   exec A: 41, B: 33, C: 45
 *   post C: 96
 *   post C: 28
 *   post B: 17
 *   exec A: 12, B: 17, C: 96
 *   post B: 69
 *   exec A: 74, B: 69, C: 28
 */
Tool.prototype.post = function(inputName, value, $tag) {
    var pack;
    var full;
    var i, k;

    for (i = 0 ; i < this.mailbox.length + 1 ; i++) {
        if (this.mailbox.length <= i) this.mailbox.push({$: this.definition.input.length});
        pack = this.mailbox[i];

        if (typeof pack[inputName] === 'undefined') {
            // Tagging inputs/outputs  is useful  for tracability.  With the
            // posting mecanism, you can have  data from several origins. In
            // this case, `$tag` must be an array.
            if (typeof pack.$tag === 'undefined') pack.$tag = $tag;
            else if (pack.$tag != $tag) {
                // There already is a tag here.
                if (Array.isArray(pack.$tag)) {
                    // Add new tag in the array if is not already part of it.
                    if (pack.$tag.indexOf($tag) == -1) {
                        pack.$tag.push($tag);
                    }
                } else {
                    // Create an array with both tags.
                    pack.$tag = [pack.$tag, $tag];
                }
            }
            // Set the value to the input's attribute.
            pack[inputName] = value;
            // `pack.$` is used to know how many inputs we still have to
            // set before the whole input is fullfilled.
            pack.$--;
            if (pack.$ > 0) return null;
            delete pack.$;
            pack = this.mailbox.shift();
            return pack;
        }
    }
    return null;
};


module.exports = function(definition) {
    return new Tool(definition);
};


/**
 * Test if `obj` has the Tool's interface.
 */
module.exports.isTool = function(obj) {
    if (typeof obj !== 'object') return false;
    if (typeof obj.exec !== 'function') return false;
    if (typeof obj.name !== 'function') return false;
    if (typeof obj.post !== 'function') return false;
    if (typeof obj.link !== 'function') return false;
    return true;
};


/**
 * Empty function to use as a default `resolve` and/or `reject`.
 */
var emptyFunction = function() {};
