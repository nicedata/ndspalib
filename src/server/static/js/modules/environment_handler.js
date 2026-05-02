const { ND_EVENTS } = require("../constants.js");
const { Logger } = require("./logger.js");

exports.EnvironmentHandler = class EnvironmentHandler {
    static LOGGER = new Logger("EnvironmentHandler", true);
    constructor() {
        // Singleton
        if (!!EnvironmentHandler._instance) {
            return EnvironmentHandler._instance;
        }
        this.logger = EnvironmentHandler.LOGGER;
        EnvironmentHandler._instance = this;
        this.logger = EnvironmentHandler.LOGGER;

        this.envs = []; // The current environments list of {key, value}

        // Add an event listeners
        this.logger.info(`Adding a listener to handle '${ND_EVENTS.ENVIRONMENT}' events.`);
        document.addEventListener(ND_EVENTS.ENVIRONMENT, this._event_handler);
    }

    _update_document = () => {
        this.logger.info(`Updating document. Environment: ${JSON.stringify(this.envs)}.`);

        document.querySelectorAll("[nd-env]").forEach((e) => {
            const key = e.getAttribute("nd-env");
            if (!key) {
                this.logger.error(`No key specified in element`, e);
                return;
            }

            // find the key in the environments list
            const result = this.envs.find((env) => env.key === key);
            if (!result) return;

            e.innerHTML = result.value;
        });
    };

    // Todo : remove
    process = (fragment) => {};

    postprocess = () => {
        this._update_document();
    };

    _event_handler = (event) => {
        this.logger.info(`Event: ${event.type}. Data: '${JSON.stringify(event.detail)}'.`);
        const data = event.detail;

        switch (data.action) {
            case "set":
                const result = this.envs.find((env) => env.key === data.key);
                result ? (result.value = data.value) : this.envs.push({ key: data.key, value: data.value });
                break;
            case "unset":
                const index = this.envs.findIndex((env) => env.key === data.key);
                index >= 0 ? this.envs.splice(index, 1) : () => {};
                break;
            case "clear":
                this.envs = [];
                break;
        }

        // Update the whole document !
        this._update_document();

        // copy the environment to the core
        nd.environment = this.envs;
    };
};
