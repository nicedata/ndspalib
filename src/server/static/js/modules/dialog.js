const { Logger } = require("../modules/logger.js");
const { OneButtonDialog, TwoButtonDialog, ThreeButtonDialog, ConfirmDialog, CustomDialog } = require("../components/dialogs.js");

const MODE = "mode";
const MODES = ["info", "choice", "options", "secure", "modal"];

const PARAMS_INFO = [
    { name: "mode", required: true, defaut: null },
    { name: "title", required: true, default: "Missing title !" },
    { name: "message", required: true, default: "Missing message !" },
    { name: "accept", required: true, default: "OK" },
    { name: "accept_url", required: false, default: null },
];

const PARAMS_CHOICE = [
    { name: "mode", required: true, defaut: null },
    { name: "title", required: true, default: "Missing title !" },
    { name: "message", required: true, default: "Missing message !" },
    { name: "accept", required: true, default: "OK" },
    { name: "accept_url", required: false, default: null },
    { name: "dismiss", required: true, default: "Cancel" },
    { name: "dismiss_url", required: false, default: null },
];

const PARAMS_SECURE = [
    { name: "mode", required: true, defaut: null },
    { name: "title", required: true, default: "Missing title !" },
    { name: "message", required: true, default: "Missing message !" },
    { name: "confirm", required: true, default: "Please confirm" },
    { name: "accept", required: true, default: "OK" },
    { name: "accept_url", required: false, default: null },
    { name: "dismiss", required: true, default: "Cancel" },
    { name: "dismiss_url", required: false, default: null },
];

const PARAMS_OPTIONS = [
    { name: "mode", required: true, defaut: null },
    { name: "title", required: true, default: "Missing title !" },
    { name: "message", required: true, default: "Missing message !" },
    { name: "accept", required: true, default: "OK" },
    { name: "accept_url", required: false, default: null },
    { name: "apply", required: true, default: "OK" },
    { name: "apply_url", required: false, default: null },
    { name: "dismiss", required: true, default: "Cancel" },
    { name: "dismiss_url", required: false, default: null },
];

const PARAMS_MODAL = [
    { name: "mode", required: true, defaut: null },
    { name: "title", required: false, default: null },
    { name: "width_pc", required: false, default: "30" },
];

exports.Dialog = class Dialog {
    static LOGGER = new Logger("Dialog", true);
    constructor() {
        // Singleton !
        if (!!Dialog._instance) {
            return Dialog._instance;
        }
        this.logger = Dialog.LOGGER;
        Dialog._instance = this;
    }

    get_dict = (template) => {
        const result = {};
        const warnings = [];
        const errors = [];

        // Get the mode
        const mode = template.content.querySelector('[name="mode"]').value.toLowerCase();

        let checklist = null;
        switch (mode) {
            case "info":
                checklist = PARAMS_INFO;
                break;
            case "choice":
                checklist = PARAMS_CHOICE;
                break;
            case "options":
                checklist = PARAMS_OPTIONS;
                break;
            case "secure":
                checklist = PARAMS_SECURE;
                break;
            case "modal":
                checklist = PARAMS_MODAL;
                break;
        }

        if (mode === "modal") {
            // In a modal dialog, a sub-template containing the HTML elements must be present
            const sub_template = template.content.querySelector("template");
            if (!sub_template) {
                errors.push(`${mode} : required parameter '<template.../>' is missing in template with 'id=${template.id}'.`);
            } else {
                result["fragment"] = sub_template.content;
            }
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

    get = (dialog_str) => {
        const [template_id, title, title_text] = dialog_str.split("::");

        if (title) {
            if (title !== "title") {
                this.logger.error(`Only the '::title' modifier is allowed in template with 'id=${template_id}.`);
                return;
            }
            if (!title_text) {
                this.logger.error(`A '::title::argument' must be defined in template with 'id=${template_id}.`);
                return;
            }
        }

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

        dict.title = title_text ? title_text : dict.title;

        switch (dict.mode) {
            case "info":
                return new OneButtonDialog(dict);
            case "choice":
                return new TwoButtonDialog(dict);
            case "options":
                return new ThreeButtonDialog(dict);
            case "secure":
                return new ConfirmDialog(dict);
            case "modal":
                return new CustomDialog(dict);
        }
        return null;
    };

    show = (dialog_str) => {
        const dialog = this.get(dialog_str);
        if (dialog) dialog.show();
    };
};
