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
 *    nd-link :     Identifies an element to which a link will be associated
 *    nd-url  :     Url from which data will be fetched
 *    nd-target :   CSS selector to identify the target(s).
 *                  If ommitted, the element istelf is the target.
 *    nd-load :     Executes a 'click' immediately (loads the data from the URL)
 */

const { TARGET_NONE } = require("../constants.js");
const { BaseHandler } = require("./base_handler.js");
const { TwoButtonDialog } = require("../components/dialogs.js");

exports.LinkHandler = class LinkHandler extends BaseHandler {
    constructor() {
        super();
        this.handlers = []; // List of handlers (uuid)
    }

    /**
     * Process a given fragment.
     */
    process(fragment) {
        // If there are no links, do nothing
        if (fragment.querySelectorAll("[nd-link]").length == 0) return;

        this.logger.info(`Processing fragment`, fragment);

        // Process this fragment
        fragment.querySelectorAll("[nd-link]").forEach((element) => {
            this.logger.info(`Processing 'nd-link' element`, element);

            // Use the href attribute first. Fallback to nd-url
            let url = element.getAttribute("href");
            url = url ? url : element.getAttribute("nd-url");

            // Process nd-zone
            const nd_zone = element.getAttribute("nd-zone-target");

            // Process nd-confirm
            const nd_confirm = element.getAttribute("nd-confirm");

            // Process nd-confirm

            const nd_action = element.getAttribute("nd-action");
            // Process nd-confirm
            const nd_data = element.getAttribute("nd-data");

            // Check url
            if (!url) {
                this.logger.error(`No <nd-url> defined on element`, element);
                return;
            }

            const append = false;
            const selector = element.getAttribute("nd-target");
            const targets = selector ? nd.util.get_targets(selector) : [];

            // Check targets
            if (!targets.length && selector && selector.toLowerCase() !== TARGET_NONE) {
                this.logger.error(`No <nd-target> defined on element`, element);
            }

            // Add a UUID dataset to this element.
            // This is done to handle unused timers.
            const uuid = nd.util.set_uuid(element);

            // Add a click handler
            element.addEventListener("click", (event) => {
                this._click_handler(event, url, targets, nd_confirm, nd_action, nd_data);
            });
            this.handlers.push(uuid);
            this.logger.info(`Added a click handler on element`, element);
        });
    }

    /**
     * Clean the DOM (remove unused handlers)
     */
    postprocess() {
        const handlers_to_remove = [];
        const handlers_count = this.handlers.length;

        // Find the uuid of elements NOT present in the document
        this.handlers.forEach((uuid) => {
            if (document.querySelectorAll(`[data-nduuid="${uuid}"]`).length == 0) {
                handlers_to_remove.push(uuid); // Mark for removal
            }
        });

        handlers_to_remove.forEach((uuid) => {
            const index = this.handlers.indexOf(uuid);
            this.handlers.splice(index, 1);
            this.logger.info(`Removed link handler for element ${uuid}`);
        });
        const cleaned_handlers_count = handlers_count - this.handlers.length;

        if (cleaned_handlers_count) this.logger.info(`Cleaned ${cleaned_handlers_count} of ${this.handlers.length} link handlers`);
    }

    _click_handler = async (event, url, targets, confirm, action, data) => {
        event.preventDefault(); // Trap the default (click) handler
        let do_proceed = true;
        let request_context = null;

        if (data) {
            // console.log("D", data);
        }

        // If an nd-confirm attribute is present
        if (confirm) {
            const args = nd.util.as_json(confirm);
            do_proceed = (await TwoButtonDialog.create_from_args(args).run()) === "accept";
        }

        if (do_proceed) {
            // If there is an action to do, do it
            action ? eval(action) : () => {};

            nd.fetcher.fetch_data(url).then((data) => {
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
};
