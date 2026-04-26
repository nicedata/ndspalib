const { ND_EVENTS, VERSION } = require("../constants.js");
const { Download } = require("../constants.js");
const { Logger } = require("./logger.js");

exports.Fetcher = class Fetcher {
    // Singleton constructor !
    constructor() {
        if (!!Fetcher._instance) {
            return Fetcher._instance;
        }
        this.logger = new Logger("Fetcher");
        Fetcher._instance = this;
        this.events = [];
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
                    this.events = JSON.parse(v);
                    content = v;
                    match = true;
                    break;
                case "x-nd-title":
                    document.title = v;
                    match = true;
                    content = v;
                    break;
                case "x-nd-url":
                    console.log("X-ND-URL", v);
                    break;
            }
            if (match) this.logger.info(`Received server message '${sse}'. Content: '${content}'.`);
        });
        this.logger.info(`Headers : ${headers_dump}`);
    };

    // Dispatch received events !
    _process_events = (payload) => {
        this.logger.info(`Processing events...`);
        this.events.forEach((event) => {
            this.logger.info(`Event: `, event);
            const type = event.type;

            switch (type) {
                case "nd:download":
                    event.detail.data = payload;
                    break;
                default:
                    break;
            }

            this.logger.info(`Dispatching event '${type}'. Detail: '${JSON.stringify(event.detail)}'.`);
            document.dispatchEvent(new CustomEvent(type, { detail: event.detail }));
        });
        return payload;
    };

    async _do_fetch(request) {
        const url = request.url;
        this.events = [];
        let status = null;
        let data = null;

        // Add our own headers
        request.headers.append("X-Nd-Version", `"${VERSION}"`);
        request.headers.append("X-Nd-Url", `"${request.url}"`);

        // Trigger before fetch event
        document.dispatchEvent(new CustomEvent(ND_EVENTS.FETCH_BEFORE, { detail: { url: url, data: null, status: status } }));

        try {
            const response = await fetch(request);
            this.logger.info(`Response status: ${response.status}`);

            if (!response.ok) {
                document.dispatchEvent(new CustomEvent(ND_EVENTS.FETCH_ERROR, { detail: { url: url, data: null, status: response.status } }));
                this.logger.error(`Response status: ${response.status}`);
                return null;
            }

            // Process the response headers
            this._process_headers(response.headers);

            // Get the response payload as a Blob
            const payload = await response.blob();
            this.logger.info(`Result is of type '${payload.type}'.`);

            // Process events
            const data = await this._process_events(payload).text();

            // const data = await payload.text();
            document.dispatchEvent(new CustomEvent(ND_EVENTS.FETCH_AFTER, { detail: { url: url, data: data, status: status } }));
            return data;
        } catch (error) {
            document.dispatchEvent(new CustomEvent(ND_EVENTS.FETCH_ERROR, { detail: { url: url, data: error.message, status: status } }));
            this.logger.error(`Error on url '${url}':  ${error.message}`);
            return null;
        }
    }

    send_form(form) {
        if (!(form instanceof HTMLFormElement)) {
            this.logger.error("send_form: subitted data is not an HTMLFormElement.");
            return;
        }

        // Build a new Request object
        return this._do_fetch(
            new Request(form.action, {
                method: form.method,
                body: new FormData(form),
            }),
        );
    }

    /**
     * fetch_data - fetch data from server as text
     */
    async fetch_data(url) {
        this.logger.info(`fetch_data | Url: '${url}'.`);
        const request = new Request(url);
        return this._do_fetch(request);
    }
};
