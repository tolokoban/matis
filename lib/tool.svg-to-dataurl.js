var Tool = require("./tool");

/**
 * Transform an SVG source into a DataURL ready to use in an image.
 */
module.exports = function() {
    return Tool({
        name: "SvgToDataURL",
        input: "svg",
        output: "dataurl",
        exec: function(input, resolve, reject) {
            var svg = input.svg.split('\n').map(function(line) {
                return line.trim();
            }).join(' ');
            resolve({dataurl: 'data:image/svg+xml,' + encodeURIComponent(svg)});
        }
    });
};
