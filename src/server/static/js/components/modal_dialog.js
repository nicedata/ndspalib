/**
 * ModalDialog component.
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
    title: "ModalDialog 'title' is not defined !",
    message: "ModalDialog 'message' is not defined !",
};

/**
 * The ModalDialog class definition.
 */
exports.ModalDialog = class ModalDialog extends BaseModal {
    // Constructor
    constructor(title = DEFAULTS.title, message = DEFAULTS.message, lang = DEFAULTS.lang, accept_url = "", dismiss_url = "") {
        super(title, message, lang, accept_url, dismiss_url);

        // Set translations
        lang = LANGS.includes(lang) ? lang.toLowerCase() : DEFAULTS.lang; // Switch to DEFAULT_LANG
        this.lang = I18N[lang];

        // Bootstrap styled HTML code (compressed to make some space)
        this.html = nd.util.compress(`
            <div class="modal" data-nduuid="${this.id}" tabindex="-1" role="dialog" aria-labelledby="Modal dialog" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title"><!--<i class="bi bi-question-circle me-2" aria-hidden="true"></i>-->${this.title}</h5>
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
    }

    // Show the dialog
    async show() {
        super.show().then(() => {});
    }
};
