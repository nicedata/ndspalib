const { ND_EVENTS, DIALOG_CONTAINER_ATTRIBUTE } = require("../constants.js");
const { Dialog } = require("../components/dialog.js");
const { BaseHandler } = require("./base_handler.js");

exports.DialogHandler = class DialogHandler extends BaseHandler {
    constructor() {
        super();
        const container = document.querySelector(`[${DIALOG_CONTAINER_ATTRIBUTE}]`);
        if (!container) throw new Error(`No '${DIALOG_CONTAINER_ATTRIBUTE}' element is present !`);

        // Add a nd:toast event listener
        document.addEventListener(ND_EVENTS.DIALOG, this._modal_event_handler);
    }

    // Baseclass override
    process = (fragment) => {};

    // Baseclass override
    postprocess = () => {};

    _modal_event_handler = (event) => {
        const detail = event.detail;
        new Dialog(detail.header, detail.body, detail.lang, detail.accept_url, detail.dismiss_url).show();
    };
};
