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

const { BaseHandler } = require("./base_handler.js");
const { Link } = require("./link.js");

exports.LinkHandler = class LinkHandler extends BaseHandler {
    constructor() {
        super();
    }

    /**
     * Process a given fragment.
     */
    process(fragment) {
        // If there are no links, do nothing
        if (fragment.querySelectorAll("[nd-link]").length === 0) return;

        this.logger.info(`Processing fragment`, fragment);

        // Process this fragment
        fragment.querySelectorAll("[nd-link]").forEach((element) => {
            this.logger.info(`Processing 'nd-link' element`, element);
            new Link(element);
        });
    }

    /**
     * Clean the DOM (remove unused handlers)
     */
    postprocess() {}
};
