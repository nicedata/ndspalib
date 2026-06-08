const { ND_EVENTS, NO_CONTEXT } = require("../constants.js");
const { Logger } = require("./logger.js");
const { Util } = require("./util.js");

class Context {
    static LOGGER = new Logger("Context", true);
    static ACTIONS = ["show", "hide", "remove", "reset"];
    constructor(template) {
        this.logger = Context.LOGGER;
        this.name = template.getAttribute("nd-context");
        this.show_selector = null; // A list of elements to show
        this.hide_selector = null; // A list of elements to hide
        this.remove_selector = null; // A list of elements to remove
        this.reset_selector = null; // A list of elements to reset

        template.content.querySelectorAll("[name]").forEach((param) => {
            if (!Context.ACTIONS.includes(param.name)) {
                this.logger.error(`Invalid context action: '${param.name}'. Valid values are: ${Context.ACTIONS.join(", ")}.`);
                return;
            }

            if (!param.hasAttribute("nd-target")) {
                this.logger.error(`No 'nd-target' attribute found. Element:`, param);
                return;
            }

            const value = param.getAttribute("nd-target");

            switch (param.name) {
                case "show":
                    this.show_selector = value;
                    break;
                case "hide":
                    this.hide_selector = value;
                    break;
                case "remove":
                    this.remove_selector = value;
                    break;
                case "reset":
                    this.reset_selector = value;
                    break;
            }
        });
        this.logger.info(`Handler for the '${this.name}' context created.`);
    }

    apply = () => {
        this.logger.info(`Applying context '${this.name}'.`);
        // Show
        Util.get_targets(this.show_selector).forEach((element) => {
            element.hidden = false;
        });
        // Hide
        Util.get_targets(this.hide_selector).forEach((element) => {
            element.hidden = true;
        });
        // Remove
        Util.get_targets(this.remove_selector).forEach((element) => {
            if (element.innerHTML === "") return;
            Util.clear_node(element);
            nd.tracker.postprocess();
        });
        // Reset
        Util.get_targets(this.reset_selector).forEach((element) => {
            element.dispatchEvent(new CustomEvent(ND_EVENTS.RESET));
        });
    };
}

exports.ContextHandler = class ContextHandler {
    static LOGGER = new Logger("ContextHandler", true);
    static CONTEXT_ACTIONS = ["show", "hide", "remove", "reset"];
    constructor() {
        // Singleton
        if (!!ContextHandler._instance) {
            return ContextHandler._instance;
        }
        ContextHandler._instance = this;

        this.logger = ContextHandler.LOGGER;
        this.active_context = NO_CONTEXT;
        this.no_context_handler = null;
        this.handlers = [];

        // Add an event listeners
        this.logger.info(`Adding a listener to handle '${ND_EVENTS.CONTEXT}' events.`);
        document.addEventListener(ND_EVENTS.CONTEXT, this._set_context);
    }

    _update_handlers = (fragment) => {
        this.logger.info("Updating handlers.");

        const contexts = fragment.querySelectorAll("[nd-context]");
        if (contexts.length === 0) return;

        const index = this.handlers.findIndex((handler) => handler.name === NO_CONTEXT);
        this.handlers.splice(index, 1);

        // this.no_context_handler = null;

        const names = [];
        contexts.forEach((e) => {
            const tag = e.tagName.toLowerCase();
            const context_name = e.getAttribute("nd-context");

            // Check tag (must be 'template')
            if (tag !== "template") {
                this.logger.error(`Contexts must be defined within a '<template.../>' tag. Provided : '<${tag}.../>'.`);
                return;
            }

            // Check name
            if (!context_name) {
                this.logger.error(`Contexts must have a name !`, e);
                return;
            }

            // Create a handler (if not already done)
            if (this.handlers.findIndex((handler) => handler.name === context_name) < 0) {
                this.logger.info(`Creating a handler for the '${context_name}' context.`);
                if (context_name === NO_CONTEXT) {
                    this.no_context_handler = new Context(e);
                } else {
                    this.handlers.push(new Context(e));
                }
            } else {
                this.logger.info(`The handler for the '${context_name}' context already exists.`);
            }

            // Store the context name for later cleanup
            names.push(context_name);
        });

        // Check if there is a 'no context' handler
        if (!names.includes(NO_CONTEXT)) {
            this.logger.error(`A context for '${NO_CONTEXT}' must be present !`);
        }

        // Clean unneeded handlers
        this.handlers.slice().forEach((handler) => {
            if (!names.includes(handler.name)) {
                const index = this.handlers.findIndex((h) => h.name === handler.name);
                this.handlers.splice(index, 1);
                this.logger.info(`The handler for the '${handler.name}' context is no longer needed (cleaned).`);
            }
        });
        this._apply();
        this.logger.info("Updating handlers done.");
    };

    process = (fragment) => {
        this._update_handlers(fragment);
    };

    postprocess = () => {};

    _apply = () => {
        // if (!this.handlers.length > 0) return;
        this.logger.info(`Applying context '${this.active_context}'.`);

        // First apply the NO CONTEXT handler (initial app state)
        console.log("C", this.no_context_handler.apply);
        this.no_context_handler.apply ? this.no_context_handler.apply() : {};

        // Apply for current context(s)
        this.handlers.forEach((h) => {
            h.name === this.active_context ? h.apply() : {};
        });
    };

    _set_context = (event) => {
        this.logger.info(`Event: ${event.type}. Context: '${event.detail.context}'. Action: '${event.detail.action}'`);
        const { context, action } = event.detail;

        switch (action) {
            case "set":
                if (this.active_context === context) {
                    this.logger.info(`Value '${context}' is already set.`);
                    break;
                }
                this.active_context = context;
                break;
            case "clear":
                this.active_context = NO_CONTEXT;
                break;
            default:
                return;
        }
        this._apply();
    };
};
