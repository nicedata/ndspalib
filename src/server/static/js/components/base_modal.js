this.dismiss_btn; /**
 * Modal dialog base class
 */
const { ERR_NO_NDSPA, noop } = require("../constants.js");

exports.BaseModal = class BaseModal {
    constructor(title, message, lang, accept_url, dismiss_url, debug = false) {
        // Check for ND utilities
        if (typeof window.nd === "undefined") throw new Error(ERR_NO_NDSPA);

        this.id = crypto.randomUUID(); // Give this instance an ID (UUID) !
        this._debug = debug;
        this.accept_btn = null;
        this.dismiss_btn = null;
        this.accept_url = accept_url;
        this.dismiss_url = dismiss_url;
        this._state = "init";

        this.title = title;
        this.message = message;
        this.lang = lang;

        this.dialog = null; // The HTML dialog element
        this._bootstrap_dialog = null; // The bootstrap dialog object
        this._accept_handler = noop; // Default accept handler
        this._dismiss_handler = noop; // Default dismiss handler

        // Finally, add SPA event handlers
        nd.event.on(`nd:${this.id}:accept`, this._on_accept);
        nd.event.on(`nd:${this.id}:dismiss`, this._on_dismiss);
    }

    // Accept event handler
    _on_accept = (event) => {
        // Run the 'accept' handler
        this._state = "accepted";
        this._accept_handler();
        this._remove_event_handlers();
    };

    // Dismiss event handler
    _on_dismiss = (event) => {
        // Run the 'dismiss' handler
        this._state = "dismissed";
        this._dismiss_handler();
        this._remove_event_handlers();
    };

    _remove_event_handlers = () => {
        this._bootstrap_dialog.hide();
        nd.event.off(`nd:${this.id}:accept`);
        nd.event.off(`nd:${this.id}:dismiss`);
        this.clean_addons();
        this.dialog.remove();

        let redirect_to = "";
        switch (this._state) {
            case "accepted":
                redirect_to = this.accept_url;
                break;
            case "dismissed":
                redirect_to = this.dismiss_url;
                break;
        }
        console.log("U", redirect_to);
    };

    clean_addons = () => {};

    // Set another accept handler
    set_accept_handler(func = DEFAULTS.noop) {
        // The supplied arg. must be a function !
        if (typeof func === "function") this._accept_handler = func;
    }

    // Set another dismiss handler
    set_dismiss_handler(func = DEFAULTS.noop) {
        // The supplied arg. must be a function !
        if (typeof func === "function") this._dismiss_handler = func;
    }

    async show() {
        this.dialog = await nd.layer.open({
            content: this.html, // HTML content
            id: this.id, // Set the current context (timestamp)
        });

        this.accept_btn = this.dialog.querySelector("[nd-accept]");
        this.dismiss_btn = this.dialog.querySelector("[nd-dismiss]");

        this.accept_btn.addEventListener("click", (e) => {
            document.dispatchEvent(new CustomEvent(`nd:${this.id}:accept`, { detail: { id: this.id } }));
        });

        this.dismiss_btn.addEventListener("click", (e) => {
            document.dispatchEvent(new CustomEvent(`nd:${this.id}:dismiss`, { detail: { id: this.id } }));
        });

        this._bootstrap_dialog = new bootstrap.Modal(this.dialog, { backdrop: "static" });
        this._bootstrap_dialog.show();
        this._state = "running";
    }
};
