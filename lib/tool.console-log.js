var Tool = require("./tool");

/**
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
*/
module.exports = function(prefix, logger) {
    if (typeof prefix === 'undefined') prefix = 'log: ';
    if (typeof prefix === 'function' || typeof prefix.log === 'function') {
        logger = prefix;
        prefix = 'log: ';
    }
    if (typeof logger === 'undefined') logger = console;
    if (typeof logger === 'function') logger = {log: logger};
    if (typeof logger.log !== 'function') logger = console;

    return Tool({
        name: "ConsoleLog",
        input: "any",
        output: "any",
        exec: function(input, resolve, reject) {
            logger.log(prefix + JSON.stringify(input.any, null, 3));
            resolve(input);
        }
    });
};
