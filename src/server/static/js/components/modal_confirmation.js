/**
 * ModalConfirmation component.
 *
 * Uses: Bootstrap for styling
 *       ND SPA Utilities for handling (modal, events, ...)
 */

const { BaseModal } = require("./base_modal.js");

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
    title: "ModalConfirmation 'title' is not defined !",
    message: "ModalConfirmation 'message' is not defined !",
};

/**
 * The ModalConfirmation class definition.
 */
exports.ModalConfirmation = class ModalConfirmation extends BaseModal {
    // Constructor
    constructor(title, message, lang) {
        super(title, message, lang);

        this.confirm_cb = null; // The confirmation checkbox
        this.title = title ? title : DEFAULTS.title;
        this.message = message ? message : DEFAULTS.message;
        // Set translations
        lang = LANGS.includes(lang) ? lang.toLowerCase() : DEFAULTS.lang; // Switch to DEFAULT_LANG
        this.lang = I18N[lang];

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
    }

    clean_addons = () => {
        this.confirm_cb.removeEventListener("click", this._confirm_cb_listener); // Remove component handler
    };

    // Show the dialog
    async show() {
        super.show().then(() => {
            this.confirm_cb = this.dialog.querySelector("input"); // Get the confirmation checkbox element
            this.confirm_cb.addEventListener("click", this._confirm_cb_listener); // Add a 'click' event listener
        });
    }

    // Confirmation checkbox event listener
    _confirm_cb_listener = () => {
        if (this.confirm_cb.checked) {
            this.accept_btn.classList.add("btn-danger"); // Add accept button style (red)
            this.accept_btn.disabled = false; // Enable the accept button
            return;
        }
        this.accept_btn.classList.remove("btn-danger"); // remove accept button style (red)
        this.accept_btn.disabled = true; // Disable the accept buttons
    };
};
