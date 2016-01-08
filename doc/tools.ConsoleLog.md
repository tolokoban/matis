# tools.ConsoleLog


This tool is used for debug  purpose. By default, the input is displayed with the standard `logger.log()` function, then sent to the output unchanged.
You can provide your own logguer.

## Options
*  __prefix__ {_optional_ string}: a string that prepend each log. Default is `""`.
* __logger__ {_optional_ object}: an object that provides a `log(msg)`function. Default is the standard console.
By default, `logger` is equal to the standard javascript `console` object.

## Inputs
* __any__ {string}: the text to sent to the `logger`.

## Outputs
* __any__ {string}: the same text as the one entered.

## Example
```js
var logger = function(msg) { ... };
var tool1 = Matis.tools.ConsoleLog();
var tool2 = Matis.tools.ConsoleLog('> ');
var tool3 = Matis.tools.ConsoleLog(logger);
var tool4 = Matis.tools.ConsoleLog('> ', logger);
```
