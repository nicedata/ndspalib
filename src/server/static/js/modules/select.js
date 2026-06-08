const { ND_EVENTS } = require("../constants.js");
const { Logger } = require("./logger.js");
const { Link } = require("./link.js");
const { Util } = require("./util.js");

exports.Select = class Select {
    constructor(element) {
        this.logger = new Logger("Select");
        this.select = element;
        this.id = element.id || null;
        this.targets = [];
        this.inform = [];

        // Basic check
        if (element.tagName !== "SELECT") {
            this.logger.error(`'nd-select' only applies to 'select' tags. Error element:`, element);
            return;
        }

        // Process the nd-default attribute ans set the initial select content
        this.nd_default = element.getAttribute("nd-default");
        this.nd_default = this.nd_default ? `<option>${this.nd_default}</option>` : null;
        this.nd_default ? (element.innerHTML = this.nd_default) : () => {};

        // Process the nd-selected attribute
        this.nd_selected = element.getAttribute("nd-selected");

        // Find target(s)
        let selector = element.getAttribute("nd-target");
        let targets = Util.get_targets(selector);

        targets.forEach((target) => {
            // Hide the target. It will be updated by the change events
            target.hidden = target.hasAttribute("nd-show-for") || target.hasAttribute("nd-hide-for");
            this.logger.info(`Found target '${target.outerHTML}'`);
            this.targets.push(target);
        });

        // Find targets to inform
        selector = element.getAttribute("nd-inform");
        targets = Util.get_targets(selector);

        targets.forEach((target) => {
            if (target.tagName !== "SELECT") {
                this.logger.error(`The 'nd-inform' attribute may reference <select> elements only, not '${target.tagName}' elements.`, target);
            } else {
                this.logger.info(`Found inform target '${target.outerHTML}'`);
                this.inform.push(target);
            }
        });

        // Add tracked event listeners
        // 1.- For the local 'change' event
        // 2.- For an remote 'change' event
        nd.tracker.add_listener(element, "change", this._update_targets); // For the local 'change' event
        nd.tracker.add_listener(element, ND_EVENTS.CHANGE, this._on_nd_inform);
        nd.tracker.add_listener(element, ND_EVENTS.RESET, this._reset);

        // Get the options from the server if the 'nd-url' endpoint is specified
        const nd_options_url = element.getAttribute("nd-url");
        if (nd_options_url) {
            this.logger.info(`Getting select option from url '${nd_options_url}'.`);
            nd.fetcher.fetch_data(nd_options_url).then((data) => {
                const fragment = Util.create_fragment(data);
                Util.insert_fragment(element, fragment);
                // Do a first time update
                this._setup();
                return;
            });
        }
        // Trigger the first "change" event
        this._setup();
    }

    _reset = (event) => {
        this.select.selectedIndex = 0;
        this._update_targets();
    };

    _setup = () => {
        const nd_selected = this.select.querySelector(`option[value="${this.nd_selected}"]`);
        // Set the selection to the first option
        nd_selected ? (this.select.value = nd_selected.value) : (this.select.selectedIndex = 0);
        // Initial update !
        this.select.dispatchEvent(new Event("change"));
    };

    _send_event = () => {
        if (!this.inform) return;

        const option = this.select.options[this.select.selectedIndex];
        const value = option.getAttribute("value") || null;
        const url = option.getAttribute("nd-url") || null;

        const payload = { source: this.id, value: value, url: url };

        this.inform.forEach((e) => {
            e.dispatchEvent(new CustomEvent(ND_EVENTS.CHANGE, { detail: payload }));
        });
    };

    _on_nd_inform = (event) => {
        const detail = event.detail;
        if (!detail.url) {
            Util.clear_node(this.select);
            if (this.nd_default) {
                const fragment = Util.create_fragment(this.nd_default);
                Util.insert_fragment(this.select, fragment, false, true);
            }
            this._update_targets();
        } else {
            nd.fetcher.fetch_data(detail.url).then((data) => {
                // Append the data to the first option if any
                data = this.nd_default ? this.nd_default + data : data;
                // Clear the <select../> content
                Util.clear_node(this.select);
                // Create and insert the new fragment
                const fragment = Util.create_fragment(data);
                Util.insert_fragment(this.select, fragment, false, true);
                // Update the targets !
                this._update_targets();
            });
        }
    };

    _update_targets = () => {
        if (this.select.selectedIndex < 0) return;

        // Get the value
        const option = this.select.options[this.select.selectedIndex];
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
                link ? Link.create_link(target, link) : Link.clear_link(target);
                // Refresh the fragment
                Util.refresh(target);
            }

            // If nd-sync is specified, set the element content from the nd-select source
            if (nd_sync) {
                target.hidden != target.hidden;
                if (has_nd_url && value) {
                    const url = `${nd_url}/${value}`;
                    nd.fetcher.fetch_data(url).then((data) => {
                        const fragment = Util.create_fragment(data);
                        Util.insert_fragment(target, fragment);
                    });
                } else {
                    target.innerText = value ? value : "";
                }
                target.hidden != target.hidden;
            }

            // If nd-follow is specified, set the element content from the selected nd-select option
            if (nd_follow && link) {
                nd.fetcher.fetch_data(link).then((data) => {
                    const fragment = Util.create_fragment(data);
                    Util.insert_fragment(target, fragment, false, true);
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
        this._send_event();
    };
};
