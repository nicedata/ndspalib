const { Logger } = require("./logger.js");
const { Form } = require("./form.js");

exports.FormHandler = class FormHandler {
    constructor() {
        this.logger = new Logger("FormHandler");
        this.forms = [];
    }

    /**
     * Process a given fragment.
     */
    process(fragment) {
        if (document.querySelectorAll("[nd-form]").length == 0) return;

        // Process this fragment
        fragment.querySelectorAll("[nd-form]").forEach((element) => {
            // Check element
            if (element.tagName !== "FORM") {
                this.logger.error(`The 'nd-form' attribute can only be on a <form> element !`);
                return;
            }
            // Create a new Form instance
            new Form(element);
            this.logger.info("New form instance created.");
        });
    }

    /**
     * Clean the DOM (remove unused handlers)
     */
    postprocess() {}
};
