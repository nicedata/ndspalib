const { ERR_NO_NDSPA, TOAST_DELAY_MS, noop } = require("../constants.js");

const container_selector = "nd-toast-container";

exports.Toast = class Toast {
    constructor(container = null, category = "", header = "", body = "", redirect_url = null, debug = false) {
        this.id = crypto.randomUUID(); // Give this instance an ID (UUID) !
        this._container = container; // Set toast container element
        this._delay_ms = TOAST_DELAY_MS; // Toast display lifetime
        this._redirect_url = redirect_url;
        this._debug = debug;

        this.html = nd.util.compress(`
            <div data-nduuid="${this.id}" class="toast mt-2" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header">
                    <strong id="id_header_text" class="me-auto text-${category}">${header}</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div id="id_div_toast_body" class="toast-body">${body}</div>
            </div>`);
    }

    show = () => {
        const fragment = nd.util.create_fragment(this.html);
        // Append to the toast container
        nd.util.insert_fragment(this._container, fragment, true);
        const toast_element = this._container.querySelector(`[data-nduuid="${this.id}"]`);
        toast_element.classList.add("show");

        // Remove after a given delay
        setTimeout(() => {
            toast_element.classList.remove("show");
            toast_element.remove();
            if (this._redirect_url) {
                this._debug ? console.log(`${this.constructor.name} : will redirect to '${this._redirect_url}'.`) : noop();
                const ok = nd.util.navigate_to(this._redirect_url);
                if (!ok) this._debug ? console.error(`${this.constructor.name} : wedirection to '${this._redirect_url}' fails !`) : noop();
            } else {
                this._debug ? console.log(`${this.constructor.name} : no redirection url was specified.`) : noop();
            }
        }, this._delay_ms);
    };
};
