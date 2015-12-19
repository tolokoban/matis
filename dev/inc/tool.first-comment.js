var Tool = require('../../index').Tool;

module.exports = function() {
    return Tool({
        input: "text", output: "comment",
        exec: function(input, resolve, reject) {
            var comment = input.text;
            var start = comment.indexOf('/**');
            if (start > -1) {
                comment = comment.substr(start + 3);
            }
            var end = comment.indexOf('*/');
            if (end > -1) {
                comment = comment.substr(0, end);
            }
            resolve({comment: purify(comment)});
        }
    });
};


var RX_EMPTY_LINE = new RegExp("^[ \t\\*=\\-]*$");


/**
 * Comments often begin with spaces and an asterisk. Purification is the
 * process to remove all this garbage from the comment before converting
 * it into markdown.
 */
function purify(comment) {
    var lines = comment.split('\n');
    var line;
    var i;

    for (i = 0 ; i < lines.length ; i++) {
        line = lines[i];
        if (!RX_EMPTY_LINE.test(line)) break;
    }

    return lines.slice(i).join('\n');
}
