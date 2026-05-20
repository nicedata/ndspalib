const { Logger } = require("../modules/logger.js");
const { Alert, Toast } = require("../components/dialogs.js");

const MODE = "mode";
const MODES = ["alert", "toast"];

const PARAMS_ALERT = [
    { name: "mode", required: true, defaut: null },
    { name: "severity", required: true, default: "primary" },
    { name: "message", required: true, default: "Missing message !" },
    { name: "url", required: false, default: null },
];

const PARAMS_TOAST = [
    { name: "mode", required: true, defaut: null },
    { name: "title", required: true, default: "No title defined !" },
    { name: "message", required: true, default: "Missing message !" },
    { name: "url", required: false, default: null },
];

exports.Notification = class Notification {
    static LOGGER = new Logger("Notification", true);
    constructor() {
        // Singleton !
        if (!!Notification._instance) {
            return Notification._instance;
        }
        this.logger = Notification.LOGGER;
        Notification._instance = this;
    }

    get_dict = (template) => {
        const result = {};
        const warnings = [];
        const errors = [];

        // Get the mode
        const mode = template.content.querySelector('[name="mode"]').value.toLowerCase();

        let checklist = null;
        switch (mode) {
            case "alert":
                checklist = PARAMS_ALERT;
                break;
            case "toast":
                checklist = PARAMS_TOAST;
                break;
        }

        checklist.forEach((item) => {
            const param = template.content.querySelector(`[name="${item.name}"]`);
            if (!param) {
                if (item.required) {
                    errors.push(`${mode} : required parameter '${item.name}' is missing in template with 'id=${template.id}'.`);
                } else {
                    warnings.push(`${mode} : optional parameter '${item.name}' is missing in template with 'id=${template.id}'.`);
                }
            }
            result[item.name] = param ? param.value : item.default;
        });

        if (errors) {
            errors.forEach((error) => {
                this.logger.error(error);
            });
        }
        if (warnings) {
            warnings.forEach((warning) => {
                this.logger.info(warning);
            });
        }
        return result;
    };

    get = (template_id) => {
        // Check if template exists
        const template = document.getElementById(template_id);
        if (!template) {
            this.logger.error(`Template with 'id=${template_id}' not found.`);
            return;
        }

        // Get all parameters
        const param_names = [];
        template.content.querySelectorAll("param").forEach((p) => {
            param_names.push(p.name);
        });

        // Check for required 'mode' parameter
        if (!param_names.includes(MODE)) {
            this.logger.error(`Parameter '${MODE}' is missing in template with 'id=${template_id}'.`);
            return;
        }

        // Check if the mode is allowed
        const mode = template.content.querySelector('[name="mode"]').value.toLowerCase();
        if (!MODES.includes(mode)) {
            this.logger.error(`Parameter '${MODE}' must be ${MODES.join(" or ")} in template with 'id=${template_id}'.`);
            return;
        }

        const dict = this.get_dict(template);

        switch (dict.mode) {
            case "alert":
                return new Alert(dict);
            case "toast":
                return new Toast(dict);
        }
    };

    show = (template_id) => {
        const dialog = this.get(template_id);
        if (dialog) dialog.show();
    };
};
