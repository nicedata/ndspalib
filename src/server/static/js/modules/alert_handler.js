const { ND_EVENTS } = require("../constants.js");
const { Alert } = require("../components/alert.js");
const { BaseHandler } = require("./base_handler.js");

const _container_selector = "nd-alert-container";
const _class_name = "AlertHandler";
exports.AlertHandler = class AlertHandler extends BaseHandler {
    constructor(debug = false) {
        super(debug, _class_name);
        this._debug = debug;
        this._container = document.querySelector(`[${_container_selector}]`);
        if (!this._container) throw new Error(`No '${_container_selector}' element is present !`);

        // Add a nd:toast event listener
        document.addEventListener(ND_EVENTS.ALERT, this._alert_event_handler);
    }

    // Baseclass override
    process = (fragment) => {};

    // Baseclass override
    postprocess = () => {};

    _alert_event_handler = (event) => {
        const detail = event.detail;
        new Alert(this._container, detail.category, detail.message, detail.redirect_url, this._debug).show();
    };
};
