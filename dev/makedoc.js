var Path = require("path");
var Matis = require('../index');

//---------------
// Create tools.
var step1 = require('./inc/step.create-md')();
var step2 = require('./inc/step.create-html')();



//-------------
// Link tools.
step1.tail.link(step2.head);

//----------
// Execute.
Matis.Tool.debug(1);

Matis.Record("debug.rec", step1.head).exec(
    {path: Path.join(__dirname, "..", "lib")}
);







