/**
 * Modal dialog base class
 */
const { Logger } = require("../modules/logger.js");

exports.BaseDialog = class BaseDialog {
    constructor(title, message, lang, accept_url, dismiss_url) {
        this._logger = new Logger(this.constructor.name);
        this.id = crypto.randomUUID(); // Give this instance an ID (UUID) !
        // Set event IDs
        this.accept_event_id = `nd:${this.id}:accept`;
        this.dismiss_event_id = `nd:${this.id}:dismiss`;
        // Set URLs
        this.accept_url = accept_url;
        this.dismiss_url = dismiss_url;
        // Button elements
        this.accept_btn = null;
        this.dismiss_btn = null;

        // Dialog content
        this.title = title;
        this.message = message;
        this.lang = lang;

        this.dialog = null; // The HTML dialog element
        this._bootstrap_dialog = null; // The bootstrap dialog object
        this._accept_handler = () => {}; // Default accept handler
        this._dismiss_handler = () => {}; // Default dismiss handler

        // Finally, add event handlers
        nd.events.on(this.accept_event_id, this._on_accept);
        nd.events.on(this.dismiss_event_id, this._on_dismiss);
    }

    // Accept event handler
    _on_accept = (event) => {
        // Run the 'accept' handler
        this._logger.info(`Accept on dialog ${this.id}`);
        this._accept_handler();
        this._close(true);
    };

    // Dismiss event handler
    _on_dismiss = (event) => {
        // Run the 'dismiss' handler
        this._logger.info(`Dismiss on dialog ${this.id}`);
        this._dismiss_handler();
        this._close(false);
    };

    _close = (accepted = false) => {
        this._logger.info(`Closing dialog ${this.id} (${accepted ? "accepted" : "dismissed"})`);

        // Hide the dialog overlay
        this._bootstrap_dialog.hide();

        // Remove event handlers
        nd.events.off(this.accept_event_id);
        nd.events.off(this.dismiss_event_id);

        // Remove specific elements
        this.cleanup();

        // Remove component from DOM
        this.dialog.remove();

        // Prepare redirection, depending on the state
        const redirect_to = accepted ? this.accept_url : this.dismiss_url;

        // Redirect if an URL is specified
        if (redirect_to) nd.util.navigate_to(redirect_to);
    };

    // Remove specific handlers (may be overridden in sub classes)
    cleanup = () => {};

    // Set another accept handler
    set_accept_handler(func = () => {}) {
        // The supplied arg. must be a function !
        if (typeof func === "function") this._accept_handler = func;
    }

    // Set another dismiss handler
    set_dismiss_handler(func = () => {}) {
        // The supplied arg. must be a function !
        if (typeof func === "function") this._dismiss_handler = func;
    }

    async show() {
        this.dialog = await nd.layer.open({
            content: this.html, // HTML content
            id: this.id, // Set the context
        });

        // Get this dialog's button elements
        this.accept_btn = this.dialog.querySelector("[nd-accept]");
        this.dismiss_btn = this.dialog.querySelector("[nd-dismiss]");

        // Add click event handlers
        this.accept_btn.addEventListener("click", (e) => {
            document.dispatchEvent(new CustomEvent(this.accept_event_id, { detail: { id: this.id } }));
        });
        this.dismiss_btn.addEventListener("click", (e) => {
            document.dispatchEvent(new CustomEvent(this.dismiss_event_id, { detail: { id: this.id } }));
        });

        // Show the dialog in bootstrap
        this._bootstrap_dialog = new bootstrap.Modal(this.dialog, { backdrop: "static" });
        this._bootstrap_dialog.show();
    }
};
