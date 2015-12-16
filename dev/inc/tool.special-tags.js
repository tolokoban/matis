var FS = require("fs");
var Path = require("path");
var Tool = require('../../index').Tool;
var Tools = require('../../index').tools;


module.exports = function() {
    return Tool({
        name: "SpecialTags",
        input: "text", output: "text",
        exec: function(input, resolve, reject) {
            var lines = input.text.split('\n');
            var index = 0;
            var outputText = '';
            var loadSvg = Tools.LoadText('utf8');
            var svgToDataURL = Tools.SvgToDataURL();
            loadSvg.link('text', svgToDataURL);

            var process = function() {
                var line, trimedLine, svgPath;
                while (index < lines.length) {
                    line = lines[index++];
                    trimedLine = line.trim();
                    if (trimedLine.substr(0, 5) == '@svg ') {
                        svgPath = Path.join(__dirname, '../../', trimedLine.substr(5).trim());
                        loadSvg.exec(
                            {path: svgPath},
                            function(output) {
                                outputText += '<img src="' + output.dataurl + "' />\n";
                                process();
                            },
                            reject
                        );
                        return;
                    }
                    outputText += line + "\n";
                }
                resolve({text: outputText});
            };

            process();
        }
    });
};
