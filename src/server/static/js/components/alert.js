const { TOAST_DELAY_MS } = require("../constants.js");
const { Logger } = require("../modules/logger.js");
exports.Alert = class Alert {
    constructor(container = null, category = "", message = "", redirect_url = null, debug = false) {
        this._logger = new Logger(this.constructor.name);
        this._name = "Alert";
        this._id = crypto.randomUUID(); // Give this instance an ID (UUID) !
        this._container = container; // Set alert container element
        this._delay_ms = TOAST_DELAY_MS; // Alert display lifetime
        this._redirect_url = redirect_url;
        this._debug = debug;

        this.alert_element = null;
        this._timeout_id = null;

        this.html = nd.util.compress(`
            <div data-nduuid="${this._id}" class="alert alert-primary alert-dismissible mb-1" role="alert">
                ${message}
                <button type="button" class="btn-close" aria-label="Close"></button>
            </div>`);
    }

    destroy = (with_redirect = true) => {
        this.alert_element.classList.remove("show");
        this.alert_element.remove();

        if (!with_redirect) return;

        if (this._redirect_url) {
            this._logger.info(`Will redirect to '${this._redirect_url}'.`);
            const ok = nd.util.navigate_to(this._redirect_url);
            if (!ok) this._logger.error(`Redirection to '${this._redirect_url}' fails !`);
        } else {
            this._logger.info(`No redirection url was specified.`);
        }
    };

    show = () => {
        const fragment = nd.util.create_fragment(this.html);
        // Append to the toast container
        nd.util.insert_fragment(this._container, fragment, true);
        this.alert_element = this._container.querySelector(`[data-nduuid="${this._id}"]`);
        const btn_close = this.alert_element.querySelector("button");
        this.alert_element.classList.add("show");

        // Remove after a given delay
        const timeout_id = setTimeout(() => {
            this.destroy();
        }, this._delay_ms);

        // Add a click handler for an early close...
        btn_close.onclick = (e) => {
            clearTimeout(timeout_id);
            this.destroy(false);
            this._logger.info(`Action cancelled by user.`);
        };
    };
};
