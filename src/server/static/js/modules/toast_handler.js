const { ND_EVENTS } = require("../constants.js");
const { Toast } = require("../components/toast.js");
const { BaseHandler } = require("./base_handler.js");

const container_selector = "nd-toast-container";

exports.ToastHandler = class ToastHandler extends BaseHandler {
    constructor(debug = false) {
        super(debug);

        this._debug = debug;
        this._container = document.querySelector(`[${container_selector}]`);
        if (!this._container) throw new Error(`No '${container_selector}' element is present !`);

        // Add a nd:toast event listener
        document.addEventListener(ND_EVENTS.TOAST, this._toast_event_handler);
    }

    // Baseclass override
    process = (fragment) => {};

    // Baseclass override
    postprocess = () => {};

    _toast_event_handler = (event) => {
        const detail = JSON.parse(event.detail);
        new Toast(this._container, detail.category, detail.header, detail.body, detail.redirect_url, this._debug).show();
    };
};
