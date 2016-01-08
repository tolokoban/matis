# tools.ConcatStrings


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
