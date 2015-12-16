# MATIS 
<small><em>Multi-level Asynchrounous Tools Interconnection System</em></small>

Fast complex asynchrounous processes made easy.

## Concepts

* __Input driven execution__: best explained with this ![animation](img/triggering.svg).
* __Parallelism__: Tools are executed in parallel if it gives a time benefit. The result is a very fast process.
* __Input order preserved__: even if a tool processes 3 inputs at the same time, outputs are post to the next tool in the same order.
* __tracability__: Inputs trigger tools processing. And tools processing produces output. You always know which input has been needed to produce any output.


## Example

```text
                           |
                           | path
                      +----------+
                      | loadBody |
                      +----------+
                    path |    | text
                         |    |
                 +-------+--( | )----------+
                 |            |            |
            path |            |            | path
        +------------------+  |  +------------------+
        | changeExtForHead |  |  | changeExtForFoot |
        +------------------+  |  +------------------+
        path |                |              | path
             |                |              |
        path |                |              | path
       +------------+         |         +------------+
       | existsHead |         |         | existsFoot |
       +------------+         |         +------------+
       no |       | yes       |       yes |       | no
          |       |           |           |       |
     void |       | path      |      path |       | void
+-----------+   +----------+  |  +----------+   +-----------+
| constHead |   | loadHead |  |  | loadHead |   | constHead |
+-----------+   +----------+  |  +----------+   +-----------+
     text |       | text      |      text |       | text
          |       |           |           |       |
          +---+---+           |           +---+---+
              |               |               |
              +------------+  |  +------------+
                           |  |  |
                           | b|  | 
                           | o|  |
                           | d|  |
                      head | y|  | foot
                         +--------+
                         | concat |
                         +--------+
                             | text
                             |
```


```js
var Matis = require("async-tools");

// Create tools.
var loadBody = Matis.tools.LoadText('utf-8');
var loadHead = Matis.tools.LoadText('utf-8');
var loadFoot = Matis.tools.LoadText('utf-8');
var changeExtForHead = Matis.tools.ChangeExtension({js: "head"});
var changeExtForFoot = Matis.tools.ChangeExtension({js: "foot"});
var existsHead = Matis.tools.ExistsFile();
var existsFoot = Matis.tools.ExistsFile();
var constHead = Matis.tools.Constant("// Missing header.\n");
var constFoot = Matis.tools.Constant("// Missing footer.\n");
var concat = Matis.tools.ConcatStrings(['head', 'body', 'foot']);

// Link tools.
loadBody.link('text', concat, 'body');
loadBody.link('path', changeExtForHead).link(existsHead).link('yes', loadHead).link('text', concat, 'head');
loadBody.link('path', changeExtForFoot).link(existsFoot).link('yes', loadFoot).link('text', concat, 'foot');
existsHead.link('no', constHead).link(concat, 'head');
existsFoot.link('no', constFoot).link(concat, 'foot');

// Execute.
loadBody.exec(
    { path: 'myfile.js' },
    function (output) {
        console.log("Result is: " + output.text);
    },
    function (err) {
        console.error("Error: " + err);
    }
);
```

## Build-in tools

While it's easy to write your own tools, we provide a list of generic build-in tools which can help you quickly prototype your processes.

