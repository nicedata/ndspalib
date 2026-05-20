/**
 * Class Poll
 *
 * Represents an element bearing the nd-poll attribute.
 *
 * Usage:
 *    <tag nd-poll nd-url="url" nd-target="selector" nd-interval="msec" nd_action="my_action(arguments)"><tag>
 *
 * Attributes:
 *    nd-poll :     identifies an element to which a data poller will be associated
 *    nd-url  :     url from which data will be fetched
 *    nd-interval : polling interval in msec, defaults to 10s if not present
 *    nd-target :   css selector to identify the target(s). If ommitted, the element iself is the target.
 *    nd-action :   an action to be executed befor or after the poliing
 */
const { POLL_DEFAULT_INTERVAL_MS } = require("../constants.js");
const { Logger } = require("./logger.js");
const { Action } = require("./action.js");

exports.Poll = class Poll {
    static LOGGER = new Logger("Poll", true);

    constructor(element) {
        this.logger = Poll.LOGGER;
        this.element = element;
        this.uuid = nd.util.set_uuid(element); // Add a UUID dataset to this element. This is done to clear unused timers.
        this.url = null;
        this.interval_ms = 0;
        this.targets = null;
        this.action = null;
        this.can_poll = false;

        // Checks
        const has_url = element.hasAttribute("href") || element.hasAttribute("nd-url");
        const has_action = element.hasAttribute("nd-action");

        if (!(has_url || has_action)) {
            this.logger.error(`No 'nd-url' or 'nd-action' is defined on element`, element);
            return;
        }

        // Use the href attribute first. Fallback to nd-url
        const href = element.getAttribute("href");
        this.url = href ? href : element.getAttribute("nd-url");

        // Get the interval
        let interval_ms = element.getAttribute("nd-interval");
        if (!interval_ms || isNaN(interval_ms)) {
            interval_ms = POLL_DEFAULT_INTERVAL_MS;
        } else {
            interval_ms = Number(interval_ms);
            interval_ms = interval_ms < 1000 ? 1000 : interval_ms;
        }
        this.interval_ms = interval_ms;

        // Get the target(s)
        const selector = element.getAttribute("nd-target");
        this.targets = selector ? nd.util.get_targets(selector) : [element];

        // Process nd-action
        this.action = new Action(element);
        this.action.set_targets(this.targets);

        this.can_poll = true;
    }

    poll = () => {
        if (!this.can_poll) {
            this.logger.info("Element not fully initialized. Poll skipped.");
            return;
        }
        if (document.hidden) {
            this.logger.info("The document is hidden. Poll skipped.");
            return;
        }

        // Action before fetch
        if (this.action.when == "before") this.action.excecute();

        // Fetch if an URL is present
        if (this.url) {
            this.logger.info(`Fetching url '${this.url}'...`);
            nd.fetcher.fetch_data(this.url).then((data) => {
                this.targets.forEach((t) => {
                    if (data) {
                        const fragment = nd.util.create_fragment(data);
                        nd.util.insert_fragment(t, fragment, false, true);
                    } else {
                        this.logger.warn(`Fetching url '${this.url}' returned no data.`, this);
                    }
                    // Action after fetch when data is present
                    if (this.action.when == "after") this.action.excecute(data);
                });
            });
        }
    };
};
