const { Logger } = require("./logger.js");

exports.Form = class Form {
    static ACTIONS = ["nd-accept", "nd-apply", "nd-dismiss", "nd-revert", "nd-clear"];
    static REQUIRED_ACTIONS = ["nd-accept"];

    constructor(form) {
        this.logger = new Logger("Form");
        this.form = form;
        this.form_str = nd.util.serialize_form(this.form); // Store the original form data
        this.is_dirty = false; // Initial form is not dirty !
        this.confirm_dialog = null;
        this.accept_url = null;
        this.dismiss_url = null;
        this.event_listeners = [];

        // Set an UUID
        nd.util.set_uuid(this.form);

        // Attach a confirmation dialog
        this.confirm_dialog = this.get_confirm_dialog(this.form);

        // Attach action button click event listeners
        Form.ACTIONS.forEach((action) => {
            const element = form.querySelector(`[${action}]`);
            switch (action) {
                case "nd-accept":
                    if (element) {
                        element.addEventListener("click", this.accept);
                        // Save for nice cleaning
                        this.event_listeners.push({ element: element, event: "click", handler: this.accept });
                        this.accept_url = element.getAttribute("nd-url") || null;
                    }
                    break;
                case "nd-apply":
                    if (element) {
                        element.addEventListener("click", this.apply);
                        // Save for nice cleaning
                        this.event_listeners.push({ element: element, event: "click", handler: this.apply });
                    }
                    break;
                case "nd-dismiss":
                    if (element) {
                        element.addEventListener("click", this.dismiss);
                        // Save for nice cleaning
                        this.event_listeners.push({ element: element, event: "click", handler: this.dismiss });
                        this.dismiss_url = element.getAttribute("nd-url") || null;
                    }
                    break;
                case "nd-revert":
                    if (element) {
                        element.addEventListener("click", this.revert);
                        // Save for nice cleaning
                        this.event_listeners.push({ element: element, event: "click", handler: this.revert });
                    }
                    break;
                case "nd-clear":
                    if (element) {
                        element.addEventListener("click", this.clear);
                        // Save for nice cleaning
                        this.event_listeners.push({ element: element, event: "click", handler: this.clear });
                    }
                    break;
            }
        });

        // Add 'change' listeners to all fields
        // This is done to track changes and set the dirty flag
        form.querySelectorAll("[name]").forEach((field) => {
            field.addEventListener("change", this.on_change);
            // Save for nice cleaning
            this.event_listeners.push({ element: field, event: "change", handler: this.on_change });
        });

        // Add  a form 'submit' listener
        this.form.addEventListener("submit", this.on_submit);
        // Save for nice cleaning
        this.event_listeners.push({ element: this.form, event: "submit", handler: this.on_submit });
    }

    get_confirm_dialog = (form) => {
        // Check for a confirmation dialog
        const nd_confirm = form.querySelector("[nd-confirm]");
        let args = {};
        if (nd_confirm) {
            args.title = nd_confirm.getAttribute("nd-title") || "No title";
            args.message = nd_confirm.getAttribute("nd-message") || "No message";
            // Get the buttons
            if (nd_confirm.querySelector("[nd-button")) args.buttons = [];
            nd_confirm.querySelectorAll("[nd-button]").forEach((btn) => {
                const dict = {};
                dict.action = btn.getAttribute("nd-action") || "dismiss";
                dict.label = btn.getAttribute("nd-label") || dict.action;
                dict.url = btn.getAttribute("nd-url") || null;
                args.buttons.push(dict);
            });
        } else {
            // Default dialog
            args = {
                title: "Approval needed",
                message: "Apply form changes ?",
                buttons: [
                    { action: "accept", label: "Yes" },
                    { action: "dismiss", label: "No" },
                ],
            };
        }
        return nd.dialog_factory.create("two-button", args);
    };

    close = (reason) => {
        this.logger.info(`Closing form. Reason: '${reason}.'`);

        // Find a dialog containig this form
        const nd_dialog = this.form.closest("[nd-dialog]");

        // Remove event listeners
        this.logger.info(`Removing attached event listeners (${this.event_listeners.length}).`);
        this.event_listeners.forEach((listener) => {
            listener.element.removeEventListener(listener.event, listener.handler);
        });

        // Remove the form from the DOM
        this.form.remove();

        // Close the containing dialog
        if (nd_dialog) {
            const dialog_id = nd_dialog.id;
            this.logger.info(`Closing the containing dialog (${dialog_id}).`);
            document.dispatchEvent(new Event(`nd:close:${dialog_id}`));
        }

        // Finally perfom redirections (if any)
        switch (reason) {
            case "accept":
                this.accept_url ? nd.util.navigate_to(this.accept_url) : () => {};
                break;
            case "dismiss":
                this.dismiss_url ? nd.util.navigate_to(this.dismiss_url) : () => {};
                break;
        }
    };

    save_state = () => {
        this.logger.info("Saving form state.");
        // this.formdata = new FormData(this.form);
        this.form_str = nd.util.serialize_form(this.form);
        this.is_dirty = false;
    };

    on_change = () => {
        // Capture the new state and compare to the original one
        this.is_dirty = this.form_str !== nd.util.serialize_form(this.form);
    };

    on_submit = (event) => {
        this.logger.info("Submit event !");
        event.preventDefault();
    };

    confirm = async () => {
        const result = await this.confirm_dialog.run();
        return result === "accept";
    };

    accept = () => {
        // Submit the form
        // Check vaidity
        if (!this.form.reportValidity()) return;

        this.logger.info(`Submit: submitting. Form is valid.`);
        nd.fetcher.send_form(this.form);

        // Close the form

        this.close("accept");
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
        this.logger.info("Dismissing, dirty form: ", this.is_dirty);
        let do_proceed = true;

        // If form is dirty, run a confirmation dialog (are you sure ?)
        if (this.is_dirty) do_proceed = await this.confirm();

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
