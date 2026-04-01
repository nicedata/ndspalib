const { ND_EVENTS } = require("../constants.js");
const { Download } = require("../components/download.js");
const { BaseHandler } = require("./base_handler.js");

exports.DownloadHandler = class DownloadHandler extends BaseHandler {
    constructor() {
        super();

        // Add a nd:download event listener
        document.addEventListener(ND_EVENTS.DOWNLOAD, this._download_event_handler);
    }

    // Baseclass override
    process = (fragment) => {};

    // Baseclass override
    postprocess = () => {};

    _download_event_handler = (event) => {
        const detail = event.detail;
        this._logger.info(event);
        const component = new Download(detail.data, detail.filename, detail.preview);
        component.show();
    };
};
