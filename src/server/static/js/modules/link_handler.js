/**
 * Class LinkHandler
 *
 * Handles elements bearing the nd-link attribute.
 *
 * Methods and attributes starting with an underscore (_) are private !
 *
 * Usage:
 *    <tag nd-link nd-url="url" nd-target="selector"><tag>
 *
 * Attributes:
 *    nd-link :     identifies an element to which a link will be associated
 *    nd-url  :     url from which data will be fetched
 *    nd-target :   css selector to identify the target(s). If ommitted, the element istelf is the target.
 */

BaseHandler = require("./base_handler.js").BaseHandler;

exports.LinkHandler = class LinkHandler extends BaseHandler {
    constructor(debug = false) {
        super(debug);
        this._handlers = [];
    }

    /**
     * Process a given fragment.
     */
    process(fragment) {
        // If there are no links, DO NOTHING
        if (document.querySelectorAll("[nd-link]").length == 0) return;

        // Process this fragment
        this._process(fragment);
    }

    /**
     * Clean the DOM (remove unused handlers)
     */
    postprocess() {
        const handlers_to_remove = [];

        this._handlers.forEach((uuid) => {
            // find the uuid of elements NOT present in the document
            if (document.querySelectorAll(`[data-nduuid="${uuid}"]`).length == 0) {
                handlers_to_remove.push(uuid);
            }
        });

        handlers_to_remove.forEach((uuid) => {
            const index = this._handlers.indexOf(uuid);
            this._handlers.splice(index, 1);
            if (this._debug) console.log(`Removed link handler for ${uuid}`);
        });
        this._debug ? console.log(`Link handlers count: ${this._handlers.length}`) : () => {};
    }

    _click_handler(event, url, targets) {
        event.preventDefault();
        nd.util.fetch_data(url).then((data) => {
            if (data) {
                targets.forEach((t) => {
                    const fragment = nd.util.create_fragment(data);
                    // Insert or replace fragment
                    nd.util.insert_fragment(t, fragment, false, true);
                });
            }
        });
    }

    /**
     * Process (internal) a given fragment (HTML element)
     */
    _process(fragment) {
        fragment.querySelectorAll("[nd-link]").forEach((element) => {
            // Use the href attribute first. Fallback to nd-url
            let url = element.getAttribute("href");
            url = url ? url : element.getAttribute("nd-url");

            const append = false;
            const selector = element.getAttribute("nd-target");
            const targets = selector ? nd.util.get_targets(selector) : [];

            // Check url
            if (!url) {
                if (nd.debug.active()) {
                    console.warn("No <nd-url> defined on: %o", element);
                } else throw new Error(`No <nd-url> defined on: ${element.innerHTML}`);
            }

            // Check targets
            if (!targets.length && selector && selector.toLowerCase() !== "none") {
                if (nd.debug.active()) {
                    console.warn("No <nd-target> defined on: %o", element);
                } else throw new Error(`No <nd-target> defined on: ${element.innerHTML}`);
            }

            // Add a UUID dataset to this element.
            // This is done to handle unused timers.
            const uuid = this.set_uuid(element);

            // Add a click handler if an URL is present
            if (url) {
                element.addEventListener("click", (event) => {
                    this._click_handler(event, url, targets);
                });
                this._handlers.push(uuid);
            }
        });
    }
};
