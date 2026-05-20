const { ND_EVENTS, VERSION } = require("../constants.js");
const { Download } = require("../constants.js");
const { Logger } = require("./logger.js");

exports.Fetcher = class Fetcher {
    static LOGGER = new Logger("Fetcher", true);
    static METHODS = ["get", "post", "nav"];
    // Singleton constructor !
    constructor() {
        if (!!Fetcher._instance) {
            return Fetcher._instance;
        }
        this.logger = Fetcher.LOGGER;
        Fetcher._instance = this;
        this.main_container = null;
        this.events = [];
    }

    set_main_container = (element) => {
        this.logger.info(`The main container is `, element);
        this.main_container = element;
    };

    _process_headers = (headers) => {
        let headers_dump = [];
        headers.forEach((v, k) => {
            headers_dump.push(`'${k}'->'${v}'`);
            const sse = k.toLowerCase();
            switch (sse) {
                case "x-nd-environment":
                    const data = JSON.parse(v);
                    this.logger.info(`Received server environment '${sse}'. Content: '${v}'.`);
                    document.dispatchEvent(new CustomEvent(ND_EVENTS.ENVIRONMENT, { detail: data }));
                    break;
                case "x-nd-event":
                    this.events = JSON.parse(v);
                    this.logger.info(`Received server messages '${sse}'. Content: '${v}'.`);
                    break;
                case "x-nd-url":
                    console.log("X-ND-URL", v);
                    break;
            }
        });
        this.logger.info(`Headers : \n${headers_dump.join("\n")}`);
    };

    // Dispatch received events !
    _process_events = (payload) => {
        this.logger.info(`Processing events...`);
        this.events.forEach((event) => {
            this.logger.info(`Event: `, event);
            const type = event.type;
            let target = document;

            if (type === ND_EVENTS.DOWNLOAD) event.detail.data = payload;
            if (type === ND_EVENTS.FORM_RESET) {
                // Find the form
                const form_id = event.detail.form_id;
                target = document.querySelector(`[data-ndtrack="${form_id}"]`);
            }

            const detail = JSON.stringify(event.detail);
            if (target) {
                this.logger.info(`Dispatching event '${type}'. Detail: '${detail}'.`);
                target.dispatchEvent(new CustomEvent(type, { detail: event.detail }));
            } else {
                this.logger.warn(`No target found for event '${type}'. Detail: '${detail}'.`);
            }
        });
        return payload;
    };

    async execute_fetch(request) {
        const url = request.url;
        this.events = [];
        let status = null;
        let data = null;

        // Add our own headers
        request.headers.append("X-Nd-Version", `"${VERSION}"`);
        request.headers.append("X-Nd-Url", `"${request.url}"`);
        request.headers.append("X-Nd-Environment", `${JSON.stringify(nd.environment)}`);

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

    async send_form(form) {
        if (!(form instanceof HTMLFormElement)) {
            this.logger.error("send_form: subitted data is not an HTMLFormElement.");
            return;
        }

        const body = new FormData(form);
        body.append("form_id", form.dataset.ndtrack);
        // Build a new Request object
        return await this.execute_fetch(
            new Request(form.action, {
                method: form.method,
                body: body,
            }),
        );
    }

    _redirect_to = async (url) => {
        if (!url.startsWith("/")) {
            this.logger.error(`Cannot navigate to '${url}'. Only relative URLs are allowed !`);
            return;
        }

        if (url === "/") {
            this.logger.error(`Navigation to '/' is not allowed !`);
            return;
        }

        if (!this.main_container) {
            this.logger.error(`Cannot navigate to '${url}'. No main contais defined !`);
            return;
        }

        const request = new Request(url);
        this.logger.info(`Fetching '${url}' in a 'get' request.`);
        const data = await this.execute_fetch(request);
        if (data) {
            nd.util.clear_node(this.main_container);
            const fragment = nd.util.create_fragment(data);
            nd.util.insert_fragment(this.main_container, fragment, false, true);
        }
    };

    /**
     * fetch_data - fetch data from server as text
     */
    async fetch_data(url) {
        // Default method is GET !
        let [_method, _url] = ["get", url];

        // Handle URL prefxes
        if (url.includes("::")) {
            [_method, _url] = url.split("::");
            if (!Fetcher.METHODS.includes(_method)) {
                this.logger.error(`Only ${Fetcher.METHODS.join(" or ")} URL modifiers are allowed. Supplied method was '${_method}:'.`);
                return;
            }
        }

        if (_method === "nav") {
            await this._redirect_to(_url);
            return;
        }

        const request = new Request(_url, { method: _method });

        this.logger.info(`Fetching '${_url}' in a '${_method}' request.`);

        return await this.execute_fetch(request);
    }

    redirect = async (url) => {
        if (!url) return;
        url.startsWith("nav::") ? () => {} : (url = "nav::" + url);
        return await this.fetch_data(url);
    };
};
