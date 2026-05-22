const { ND_EVENTS } = require("../constants.js");
const { Logger } = require("./logger.js");

exports.ContextHandler = class ContextHandler {
    static LOGGER = new Logger("ContextHandler", true);
    static CONTEXT_ACTIONS = ["show", "hide", "remove"];
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
            // Get attributes from element
            let nd_show_for = e.getAttribute("nd-show-for");
            let nd_hide_for = e.getAttribute("nd-hide-for");
            let nd_remove_for = e.getAttribute("nd-remove-for");

            // Clean attributes (remove whitespaces and possibly set an empty value)
            nd_show_for ? (nd_show_for = nd_show_for.split(" ").join(" ")) : (nd_show_for = "");
            nd_hide_for ? (nd_hide_for = nd_hide_for.split(" ").join(" ")) : (nd_hide_for = "");
            nd_remove_for ? (nd_remove_for = nd_remove_for.split(" ").join(" ")) : (nd_remove_for = "");

            // Prform checks
            if (!nd_show_for && !nd_hide_for) {
                this.logger.error(`At least one of 'nd-show-for' and 'nd-show-for' attribute should be defined on element`, e);
                return;
            }

            // Hide by default
            e.hidden = true;

            // Transform parameters into arrays
            const show_for = nd_show_for ? nd_show_for.split(" ") : [];
            const hide_for = nd_hide_for ? nd_hide_for.split(" ") : [];
            const remove_for = nd_remove_for ? nd_remove_for.split(" ") : [];

            // By default elements with no 'nd-show-for' attribute are shown when no context is set
            if (this.contexts.length === 0 && show_for.length === 0) {
                e.innerHTML === "" ? (e.hidden = true) : (e.hidden = false);
                return;
            }

            // Loop current contexts
            this.contexts.forEach((context) => {
                if (remove_for.includes(context)) {
                    if (e.innerHTML) {
                        nd.util.clear_node(e);
                        nd.tracker.postprocess();
                    }
                    e.innerHTML === "" ? (e.hidden = true) : (e.hidden = false);
                }
                if (hide_for.includes(context) || hide_for.includes("*")) {
                    e.hidden = true;
                }
                if (show_for.includes(context) || show_for.includes("*")) {
                    e.hidden = false;
                }
            });
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
