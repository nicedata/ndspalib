/**
 * ModalDialog component.
 *
 * Uses: Bootstrap for styling
 *       ND SPA Utilities for handling (modal, events, ...)
 */

// Supported languages (add your own !)
const LANGS = ["de", "fr", "en"];

// Internationalization (I18N)
const I18N = {
    fr: {
        yes: "Oui",
        no: "Non",
    },
    en: {
        yes: "Yes",
        no: "No",
    },
    de: {
        yes: "Ja",
        no: "Nein",
    },
};

// Default settings
const DEFAULTS = {
    lang: "en",
    title: "ModalDialog.title is not defined !",
    message: "ModalDialog.message is not defined !",
    // No Operation function
    noop: () => {
        console.log("NOOP");
    },
};

/**
 * The ModalDialog class definition.
 */
exports.ModalDialog = class ModalDialog {
    // Constructor
    constructor(title, message, lang) {
        this.dialog = null;
        this.bs_dialog = null;
        this.title = title ? title : DEFAULTS.title;
        this.message = message ? message : DEFAULTS.message;
        // Set translations
        lang = LANGS.includes(lang) ? lang.toLowerCase() : DEFAULTS.lang; // Switch to DEFAULT_LANG
        this.lang = I18N[lang];

        // Give this intance an ID (UUID) !
        this.id = crypto.randomUUID();

        // Bootstrap styled HTML code (compressed to make some space)
        this.html = nd.util.compress(`
            <div class="modal" data-nduuid="${this.id}" tabindex="-1" role="dialog" aria-labelledby="Modal dialog" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title"><i class="bi bi-question-circle me-2" aria-hidden="true"></i>${this.title}</h5>
                        </div>
                        <div class="modal-body">${this.message}</div>
                        <div class="modal-footer">
                            <div class="col-md-12 text-center">
                                <button type="button" class="btn btn-primary" style="width: 5rem" nd-accept>${this.lang.yes}</button>
                                <button type="button" class="btn btn-secondary" style="width: 5rem" nd-dismiss>${this.lang.no}</button>
                            </div>
                        </div>
                    </div>
                </div>    
            </div>`);

        console.log(this.html);

        // Set the default accept and cancel handlers
        this._accept_handler = DEFAULTS.noop; // Default accept handler
        this._cancel_handler = DEFAULTS.noop; // Default cancel handler

        // Accept event handler
        this._on_accept = (event) => {
            // Run the 'accept' handler
            this._accept_handler();
            this._remove_event_handlers();
        };

        // Cancel event handler
        this._on_cancel = (event) => {
            // Run the 'dismiss' handler
            this._cancel_handler();
            this._remove_event_handlers();
        };

        // Remove event handlers (cleanup)
        this._remove_event_handlers = () => {
            this.bs_dialog.hide();
            nd.event.off(`nd:${this.id}:accept`);
            nd.event.off(`nd:${this.id}:dismiss`);
            this.dialog.remove();
        };

        // Finally, add SPA event handlers
        nd.event.on(`nd:${this.id}:accept`, this._on_accept);
        nd.event.on(`nd:${this.id}:dismiss`, this._on_cancel);
    }

    // Set another accept handler
    set_accept_handler(func = DEFAULTS.noop) {
        // The supplied arg. must be a function !
        if (typeof func === "function") this._accept_handler = func;
    }

    // Set another cancel handler
    set_cancel_handler(func = DEFAULTS.noop) {
        // The supplied arg. must be a function !
        if (typeof func === "function") this._cancel_handler = func;
    }

    // Show the dialog
    async show() {
        this.dialog = await nd.layer.open({
            mode: "modal", // We want a modal !
            content: this.html, // HTML content
            id: this.id, // Set the current context (timestamp)
            dismissable: "button", // Use only buttons to dismiss the dialog !
            history: false, // Do not track url changes
        });

        this.bs_dialog = new bootstrap.Modal(this.dialog, { backdrop: "static" });
        const accept_btn = this.dialog.querySelector("[nd-accept]");
        const cancel_btn = this.dialog.querySelector("[nd-dismiss]");

        accept_btn.addEventListener("click", (e) => {
            document.dispatchEvent(new CustomEvent(`nd:${this.id}:accept`, { detail: { id: this.id } }));
        });

        cancel_btn.addEventListener("click", (e) => {
            document.dispatchEvent(new CustomEvent(`nd:${this.id}:dismiss`, { detail: { id: this.id } }));
        });

        this.bs_dialog.show();
    }
};
