# MATIS 
<small><em>Multi-level Asynchrounous Tools Interconnection System</em></small>

Fast complex asynchrounous processes made easy.

```js
npm install matis
```

More documentation [here](http://tolokoban.github.io/matis).


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

var process = Matis.Process(function() {
    this.Start = Matis.tools.Nop().name('start');
    this.LoadBody = Matis.tools.LoadText('utf-8');
    this.LoadHead = Matis.tools.LoadText('utf-8');
    this.LoadFoot = Matis.tools.LoadText('utf-8');
    this.ChangeExtForHead = Matis.tools.ChangeExtension({js: "head"});
    this.ChangeExtForFoot = Matis.tools.ChangeExtension({js: "foot"});
    this.ExistsHead = Matis.tools.ExistsFile();
    this.ExistsFoot = Matis.tools.ExistsFile();
    this.ConstHead = Matis.tools.Constant("// Missing header.\n");
    this.ConstFoot = Matis.tools.Constant("// Missing footer.\n");
    this.Concat = Matis.tools.ConcatStrings(['head', 'body', 'foot']);
}, [
    "Start > LoadBody > body:Concat",    
    "Start > ChangeExtForHead > ExistsHead:yes > LoadHead > head:Concat",
    "Start > ChangeExtForFoot > ExistsFoot:yes > LoadFoot > foot:Concat",
    "ExistsHead:no > ConstHead > head:Concat",
    "ExistsFoot:no > ConstFoot > foot:Concat"
]);

// Execute.
process.exec(
    { path: 'myfile.js' },
    function (output) {
        console.log("Result is: " + output.text);
    },
    function (err) {
        console.error("Error: " + err);
    }
);
```

