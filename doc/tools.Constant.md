# tools.Constant


Send a constant to its output `value`.

## Options
The value to send as an output.

## Inputs
* __void__ {any}: can be any value. It is used only for trigerring.

## Outputs
* __value__ {any}: the constant value passed as option.

## Example
```js
var tool = Matis.tools.Constant(27);
tool.exec(
    {void: "any kind on input"},
    function(outputs) {
        if (outputs.value !== 27) {
            throw "IMPOSSIBLE!";
        }
    }
);
```
