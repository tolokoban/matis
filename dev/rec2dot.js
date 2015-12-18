var Matis = require('../index');
var ChildProcess = require("child_process");


Matis.Graphviz('debug.rec');
ChildProcess.execSync('dot -Tpng debug.dot -o debug.png');
ChildProcess.execSync('dot -Tsvg debug.dot -o debug.svg');
