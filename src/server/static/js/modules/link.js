const { Logger } = require("./logger.js");
const { Action } = require("./action.js");
const { Util } = require("./util.js");
const { ND_EVENTS } = require("../constants.js");

exports.Link = class Link {
    static LOGGER = new Logger("Link", true);

    constructor(element) {
        this.logger = Link.LOGGER;
        this.element = element;
        this.url = null;
        this.dialog = null;
        this.action = null;
        this.targets = null; // Target selector
        this.resets = null; // Reset Target selector

        // Checks
        const has_href = element.hasAttribute("href");
        const has_nd_url = element.hasAttribute("nd-url");
        const has_action = element.hasAttribute("nd-action");
        const has_reset = element.hasAttribute("nd-reset");
        const has_dialog = element.hasAttribute("nd-dialog");
        const has_confim = element.hasAttribute("nd-confirm");

        let has_errors = false;

        if (has_href && has_nd_url) {
            this.logger.error(`Use 'href' or 'nd-url', not both !`, element);
            has_errors = true;
        }

        if (!(has_href || has_nd_url || has_action || has_reset || has_dialog)) {
            this.logger.error(`No 'nd-url', 'nd-action', 'nd-reset' or 'nd-dialog' is defined on element`, element);
            has_errors = true;
        }

        if (has_errors) return;

        // Change the cursor style !
        this.element.style.cursor = "pointer";

        // Use the href attribute first. Fallback to nd-url
        if (has_href || has_nd_url) {
            const href = element.getAttribute("href");
            this.url = href ? href : element.getAttribute("nd-url");
        }

        // Process nd-action
        this.action = has_action ? new Action(element) : null;

        // If the element already has an data-ndtrack attribute,
        // remove it to give the listener tracker a chance to update
        element.removeAttribute("data-ndtrack");

        // Process nd-confirm
        if (has_confim) {
            const template_id = element.getAttribute("nd-confirm");
            if (template_id) {
                this.dialog = nd.dialog.get(template_id);
            }
        }

        if (has_dialog) {
            const template_id = element.getAttribute("nd-dialog");
            if (template_id) {
                this.dialog = nd.dialog.get(template_id);
            }
        }

        // Get the target(s)
        this.targets = element.getAttribute("nd-target");

        // Get the reset target(s)
        this.resets = element.getAttribute("nd-reset");

        // Add a tracked 'click' handler
        nd.tracker.add_listener(element, "click", this.click_handler);
        this.logger.info(`New Link created (${element.getAttribute("data-ndtrack")}).`);
    }

    click_handler = async (event) => {
        event.preventDefault(); // Trap the default (click) handler
        let do_proceed = true;

        // Evetually run a confirmation dialog
        this.dialog ? (do_proceed = (await this.dialog.run()) === "accept") : {};

        if (do_proceed) {
            // Action before fetch
            if (this.action && this.action.when == "before") this.action.excecute();

            Util.get_targets(this.resets).forEach((element) => {
                element.dispatchEvent(new CustomEvent(ND_EVENTS.RESET));
            });

            // Fetch if an URL is present
            if (this.url) {
                nd.fetcher.fetch_data(this.url).then((data) => {
                    // Process data if any
                    if (data) {
                        Util.get_targets(this.targets).forEach((t) => {
                            if (t.tagName === "INPUT") {
                                t.value = data;
                            } else {
                                const fragment = Util.create_fragment(data);
                                // Replace target fragment and refresh it
                                Util.insert_fragment(t, fragment, false, true);
                            }
                        });
                    }
                    // Action after fetch when data is present
                    if (this.action && this.action.when == "after") this.action.excecute(data);
                });
            }
        }
    };

    static create_link = (element, url) => {
        element.setAttribute("nd-link", "");
        element.setAttribute("nd-url", url);
        return new Link(element);
    };

    static clear_link = (element) => {
        element.removeAttribute("nd-link");
        element.removeAttribute("nd-url");
        element.removeAttribute("data-ndtrack");
        element.style.cursor = "";
    };
};
