const { Logger } = require("./logger.js");

exports.Form = class Form {
    static ACTIONS = ["nd-accept", "nd-apply", "nd-dismiss", "nd-revert", "nd-clear"];
    // static REQUIRED_ACTIONS = ["nd-accept", "nd-dismiss"];
    static REQUIRED_ACTIONS = ["nd-accept"];

    constructor(form) {
        this.logger = new Logger("Form");
        this.form = form;
        this.fields = form.querySelectorAll("[name]"); // Get all form fields
        this.formdata = new FormData(this.form); // Get the original form data
        this.form_str = nd.util.serialize_form(this.form); // Store the original form data
        this.is_dirty = false; // Initial form is not dirty !
        this.confirm_dialog = null;

        // Attach action button click event listeners
        Form.ACTIONS.forEach((action) => {
            const element = form.querySelector(`[${action}]`);
            switch (action) {
                case "nd-accept":
                    element ? element.addEventListener("click", this.accept) : () => {};
                    break;
                case "nd-apply":
                    element ? element.addEventListener("click", this.apply) : () => {};
                    break;
                case "nd-dismiss":
                    element ? element.addEventListener("click", this.dismiss) : () => {};
                    break;
                case "nd-revert":
                    element ? element.addEventListener("click", this.revert) : () => {};
                    break;
                case "nd-clear":
                    element ? element.addEventListener("click", this.clear) : () => {};
                    break;
            }
        });

        // Check for a confirmation dialog
        const nd_confirm = form.getAttribute("nd-confirm");
        if (nd_confirm) {
            const args = nd.util.as_json(nd_confirm);
            this.confirm_dialog = nd.factory.create("two-button", args);
        }

        // Set an UUID
        nd.util.set_uuid(this.form);

        // Add 'change' listeners to all fields
        this.fields.forEach((field) => {
            field.addEventListener("change", this.on_change);
        });

        // Add  a form 'submit' listener
        this.form.addEventListener("submit", this.on_submit);
    }

    save_state = () => {
        this.logger.info("Saving form state.");
        this.formdata = new FormData(this.form);
        this.form_str = nd.util.serialize_form(this.form);
        this.is_dirty = false;
    };

    close = () => {
        // Are we in a dialog ?
        const nd_dialog = this.form.closest("[nd-dialog]");
        if (!nd_dialog) {
            return;
        }

        const dialog_id = nd_dialog.id;
        this.logger.info(`Closing the containing dialog (${dialog_id}).`);
        document.dispatchEvent(new Event(`nd:close:${dialog_id}`));
    };

    on_change = () => {
        // Capture the new state and compare to the original one
        this.is_dirty = nd.util.serialize_form(this.form) !== this.form_str;
    };

    on_submit = (event) => {
        this.logger.info("Submit event !");
        event.preventDefault();
    };

    confirm = async () => {
        if (this.confirm_dialog) {
            const result = await this.confirm_dialog.run();
            return result === "accept";
        }
        return true;
    };

    accept = () => {
        // Submit the form
        // Check vaidity
        if (!this.form.reportValidity()) return;

        this.logger.info(`Submit: submitting. Form is valid.`);
        nd.fetcher.send_form(this.form);

        // Close the form
        this.close();
    };

    apply = () => {
        // Check whether the form has been changed
        if (!this.is_dirty) {
            this.logger.info("Apply: no changes.");
            return;
        }

        // Check vaidity
        if (!this.form.reportValidity()) return;

        // Submit the form
        this.logger.info(`Apply: submitting. Form is valid.`);
        nd.fetcher.send_form(this.form);

        // Save the current state
        this.save_state();
    };

    dismiss = async () => {
        let do_proceed = true;

        // If form is dirty, run a confirmation dialog (are you sure ?)
        if (this.is_dirty) do_proceed = await this.confirm();

        // Action: close or noop()
        do_proceed ? this.close() : () => {};
    };

    clear = async () => {
        let do_proceed = true;

        // If form is dirty, run a confirmation dialog (are you sure ?)
        if (this.is_dirty) do_proceed = await this.confirm();

        // Action: close or noop()
        do_proceed ? this.form.reset() : () => {};
    };

    revert = async () => {
        // Check whether the form has been changed
        if (!this.is_dirty) {
            this.logger.info("Revert: no changes.");
            return;
        }

        // Run a confirmation dialog (are you sure ?)
        if (await this.confirm()) {
            this.logger.info("Revert: restoring previous state.");
            this.form_str = nd.util.deserialize_form(this.form, this.formdata);
            this.is_dirty = false;
        } else {
            this.logger.info("Revert: action cancelled.");
        }
    };
};
