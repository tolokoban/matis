"use strict";


var Runtime = function() {
    this._first = null;
    this._last = null;
    this._count = 0;
};


/**
 * @return void
 */
Runtime.prototype.count = function() {
    return this._count;
};

/**
 * @return void
 */
Runtime.prototype.newToken = function(input) {
    var that = this;

    var token = {
        input: input,
        flush: function(f) {
            var tkn;
            token.f = f;
            while (that._first && that._first.f) {
                that._count--;
                tkn = that._first;
                that._first = tkn.next;
                delete tkn.next;
                if (that._last == tkn) {
                    that._last = null;
                }
                try {
                    tkn.f();
                }
                catch (ex) {
                    // `f` should not throw any exception.
                    console.error("[Runtime.token.flush]", ex);
                }
            }
        }
    };
    if (this._last) {
        this._last.next = token;
        this._last = token;
    } else {
        this._first = this._last = token;
    }
    this._count++;
    return token;
};


module.exports = Runtime;
