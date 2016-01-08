# tools.BlackHole


All not  linked ouptuts can  trigger a resolution.  But __BlackHole__ has no output. So, it is usefull for __ForEach__ tool.

## Inputs
* {any} __any__ - any kind of value which will be swallowed by the black hole.

## Example
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
