var Tool = require("./tool");

/**
Match `text` against a regexp `pattern`. The output can be `yes`or `no`.

## Options
* __pattern__ {string}: regular expression pattern.
* __flags__ {optional string}: flags for this regexp.

## Inputs
* __text__ {string}: the string to test.

## Outputs
* __yes__ {string}: the input string if it matches.
* __no__ {string}: the input string if it doen not match

## Example
```js
var isNumber = Matis.tools.MatchRegexp('[0-9]+');
```


*/
module.exports = function(pattern, flags) {
    var rx = new RegExp(pattern, flags);

    return Tool({
        name: "MathRegexp",
        input: "text",
        output: ["yes", "no"],
        exec: function(input, resolve, reject) {
            try {
                if (rx.test(input.text)) {
                    resolve({yes: input.text});
                } else {
                    resolve({no: input.text});
                }
            } catch (ex) {
                reject(ex);
            }
        }
    });
};
