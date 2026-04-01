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

const { POLL_DEFAULT_INTERVAL_MS } = require("../constants.js");
const { BaseHandler } = require("./base_handler.js");

exports.PollHandler = class PollHandler extends BaseHandler {
    constructor() {
        super();
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
            }
        });

        // Instance list cleanup
        timers_to_clear.forEach((timer) => {
            const index = this._timers.indexOf(timer);
            this._timers.splice(index, 1);
            this._logger.info(`Cleared and removed timer ${timer.id} for ${timer.uuid}.`);
        });
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
            const uuid = nd.util.set_uuid(element);

            // Check url
            if (!url) {
                this._logger.error(`No <nd-url> defined on element`, Object(element));
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
        const timeout_id = setTimeout(() => {
            // Clear the current timeout
            clearTimeout(timeout_id);

            // Remove this timeout ID from the pollers list
            const result = this._timers.find(({ id, uuid }) => id === timeout_id);
            const index = this._timers.indexOf(result);
            this._timers.splice(index, 1);
            this._logger.info(`Removed timer ${result.id} for ${result.uuid}. Active timers : ${this._timers.length}`);

            // Get the data and update the targets if the document is not hidden (save bandwidth)
            if (!document.hidden) {
                nd.fetcher.fetch_data(url).then((data) => {
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
        this._logger.info(`Added timer ${timeout_id} (${interval_ms}ms) for ${uuid}. Active timers : ${this._timers.length}`);
    }
};
