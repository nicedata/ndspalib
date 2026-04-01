const { ND_EVENTS, VERSION } = require("../constants.js");
const { Download } = require("../constants.js");
const { Logger } = require("./logger.js");

exports.Fetcher = class Fetcher {
    constructor() {
        if (!!Fetcher._instance) {
            return Fetcher._instance;
        }
        this._logger = new Logger("Fetcher");
        Fetcher._instance = this;
        this._events = [];
    }

    _process_headers = (headers) => {
        let headers_dump = "";
        headers.forEach((v, k) => {
            headers_dump += `'${k}'->'${v}', `;
            const sse = k.toLowerCase();
            let match = false;
            let content = null;
            switch (sse) {
                case "x-nd-event":
                    this._events = JSON.parse(v);
                    content = v;
                    match = true;
                    break;
                case "x-nd-title":
                    document.title = v;
                    match = true;
                    content = v;
                    break;
            }
            if (match) this._logger.info(`Received server message '${sse}'. Content: '${content}'.`);
        });
        this._logger.info(`Headers : ${headers_dump}`);
    };

    // Dispatch received events !
    _process_events = (payload) => {
        this._logger.info(`Processing events...`);
        this._events.forEach((event) => {
            this._logger.info(`Event: `, event);
            const type = event.type;

            switch (type) {
                case "nd:download":
                    event.detail.data = payload;
                    break;
                default:
                    break;
            }

            this._logger.info(`Dispatching event '${type}'. Detail: '${JSON.stringify(event.detail)}'.`);
            document.dispatchEvent(new CustomEvent(type, { detail: event.detail }));
        });
        return payload;
    };

    /**
     * fetch_data - fetch data from server as text (default) or json.
     */
    async fetch_data(url) {
        this._logger.info(`Function fetch_data() called. Url: '${url}'.`);
        this._events = [];
        let status = null;
        let data = null;

        // Build a new Request object
        const request = new Request(url);

        // Add our own headers
        request.headers.append("X-Nd-Version", `"${VERSION}"`);
        request.headers.append("X-Nd-Url", `"${url}"`);

        // Trigger before fetch event
        document.dispatchEvent(new CustomEvent(ND_EVENTS.FETCH_BEFORE, { detail: { url: url, data: null, status: status } }));

        // Perform fetch !
        try {
            const response = await fetch(request);
            this._logger.info(`Response status: ${response.status}`);

            if (!response.ok) {
                document.dispatchEvent(new CustomEvent(ND_EVENTS.FETCH_ERROR, { detail: { url: url, data: null, status: response.status } }));
                this._logger.error(`Response status: ${response.status}`);
                return null;
            }

            // Process the response headers
            this._process_headers(response.headers);

            // Get the response payload as a Blob
            const payload = await response.blob();
            this._logger.info(`Result is of type '${payload.type}'.`);

            // Process events
            const data = await this._process_events(payload).text();

            // const data = await payload.text();
            document.dispatchEvent(new CustomEvent(ND_EVENTS.FETCH_AFTER, { detail: { url: url, data: data, status: status } }));
            return data;
        } catch (error) {
            document.dispatchEvent(new CustomEvent(ND_EVENTS.FETCH_ERROR, { detail: { url: url, data: error.message, status: status } }));
            this._logger.error(`Error on url '${url}':  ${error.message}`);
            return null;
        }
    }
};
