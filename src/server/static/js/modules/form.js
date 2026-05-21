const { Logger } = require("./logger.js");
const { ND_EVENTS } = require("../constants.js");

exports.Form = class Form {
    constructor(form) {
        this.logger = new Logger("Form");
        this.form = form;
        this.form_str = nd.util.serialize_form(this.form); // Store the original form data
        this.is_dirty = false; // Initial form is not dirty !
        this.confirm_dialog = null;
        this.accept_url = null;
        this.dismiss_url = null;

        const form_actions = [
            { name: "nd-accept", element: form.querySelector("[nd-accept]"), handler: this.accept, required: true },
            { name: "nd-apply", element: form.querySelector("[nd-apply]"), handler: this.apply, required: false },
            { name: "nd-dismiss", element: form.querySelector("[nd-dismiss]"), handler: this.dismiss, required: false },
            { name: "nd-revert", element: form.querySelector("[nd-revert]"), handler: this.revert, required: false },
            { name: "nd-clear", element: form.querySelector("[nd-clear]"), handler: this.clear, required: false },
        ];

        const template_id = form.getAttribute("nd-confirm");
        console.log("TID", template_id);
        if (template_id) {
            this.confirm_dialog = nd.dialog.get(template_id);
            console.log("Confirm", this.confirm_dialog);
        }

        form_actions.forEach((a) => {
            a.required && !a.element ? this.logger.error(`Required element with an '${a.name}' attribute is required !`) : () => {};
            a.element ? nd.tracker.add_listener(a.element, "click", a.handler) : () => {};
            a.name === "nd-accept" && a.element ? (this.accept_url = a.element.getAttribute("nd-url")) : () => {};
            a.name === "nd-dismiss" && a.element ? (this.dismiss_url = a.element.getAttribute("nd-url")) : () => {};
        });

        // Add 'change' listeners to all fields
        // This is done to track changes and set the dirty flag
        form.querySelectorAll("[name]").forEach((field) => {
            nd.tracker.add_listener(field, "change", this.on_change);
        });

        // Add  a form 'submit' listener
        nd.tracker.add_listener(this.form, "submit", this.on_submit);

        // Add a listener for server sent 'nd:form:reset'
        nd.tracker.add_listener(this.form, ND_EVENTS.FORM_RESET, this.on_reset_request);
    }

    close = async (reason) => {
        this.logger.info(`Closing form. Reason: '${reason}.'`);

        // Finally perfom redirections (if any)
        switch (reason) {
            case "accept":
                this.accept_url ? await nd.fetcher.fetch_data(this.accept_url) : () => {};
                break;
            case "dismiss":
                this.dismiss_url ? await nd.fetcher.fetch_data(this.dismiss_url) : () => {};
                break;
        }
    };

    save_state = () => {
        this.logger.info("Saving form state.");
        this.form_str = nd.util.serialize_form(this.form);
        this.is_dirty = false;
    };

    on_reset_request = (event) => {
        this.form.reset();
        const first_input = this.form.querySelector("input");
        first_input ? first_input.focus() : () => {};
    };

    on_change = () => {
        // Capture the new state and compare to the original one
        this.is_dirty = this.form_str !== nd.util.serialize_form(this.form);
    };

    on_submit = (event) => {
        // Trap the default handling !
        event.preventDefault();
    };

    confirm = async () => {
        this.form.setAttribute("novalidate", "");
        const result = this.confirm_dialog ? (await this.confirm_dialog.run()) === "accept" : true;
        this.form.removeAttribute("novalidate");
        const first_input = this.form.querySelector("input");
        first_input ? first_input.focus() : () => {};
        return result;
    };

    accept = async () => {
        // Submit the form
        // Check vaidity
        if (!this.form.reportValidity()) return;

        this.logger.info(`Submit: submitting. Form is valid.`);
        await nd.fetcher.send_form(this.form);

        // Close the form

        this.close("accept");
    };

    apply = async () => {
        // Check whether the form has been changed
        if (!this.is_dirty) {
            this.logger.info("Apply: no changes.");
            return;
        }

        // Check vaidity
        if (!this.form.reportValidity()) return;

        // Submit the form
        this.logger.info(`Apply: submitting. Form is valid.`);
        await nd.fetcher.send_form(this.form);

        // Save the current state
        this.save_state();
    };

    dismiss = async () => {
        this.logger.info("Dismissing, dirty form: ", this.is_dirty);
        let do_proceed = true;

        // If form is dirty, run a confirmation dialog (are you sure ?)
        do_proceed = await this.confirm();

        // Action: close or noop()
        do_proceed ? this.close("dismiss") : () => {};
    };

    clear = async () => {
        this.logger.info("Clearing, dirty form: ", this.is_dirty);
        let do_proceed = true;

        // If form is dirty, run a confirmation dialog (are you sure ?)
        if (this.is_dirty) do_proceed = await this.confirm();

        // Action: close or noop()
        do_proceed ? this.form.reset() : () => {};
    };

    revert = async () => {
        this.logger.info("Revering, dirty form: ", this.is_dirty);
        // Check whether the form has been changed
        if (!this.is_dirty) {
            this.logger.info("Revert: no changes.");
            return;
        }

        // Run a confirmation dialog (are you sure ?)
        if (await this.confirm()) {
            this.logger.info("Revert: restoring previous state.");
            nd.util.deserialize_form(this.form, this.form_str);
            this.is_dirty = false;
        } else {
            this.logger.info("Revert: action cancelled.");
        }
    };
};
