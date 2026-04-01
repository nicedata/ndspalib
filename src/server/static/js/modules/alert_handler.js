const { ND_EVENTS, ALERT_CONTAINER_ATTRIBUTE } = require("../constants.js");
const { Alert } = require("../components/alert.js");
const { BaseHandler } = require("./base_handler.js");

exports.AlertHandler = class AlertHandler extends BaseHandler {
    constructor() {
        super();

        this._container = document.querySelector(`[${ALERT_CONTAINER_ATTRIBUTE}]`);
        if (!this._container) {
            this._logger.error(`No '${ALERT_CONTAINER_ATTRIBUTE}' element is present !`);
            return;
        }

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
