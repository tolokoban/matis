var Matis = require('../index');

var start = Matis.tools.MatchRegexp('[aeiouy]', 'i');
var concat = Matis.tools.ConcatStrings(["vowel", "consonant"]);

start.link('yes', concat, 'vowel');
start.link('no', concat, 'consonant');

var resolve = function(output) {
    console.log("RESOLVE: " + this.name() + " -> " + JSON.stringify(output));
};

Matis.Record('debug.rec', start);


Matis.Tool.debug(1);
start.exec({$tag: 1, text: "F"}, resolve);
start.exec({$tag: 2, text: "b"}, resolve);
start.exec({$tag: 3, text: "i"}, resolve);
