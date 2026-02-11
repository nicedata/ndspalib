/**
 * ModalConfirmation component.
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
        confirm: "SVP, Confirmer l'opération",
    },
    en: {
        yes: "Yes",
        no: "No",
        confirm: "Please, confirm the operation",
    },
    de: {
        yes: "Ja",
        no: "Nein",
        confirm: "Bitte Vorgang bestätigen",
    },
};

// Default settings
const DEFAULTS = {
    lang: "en",
    title: "ModalConfirmation.title is not defined !",
    message: "ModalConfirmation.message is not defined !",
    // No Operation function
    NOOP: () => {
        console.log("NOOP");
    },
};

/**
 * The ModalConfirmation class definition.
 */
exports.ModalConfirmation = class ModalConfirmation {
    // Constructor
    constructor(title, message, lang) {
        // Check for ND utilities
        if (typeof window.nd === "undefined") throw new Error("NDSPA library not present !");

        // Initilization
        this.dialog = null;
        this.bs_dialog = null;
        this.accept_btn = null; // The accept button
        this.cancel_btn = null; // The cancel button
        this.confirm_cb = null; // The confirmation checkbox
        this.title = title ? title : DEFAULTS.title;
        this.message = message ? message : DEFAULTS.message;
        // Set translations
        lang = LANGS.includes(lang) ? lang.toLowerCase() : DEFAULTS.lang; // Switch to DEFAULT_LANG
        this.lang = I18N[lang];

        // Give this instance an ID (UUID) !
        this.id = crypto.randomUUID();

        // Bootstrap styled HTML code (compressed to make some space)
        this.html = nd.util.compress(`
            <div class="modal" data-nduuid="${this.id}" tabindex="-1" role="dialog" aria-labelledby="Modal dialog" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title"><i class="bi bi-exclamation-circle me-2 text-danger" aria-hidden="true"></i>${this.title}</h5>
                        </div>
                        <div class="modal-body">${this.message}</div>
                        <div class="modal-footer">  
                            <div class="d-flex flex-row align-items-center w-100">
                                <div class="col-7">
                                    <!-- Confirmation checkbox -->
                                    <input type="checkbox"><label><i class="bi bi-arrow-left ms-2 me-1"></i>${this.lang.confirm}</label>
                                </div>
                                <div class="col-5 text-end">
                                    <button type="button" class="btn btn-secondary" style="width: 5rem" nd-dismiss>${this.lang.no}</button>
                                    <button type="button" class="btn" style="width: 5rem" nd-accept disabled>${this.lang.yes}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>    
            </div>`);

        // Set default handlers
        this._accept_handler = DEFAULTS.NOOP; // Default accept handler
        this._cancel_handler = DEFAULTS.NOOP; // Default cancel handler

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
            this.confirm_cb.removeEventListener("click", this._confirm_cb_listener); // Remove component handler
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

        this.accept_btn = this.dialog.querySelector("[nd-accept]"); // Get the accept button element
        this.cancel_btn = this.dialog.querySelector("[nd-dismiss]"); // Get the cancel button element
        this.confirm_cb = this.dialog.querySelector("input"); // Get the confirmation checkbox element
        this.confirm_cb.addEventListener("click", this._confirm_cb_listener); // Add a 'click' event listener

        this.accept_btn.addEventListener("click", (e) => {
            document.dispatchEvent(new CustomEvent(`nd:${this.id}:accept`, { detail: { id: this.id } }));
        });

        this.cancel_btn.addEventListener("click", (e) => {
            document.dispatchEvent(new CustomEvent(`nd:${this.id}:dismiss`, { detail: { id: this.id } }));
        });

        this.bs_dialog.show();
    }

    // Confirmation checkbox event listener
    _confirm_cb_listener = () => {
        if (this.confirm_cb.checked) {
            this.accept_btn.classList.add("btn-danger"); // Add accept button style (red)
            this.accept_btn.disabled = false; // Enable the accept button
            return;
        }
        this.accept_btn.classList.remove("btn-danger"); // remove accept button style (red)
        this.accept_btn.disabled = true; // Disable the accept butto
    };
};
