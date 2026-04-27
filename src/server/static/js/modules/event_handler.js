const { ND_EVENTS } = require("../constants.js");
const { OneButtonDialog, TwoButtonDialog, ThreeButtonDialog, ConfirmDialog, Toast, Alert } = require("../components/dialogs.js");
const { Download } = require("../components/download.js");
const { Logger } = require("./logger.js");

exports.EventHandler = class EventHandler {
    constructor() {
        this.logger = new Logger("EventHandler");
        const notification_events = [
            ND_EVENTS.ALERT,
            ND_EVENTS.TOAST,
            ND_EVENTS.CONFIRM,
            ND_EVENTS.ONE_BUTTON_DIALOG,
            ND_EVENTS.TWO_BUTTON_DIALOG,
            ND_EVENTS.THREE_BUTTON_DIALOG,
            ND_EVENTS.CUSTOM_DIALOG,
            ND_EVENTS.DOWNLOAD,
            ND_EVENTS.REDIRECT,
        ];

        // Add event listeners (event list)
        notification_events.forEach((value) => {
            this.logger.info(`Adding a listener to handle '${value}' events.`);
            document.addEventListener(value, this._event_handler);
        });
    }

    // Todo : remove
    process(fragment) {}

    // Todo : remove
    postprocess() {}

    _event_handler = async (event) => {
        this.logger.info(`Event received: ${event.type}.`);
        this.logger.info(`Event detail: ${JSON.stringify(event.detail)}.`);
        const detail = event.detail;
        let data = null;

        switch (event.type) {
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
                new Download(detail.data, detail.filename, detail.mode === "preview").show();
                break;
            case ND_EVENTS.REDIRECT:
                this.logger.info(`Redrect | Url: '${detail.urls.redirect}'...`);
                data = await nd.fetcher.fetch_data(detail.urls.redirect);
                this.logger.info(`Redrect | Data: '${nd.util.truncate(data)}.`);
                const target = document.querySelector("main");
                if (target) {
                    const fragment = nd.util.create_fragment(data);
                    nd.util.insert_fragment(target, fragment, false, true, false);
                    nd.util.refresh(target);
                }
                break;
        }
    };
};
