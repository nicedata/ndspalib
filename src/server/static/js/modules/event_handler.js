const { ND_EVENTS } = require("../constants.js");
const { OneButtonDialog, TwoButtonDialog, ThreeButtonDialog, ConfirmDialog, Toast, Alert } = require("../components/dialogs.js");
const { Download } = require("../components/download.js");
const { Logger } = require("./logger.js");

exports.EventHandler = class EventHandler {
    constructor() {
        // Singleton !
        if (!!EventHandler._instance) {
            return EventHandler._instance;
        }
        EventHandler._instance = this;
        this.logger = new Logger("EventHandler");

        const events = [
            ND_EVENTS.ALERT,
            ND_EVENTS.TOAST,
            ND_EVENTS.CONFIRM,
            ND_EVENTS.ONE_BUTTON_DIALOG,
            ND_EVENTS.TWO_BUTTON_DIALOG,
            ND_EVENTS.THREE_BUTTON_DIALOG,
            ND_EVENTS.CUSTOM_DIALOG,
            ND_EVENTS.DOWNLOAD,
            ND_EVENTS.REDIRECT,
            ND_EVENTS.TITLE,
        ];

        // Add event listeners (event list)
        events.forEach((event) => {
            this.logger.info(`Adding a listener to handle '${event}' events.`);
            document.addEventListener(event, this._event_handler);
        });
    }

    // Todo : remove
    process(fragment) {}

    // Todo : remove
    postprocess() {}

    _event_handler = async (event) => {
        this.logger.info(`Event ${event.type}, detail: ${JSON.stringify(event.detail)}.`);
        const detail = event.detail;
        let data = null;

        switch (event.type) {
            case ND_EVENTS.TITLE:
                document.title = detail.title;
                break;
            case ND_EVENTS.ALERT:
                new Alert(detail).show();
                break;
            case ND_EVENTS.TOAST:
                new Toast(detail).show();
                break;
            case ND_EVENTS.CONFIRM:
                new ConfirmDialog(detail).show();
                break;
            case ND_EVENTS.ONE_BUTTON_DIALOG:
                new OneButtonDialog(detail).show();
                break;
            case ND_EVENTS.TWO_BUTTON_DIALOG:
                new TwoButtonDialog(detail).show();
                break;
            case ND_EVENTS.THREE_BUTTON_DIALOG:
                new ThreeButtonDialog(detail).show();
                break;
            case ND_EVENTS.DOWNLOAD:
                new Download(detail.data, detail.offset, detail.size, detail.filename, detail.mimetype, detail.mode === "preview").show();
                break;
        }
    };
};
