exports.Tool = require('./lib/tool');
exports.Record = require('./lib/record');
exports.Graphviz = require('./lib/graphviz');

exports.tools = {
    BaseName: require('./lib/tool.base-name'),
    BlackHole: require('./lib/tool.black-hole'),
    ChangeExtension: require('./lib/tool.change-extension'),
    ConcatStrings: require('./lib/tool.concat-strings'),
    ConsoleLog: require('./lib/tool.console-log'),
    Constant: require('./lib/tool.constant'),
    DirName: require('./lib/tool.dir-name'),
    ExistsFile: require('./lib/tool.exists-file'),
    ForEach: require('./lib/tool.for-each'),
    Join: require('./lib/tool.join'),
    LoadStream: require('./lib/tool.load-stream'),
    LoadText: require('./lib/tool.load-text'),
    MatchRegexp: require('./lib/tool.match-regexp'),
    PrefixSuffix: require('./lib/tool.prefix-suffix'),
    ReadDir: require('./lib/tool.read-dir'),
    SaveText: require('./lib/tool.save-text'),
    SvgToDataURL: require('./lib/tool.svg-to-dataurl')
};

