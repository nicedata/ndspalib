const { ND_EVENTS, VERSION } = require("../constants.js");
const { Logger } = require("./logger.js");

exports.Util = class Util {
    static logger = new Logger("Util", true);

    // Source - https://stackoverflow.com/questions/42406520/populate-an-html-form-from-a-formdata-object
    // Source - https://stackoverflow.com/questions/42406520/populate-an-html-form-from-a-formdata-object/79932100#79932100
    static serialize_form(form) {
        const result = [];
        form.querySelectorAll("[name]").forEach((e) => {
            switch (e.type) {
                case "checkbox":
                    result.push(`${e.name}=${e.checked}`);
                    break;
                default:
                    result.push(`${e.name}=${e.value}`);
                    break;
            }
        });
        return result.join("&");
    }

    static deserialize_form(form, serialized_form_data) {
        const entries = new URLSearchParams(serialized_form_data).entries();
        for (const [key, val] of entries) {
            const input = form.elements[key];
            switch (input.type) {
                case "checkbox":
                    input.checked = !val;
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
    static truncate(input, len = 50) {
        if (typeof input !== "string") return input;
        return input.length > len ? `${input.substring(0, len)}...` : input;
    }

    static as_text(element) {
        if (typeof element === "object" && element !== null && element.constructor.name === "HTMLElement") {
            return element.outerHTML.replace("<", "&lt").replace(">", "&gt");
        }
        return "???";
    }

    /**
     *  get_targets - get all elements by a selector, eventually return the element (ifempty) if querySelectorAll returns nothing.
     *
     *  @selector: a string with the selector to query (e.g. '#my-id', '.my-class', 'div > p', etc.). If the string is empty or not a string, an empty array is returned.
     *  @ifempty: an element to return if the querySelectorAll returns nothing. If the selector is empty or not a string, this element is returned (if specified).
     *
     *  @return: an array of elements matching the selector, or an array with the element (ifempty) if querySelectorAll returns nothing.
     */
    static get_targets = (selector, ifempty = null) => {
        // Check selector (must be a string)
        if (typeof selector !== "string") return ifempty ? [ifempty] : [];

        // Cleanup: remove duplicate spaces, split and produce a comma-separated string
        selector = selector.trim().replace(/\s+/g, " ").split(" ").join(",");

        // Get the elements, eventually add the element (ifempty) if querySelectorAll returns nothing
        return selector ? document.querySelectorAll(selector) : ifempty ? [ifempty] : [];
    };

    /**
     *  clear_node - delete a specific node.
     *
     *  @param {*} node - the node to clear.
     *  @return: nothing, the function modifies the node in place.
     */
    static clear_node = (node) => {
        Util.logger.info(`clear_node | node name: '${node.nodeName.toLowerCase()}'`);
        const range = document.createRange();
        range.selectNodeContents(node);
        range.deleteContents();
    };

    /**
     * create_fragment - create a document fragment from HTML code.
     */
    static create_fragment(html) {
        Util.logger.info(`create_fragment | Content: '${html ? this.truncate(html) : ""}'`);
        const range = document.createRange();
        return range.createContextualFragment(html);
    }

    static refresh(fragment) {
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
        document.dispatchEvent(new CustomEvent(ND_EVENTS.REFRESH_AFTER, { detail: { fragment: fragment } }));
    }

    /**
     * insert_fragment - replace or append a fragment in a specific target.
     *
     * @param {*} target - the target element where the fragment will be inserted.
     * @param {*} fragment - the fragment to insert (must be a DocumentFragment).
     * @param {*} append - if true, the fragment will be appended to the target. If false, the target will be cleared before inserting the fragment. Default is false.
     * @param {*} refresh - if true, the 'refresh' method will be called on the target after inserting the fragment. Default is false.
     * @param {*} new_layer - if true, no global refresh will be triggered after inserting the fragment. Default is false.
     *
     * @return: nothing, the function modifies the DOM in place.
     */
    static insert_fragment = (target, fragment, append = false, refresh = false, new_layer = false) => {
        Util.logger.info(`insert_fragment | Target: '${target.tagName.toLowerCase()}'. Mode: ${append ? "append" : "replace"}. Refresh: ${refresh ? "yes" : "no"}.`);

        document.dispatchEvent(new CustomEvent(ND_EVENTS.FRAGMENT_BEFORE_INSERT, { detail: { target: target, fragment: fragment, append: append } }));
        // If append mode is false, clear the node before
        append ? {} : Util.clear_node(target);

        // See : https://www.miragecraft.com/blog/dynamically-insert-inline-script
        target.appendChild(fragment);

        // No global refresh on new layers !
        if (new_layer) return;

        // If refresh mode is true, refresh the node
        refresh ? this.refresh(target) : () => {};

        document.dispatchEvent(new CustomEvent(ND_EVENTS.FRAGMENT_AFTER_INSERT, { detail: { target: target, data: fragment, append: append } }));
    };

    /**
     * sleep_ms - sleep during a specific period (ms).
     */
    static async sleep_ms(ms) {
        Util.logger.info(`sleep_ms | Timeout: ${ms}ms.`);
        await new Promise((resolve) => setTimeout(resolve, ms));
    }

    /**
     * compress - Compress a string (remove duplicate whitechars).
     */
    static compress(str) {
        if (typeof str !== "string") return str;
        Util.logger.info(`compress | String: '${this.truncate(str)}'.`);
        return str.replace(/\n+/g, " ").replace(/\r+/g, " ").replace(/  +/g, " ");
    }

    static navigate_to = async (new_url) => {
        let [method, url] = ["navigate", ""];
        if (new_url.includes("::")) {
            [method, url] = new_url.split("::");
            if (!["get", "post"].includes(method)) {
                Util.logger.error(`Only 'get::' or 'post::' url modifiers are allowed. Supplied method was '${method}:'.`);
                return;
            }
        } else {
            url = new_url;
        }

        // Get or Post...
        if (["get", "post"].includes(method)) {
            Util.logger.info(`Fetching url '${url} with a '${method}' request.`);
            const request = new Request(url, { method: method.toUpperCase() });
            await nd.fetcher.execute_fetch(request);
            return;
        }

        // Navigate
        let result = false;
        document.querySelectorAll("[nd-link]").forEach((link) => {
            const nd_url = link.getAttribute("nd-url");
            const href = link.getAttribute("href");
            if (href === new_url || nd_url === new_url) {
                link.click();
                result = true;
                return;
            }
        });
        Util.logger.warn(`navigate_to | Url: '${new_url}'. Link: ${result ? "found" : "not found"}.`);
        return result;
    };

    static as_json = (value) => {
        const cleaned_value = value.replaceAll("\\'", "#####").replaceAll("'", '"').replaceAll("#####", "'");
        return JSON.parse(cleaned_value);
    };

    action_detail_dict = (arr) => {
        let result = {};
        if (!(arr instanceof Array)) return result;

        let index = 0;
        arr.forEach((arg) => {
            if (arg instanceof Object && arg.length > 0) {
                result["detail"] = arg[0];
            } else {
                result[`arg${index++}`] = arg;
            }
        });
        return result;
    };
};
