/**
 * Constants
 */

exports.PROGNAME = "NDS SPA utilities";
exports.VERSION = "1.0.6-dev";
exports.PREFIX = "nd";

exports.ERR_NO_NDSPA = "NDSPA library not present !";
exports.TARGET_NONE = ":none:";

exports.ND_EVENTS = {
    POLL_START: "nd:poll:start",
    POLL_END: "nd:poll:end",
    FRAGMENT_BEFORE_INSERT: "nd:fragment:before_insert",
    FRAGMENT_AFTER_INSERT: "nd:fragment:after_insert",
    FETCH_BEFORE: "nd:fetch:before",
    FETCH_AFTER: "nd:fetch:after",
    FETCH_ERROR: "nd:fetch:error",
    TOAST: "nd:toast",
    MODAL: "nd:modal",
    CONFIRM: "nd:confirm",
};

exports.TOAST_DELAY_MS = 3000;
exports.POLL_DEFAULT_INTERVAL_MS = 10000;
exports.noop = () => {}; // A function that does nothing !
