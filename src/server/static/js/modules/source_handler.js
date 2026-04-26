/**
 * Class SourceHandler
 *
 * Handles elements bearing the nd-source attribute.
 *
 * Methods and attributes starting with an underscore (_) are private !
 *
 * Usage:
 *    <tag nd-source="url"><tag>
 *
 * Attributes:
 *    nd-source:     url from which data will be fetched
 */

const { BaseHandler } = require("./base_handler.js");

exports.SourceHandler = class SourceHandler extends BaseHandler {
    constructor() {
        super();
    }

    process_init(fragment) {
        if (document.querySelectorAll("[nd-init]").length == 0) return;

        // Process this fragment
        fragment.querySelectorAll(`[nd-init]`).forEach((element) => {
            const url = element.getAttribute("nd-init");
            this.logger.info(`Processing element`, element);

            if (url === "/") {
                this.logger.error(`'nd-init' cannot be the root url (/) !`);
                return;
            }

            // Check url
            if (!url) {
                this.logger.error(`No valid url defined in 'nd-init' on element`, Object(element));
                element.innerHTML = `<span style="color: red">Error: no valid url defined in 'nd-init' on element &lt;${element.tagName.toLowerCase()} data-nduuid="${uuid}"&gt;</span>`;
                return;
            }

            // Get the data
            this.logger.info(`nd-init: Fetching data from '${url}'...`);
            nd.fetcher.fetch_data(url).then((data) => {
                if (data) {
                    const fragment = nd.util.create_fragment(data);
                    // Insert the fragment (replace the existing and refresh it)
                    nd.util.insert_fragment(element, fragment, false, true);
                } else {
                    this.logger.error(`Url '${url}' returned no data !`);
                    element.innerHTML = `<span style="color: red">Error: url '${url}' returned no data for element ${nd.util.as_text(element)}</span>`;
                }
            });
            element.removeAttribute("nd-init");
        });
    }
    /**
     * Process a given fragment.
     */
    process(fragment) {
        this.process_init(fragment);

        if (document.querySelectorAll("[nd-source]").length == 0) return;

        // Process this fragment
        fragment.querySelectorAll(`[nd-source]`).forEach((element) => {
            const url = element.getAttribute("nd-source");
            this.logger.info(`Processing element`, element);

            if (url === "/") {
                this.logger.error(`<nd-source cannot be the root url (/) !`);
                return;
            }

            // Add a UUID dataset to this element.
            const uuid = nd.util.set_uuid(element);

            // Check url
            if (!url) {
                this.logger.error(`No valid url defined in 'nd-source' on element`, Object(element));
                element.innerHTML = `<span style="color: red">Error: no valid url defined in 'nd-source' on element &lt;${element.tagName.toLowerCase()} data-nduuid="${uuid}"&gt;</span>`;
                return;
            }

            // Get the data
            this.logger.info(`Fetching data from '${url}' for element with uuid '${uuid}'...`);
            nd.fetcher.fetch_data(url).then((data) => {
                if (data) {
                    const fragment = nd.util.create_fragment(data);
                    // Insert the fragment (replace the existing and refresh it)
                    nd.util.insert_fragment(element, fragment, false, true);
                } else {
                    this.logger.error(`Url '${url}' returned no data !`);
                    element.innerHTML = `<span style="color: red">Error: url '${url}' returned no data for element ${nd.util.as_text(element)}</span>`;
                }
            });
        });
    }

    /**
     * Clean the DOM
     */
    postprocess() {}
};
