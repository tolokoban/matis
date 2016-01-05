var Tool = require("./tool");

/****************************************
__ConsoleLog(options)__

This tool is used for debug  purpose. The input is displayed with the `logger.log()` function, then sent to the output unchanged. 

## Options

* __prefix__ {optional string}: a string that prepend each log. Default is `""`.
* __logger__ {optional object}: an object that provides a `log(msg)`function. Default is the standard console.
By default, `logger` is equal to `console`.

## Inputs

* __any__ {string}: the text to sent to the `logger`.

## Outpus

* __any__ {string}: the same text as the one entered.

## Example

```js
var logger = function(msg) { ... };
var tool1 = Matis.tools.ConsoleLog();
var tool2 = Matis.tools.ConsoleLog('> ');
var tool3 = Matis.tools.ConsoleLog(logger);
var tool4 = Matis.tools.ConsoleLog('> ', logger);
```
****************************************/
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
