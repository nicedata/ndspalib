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

const { TARGET_NONE } = require("../constants.js");
const { BaseHandler } = require("./base_handler.js");

exports.LinkHandler = class LinkHandler extends BaseHandler {
    constructor() {
        super();
        this._handlers = []; // List of handlers (uuid)
        this._logger.info("Class instance created.");
    }

    /**
     * Process a given fragment.
     */
    process(fragment) {
        // If there are no links, do nothing
        if (document.querySelectorAll("[nd-link]").length == 0) return;

        // Process this fragment
        fragment.querySelectorAll("[nd-link]").forEach((element) => {
            // Use the href attribute first. Fallback to nd-url
            let url = element.getAttribute("href");
            url = url ? url : element.getAttribute("nd-url");

            const append = false;
            const selector = element.getAttribute("nd-target");
            const targets = selector ? nd.util.get_targets(selector) : [];

            // Check url
            if (!url) {
                this._logger.error(`No <nd-url> defined on element`, element);
            }

            // Check targets
            if (!targets.length && selector && selector.toLowerCase() !== TARGET_NONE) {
                this._logger.error(`No <nd-target> defined on element`, element);
            }

            // Add a UUID dataset to this element.
            // This is done to handle unused timers.
            const uuid = nd.util.set_uuid(element);

            // Add a click handler if an URL is present
            if (url) {
                element.addEventListener("click", (event) => {
                    this._click_handler(event, url, targets);
                });
                this._handlers.push(uuid);
                this._logger.info(`Added a click handler on element`, element);
            }
        });
    }

    /**
     * Clean the DOM (remove unused handlers)
     */
    postprocess() {
        const handlers_to_remove = [];
        const handlers_count = this._handlers.length;

        // Find the uuid of elements NOT present in the document
        this._handlers.forEach((uuid) => {
            if (document.querySelectorAll(`[data-nduuid="${uuid}"]`).length == 0) {
                handlers_to_remove.push(uuid); // Mark for removal
            }
        });

        handlers_to_remove.forEach((uuid) => {
            const index = this._handlers.indexOf(uuid);
            this._handlers.splice(index, 1);
            this._logger.info(`Removed link handler for element ${uuid}`);
        });
        const cleaned_handlers_count = handlers_count - this._handlers.length;

        if (cleaned_handlers_count) this._logger.info(`Cleaned ${cleaned_handlers_count} of ${this._handlers.length} link handlers`);
    }

    _click_handler(event, url, targets) {
        event.preventDefault(); // Trap the default (click) handler
        nd.util.fetch_data(url).then((data) => {
            if (data) {
                targets.forEach((t) => {
                    if (t.tagName === "INPUT") {
                        t.value = data;
                    } else {
                        const fragment = nd.util.create_fragment(data);
                        // Insert or replace fragment
                        nd.util.insert_fragment(t, fragment, false, true);
                    }
                });
            }
        });
    }
};
