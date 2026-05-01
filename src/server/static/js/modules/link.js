const { Logger } = require("./logger.js");
const { TwoButtonDialog } = require("../components/dialogs.js");

exports.Link = class Link {
    static LOGGER = new Logger("Link", true);
    constructor(element) {
        this.logger = Link.LOGGER;
        this.element = element;
        this.url = null;
        this.confirm = null;
        this.action = null;
        this.data = null;
        this.targets = [];

        // If the element already has an data-ndtrack attribute,
        // remove it to give the listener tracker a chance to update
        element.removeAttribute("data-ndtrack");

        // Use the href attribute first. Fallback to nd-url
        const href = element.getAttribute("href");
        this.url = href ? href : element.getAttribute("nd-url");

        // Process nd-confirm
        this.confirm = element.getAttribute("nd-confirm");

        // Process nd-confirm

        this.action = element.getAttribute("nd-action");
        // Process nd-confirm
        this.data = element.getAttribute("nd-data");

        // Check url
        if (!this.url) {
            this.logger.error(`No <nd-url> defined on element`, element);
            return;
        }

        const append = false;
        const selector = element.getAttribute("nd-target");
        this.targets = selector ? nd.util.get_targets(selector) : [];

        // Check targets
        if (!this.targets.length && selector && selector.toLowerCase() !== TARGET_NONE) {
            this.logger.error(`No <nd-target> defined on element`, element);
        }

        // Add a tracked 'click' handler
        nd.tracker.add_listener(element, "click", this._click_handler);
        this.logger.info(`New Link created (${element.getAttribute("data-ndtrack")}).`);
    }

    _click_handler = async (event) => {
        event.preventDefault(); // Trap the default (click) handler
        let do_proceed = true;
        let request_context = null;

        if (this.data) {
            // console.log("D", data);
        }

        // If an nd-confirm attribute is present
        if (this.confirm) {
            const args = nd.util.as_json(this.confirm);
            do_proceed = (await TwoButtonDialog.create_from_args(args).run()) === "accept";
        }

        if (do_proceed) {
            // If there is an action to do, do it
            this.action ? eval(this.action) : () => {};

            nd.fetcher.fetch_data(this.url).then((data) => {
                if (data) {
                    this.targets.forEach((t) => {
                        if (t.tagName === "INPUT") {
                            t.value = data;
                        } else {
                            const fragment = nd.util.create_fragment(data);
                            // Replace target fragment
                            nd.util.insert_fragment(t, fragment, false, true);
                        }
                    });
                }
            });
        }
    };
};
