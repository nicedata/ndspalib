const { BaseHandler } = require("./base_handler.js");
const { Logger } = require("./logger.js");
const { Util } = require("./util.js");
const { ND_EVENTS } = require("../constants.js");

class Source {
    static INIT = "nd-init";
    static SOURCE = "nd-source";
    constructor(element) {
        this.logger = new Logger("Source");
        this.element = element; // The HTML element
        this.type = null;
        this.url = null; // The URL to fetch

        // Basic checks
        if (element.hasAttribute(Source.INIT) && element.hasAttribute(Source.SOURCE)) {
            this.logger.error(`'${Source.INIT}' and '${Source.SOURCE}' cannot appear on the same element`, element);
            return;
        }

        if (element.hasAttribute(Source.INIT)) {
            this.url = element.getAttribute(Source.INIT);
            this.type = Source.INIT;
        }
        if (element.hasAttribute(Source.SOURCE)) {
            this.url = element.getAttribute(Source.SOURCE);
            this.type = Source.SOURCE;
        }

        // Clean URL
        typeof this.url === "string" ? (this.url = this.url.trim()) : {};

        // Further checks
        if (!this.url) {
            this.logger.error(`No valid URL defined in '${this.type}' on element`, element);
            element.innerHTML = `<span style="color: red">Error: no valid url defined in '${this.type}' on element &lt;${element.tagName.toLowerCase()}.../"&gt;</span>`;
            return;
        }

        if (this.url === "/") {
            this.logger.error(`The URL in '${this.type}' cannot be the root url (/) !`, this.element);
            return;
        }

        // Add an event li  stener for reset events
        if (this.type === Source.SOURCE) {
            nd.tracker.add_listener(this.element, ND_EVENTS.RESET, this.refresh);
        }

        this.refresh();

        if (this.type === Source.INIT) {
            this.element.removeAttribute(Source.INIT);
        }
    }

    refresh = () => {
        // Get the data
        this.logger.info(`${this.type}: Fetching data from '${this.url}'...`);
        nd.fetcher.fetch_data(this.url).then((data) => {
            if (data) {
                const fragment = Util.create_fragment(data);
                // Insert the fragment (replace the existing and refresh it)
                Util.insert_fragment(this.element, fragment, false, true);
            } else {
                this.logger.error(`Url '${this.url}' returned no data !`);
                this.element.innerHTML = `<span style="color: red">Error: url '${this.url}' returned no data for element ${Util.as_text(this.element)}</span>`;
            }
        });
    };
}

exports.SourceHandler = class SourceHandler extends BaseHandler {
    constructor() {
        super();
    }

    process(fragment) {
        fragment.querySelectorAll(`[nd-init],[nd-source]`).forEach((element) => {
            new Source(element);
        });
    }

    postprocess() {}
};
