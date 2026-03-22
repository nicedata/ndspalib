const { ND_EVENTS, VERSION } = require("../constants.js");
const { Logger } = require("./logger.js");

exports.Util = class Util {
    constructor() {
        this._logger = new Logger(this.constructor.name);
    }

    // Source - https://stackoverflow.com/a/4700265
    // Posted by El Ronnoco, modified by community. See post 'Timeline' for change history
    // Retrieved 2026-02-15, License - CC BY-SA 4.0
    truncate(input, len = 50) {
        return input.length > len ? `${input.substring(0, len)}...` : input;
    }

    set_uuid(element) {
        const uuid = crypto.randomUUID();
        element.dataset.nduuid = uuid;
        this._logger.info(`Attributed an UUID to element`, Object(element));
        return uuid;
    }

    /**
     * noop - function that does nothing.
     */
    noop() {
        this._logger.info(`Function noop() called`);
    }

    /**
     * get_targets - get all elements by a selector,
     */
    get_targets(selector) {
        this._logger.info(`Function get_targets() called. Selector: '${selector}'`);
        if (typeof selector !== "string" || !selector) return Array(0);
        selector = selector.trim();

        // Search elements by tags
        return Array.from(document.querySelectorAll(selector));
    }

    /**
     * clear_node - delete a specific node.
     */
    clear_node(node) {
        this._logger.info(`Function clear_node() called. Node name: '${node.nodeName.toLowerCase()}'`);
        const range = document.createRange();
        range.selectNodeContents(node);
        range.deleteContents();
    }

    /**
     * create_fragment - create a document fragment from HTML code.
     */
    create_fragment(html) {
        this._logger.info(`Function create_fragment() called. Content: '${this.truncate(html)}'`);
        const range = document.createRange();
        return range.createContextualFragment(html);
    }

    /**
     * insert_fragment - replace or append a fragment in a specific target.
     */
    insert_fragment(target, fragment, append = false, refresh = false) {
        this._logger.info(`Function insert_fragment() called. Target: '${target.tagName.toLowerCase()}'. Mode: ${append ? "append" : "replace"}.`);

        document.dispatchEvent(new CustomEvent(ND_EVENTS.FRAGMENT_BEFORE_INSERT, { detail: { target: target, fragment: fragment, append: append } }));
        // If append mode is false, clear the node before
        append ? this.noop() : this.clear_node(target);

        // See : https://www.miragecraft.com/blog/dynamically-insert-inline-script
        const result = target.appendChild(fragment);

        // If refresh mode is true, refresh the node
        refresh ? nd.refresh(target) : () => {};

        document.dispatchEvent(new CustomEvent(ND_EVENTS.FRAGMENT_AFTER_INSERT, { detail: { target: target, data: fragment, append: append } }));
        return result;
    }

    /**
     * fetch_data - fetch data from server as text (default) or json.
     */
    async fetch_data(url, as_json = false) {
        this._logger.info(`Function fetch_data() called. Url: '${url}'. Mode: ${as_json ? "json" : "text"}.`);
        let status = null;
        const request = new Request(url);
        request.headers.append("X-Nd-Version", `"${VERSION}"`);
        request.headers.append("X-Nd-Url", `"${url}"`);
        document.dispatchEvent(new CustomEvent(ND_EVENTS.FETCH_BEFORE, { detail: { url: url, data: null, status: status } }));
        try {
            const response = await fetch(request);
            status = response.status;
            if (!response.ok) {
                document.dispatchEvent(new CustomEvent(ND_EVENTS.FETCH_ERROR, { detail: { url: url, data: null, status: status } }));
                throw new Error(`Response status: ${response.status}`);
            }
            const result = as_json ? await response.json() : await response.text();
            document.dispatchEvent(new CustomEvent(ND_EVENTS.FETCH_AFTER, { detail: { url: url, data: result, status: status } }));
            return result;
        } catch (error) {
            document.dispatchEvent(new CustomEvent(ND_EVENTS.FETCH_ERROR, { detail: { url: url, data: error.message, status: status } }));
            this._logger.error(`Error on url '${url}':  ${error.message}`);
            return null;
        }
    }

    /**
     * sleep_ms - sleep during a specific period (ms).
     */
    async sleep_ms(ms) {
        this._logger.info(`Function sleep_ms() called. Timeout: ${ms}ms.`);
        await new Promise((resolve) => setTimeout(resolve, ms));
    }

    /**
     * compress - Compress a string (remove duplicate whitechars).
     */
    compress(str) {
        if (typeof str !== "string") return str;
        this._logger.info(`Function compress() called. String: '${this.truncate(str)}'.`);
        return str.replace(/\n+/g, " ").replace(/\r+/g, " ").replace(/  +/g, " ");
    }

    navigate_to = (url) => {
        let result = false;
        document.querySelectorAll("[nd-link]").forEach((link) => {
            const nd_url = link.getAttribute("nd-url");
            const href = link.getAttribute("href");
            if (href === url || nd_url === url) {
                link.click();
                result = true;
                return;
            }
        });
        this._logger.info(`Function navigate_to() called. Url: '${url}'. Link: ${result ? "found" : "not found"}.`);
        return result;
    };
};
