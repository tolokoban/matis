var Tool = require("./tool");

/**
Concat all the inputs in one output.

## Inputs
Inputs depend on the options passed in the constructor.

## Outputs
* {string} __text__: the resulting concatenated text.

## Options
Array of inputs in the order you want them to be concatenated.

## Example
```js
var concat = Matis.tools.ConcatString(['prefix', 'radical', 'suffix']);
concat.exec(
  {
    prefix: "<",
    radical: "my-tag",
    suffix: ">"
  },
  function(outputs) {
    console.log(outputs.text);
  }
);
```
*/
module.exports = function(inputs) {
    if (typeof inputs === 'string') inputs = [inputs];
    if (!Array.isArray(inputs)) inputs = [];

    return Tool({
        name: "ConcatStrings",
        input: inputs.slice(),
        output: "text",
        exec: function(input, resolve, reject) {
            var result = '';
            inputs.forEach(function (inputName) {
                result += input[inputName];
            });
            resolve({text: result});
        }
    });
};
