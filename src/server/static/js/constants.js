/**
 * Constants
 */

exports.PROGNAME = "NDS SPA utilities";
exports.VERSION = "1.0.0-dev";
exports.PREFIX = "nd";

exports.ND_EVENTS = {
    POLL_START: "nd:poll:start",
    POLL_END: "nd:poll:end",
    FRAGMENT_BEFORE_INSERT: "nd:fragment:before_insert",
    FRAGMENT_AFTER_INSERT: "nd:fragment:after_insert",
    FETCH_BEFORE: "nd:fetch:before",
    FETCH_AFTER: "nd:fetch:after",
    FETCH_ERROR: "nd:fetch:error",
    TOAST: "nd:toast",
};

exports.TOAST_DELAY_MS = 3000;
exports.POLL_DEFAULT_INTERVAL_MS = 10000;

// const ND_SELECTORS = {
//     poll: `${PREFIX}-poll`,
//     target: `${PREFIX}-target`,
//     interval: `${PREFIX}-interval`,
//     switch: `${PREFIX}-switch`,
//     options: `${PREFIX}-options`,
//     showfor: `${PREFIX}-show-for`,
//     hidefor: `${PREFIX}-hide-for`,
//     sync: `${PREFIX}-sync`,
//     url: `${PREFIX}-url`,
// };
