# tools.ForEach


This is a powerful tool that loops on each element of an array an produces arrays.

## Options
* __tool__ {Matis.Tool}: the tool that will process each element one after the other.
* __output__ {array[string]}: Array of outputs' names. They all will be arrays.

## Inputs
Inputs are the same as inputs of `tool`, except that the first one must be an array.

## Example
### Several outputs
```js
var isJS = Matis.tools.MatchRegexp('\\.js$');
var looper = Matis.tools.ForEach({ tool: isJS, output: ["yes", "no"]});
looper.exec(
    { text: ["a.js", "b.html", "c.js", "d.js"] },
    function(outputs) {
        console.log(outputs);
    }
);
```

`outputs` will be equal to:
```js
{
    yes: ["a.js", "c.js", "d.js"],
    no: ["b.html"]
}
```

### Using black-holes
```js
var process = Matis.Process(function() {
  this.Path = Matis.tools.Constant('mypath/subpath');
  this.List = Matis.tools.ReadDir();
  this.IsJavascript = Matis.tools.MatchRegexp('\\.js$');
  this.IsTest = Matis.tools.MatchRegexp('spec');
  this.Loop = Matis.tools.ForEach({
    tool: this.IsJavascript,
    output: "no"
  });
  this.Garbage = Matis.tools.BlackHole();
}, [
  "Path > List > Loop",
  "IsJavascript:yes > IsTest",
  "IsJavascript:no  > Garbage"
]);
```

Without the BlackHole, this process would filter no file because all the __no__ outputs are outputs of the `ForEach`.

