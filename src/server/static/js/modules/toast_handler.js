const { ND_EVENTS, TOAST_CONTAINER_ATTRIBUTE } = require("../constants.js");
const { Toast } = require("../components/toast.js");
const { BaseHandler } = require("./base_handler.js");

exports.ToastHandler = class ToastHandler extends BaseHandler {
    constructor() {
        super();

        this._container = document.querySelector(`[${TOAST_CONTAINER_ATTRIBUTE}]`);
        if (!this._container) {
            this._logger.error(`No '${TOAST_CONTAINER_ATTRIBUTE}' element is present !`);
            return;
        }

        // Add a nd:toast event listener
        document.addEventListener(ND_EVENTS.TOAST, this._toast_event_handler);
    }

    // Baseclass override
    process = (fragment) => {};

    // Baseclass override
    postprocess = () => {};

    _toast_event_handler = (event) => {
        const detail = event.detail;
        new Toast(this._container, detail.category, detail.header, detail.body, detail.redirect_url).show();
    };
};
