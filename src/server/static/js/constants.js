/**
 * Constants
 */

const INFOS = {
    PROGNAME: "NDS SPA utilities",
    VERSION: "1.0.7-dev",
    AUTHOR: "Martin Mohnhaupt <martin.mohnhaupt@etik.com>",
    LICENCE: "MIT License, https://mit-license.org/",
    INSPIREDBY: {
        HTMX: "HTMX : https://htmx.org/",
        UNPOLY: "UNPOLY : https://unpoly.com/",
    },
};

exports.INFOS = INFOS;
exports.ERR_NO_NDSPA = `${INFOS.PROGNAME} library not present !`;
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
