/**
 * Class SwitchHandler
 *
 * Handles <select> elements bearing the nd-switch attribute.
 *
 * Methods and attributes starting with an underscore (_) are private !
 *
 * Usage:
 *    <select nd-switch="selector">
 *       <option value="...">opt</option>
 *       ...
 *    </select>
 *
 * Attributes:
 *    On the <select> element itself:
 *
 *       nd-switch :      Identifies elements (CSS selector) to which the select behaviour will be applied.
 *       nd-options-url : Url from where to get the select options.
 *
 *    On the <options> element:
 *
 *       TODO use a complex value like a json dictionary
 *       nd-value : use a complex value like a json dictionary
 *
 *    On the nd-switch targets:
 *
 *       nd-sync :        The target(s) will be updated with the selected option's value.
 *       nd-follow :      The selected value is an url.
 *                        The target(s) will be updated with the server response.
 *
 *       nd-url :         The target(s) will be updated with a value received from the server : /url/<value>
 *                        The selected value is appended to the url.
 *       nd-show-for : Show if a specific value is received (wildcard * accepted)
 *       nd-hide-for : Hide if a specific value is received (wildcard * accepted)
 */

const { BaseHandler } = require("./base_handler.js");

exports.SwitchHandler = class SwitchHandler extends BaseHandler {
    constructor() {
        super();
    }

    process(fragment) {
        // If there are no nd-switches, DO NOTHING
        if (document.querySelectorAll("[nd-switch]").length == 0) return;
        this._process(fragment);
    }

    postprocess() {}

    _process(fragment) {
        fragment.querySelectorAll("[nd-switch]").forEach(async (element) => {
            const nd_switch = element.getAttribute("nd-switch");
            const nd_options_url = element.getAttribute("nd-options");

            this.logger.info(`Processing switch element`, element);

            if (element.tagName !== "SELECT") {
                this.logger.error(`<nd-switch> only applies to 'select' tags. Error element:`, element);
                return;
            }

            const targets = Array();
            nd_switch.split(" ").forEach((s) => {
                if (s) {
                    this.logger.info(`Processing switch element with class or id '${s}'`);
                    document.querySelectorAll(s).forEach((t) => {
                        if (t.hasAttribute("nd-show-for") || t.hasAttribute("nd-hide-for")) {
                            t.hidden = true; // Hide the target. It will be updated by the change events
                        }
                        this.logger.info(`Found target identified by '${s}' (class or id) :`, t);
                        targets.push(t);
                    });
                }
            });

            if (nd_options_url) {
                this.logger.info(`Getting select option from url '${nd_options_url}'.`);
                await nd.fetcher.fetch_data(nd_options_url).then((data) => {
                    const fragment = nd.util.create_fragment(data);
                    nd.util.insert_fragment(element, fragment);
                });
            }

            // Add an 'change' event listener
            element.addEventListener("change", () => {
                this._update_targets(element, targets);
            });

            // Set the selection to the first option
            element.selectedIndex = 0;
            // Initial update !
            element.dispatchEvent(new Event("change"));
        });
    }

    _update_targets(selector, targets) {
        if (selector.selectedIndex < 0) return;

        // Get the value
        const value = selector.options[selector.selectedIndex].getAttribute("value");

        targets.forEach((e) => {
            const nd_show_for = e.getAttribute("nd-show-for");
            const nd_hide_for = e.getAttribute("nd-hide-for");
            const nd_follow = e.hasAttribute("nd-follow");
            const nd_sync = e.hasAttribute("nd-sync");

            const nd_url = e.getAttribute("nd-url");
            const has_nd_url = nd_url ? true : false;

            // nd-sync and nd-follow cannot appear together !
            if (nd_sync && nd_follow) {
                this.logger.error("<nd-sync> and <nd-follow> are nutually exclusive !", e);
                return;
            }

            const show_targets = nd_show_for ? nd_show_for.split(" ") : [];
            const hide_targets = nd_hide_for ? nd_hide_for.split(" ") : [];

            // If nd-sync is specified, set the element content from the nd-switch source
            if (nd_sync) {
                if (has_nd_url && value) {
                    const url = `${nd_url}/${value}`;
                    nd.fetcher.fetch_data(url).then((data) => {
                        const fragment = nd.util.create_fragment(data);
                        nd.util.insert_fragment(e, fragment);
                    });
                } else {
                    e.innerText = value ? value : "";
                }
            }

            // If nd-follow is specified, set the element content from the selected nd-switch option
            if (nd_follow) {
                if (value) {
                    nd.fetcher.fetch_data(value).then((data) => {
                        const fragment = nd.util.create_fragment(data);
                        nd.util.insert_fragment(e, fragment, false, true);
                    });
                } else {
                    e.innerHTML = "";
                }
            }

            // Show wildcards
            if (show_targets.includes("*")) {
                e.hidden = value ? false : true;
                show_targets.splice(show_targets.indexOf("*"), 1);
            }

            // Hide wildcards
            if (hide_targets.includes("*")) {
                e.hidden = value ? true : false;
                hide_targets.splice(hide_targets.indexOf("*"), 1);
            }

            // Specific shows
            if (show_targets.length) e.hidden = !show_targets.includes(value);

            // Specific hides
            if (hide_targets.length) e.hidden = hide_targets.includes(value);
        });
    }
};
