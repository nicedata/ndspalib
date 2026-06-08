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
const { Util } = require("./util.js");
const { get_targets } = require("./util.js");

exports.Poll = class Poll {
    static LOGGER = new Logger("Poll", true);

    constructor(element) {
        this.logger = Poll.LOGGER;
        this.element = element;
        this.uuid = null;
        this.url = null;
        this.interval_ms = 0;
        this.targets_selector = null;
        this.action = null;
        this.can_poll = false;

        // Checks
        const has_url = element.hasAttribute("href") || element.hasAttribute("nd-url");
        const has_action = element.hasAttribute("nd-action");

        if (!(has_url || has_action)) {
            this.logger.error(`No 'nd-url' or 'nd-action' is defined on element`, element);
            return;
        }

        // Add a UUID dataset to this element. This is done to clear unused timers.
        this.uuid = crypto.randomUUID();
        element.dataset.ndtimer = this.uuid;
        this.logger.info(`Attributed an UUID to element`, element);

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
        this.targets_selector = element.getAttribute("nd-target");

        // Process nd-action
        this.action = has_action ? new Action(element) : null;
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

        // Dynamically get the targets
        const targets = Util.get_targets(this.targets_selector, this.element);
        this.action ? this.action.set_targets(targets) : {};

        // Action before fetch
        if (this.action && this.action.when == "before") this.action.excecute();

        // Fetch if an URL is present
        if (this.url) {
            this.logger.info(`Fetching url '${this.url}'...`);
            nd.fetcher.fetch_data(this.url).then((data) => {
                targets.forEach((t) => {
                    if (data) {
                        const fragment = Util.create_fragment(data);
                        Util.insert_fragment(t, fragment, false, true);
                    } else {
                        this.logger.warn(`Fetching url '${this.url}' returned no data.`, this);
                    }
                    // Action after fetch when data is present
                    if (this.action && this.action.when == "after") this.action.excecute(data);
                });
            });
        }
    };
};
