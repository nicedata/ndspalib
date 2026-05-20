const { Logger } = require("./logger.js");
const { Action } = require("./action.js");

exports.Link = class Link {
    static LOGGER = new Logger("Link", true);

    constructor(element) {
        this.logger = Link.LOGGER;
        this.element = element;
        this.url = null;
        this.confirm_dialog = null;
        this.action = null;
        this.targets = [];

        // Change the cursor style !
        this.element.style.cursor = "pointer";

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

        // Process nd-action
        this.action = new Action(element);

        // If the element already has an data-ndtrack attribute,
        // remove it to give the listener tracker a chance to update
        element.removeAttribute("data-ndtrack");

        // Process nd-confirm
        const template_id = element.getAttribute("nd-confirm");
        if (template_id) {
            this.confirm_dialog = nd.dialog.get(template_id);
        }

        // Get the target(s)
        const selector = element.getAttribute("nd-target");
        this.targets = selector ? nd.util.get_targets(selector) : [];

        // Add a tracked 'click' handler
        nd.tracker.add_listener(element, "click", this.click_handler);
        this.logger.info(`New Link created (${element.getAttribute("data-ndtrack")}).`);
    }

    click_handler = async (event) => {
        event.preventDefault(); // Trap the default (click) handler
        let do_proceed = true;

        // Evetually run a confirmation dialog
        this.confirm_dialog ? (do_proceed = (await this.confirm_dialog.run()) === "accept") : () => {};

        if (do_proceed) {
            // Action before fetch
            if (this.action.when == "before") this.action.excecute();

            // Fetch if an URL is present
            if (this.url) {
                nd.fetcher.fetch_data(this.url).then((data) => {
                    // Process data if any
                    if (data) {
                        this.targets.forEach((t) => {
                            if (t.tagName === "INPUT") {
                                t.value = data;
                            } else {
                                const fragment = nd.util.create_fragment(data);
                                // Replace target fragment and refresh it
                                nd.util.insert_fragment(t, fragment, false, true);
                            }
                        });
                    }
                    // Action after fetch when data is present
                    if (this.action.when == "after") this.action.excecute(data);
                });
            }
        }
    };

    static clear_link = (element) => {
        element.removeAttribute("nd-link");
        element.removeAttribute("nd-url");
        element.removeAttribute("data-ndtrack");
        element.style.cursor = "";
    };

    static create_link = (element, url) => {
        element.setAttribute("nd-link", "");
        element.setAttribute("nd-url", url);
        return new Link(element);
    };
};
