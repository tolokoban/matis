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


/**
 * Comments often begin with spaces and an asterisk. Purification is the
 * process to remove all this garbage from the comment before converting
 * it into markdown.
 */
function purify(comment) {
    var lines = comment.split('\n');
    var line;
    var loop = true;
    var i = -1;
    var k;    
    var oldChar;
    var curChar;
    
    while (loop) {
        oldChar = null;
        i++;
        for (k = 0 ; k < lines.length ; k++) {
            line = lines[k].trimRight();
            if (line.length <= i) continue;
            curChar = line.charAt(i);
            if (oldChar === null) {
                oldChar = curChar;
            }
            else if (curChar != oldChar) {
                loop = false;
                break;
            }
        }
    }

    return lines.map(function(line) {
        return line.substr(i);
    }).join('\n');
}
