const { ND_EVENTS, VERSION } = require("../constants.js");
const { Logger } = require("./logger.js");

exports.Util = class Util {
    constructor() {
        this.logger = new Logger("Util");
    }

    // Source - https://stackoverflow.com/questions/42406520/populate-an-html-form-from-a-formdata-object
    serialize_form(form) {
        const data = new FormData(form);
        return new URLSearchParams(data).toString();
    }

    deserialize_form(form, formdata) {
        const entries = new URLSearchParams(formdata).entries();
        for (const [key, val] of entries) {
            //http://javascript-coder.com/javascript-form/javascript-form-value.phtml
            const input = form.elements[key];
            switch (input.type) {
                case "checkbox":
                    input.checked = !!val;
                    break;
                default:
                    input.value = val;
                    break;
            }
        }
    }

    // Source - https://stackoverflow.com/a/4700265
    // Posted by El Ronnoco, modified by community. See post 'Timeline' for change history
    // Retrieved 2026-02-15, License - CC BY-SA 4.0
    truncate(input, len = 50) {
        if (typeof input !== "string") return input;
        return input.length > len ? `${input.substring(0, len)}...` : input;
    }

    set_uuid(element) {
        const uuid = crypto.randomUUID();
        element.dataset.nduuid = uuid;
        this.logger.info(`set_uuid | Attributed an UUID to element`, Object(element));
        return uuid;
    }

    as_text(element) {
        if (typeof element === "object" && element !== null && element.constructor.name === "HTMLElement") {
            return element.outerHTML.replace("<", "&lt").replace(">", "&gt");
        }
        return "???";
    }

    /**
     * noop - function that does nothing.
     */
    noop() {
        this.logger.info(`noop`);
    }

    /**
     * get_targets - get all elements by a selector,
     */
    get_targets(selector) {
        this.logger.info(`get_targets | selector: '${selector}'`);
        if (typeof selector !== "string" || !selector) return Array(0);
        selector = selector.trim();

        // Search elements by tags
        return Array.from(document.querySelectorAll(selector));
    }

    /**
     * clear_node - delete a specific node.
     */
    clear_node(node) {
        this.logger.info(`clear_node | node name: '${node.nodeName.toLowerCase()}'`);
        const range = document.createRange();
        range.selectNodeContents(node);
        range.deleteContents();
        return "";
    }

    /**
     * create_fragment - create a document fragment from HTML code.
     */
    create_fragment(html) {
        this.logger.info(`create_fragment | Content: '${html ? this.truncate(html) : ""}'`);
        const range = document.createRange();
        return range.createContextualFragment(html);
    }

    refresh(fragment) {
        // Step 1 : process the fragment (update handlers)
        for (const [_, handler] of Object.entries(nd.handlers)) {
            handler.process(fragment);
        }

        // Step 2 : postprocess the (update handlers)
        for (const [_, handler] of Object.entries(nd.handlers)) {
            handler.postprocess();
        }

        // If the fragment contains a form, we remove focus from the activeElement
        // to allow focus to be set somewhere in the form (autofocus)
        const form = fragment.querySelector("form");
        if (form) {
            const first_field = form.querySelector("[autofocus]");

            if (first_field) {
                document.activeElement ? document.activeElement.blur() : () => {};
                first_field.focus();
            }
        }
    }

    /**
     * insert_fragment - replace or append a fragment in a specific target.
     */
    insert_fragment(target, fragment, append = false, refresh = false, new_layer = false) {
        this.logger.info(`insert_fragment | Target: '${target.tagName.toLowerCase()}'. Mode: ${append ? "append" : "replace"}. Refresh: ${refresh ? "yes" : "no"}.`);

        document.dispatchEvent(new CustomEvent(ND_EVENTS.FRAGMENT_BEFORE_INSERT, { detail: { target: target, fragment: fragment, append: append } }));
        // If append mode is false, clear the node before
        append ? () => {} : this.clear_node(target);

        // See : https://www.miragecraft.com/blog/dynamically-insert-inline-script
        target.appendChild(fragment);

        // No global refresh on new layers !
        if (new_layer) return;

        // If refresh mode is true, refresh the node
        refresh ? this.refresh(target) : () => {};

        document.dispatchEvent(new CustomEvent(ND_EVENTS.FRAGMENT_AFTER_INSERT, { detail: { target: target, data: fragment, append: append } }));
    }

    /**
     * sleep_ms - sleep during a specific period (ms).
     */
    async sleep_ms(ms) {
        this.logger.info(`sleep_ms | Timeout: ${ms}ms.`);
        await new Promise((resolve) => setTimeout(resolve, ms));
    }

    /**
     * compress - Compress a string (remove duplicate whitechars).
     */
    compress(str) {
        if (typeof str !== "string") return str;
        this.logger.info(`compress | String: '${this.truncate(str)}'.`);
        return str.replace(/\n+/g, " ").replace(/\r+/g, " ").replace(/  +/g, " ");
    }

    navigate_to = (url) => {
        let result = false;
        document.querySelectorAll("[nd-link]").forEach((link) => {
            const nd_url = link.getAttribute("nd-url");
            const href = link.getAttribute("href");
            if (href === url || nd_url === url) {
                link.click();
                result = true;
                return;
            }
        });
        this.logger.warn(`navigate_to | Url: '${url}'. Link: ${result ? "found" : "not found"}.`);
        return result;
    };

    as_json = (value) => {
        const cleaned_value = value.replaceAll("\\'", "#####").replaceAll("'", '"').replaceAll("#####", "'");
        return JSON.parse(cleaned_value);
    };
};
