const { Logger } = require("./logger.js");
const { Link } = require("./link.js");

exports.Select = class Select {
    constructor(element) {
        this.logger = new Logger("Select");
        this.selector = element;
        this.targets = [];

        const nd_targets = element.getAttribute("nd-target");
        const nd_options_url = element.getAttribute("nd-url");

        if (element.tagName !== "SELECT") {
            this.logger.error(`'nd-select' only apply to 'select' tags. Error element:`, element);
            return;
        }

        const targets = Array();
        if (nd_targets) {
            nd_targets.split(" ").forEach((target) => {
                if (target) {
                    this.logger.info(`Processing switch element with class or id '${target}'`);
                    document.querySelectorAll(target).forEach((t) => {
                        if (t.hasAttribute("nd-show-for") || t.hasAttribute("nd-hide-for")) {
                            t.hidden = true; // Hide the target. It will be updated by the change events
                        }
                        this.logger.info(`Found target identified by '${target}' (class or id) :`, t);
                        this.targets.push(t);
                    });
                }
            });
        }

        // Add a tracked 'change' event listener
        nd.tracker.add_listener(element, "change", this._update_targets);

        if (nd_options_url) {
            this.logger.info(`Getting select option from url '${nd_options_url}'.`);
            nd.fetcher.fetch_data(nd_options_url).then((data) => {
                const fragment = nd.util.create_fragment(data);
                nd.util.insert_fragment(element, fragment);

                // First time update
                this._setup();
                return;
            });
        }
        this._setup();
    }

    _setup = () => {
        // Set the selection to the first option
        this.selector.selectedIndex = 0;
        // Initial update !
        this.selector.dispatchEvent(new Event("change"));
    };

    _update_targets = (event) => {
        if (this.selector.selectedIndex < 0) return;

        // Get the value
        const option = this.selector.options[this.selector.selectedIndex];
        const value = option.getAttribute("value");
        const link = option.getAttribute("nd-url");

        this.targets.forEach((target) => {
            // Values
            const nd_show_for = target.getAttribute("nd-show-for");
            const nd_hide_for = target.getAttribute("nd-hide-for");

            // Booleans
            const nd_follow = target.hasAttribute("nd-follow");
            const nd_sync = target.hasAttribute("nd-sync");
            const nd_activate = target.hasAttribute("nd-activate");

            // nd-sync, nd-follow and nd-activate cannot appear together !
            if ([nd_follow, nd_sync, nd_activate].filter(Boolean).length > 1) {
                this.logger.error("'nd-sync', 'nd-follow' or 'nd-activate' are mutually exclusive !", target);
                return;
            }

            // Composite
            const nd_url = target.getAttribute("nd-url");
            const has_nd_url = nd_url ? true : false;

            const show_targets = nd_show_for ? nd_show_for.split(" ") : [];
            const hide_targets = nd_hide_for ? nd_hide_for.split(" ") : [];

            if (nd_activate) {
                target.innerHTML = value;
                target.setAttribute("nd-link", "");
                target.setAttribute("nd-url", link);

                // Activate the  target as a link
                new Link(target);
                // Refresh the fragment
                nd.util.refresh(target);
            }

            // If nd-sync is specified, set the element content from the nd-select source
            if (nd_sync) {
                if (has_nd_url && value) {
                    const url = `${nd_url}/${value}`;
                    nd.fetcher.fetch_data(url).then((data) => {
                        const fragment = nd.util.create_fragment(data);
                        nd.util.insert_fragment(target, fragment);
                    });
                } else {
                    target.innerText = value ? value : "";
                }
            }

            // If nd-follow is specified, set the element content from the selected nd-select option
            // TODO : to test again !
            if (nd_follow && link) {
                nd.fetcher.fetch_data(link).then((data) => {
                    const fragment = nd.util.create_fragment(data);
                    nd.util.insert_fragment(target, fragment, false, true);
                });
            }

            // Show wildcards
            if (show_targets.includes("*")) {
                target.hidden = value ? false : true;
                show_targets.splice(show_targets.indexOf("*"), 1);
            }

            // Hide wildcards
            if (hide_targets.includes("*")) {
                target.hidden = value ? true : false;
                hide_targets.splice(hide_targets.indexOf("*"), 1);
            }

            // Specific shows
            if (show_targets.length) target.hidden = !show_targets.includes(value);

            // Specific hides
            if (hide_targets.length) target.hidden = hide_targets.includes(value);
        });
    };
};
