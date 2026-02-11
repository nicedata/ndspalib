/**
 * ModalConfirmation component.
 *
 * Uses: Bootstrap for styling
 *       UNPOLY for handling (modal, events, ...)
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

// String compression (make space !)
const str_compress = (str) => {
    if (typeof str !== "string") return str;
    return str.replace(/\n+/g, " ").replace(/\r+/g, " ").replace(/  +/g, " ");
};

/**
 * The ModalConfirmation class definition.
 */
export class ModalConfirmation {
    // Constructor
    constructor(title, message, lang) {
        this.title = title ? title : DEFAULTS.title;
        this.message = message ? message : DEFAULTS.message;
        // Set translations
        lang = LANGS.includes(lang) ? lang.toLowerCase() : DEFAULTS.lang; // Switch to DEFAULT_LANG
        this.lang = I18N[lang];

        // Give this intance an ID (timestamp) !
        this.id = Date.now();

        // Important elements that will be set once the component is in the DOM
        this.accept_btn = null; // The accept button
        this.confirm_cb = null; // The confirmation checkbox

        // Bootstrap styled HTML code (compressed to make some space)
        this.html = str_compress(`
            <div id="modal-${this.id}" class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="bi bi-exclamation-circle me-2 text-danger" aria-hidden="true"></i>${this.title}</h5>
                    </div>
                    <div class="modal-body">${this.message}</div>
                    <div class="modal-footer">  
                        <div class="row align-items-center w-100">
                            <div class="col">
                                <!-- Confirmation checkbox -->
                                <input class="me-2" type="checkbox"><label><i class="bi bi-arrow-left ms-1 me-1"></i>${this.lang.confirm}</label>
                            </div>
                            <div class="col auto text-end">
                                <button type="button" class="btn btn-secondary" style="width: 5rem" up-dismiss>${this.lang.no}</button>
                                <button type="button" class="btn" style="width: 5rem" up-accept disabled>${this.lang.yes}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`);

        // Set the default accept and cancel handlers
        this._accept_handler = DEFAULTS.NOOP; // Default accept handler
        this._cancel_handler = DEFAULTS.NOOP; // Default cancel handler

        // Accept event handler
        this._on_accept = (event) => {
            // Handle only this context !
            if (event.layer.context.id && event.layer.context.id == this.id) {
                this._accept_handler(); // Call the accept handler
                this._remove_event_handlers(); // Remove handlers before component destruction (clean the DOM)
            }
        };

        // Cancel event handler
        this._on_cancel = (event) => {
            // Handle only this context !
            if (event.layer.context.id && event.layer.context.id == this.id) {
                this._cancel_handler(); // Call the cancel handler
                this._remove_event_handlers(); // Remove handlers before component destruction (clean the DOM)
            }
        };

        // Remove event handlers (cleanup)
        this._remove_event_handlers = () => {
            up.off("up:layer:accept", this._on_accept); // Remove UNPOLY accept handler
            up.off("up:layer:dismiss", this._on_cancel); // Remove UNPOLY dismiss handler
            this.confirm_cb.removeEventListener("click", this._confirm_cb_listener); // Remove component handler
        };

        // Finally, add UNPOLY event handlers
        up.on("up:layer:accept", this._on_accept); // Add UNPOLY accept handler
        up.on("up:layer:dismiss", this._on_cancel); // Add UNPOLY dismiss handler
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

    // Code executed once the component is in the DOM
    _on_show = () => {
        const modal_root = document.getElementById(`modal-${this.id}`); // Dialog root element
        this.accept_btn = modal_root.querySelector("[up-accept]"); // Get the accept button
        this.confirm_cb = modal_root.querySelector("input"); // Get the confirmation checkbox
        this.confirm_cb.addEventListener("click", this._confirm_cb_listener); // Add a 'click' event listener
    };

    // Set another accept handler
    set_accept_handler(func = DEFAULTS.NOOP) {
        // The supplied arg. must be a function !
        if (typeof func === "function") this._accept_handler = func;
    }

    // Set another cancel handler
    set_cancel_handler(func = DEFAULTS.NOOP) {
        // The supplied arg. must be a function !
        if (typeof func === "function") this._cancel_handler = func;
    }

    // Show the dialog
    async show() {
        // UNPOLY call
        await up.layer.open({
            mode: "modal", // We want a modal !
            content: this.html, // HTML content
            dismissable: "button", // Use only buttons to dismiss the dialog !
            history: false, // Do not track url changes
            context: {
                id: this.id, // Set the current context (timestamp)
            },
        });

        // Process once in DOM
        this._on_show();
    }
}
