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
 *       nd-switch :      Identifies elements to which the select behaviour will be applied.
 *                        This is a CSS selector.
 *       nd-options-url : Url from where to get the select options.
 *
 *    On the <options element:
 *
 *       nd-value : use a complex value like a json dictionary (TODO)
 *
 *    On the nd-switch targets:
 *
 *       nd-sync :     This element will receive the selected <option> value
 *       nd-url :      This element will be synced with a value received from the server : /url/value
 *                     The selected value is appended to the url.
 *                     TODO: transmit value via another pattern, e.g. /url?param=value
 *       nd-show-for : Show if a specific value is received (wildcard * accepted)
 *       nd-hide-for : Hide if a specific value is received (wildcard * accepted)
 */

BaseHandler = require("./base_handler.js").BaseHandler;

exports.SwitchHandler = class SwitchHandler extends BaseHandler {
    constructor(debug) {
        super(debug);
    }

    process(fragment) {
        // If there are no nd-switches, DO NOTHING
        if (document.querySelectorAll("[nd-switch]").length == 0) return;

        this._process(fragment);
    }

    postprocess() {}

    _process(fragment) {
        fragment.querySelectorAll("[nd-switch]").forEach((element) => {
            const nd_switch = element.getAttribute("nd-switch");
            const nd_options = element.getAttribute("nd-options-url");

            if (element.tagName !== "SELECT") {
                if (nd.debug.active()) {
                    console.warn("<nd-switch> only applies to 'select' tags !", element);
                } else throw new Error(`X<nd-switch> only applies to 'select' tags ! ${element.innerHTML}`);
            }

            if (nd_options) {
                nd.util.fetch_data(nd_options).then((data) => {
                    const fragment = nd.util.create_fragment(data);
                    nd.util.insert_fragment(element, fragment);
                });
            }

            const targets = Array();
            nd_switch.split(" ").forEach((s) => {
                if (s) {
                    document.querySelectorAll(s).forEach((t) => {
                        targets.push(t);
                    });
                }
            });

            if (element.tagName == "SELECT") {
                this._update_targets(element, targets);

                element.addEventListener("change", () => {
                    this._update_targets(element, targets);
                });
            }
        });
    }

    _update_targets(selector, targets) {
        const value = selector.options[selector.selectedIndex].getAttribute("value");

        targets.forEach((e) => {
            const nd_show_for = e.getAttribute("nd-show-for");
            const nd_hide_for = e.getAttribute("nd-hide-for");
            const nd_url = e.getAttribute("nd-url");
            const has_nd_sync = e.hasAttribute("nd-sync");
            const has_nd_url = nd_url ? true : false;

            const show_targets = nd_show_for ? nd_show_for.split(" ") : [];
            const hide_targets = nd_hide_for ? nd_hide_for.split(" ") : [];

            // If nd-sync is specified, set the element content from the nd-switch source
            if (has_nd_sync) {
                if (has_nd_url && value) {
                    const url = `${nd_url}/${value}`;
                    nd.util.fetch_data(url).then((data) => {
                        const fragment = nd.util.create_fragment(data);
                        nd.util.insert_fragment(e, fragment);
                    });
                } else {
                    e.innerText = value ? value : "";
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
