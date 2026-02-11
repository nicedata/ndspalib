/**
 * Class PollHandler
 *
 * Handles elements bearing the nd-poll attribute.
 *
 * Methods and attributes starting with an underscore (_) are private !
 *
 * Usage:
 *    <tag nd-poll nd-url="url" nd-target="selector" nd-interval="msec"><tag>
 *
 * Attributes:
 *    nd-poll :     identifies an element to which a data poller will be associated
 *    nd-url  :     url from which data will be fetched
 *    nd-interval : polling interval in msec, defaults to 10s if not present
 *    nd-target :   css selector to identify the target(s). If ommitted, the element iself is the target.
 */

const POLL_DEFAULT_INTERVAL_MS = require("../constants.js").POLL_DEFAULT_INTERVAL_MS;
BaseHandler = require("./base_handler.js").BaseHandler;

exports.PollHandler = class PollHandler extends BaseHandler {
    constructor(debug = false) {
        super(debug);
        this._timers = [];
    }

    /**
     * Process a given fragment.
     */
    process(fragment) {
        // If there are no pollers, clear the timers list
        if (document.querySelectorAll("[nd-poll]").length == 0) return;

        // Process this fragment
        this._process(fragment);
    }

    /**
     * Clean the DOM (remove unused timers)
     */
    postprocess() {
        const timers_to_clear = [];

        this._timers.forEach((timer, index) => {
            // find the uuid of elements NOT present in the document
            if (document.querySelectorAll(`[data-nduuid="${timer.uuid}"]`).length == 0) {
                clearTimeout(timer.id);
                timers_to_clear.push(timer);
                if (this._debug) console.log(`Cleared timeout ${timer.id} for ${timer.uuid}.`);
            }
        });

        // Instance list cleanup
        timers_to_clear.forEach((timer) => {
            const index = this._timers.indexOf(timer);
            this._timers.splice(index, 1);
            if (this._debug) console.log(`Removed timer ${timer.id} for ${timer.uuid}.`);
        });
        this._debug ? console.log(`Poll timers count: ${this._timers.length}`) : () => {};
    }

    /**
     * Clear the polling timers
     */
    _clear_timers() {
        this._timers.forEach((e) => {
            clearTimeout(e.id);
            if (this._debug) console.log(`Removed poll timeout ${e.id} for ${e.uuid}`);
        });
        this._timers = [];
    }

    /**
     * Process (internal) a given fragment (HTML element)
     */
    _process(fragment) {
        fragment.querySelectorAll(`[nd-poll]`).forEach((element) => {
            const url = element.getAttribute("nd-url");
            const selector = element.getAttribute("nd-target");
            const targets = selector ? nd.util.get_targets(selector) : [element];
            let interval_ms = element.getAttribute("nd-interval");

            // Add a UUID dataset to this element.
            // This is done to handle unused timers.
            const uuid = this.set_uuid(element);

            // Check url
            if (!url) {
                if (this._debug) {
                    console.warn("No <nd-url> defined on", element);
                } else throw new Error(`No <nd-url> defined on '${element.innerHTML}'`);
            }

            // Check interval
            if (!interval_ms || isNaN(interval_ms)) {
                interval_ms = POLL_DEFAULT_INTERVAL_MS;
            } else {
                interval_ms = Number(interval_ms);
                interval_ms = interval_ms < 1000 ? 1000 : interval_ms;
            }

            if (url) this._poll(uuid, url, targets, interval_ms);
        });
    }

    /**
     * Polling function
     */
    _poll(uuid, url, targets, interval_ms) {
        if (this._debug) console.log("Poller count before:", this._timers.length);
        const timeout_id = setTimeout(() => {
            // Clear the current timeout
            clearTimeout(timeout_id);

            // Remove this timeout ID from the pollers list
            const result = this._timers.find(({ id, uuid }) => id === timeout_id);
            const index = this._timers.indexOf(result);
            this._timers.splice(index, 1);

            // Get the data and update the targets if the document is not hidden (save bandwidth)
            if (!document.hidden) {
                nd.util.fetch_data(url).then((data) => {
                    targets.forEach((t) => {
                        const fragment = nd.util.create_fragment(data);
                        nd.util.insert_fragment(t, fragment, false, true);
                    });
                });
            }

            // Start a new poll !
            this._poll(uuid, url, targets, interval_ms);
        }, interval_ms);

        // Add this tmeout ID to the timers list
        this._timers.push({ id: timeout_id, uuid: uuid });
        if (this._debug) console.log("Poller count after:", this._timers.length);
    }
};
