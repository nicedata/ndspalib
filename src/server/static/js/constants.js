/**
 * Constants
 */

const INFOS = {
    PROGNAME: "NDS SPA utilities",
    VERSION: "1.0.15-dev",
    AUTHOR: "Martin Mohnhaupt <martin.mohnhaupt@etik.com>",
    LICENCE: "MIT License, https://mit-license.org/",
    INSPIREDBY: {
        HTMX: "HTMX : https://htmx.org/",
        UNPOLY: "UNPOLY : https://unpoly.com/",
    },
};

exports.INFOS = INFOS;
exports.PROGNAME = INFOS.PROGNAME;
exports.VERSION = INFOS.VERSION;
exports.TARGET_NONE = ":none:";

exports.ND_EVENTS = {
    // Core events
    POLL_START: "nd:poll:start",
    POLL_END: "nd:poll:end",
    FRAGMENT_BEFORE_INSERT: "nd:fragment:before_insert",
    FRAGMENT_AFTER_INSERT: "nd:fragment:after_insert",
    FETCH_BEFORE: "nd:fetch:before",
    FETCH_AFTER: "nd:fetch:after",
    FETCH_ERROR: "nd:fetch:error",
    REFRESH_AFTER: "nd:refresh:after",
    NAVIGATION: "nd:navigation",
    // Notifications
    ALERT: "nd:dialog:alert",
    TOAST: "nd:dialog:toast",
    CONFIRM: "nd:dialog:confirm",
    ONE_BUTTON_DIALOG: "nd:dialog:one_button",
    TWO_BUTTON_DIALOG: "nd:dialog:two_button",
    THREE_BUTTON_DIALOG: "nd:dialog:three_button",
    CUSTOM_DIALOG: "nd:dialog:custom",
    DOWNLOAD: "nd:download",
    // Others
    REDIRECT: "nd:redirect",
    CONTEXT: "nd:context",
    ENVIRONMENT: "nd:environ",
    TITLE: "nd:title",
    CHANGE: "nd:change",
    FORM_RESET: "nd:form:reset",
    RESET: "nd:reset",
    UPDATE: "nd:update",
    ZONE: "nd:zone",
};
exports.NO_CONTEXT = "::none::";

exports.DIALOG_CONTAINER = "nd-dialog-container";
exports.NOTIFICATION_CONTAINER = "nd-notification-container";

exports.TOAST_DELAY_MS = 3000;
exports.POLL_DEFAULT_INTERVAL_MS = 10000;

exports.STYLING = {
    BOOTSTRAP: {
        CLASSES: {
            ND_NOTIFICATION_CONTAINER: "nd-notification-container",
            ND_DIALOG_CONTAINER: "",
        },
    },
    TAILWIND: {
        CLASSES: {
            ND_NOTIFICATION_CONTAINER: "",
            ND_DIALOG_CONTAINER: "",
        },
    },
    VANILLA: {
        CLASSES: {
            ND_NOTIFICATION_CONTAINER: "",
            ND_DIALOG_CONTAINER: "",
        },
    },
};
