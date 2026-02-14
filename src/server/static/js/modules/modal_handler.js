const { ND_EVENTS } = require("../constants.js");
const { ModalDialog } = require("../components/modal_dialog.js");
const { BaseHandler } = require("./base_handler.js");

const container_selector = "nd-modal-container";

exports.ModalHandler = class ModalHandler extends BaseHandler {
    constructor(debug = false) {
        super(debug);

        this._debug = debug;
        const container = document.querySelector(`[${container_selector}]`);
        if (!container) throw new Error(`No '${container_selector}' element is present !`);

        // Add a nd:toast event listener
        document.addEventListener(ND_EVENTS.MODAL, this._modal_event_handler);
    }

    // Baseclass override
    process = (fragment) => {};

    // Baseclass override
    postprocess = () => {};

    _modal_event_handler = (event) => {
        const detail = JSON.parse(event.detail);
        new ModalDialog(detail.header, detail.body, detail.lang, detail.accept_url, detail.dismiss_url).show();
    };
};
