const { ND_EVENTS } = require("../constants.js");
const { Logger } = require("./logger.js");

exports.ContextHandler = class ContextHandler {
    static LOGGER = new Logger("ContextHandler", true);
    constructor() {
        this.logger = ContextHandler.LOGGER;
        this.contexts = []; // The current context (initially not set)

        // Add an event listeners
        this.logger.info(`Adding a listener to handle '${ND_EVENTS.CONTEXT}' events.`);
        document.addEventListener(ND_EVENTS.CONTEXT, this._event_handler);
    }

    _update_document = () => {
        this.logger.info("Updating document.");
        document.querySelectorAll("[nd-context]").forEach((e) => {
            const attribute = e.getAttribute("nd-context");
            if (!attribute) {
                this.logger.error(`No context specified in element`, e);
                return;
            }

            // Handle actions, default is 'show'
            const [context, action = "show"] = attribute.split(":");

            // Check !
            if (!["show", "hide"].includes(action)) {
                this.logger.error(`Unsupported context action: '${action}. Allowed actions are 'show' or 'hide'.`);
                return;
            }

            switch (action) {
                case "show":
                    e.hidden = this.contexts.includes(context) ? false : true;
                    break;
                case "hide":
                    e.hidden = this.contexts.includes(context) ? true : false;
                    break;
            }
        });
    };

    // Todo : remove
    process = (fragment) => {};

    postprocess = () => {
        this._update_document();
    };

    _event_handler = (event) => {
        this.logger.info(`Event: ${event.type}. Context: '${event.detail.context}'. Action: '${event.detail.action}'`);
        const { context, action } = event.detail;

        switch (action) {
            case "set":
                if (this.contexts.includes(context)) {
                    this.logger.info(`Value '${context}' is already present.`);
                    return;
                }
                this.contexts.push(context);
                break;
            case "reset":
                if (!this.contexts.includes(context)) {
                    this.logger.info(`Value '${context}' is not set.`);
                    return;
                }
                const index = this.contexts.indexOf(context);
                index !== -1 ? this.contexts.splice(index, 1) : () => {};
                break;
            case "clear":
                this.contexts = [];
                break;
            default:
                return;
        }

        // Update the whole document !
        this._update_document();
    };
};
