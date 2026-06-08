(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // src/server/static/js/constants.js
  var require_constants = __commonJS({
    "src/server/static/js/constants.js"(exports) {
      var INFOS2 = {
        PROGNAME: "NDS SPA utilities",
        VERSION: "1.0.15-dev",
        AUTHOR: "Martin Mohnhaupt <martin.mohnhaupt@etik.com>",
        LICENCE: "MIT License, https://mit-license.org/",
        INSPIREDBY: {
          HTMX: "HTMX : https://htmx.org/",
          UNPOLY: "UNPOLY : https://unpoly.com/"
        }
      };
      exports.INFOS = INFOS2;
      exports.PROGNAME = INFOS2.PROGNAME;
      exports.VERSION = INFOS2.VERSION;
      exports.TARGET_NONE = ":none:";
      exports.ND_EVENTS = {
        // Core events
        POLL_START: "nd:poll:start",
        POLL_END: "nd:poll:end",
        FRAGMENT_BEFORE_INSERT: "nd:fragment:before_insert",
        FRAGMENT_AFTER_INSERT: "nd:fragment:after_insert",
        FETCH_BEFORE: "nd:fetch:before",
        FETCH_AFTER: "nd:fetch:after",
        FETCH_ERROR: "nd:fetch:error",
        REFRESH_AFTER: "nd:refresh:after",
        NAVIGATION: "nd:navigation",
        // Notifications
        ALERT: "nd:dialog:alert",
        TOAST: "nd:dialog:toast",
        CONFIRM: "nd:dialog:confirm",
        ONE_BUTTON_DIALOG: "nd:dialog:one_button",
        TWO_BUTTON_DIALOG: "nd:dialog:two_button",
        THREE_BUTTON_DIALOG: "nd:dialog:three_button",
        CUSTOM_DIALOG: "nd:dialog:custom",
        DOWNLOAD: "nd:download",
        // Others
        REDIRECT: "nd:redirect",
        CONTEXT: "nd:context",
        ENVIRONMENT: "nd:environ",
        TITLE: "nd:title",
        CHANGE: "nd:change",
        FORM_RESET: "nd:form:reset",
        RESET: "nd:reset",
        UPDATE: "nd:update",
        ZONE: "nd:zone"
      };
      exports.NO_CONTEXT = "::none::";
      exports.DIALOG_CONTAINER = "nd-dialog-container";
      exports.NOTIFICATION_CONTAINER = "nd-notification-container";
      exports.TOAST_DELAY_MS = 3e3;
      exports.POLL_DEFAULT_INTERVAL_MS = 1e4;
      exports.STYLING = {
        BOOTSTRAP: {
          CLASSES: {
            ND_NOTIFICATION_CONTAINER: "nd-notification-container",
            ND_DIALOG_CONTAINER: ""
          }
        },
        TAILWIND: {
          CLASSES: {
            ND_NOTIFICATION_CONTAINER: "",
            ND_DIALOG_CONTAINER: ""
          }
        },
        VANILLA: {
          CLASSES: {
            ND_NOTIFICATION_CONTAINER: "",
            ND_DIALOG_CONTAINER: ""
          }
        }
      };
    }
  });

  // src/server/static/js/modules/debug.js
  var require_debug = __commonJS({
    "src/server/static/js/modules/debug.js"(exports) {
      exports.Debug = class Debug2 {
        constructor() {
          if (!!Debug2._instance) {
            return Debug2._instance;
          }
          this.debug = true;
          this.classname = "Debug";
          this.filter_items = [];
          this.filter_override = [];
          Debug2._instance = this;
        }
        enable() {
          this.debug = true;
          console.info(`INFO | ${this.classname} | Debugging is enabled.`);
        }
        disable() {
          this.debug = false;
          console.info(`INFO | ${this.classname} | Debugging is disabled.`);
        }
        is_active() {
          return this.debug;
        }
        ignore = (items) => {
          if (!Array.isArray(items)) {
            console.error(`ERROR | ${this.classname} | Function debug.ignore() requires a list of strings as an argument.`);
            return;
          }
          this.filter_items = items;
          this.filter_items.includes("*") ? this.filter_items = ["*"] : () => {
          };
          if (this.debug)
            console.log(`INFO | Debug | ${this.classname} ignored source(s) :`, this.filter_items.join(", "));
        };
        force = (items) => {
          if (!Array.isArray(items)) {
            console.error(`ERROR | ${this.classname} | Function debug.force() requires a list of strings as an argument.`);
            return;
          }
          this.filter_override = items;
          if (this.debug)
            console.log(`INFO | Debug | ${this.classname} forced source(s) :`, this.filter_override.join(", "));
        };
        is_filtered(source) {
          if (this.filter_override.includes(source))
            return false;
          let result = false;
          this.filter_items.includes("*") ? result = true : this.filter_items.includes(source);
          return result;
        }
      };
    }
  });

  // src/server/static/js/modules/logger.js
  var require_logger = __commonJS({
    "src/server/static/js/modules/logger.js"(exports) {
      var { Debug: Debug2 } = require_debug();
      exports.Logger = class Logger {
        constructor(source, silent = false) {
          const name = "Logger";
          this.source = source;
          this.debug = new Debug2();
          if (!this.debug.is_active())
            return;
          if (this.debug.is_filtered(name))
            return;
          if (!silent)
            console.info(`INFO | ${name} | Creating a logger for ${this.source}`);
        }
        info() {
          if (!this.debug.is_active())
            return;
          if (this.debug.is_filtered(this.source))
            return;
          console.info(`INFO | ${this.source} |`, ...arguments);
        }
        error() {
          console.error(`ERROR | ${this.source} |`, ...arguments);
        }
        warn() {
          console.warn(`WARNING | ${this.source} |`, ...arguments);
        }
      };
    }
  });

  // src/server/static/js/modules/util.js
  var require_util = __commonJS({
    "src/server/static/js/modules/util.js"(exports) {
      var { ND_EVENTS, VERSION } = require_constants();
      var { Logger: Logger2 } = require_logger();
      exports.Util = class Util2 {
        static logger = new Logger2("Util", true);
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
          if (typeof input !== "string")
            return input;
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
          if (typeof selector !== "string")
            return ifempty ? [ifempty] : [];
          selector = selector.trim().replace(/\s+/g, " ").split(" ").join(",");
          return selector ? document.querySelectorAll(selector) : ifempty ? [ifempty] : [];
        };
        /**
         *  clear_node - delete a specific node.
         *
         *  @param {*} node - the node to clear.
         *  @return: nothing, the function modifies the node in place.
         */
        static clear_node = (node) => {
          Util2.logger.info(`clear_node | node name: '${node.nodeName.toLowerCase()}'`);
          const range = document.createRange();
          range.selectNodeContents(node);
          range.deleteContents();
        };
        /**
         * create_fragment - create a document fragment from HTML code.
         */
        static create_fragment(html) {
          Util2.logger.info(`create_fragment | Content: '${html ? this.truncate(html) : ""}'`);
          const range = document.createRange();
          return range.createContextualFragment(html);
        }
        static refresh(fragment) {
          for (const [_2, handler] of Object.entries(nd.handlers)) {
            handler.process(fragment);
          }
          for (const [_2, handler] of Object.entries(nd.handlers)) {
            handler.postprocess();
          }
          const form = fragment.querySelector("form");
          if (form) {
            const first_field = form.querySelector("[autofocus]");
            if (first_field) {
              document.activeElement ? document.activeElement.blur() : () => {
              };
              first_field.focus();
            }
          }
          document.dispatchEvent(new CustomEvent(ND_EVENTS.REFRESH_AFTER, { detail: { fragment } }));
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
          Util2.logger.info(`insert_fragment | Target: '${target.tagName.toLowerCase()}'. Mode: ${append ? "append" : "replace"}. Refresh: ${refresh ? "yes" : "no"}.`);
          document.dispatchEvent(new CustomEvent(ND_EVENTS.FRAGMENT_BEFORE_INSERT, { detail: { target, fragment, append } }));
          append ? {} : Util2.clear_node(target);
          target.appendChild(fragment);
          if (new_layer)
            return;
          refresh ? this.refresh(target) : () => {
          };
          document.dispatchEvent(new CustomEvent(ND_EVENTS.FRAGMENT_AFTER_INSERT, { detail: { target, data: fragment, append } }));
        };
        /**
         * sleep_ms - sleep during a specific period (ms).
         */
        static async sleep_ms(ms) {
          Util2.logger.info(`sleep_ms | Timeout: ${ms}ms.`);
          await new Promise((resolve) => setTimeout(resolve, ms));
        }
        /**
         * compress - Compress a string (remove duplicate whitechars).
         */
        static compress(str) {
          if (typeof str !== "string")
            return str;
          Util2.logger.info(`compress | String: '${this.truncate(str)}'.`);
          return str.replace(/\n+/g, " ").replace(/\r+/g, " ").replace(/  +/g, " ");
        }
        static navigate_to = async (new_url) => {
          let [method, url] = ["navigate", ""];
          if (new_url.includes("::")) {
            [method, url] = new_url.split("::");
            if (!["get", "post"].includes(method)) {
              Util2.logger.error(`Only 'get::' or 'post::' url modifiers are allowed. Supplied method was '${method}:'.`);
              return;
            }
          } else {
            url = new_url;
          }
          if (["get", "post"].includes(method)) {
            Util2.logger.info(`Fetching url '${url} with a '${method}' request.`);
            const request = new Request(url, { method: method.toUpperCase() });
            await nd.fetcher.execute_fetch(request);
            return;
          }
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
          Util2.logger.warn(`navigate_to | Url: '${new_url}'. Link: ${result ? "found" : "not found"}.`);
          return result;
        };
        static as_json = (value) => {
          const cleaned_value = value.replaceAll("\\'", "#####").replaceAll("'", '"').replaceAll("#####", "'");
          return JSON.parse(cleaned_value);
        };
        action_detail_dict = (arr) => {
          let result = {};
          if (!(arr instanceof Array))
            return result;
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
    }
  });

  // src/server/static/js/modules/document_setup.js
  var require_document_setup = __commonJS({
    "src/server/static/js/modules/document_setup.js"(exports) {
      var { Util: Util2 } = require_util();
      var { DIALOG_CONTAINER: DIALOG_CONTAINER2, NOTIFICATION_CONTAINER: NOTIFICATION_CONTAINER2 } = require_constants();
      var ND_STYLES = `
    :root {
        --nd-border-radius: 5px;
        --nd-border-color: lightgray solid 1px;
    }

    [nd-notification-container] {
        position: absolute;
        left: 50%;
        top: 0;
        width: 100%;
        height: 0;
        transform: translate(-50%, 0%);
        margin-top: 0px;
        z-index: 9000;
    }

    .nd-modal {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.1);
        border-radius: var(--nd-border-radius);
        border-color: var(--nd-border-color);
        z-index: 8000;
        cursor: not-allowed;
        display: none;
    }

    .nd-modal-content {
        position: relative;
        left: 50%;
        width: 50%;
        transform: translate(-50%, 0%);

        height: fit-content;
        margin-top: 10px;
        padding: 15px;

        background-color: white;
        border: var(--nd-border-color);
        border-radius: var(--nd-border-radius);
        cursor: auto;
    }

    .nd-notification {
        position: relative;
        margin-bottom: 5px;
        left: 50%;
        width: 60%;
        transform: translate(-50%, 0%);

        margin-top: 5px;

        border: transparent solid 1px;
        border-radius: var(--nd-border-radius);
        padding-right: 10px;
        background-color: white;
        z-index: 10000;
        display: none;
    }

    .nd-close {
        position: relative;
        left: 100%;
        top: -30;
        font-size: x-large;
        display: inline-block;
        line-height: 1;
        cursor: pointer;
    }

    .nd-content {
        margin-top: 10px;
        margin-bottom: 10px;
        margin-right: 10px;
    }

    .nd-header {
        padding-bottom: 3px;
        margin-bottom: 5px;
        border-bottom: var(--nd-border-color);
    }

    .nd-footer {
        padding-top: 10px;
        border-top: var(--nd-border-color);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .nd-toast {
        position: relative;
        margin-bottom: 5px;
        left: 50%;
        width: 30%;
        transform: translate(-50%, 0%);

        margin-top: 5px;

        border: var(--nd-border-color);
        border-radius: var(--nd-border-radius);
        padding-right: 10px;
        background-color: white;
        z-index: 10000;
        display: none;
    }

    .nd-toast-header {
        display: inline-block;
    }

    .nd-toast-content {
        margin-left: 20px;
        padding-top: 10px;
        border-top: var(--nd-border-color);
`.trim().replace(/\s+/g, " ").split(" ").join(" ");
      var containers = `<div ${NOTIFICATION_CONTAINER2}></div><div ${DIALOG_CONTAINER2}></div>`;
      var scripts = ['<script src="https://unpkg.com/html5-qrcode"><\/script>'];
      exports.DocumentSetup = class DocumentSetup {
        static apply = () => {
          const html = `<style id="nd-style">${ND_STYLES}</style>`;
          let fragment = Util2.create_fragment(html);
          document.querySelector("head").lastElementChild.after(fragment);
          scripts.forEach((script) => {
            let fragment2 = Util2.create_fragment(script);
            document.querySelector("head").lastElementChild.before(fragment2);
          });
          fragment = Util2.create_fragment(containers);
          document.querySelector("body").firstElementChild.before(fragment);
        };
      };
    }
  });

  // src/server/static/js/modules/base_handler.js
  var require_base_handler = __commonJS({
    "src/server/static/js/modules/base_handler.js"(exports) {
      var { Logger: Logger2 } = require_logger();
      exports.BaseHandler = class BaseHandler {
        constructor() {
          this.logger = new Logger2(this.constructor.name);
        }
        /**
         * Process a given fragment.
         */
        process(fragment) {
          this.logger.error(`The 'process(fragment)' method is not implemented.`);
        }
        /**
         * Clean the DOM after loading fragments.
         */
        postprocess() {
          this.logger.error(`The 'postprocess(fragment)' method is not implemented.`);
        }
      };
    }
  });

  // src/server/static/js/modules/action.js
  var require_action = __commonJS({
    "src/server/static/js/modules/action.js"(exports) {
      var { Logger: Logger2 } = require_logger();
      var { Util: Util2 } = require_util();
      var ACTION_MODIFIERS = ["before", "after"];
      var ActionDetail = class {
        when = null;
        url = null;
        source = null;
        targets = [];
        str_data = null;
        json_data = null;
      };
      exports.Action = class Action {
        static LOGGER = new Logger2("Action", true);
        constructor(element) {
          this.logger = Action.LOGGER;
          this.code = null;
          this.when = null;
          this.action = null;
          this.details = new ActionDetail();
          const action = element.getAttribute("nd-action");
          if (!action)
            return;
          this.details.source = element;
          const href = element.getAttribute("href");
          const nd_url = element.getAttribute("nd-url");
          this.details.url = href ? href : nd_url ? nd_url : null;
          const selector = element.getAttribute("nd-target");
          this.details.targets = Util2.get_targets(selector);
          if (action.includes("::")) {
            [this.when, this.code] = action.split("::");
            if (!ACTION_MODIFIERS.includes(this.when)) {
              this.logger.error(`Only 'before' and 'after' action modifiers are allowed. Element :`, element);
              return;
            }
          } else {
            this.code = action;
            this.when = "before";
          }
          this.details.when = this.when;
          this.details.url ? {} : this.when = "before";
          this.action = new Function(this.code);
        }
        // Method to set target elements after the action has been created, allowing for dynamic updates to the targets.
        set_targets = (targets) => {
          this.details.targets = targets;
        };
        // Method to execute the action function with the provided data and log the execution.
        excecute = (data = null) => {
          this.logger.info(`Executing ${this.code}, ${this.when} fetch.`);
          this.details.str_data = data;
          try {
            this.details.json_data = JSON.parse(data);
          } catch (error) {
            this.details.json_data = null;
          }
          this.action.call(null, this.details);
        };
      };
    }
  });

  // src/server/static/js/modules/link.js
  var require_link = __commonJS({
    "src/server/static/js/modules/link.js"(exports) {
      var { Logger: Logger2 } = require_logger();
      var { Action } = require_action();
      var { Util: Util2 } = require_util();
      var { ND_EVENTS } = require_constants();
      exports.Link = class Link {
        static LOGGER = new Logger2("Link", true);
        constructor(element) {
          this.logger = Link.LOGGER;
          this.element = element;
          this.url = null;
          this.dialog = null;
          this.action = null;
          this.targets = null;
          this.resets = null;
          const has_href = element.hasAttribute("href");
          const has_nd_url = element.hasAttribute("nd-url");
          const has_action = element.hasAttribute("nd-action");
          const has_reset = element.hasAttribute("nd-reset");
          const has_dialog = element.hasAttribute("nd-dialog");
          const has_confim = element.hasAttribute("nd-confirm");
          let has_errors = false;
          if (has_href && has_nd_url) {
            this.logger.error(`Use 'href' or 'nd-url', not both !`, element);
            has_errors = true;
          }
          if (!(has_href || has_nd_url || has_action || has_reset || has_dialog)) {
            this.logger.error(`No 'nd-url', 'nd-action', 'nd-reset' or 'nd-dialog' is defined on element`, element);
            has_errors = true;
          }
          if (has_errors)
            return;
          this.element.style.cursor = "pointer";
          if (has_href || has_nd_url) {
            const href = element.getAttribute("href");
            this.url = href ? href : element.getAttribute("nd-url");
          }
          this.action = has_action ? new Action(element) : null;
          element.removeAttribute("data-ndtrack");
          if (has_confim) {
            const template_id = element.getAttribute("nd-confirm");
            if (template_id) {
              this.dialog = nd.dialog.get(template_id);
            }
          }
          if (has_dialog) {
            const template_id = element.getAttribute("nd-dialog");
            if (template_id) {
              this.dialog = nd.dialog.get(template_id);
            }
          }
          this.targets = element.getAttribute("nd-target");
          this.resets = element.getAttribute("nd-reset");
          nd.tracker.add_listener(element, "click", this.click_handler);
          this.logger.info(`New Link created (${element.getAttribute("data-ndtrack")}).`);
        }
        click_handler = async (event) => {
          event.preventDefault();
          let do_proceed = true;
          this.dialog ? do_proceed = await this.dialog.run() === "accept" : {};
          if (do_proceed) {
            if (this.action && this.action.when == "before")
              this.action.excecute();
            Util2.get_targets(this.resets).forEach((element) => {
              element.dispatchEvent(new CustomEvent(ND_EVENTS.RESET));
            });
            if (this.url) {
              nd.fetcher.fetch_data(this.url).then((data) => {
                if (data) {
                  Util2.get_targets(this.targets).forEach((t) => {
                    if (t.tagName === "INPUT") {
                      t.value = data;
                    } else {
                      const fragment = Util2.create_fragment(data);
                      Util2.insert_fragment(t, fragment, false, true);
                    }
                  });
                }
                if (this.action && this.action.when == "after")
                  this.action.excecute(data);
              });
            }
          }
        };
        static create_link = (element, url) => {
          element.setAttribute("nd-link", "");
          element.setAttribute("nd-url", url);
          return new Link(element);
        };
        static clear_link = (element) => {
          element.removeAttribute("nd-link");
          element.removeAttribute("nd-url");
          element.removeAttribute("data-ndtrack");
          element.style.cursor = "";
        };
      };
    }
  });

  // src/server/static/js/modules/select.js
  var require_select = __commonJS({
    "src/server/static/js/modules/select.js"(exports) {
      var { ND_EVENTS } = require_constants();
      var { Logger: Logger2 } = require_logger();
      var { Link } = require_link();
      var { Util: Util2 } = require_util();
      exports.Select = class Select {
        constructor(element) {
          this.logger = new Logger2("Select");
          this.select = element;
          this.id = element.id || null;
          this.targets = [];
          this.inform = [];
          if (element.tagName !== "SELECT") {
            this.logger.error(`'nd-select' only applies to 'select' tags. Error element:`, element);
            return;
          }
          this.nd_default = element.getAttribute("nd-default");
          this.nd_default = this.nd_default ? `<option>${this.nd_default}</option>` : null;
          this.nd_default ? element.innerHTML = this.nd_default : () => {
          };
          this.nd_selected = element.getAttribute("nd-selected");
          let selector = element.getAttribute("nd-target");
          let targets = Util2.get_targets(selector);
          targets.forEach((target) => {
            target.hidden = target.hasAttribute("nd-show-for") || target.hasAttribute("nd-hide-for");
            this.logger.info(`Found target '${target.outerHTML}'`);
            this.targets.push(target);
          });
          selector = element.getAttribute("nd-inform");
          targets = Util2.get_targets(selector);
          targets.forEach((target) => {
            if (target.tagName !== "SELECT") {
              this.logger.error(`The 'nd-inform' attribute may reference <select> elements only, not '${target.tagName}' elements.`, target);
            } else {
              this.logger.info(`Found inform target '${target.outerHTML}'`);
              this.inform.push(target);
            }
          });
          nd.tracker.add_listener(element, "change", this._update_targets);
          nd.tracker.add_listener(element, ND_EVENTS.CHANGE, this._on_nd_inform);
          nd.tracker.add_listener(element, ND_EVENTS.RESET, this._reset);
          const nd_options_url = element.getAttribute("nd-url");
          if (nd_options_url) {
            this.logger.info(`Getting select option from url '${nd_options_url}'.`);
            nd.fetcher.fetch_data(nd_options_url).then((data) => {
              const fragment = Util2.create_fragment(data);
              Util2.insert_fragment(element, fragment);
              this._setup();
              return;
            });
          }
          this._setup();
        }
        _reset = (event) => {
          this.select.selectedIndex = 0;
          this._update_targets();
        };
        _setup = () => {
          const nd_selected = this.select.querySelector(`option[value="${this.nd_selected}"]`);
          nd_selected ? this.select.value = nd_selected.value : this.select.selectedIndex = 0;
          this.select.dispatchEvent(new Event("change"));
        };
        _send_event = () => {
          if (!this.inform)
            return;
          const option = this.select.options[this.select.selectedIndex];
          const value = option.getAttribute("value") || null;
          const url = option.getAttribute("nd-url") || null;
          const payload = { source: this.id, value, url };
          this.inform.forEach((e) => {
            e.dispatchEvent(new CustomEvent(ND_EVENTS.CHANGE, { detail: payload }));
          });
        };
        _on_nd_inform = (event) => {
          const detail = event.detail;
          if (!detail.url) {
            Util2.clear_node(this.select);
            if (this.nd_default) {
              const fragment = Util2.create_fragment(this.nd_default);
              Util2.insert_fragment(this.select, fragment, false, true);
            }
            this._update_targets();
          } else {
            nd.fetcher.fetch_data(detail.url).then((data) => {
              data = this.nd_default ? this.nd_default + data : data;
              Util2.clear_node(this.select);
              const fragment = Util2.create_fragment(data);
              Util2.insert_fragment(this.select, fragment, false, true);
              this._update_targets();
            });
          }
        };
        _update_targets = () => {
          if (this.select.selectedIndex < 0)
            return;
          const option = this.select.options[this.select.selectedIndex];
          const value = option.getAttribute("value");
          const link = option.getAttribute("nd-url");
          this.targets.forEach((target) => {
            const nd_show_for = target.getAttribute("nd-show-for");
            const nd_hide_for = target.getAttribute("nd-hide-for");
            const nd_follow = target.hasAttribute("nd-follow");
            const nd_sync = target.hasAttribute("nd-sync");
            const nd_activate = target.hasAttribute("nd-activate");
            if ([nd_follow, nd_sync, nd_activate].filter(Boolean).length > 1) {
              this.logger.error("'nd-sync', 'nd-follow' or 'nd-activate' are mutually exclusive !", target);
              return;
            }
            const nd_url = target.getAttribute("nd-url");
            const has_nd_url = nd_url ? true : false;
            const show_targets = nd_show_for ? nd_show_for.split(" ") : [];
            const hide_targets = nd_hide_for ? nd_hide_for.split(" ") : [];
            if (nd_activate) {
              target.innerHTML = value;
              link ? Link.create_link(target, link) : Link.clear_link(target);
              Util2.refresh(target);
            }
            if (nd_sync) {
              target.hidden != target.hidden;
              if (has_nd_url && value) {
                const url = `${nd_url}/${value}`;
                nd.fetcher.fetch_data(url).then((data) => {
                  const fragment = Util2.create_fragment(data);
                  Util2.insert_fragment(target, fragment);
                });
              } else {
                target.innerText = value ? value : "";
              }
              target.hidden != target.hidden;
            }
            if (nd_follow && link) {
              nd.fetcher.fetch_data(link).then((data) => {
                const fragment = Util2.create_fragment(data);
                Util2.insert_fragment(target, fragment, false, true);
              });
            }
            if (show_targets.includes("*")) {
              target.hidden = value ? false : true;
              show_targets.splice(show_targets.indexOf("*"), 1);
            }
            if (hide_targets.includes("*")) {
              target.hidden = value ? true : false;
              hide_targets.splice(hide_targets.indexOf("*"), 1);
            }
            if (show_targets.length)
              target.hidden = !show_targets.includes(value);
            if (hide_targets.length)
              target.hidden = hide_targets.includes(value);
          });
          this._send_event();
        };
      };
    }
  });

  // src/server/static/js/modules/select_handler.js
  var require_select_handler = __commonJS({
    "src/server/static/js/modules/select_handler.js"(exports) {
      var { BaseHandler } = require_base_handler();
      var { Select } = require_select();
      exports.SelectHandler = class SelectHandler extends BaseHandler {
        constructor() {
          super();
        }
        process(fragment) {
          fragment.querySelectorAll("[nd-select]").forEach((element) => {
            new Select(element);
          });
        }
        postprocess() {
        }
      };
    }
  });

  // src/server/static/js/modules/poll.js
  var require_poll = __commonJS({
    "src/server/static/js/modules/poll.js"(exports) {
      var { POLL_DEFAULT_INTERVAL_MS } = require_constants();
      var { Logger: Logger2 } = require_logger();
      var { Action } = require_action();
      var { Util: Util2 } = require_util();
      var { get_targets } = require_util();
      exports.Poll = class Poll {
        static LOGGER = new Logger2("Poll", true);
        constructor(element) {
          this.logger = Poll.LOGGER;
          this.element = element;
          this.uuid = null;
          this.url = null;
          this.interval_ms = 0;
          this.targets_selector = null;
          this.action = null;
          this.can_poll = false;
          const has_url = element.hasAttribute("href") || element.hasAttribute("nd-url");
          const has_action = element.hasAttribute("nd-action");
          if (!(has_url || has_action)) {
            this.logger.error(`No 'nd-url' or 'nd-action' is defined on element`, element);
            return;
          }
          this.uuid = crypto.randomUUID();
          element.dataset.ndtimer = this.uuid;
          this.logger.info(`Attributed an UUID to element`, element);
          const href = element.getAttribute("href");
          this.url = href ? href : element.getAttribute("nd-url");
          let interval_ms = element.getAttribute("nd-interval");
          if (!interval_ms || isNaN(interval_ms)) {
            interval_ms = POLL_DEFAULT_INTERVAL_MS;
          } else {
            interval_ms = Number(interval_ms);
            interval_ms = interval_ms < 1e3 ? 1e3 : interval_ms;
          }
          this.interval_ms = interval_ms;
          this.targets_selector = element.getAttribute("nd-target");
          this.action = has_action ? new Action(element) : null;
          this.can_poll = true;
        }
        poll = () => {
          if (!this.can_poll) {
            this.logger.info("Element not fully initialized. Poll skipped.");
            return;
          }
          if (document.hidden) {
            this.logger.info("The document is hidden. Poll skipped.");
            return;
          }
          const targets = Util2.get_targets(this.targets_selector, this.element);
          this.action ? this.action.set_targets(targets) : {};
          if (this.action && this.action.when == "before")
            this.action.excecute();
          if (this.url) {
            this.logger.info(`Fetching url '${this.url}'...`);
            nd.fetcher.fetch_data(this.url).then((data) => {
              targets.forEach((t) => {
                if (data) {
                  const fragment = Util2.create_fragment(data);
                  Util2.insert_fragment(t, fragment, false, true);
                } else {
                  this.logger.warn(`Fetching url '${this.url}' returned no data.`, this);
                }
                if (this.action && this.action.when == "after")
                  this.action.excecute(data);
              });
            });
          }
        };
      };
    }
  });

  // src/server/static/js/modules/poll_handler.js
  var require_poll_handler = __commonJS({
    "src/server/static/js/modules/poll_handler.js"(exports) {
      var { BaseHandler } = require_base_handler();
      var { Poll } = require_poll();
      exports.PollHandler = class PollHandler extends BaseHandler {
        constructor() {
          super();
          this.timers = [];
        }
        /**
         * Process a given fragment.
         */
        process = (fragment) => {
          if (document.querySelectorAll("[nd-poll]").length == 0)
            return;
          fragment.querySelectorAll(`[nd-poll]`).forEach((element) => {
            const poller = new Poll(element);
            this.poll(poller);
          });
        };
        /**
         * Clean the DOM (remove unused timers)
         */
        postprocess = () => {
          const timers_to_clear = [];
          this.timers.forEach((timer, index) => {
            if (document.querySelectorAll(`[data-ndtimer="${timer.uuid}"]`).length == 0) {
              clearTimeout(timer.id);
              timers_to_clear.push(timer);
            }
          });
          timers_to_clear.forEach((timer) => {
            const index = this.timers.indexOf(timer);
            this.timers.splice(index, 1);
            this.logger.info(`Cleared and removed timer ${timer.id} for ${timer.uuid}.`);
          });
        };
        /**
         * Polling function
         */
        poll = (poller) => {
          const timeout_id = setTimeout(() => {
            clearTimeout(timeout_id);
            const timer = this.timers.find(({ id, uuid }) => id === timeout_id);
            const timer_index = this.timers.indexOf(timer);
            this.timers.splice(timer_index, 1);
            this.logger.info(`Removed timer ${timer.id} for ${timer.uuid}. Active timers : ${this.timers.length}`);
            poller.poll();
            this.poll(poller);
          }, poller.interval_ms);
          this.timers.push({ id: timeout_id, uuid: poller.uuid });
          this.logger.info(`Added timer ${timeout_id} (${poller.interval_ms}ms) for ${poller.uuid}. Active timers : ${this.timers.length}`);
        };
      };
    }
  });

  // src/server/static/js/modules/source_handler.js
  var require_source_handler = __commonJS({
    "src/server/static/js/modules/source_handler.js"(exports) {
      var { BaseHandler } = require_base_handler();
      var { Logger: Logger2 } = require_logger();
      var { Util: Util2 } = require_util();
      var { ND_EVENTS } = require_constants();
      var Source = class _Source {
        static INIT = "nd-init";
        static SOURCE = "nd-source";
        constructor(element) {
          this.logger = new Logger2("Source");
          this.element = element;
          this.type = null;
          this.url = null;
          if (element.hasAttribute(_Source.INIT) && element.hasAttribute(_Source.SOURCE)) {
            this.logger.error(`'${_Source.INIT}' and '${_Source.SOURCE}' cannot appear on the same element`, element);
            return;
          }
          if (element.hasAttribute(_Source.INIT)) {
            this.url = element.getAttribute(_Source.INIT);
            this.type = _Source.INIT;
          }
          if (element.hasAttribute(_Source.SOURCE)) {
            this.url = element.getAttribute(_Source.SOURCE);
            this.type = _Source.SOURCE;
          }
          typeof this.url === "string" ? this.url = this.url.trim() : {};
          if (!this.url) {
            this.logger.error(`No valid URL defined in '${this.type}' on element`, element);
            element.innerHTML = `<span style="color: red">Error: no valid url defined in '${this.type}' on element &lt;${element.tagName.toLowerCase()}.../"&gt;</span>`;
            return;
          }
          if (this.url === "/") {
            this.logger.error(`The URL in '${this.type}' cannot be the root url (/) !`, this.element);
            return;
          }
          if (this.type === _Source.SOURCE) {
            nd.tracker.add_listener(this.element, ND_EVENTS.RESET, this.refresh);
          }
          this.refresh();
          if (this.type === _Source.INIT) {
            this.element.removeAttribute(_Source.INIT);
          }
        }
        refresh = () => {
          this.logger.info(`${this.type}: Fetching data from '${this.url}'...`);
          nd.fetcher.fetch_data(this.url).then((data) => {
            if (data) {
              const fragment = Util2.create_fragment(data);
              Util2.insert_fragment(this.element, fragment, false, true);
            } else {
              this.logger.error(`Url '${this.url}' returned no data !`);
              this.element.innerHTML = `<span style="color: red">Error: url '${this.url}' returned no data for element ${Util2.as_text(this.element)}</span>`;
            }
          });
        };
      };
      exports.SourceHandler = class SourceHandler extends BaseHandler {
        constructor() {
          super();
        }
        process(fragment) {
          fragment.querySelectorAll(`[nd-init],[nd-source]`).forEach((element) => {
            new Source(element);
          });
        }
        postprocess() {
        }
      };
    }
  });

  // src/server/static/js/modules/version_handler.js
  var require_version_handler = __commonJS({
    "src/server/static/js/modules/version_handler.js"(exports) {
      var { BaseHandler } = require_base_handler();
      exports.VersionHandler = class VersionHandler extends BaseHandler {
        constructor() {
          super();
        }
        /**
         * Process a given fragment.
         */
        process(fragment) {
          if (document.querySelectorAll("[nd-version]").length == 0)
            return;
          fragment.querySelectorAll(`[nd-version]`).forEach((element) => {
            this.logger.info(`Processing element`, element);
            element.textContent = nd.version;
          });
        }
        /**
         * Clean the DOM
         */
        postprocess() {
        }
      };
    }
  });

  // src/server/static/js/modules/link_handler.js
  var require_link_handler = __commonJS({
    "src/server/static/js/modules/link_handler.js"(exports) {
      var { BaseHandler } = require_base_handler();
      var { Link } = require_link();
      exports.LinkHandler = class LinkHandler extends BaseHandler {
        constructor() {
          super();
        }
        /**
         * Process a given fragment.
         */
        process(fragment) {
          if (fragment.querySelectorAll("[nd-link]").length === 0)
            return;
          this.logger.info(`Processing fragment`, fragment);
          fragment.querySelectorAll("[nd-link]").forEach((element) => {
            this.logger.info(`Processing 'nd-link' element`, element);
            new Link(element);
          });
        }
        /**
         * Clean the DOM (remove unused handlers)
         */
        postprocess() {
        }
      };
    }
  });

  // src/server/static/js/components/dialogs.js
  var require_dialogs = __commonJS({
    "src/server/static/js/components/dialogs.js"(exports) {
      var { Logger: Logger2 } = require_logger();
      var { Util: Util2 } = require_util();
      var { TOAST_DELAY_MS, DIALOG_CONTAINER: DIALOG_CONTAINER2 } = require_constants();
      var BaseDialog = class {
        constructor(logger_name, args) {
          this.logger = new Logger2(logger_name);
          this.id = crypto.randomUUID();
          this.args = args;
          this.can_display = void 0;
          this.dialog = null;
          this.html = null;
          this.return_value = null;
        }
        /**
         * Inject the dialog into the DOM tree.
         *
         * This method is called by the show() method to inject the dialog into the DOM tree before displaying it.
         *
         * The inject() method checks if the dialog can be opened by calling the nd.layer.can_open() method with the dialog type.
         * If the dialog can be opened, it is injected into the DOM tree by calling the nd.layer.open() method with the dialog's content, id and type.
         * The inject() method returns a boolean indicating if the dialog was successfully injected into the DOM tree or not.
         *
         * The inject() method is responsible for checking if the dialog can be opened and for injecting it into the DOM tree.
         *
         * @returns {boolean} A boolean indicating if the dialog was successfully injected into the DOM tree or not.
         *
         */
        inject = () => {
          if (nd.layer.can_open(this.args.type)) {
            this.dialog = nd.layer.open({
              content: this.html,
              // The HTML content of the dialog
              id: this.id,
              // The dialog ID (UUID)
              type: this.args.type
              // The dialog type (notification or dialog)
            });
            return true;
          }
          return false;
        };
        /**
         * Show the dialog.
         *
         * This method must be implemented in child classes to display the dialog and add the necessary event listeners to
         * handle the user interactions (button clicks, etc.).
         *
         * The show() method is called by the run() method to display the dialog and wait for an action to occur (button click, etc.)
         * to resolve the promise with the dialog's return value.
         *
         * The return value is set by the show() method when an action is performed (button click, etc.) to resolve the promise returned by the run() method.
         *
         * The return value can be used to perform a redirection or an action based on the user's choice.
         *
         * The dialog's return value can be one of the following:
         * - "accept" : The user accepted the action (clicked the accept button).
         * - "dismiss" : The user dismissed the action (clicked the dismiss button).
         * - "apply" : The user applied the action (clicked the apply button).
         */
        show() {
          this.logger.error("Method show() is not implemented !");
        }
        /**
         * Run the dialog and wait for an action to occur (button click, etc.) to resolve the promise with the dialog's return value.
         * The dialog is displayed by calling the show() method, which must be implemented in child classes.
         *
         * The return value is set by the show() method when an action is performed (button click, etc.) to resolve the promise returned by the run() method.
         *
         * @returns {Promise} A promise that resolves with the dialog's return value when an action is performed (button click, etc.).
         *
         * The return value can be used to perform a redirection or an action based on the user's choice.
         *
         * The dialog's return value can be one of the following:
         * - "accept" : The user accepted the action (clicked the accept button).
         * - "dismiss" : The user dismissed the action (clicked the dismiss button).
         * - "apply" : The user applied the action (clicked the apply button).
         */
        run = () => {
          this.logger.info("Awaiting an action...");
          const dialog = this;
          return new Promise(async (resolve) => {
            dialog.return_value = null;
            dialog.show();
            while (!dialog.return_value) {
              await new Promise((res) => setTimeout(res, 100));
            }
            this.logger.info(`Resolving promise. Result: '${dialog.return_value}'.`);
            resolve(dialog.return_value);
          });
        };
        on_close_handler = () => {
          this.logger.error("Method on_close_handler() is not implemented !");
        };
      };
      exports.ConfirmDialog = class ConfirmDialog extends BaseDialog {
        constructor(args) {
          super("ConfirmDialog", args);
          this.args.type = "dialog";
          this.close_event = `nd:close:${this.id}`;
          this.btn_dismiss = null;
          this.btn_accept = null;
          this.cb_confirm = null;
          const css_class = `nd-modal`;
          const css_style = `width: 30%`;
          const buttons = Util2.compress(`
            <button nd-dismiss class="btn btn-secondary" style="width: 7rem">
                ${this.args.dismiss}
            </button>
            <button nd-accept class="btn btn-secondary" style="width: 7rem" disabled>
                ${this.args.accept}
            </button>`);
          this.html = Util2.compress(`
            <div id="${this.id}" data-nduuid="${this.id}" class="${css_class}" role="document">
                <div class="nd-modal-content" style="${css_style}">
                    <h5 class="nd-header">${this.args.title}</h5>
                    <div>
                        ${this.args.message}
                    </div>
                    <div class="nd-footer">
                        <div class="col-6">
                            <!-- Confirmation checkbox -->
                                <input type="checkbox"><label><i class="bi bi-arrow-left ms-2 me-1"></i>${this.args.confirm}</label>
                        </div>
                        <div class="col-6 text-end">
                            ${buttons}
                        </div>
                    </div>
                </div>
            </div>`);
        }
        // The 'close' event handler
        on_close_handler = (event) => {
          this.logger.info(`Hiding component (${this.return_value})...`);
          this.btn_accept.removeEventListener("click", this.action_handler);
          this.btn_dismiss.removeEventListener("click", this.action_handler);
          this.cb_confirm.removeEventListener("click", this.confirm_cb_handler);
          document.removeEventListener(this.close_event, this.on_close_handler);
          this.dialog.remove();
          let redirect_url = null;
          switch (this.return_value) {
            case "accept":
              redirect_url = this.args.accept_url;
              break;
            case "dismiss":
              redirect_url = this.args.dismiss_url;
              break;
          }
          if (redirect_url) {
            this.logger.info(`Redirecting to '${redirect_url}'`);
            nd.fetcher.redirect(redirect_url);
          }
        };
        action_handler = (event) => {
          switch (event.srcElement) {
            case this.btn_accept:
              this.return_value = "accept";
              break;
            case this.btn_dismiss:
              this.return_value = "dismiss";
              break;
          }
          document.dispatchEvent(new Event(this.close_event));
        };
        // Confirmation checkbox event handler
        confirm_cb_handler = () => {
          if (this.cb_confirm.checked) {
            this.btn_accept.classList.add("btn-danger");
            this.btn_accept.disabled = false;
          } else {
            this.btn_accept.classList.remove("btn-danger");
            this.btn_accept.disabled = true;
          }
        };
        show = () => {
          if (!this.inject())
            return;
          this.logger.info("Showing component");
          this.cb_confirm = this.dialog.querySelector("input");
          this.btn_accept = this.dialog.querySelector("[nd-accept]");
          this.btn_dismiss = this.dialog.querySelector("[nd-dismiss]");
          this.btn_accept.addEventListener("click", this.action_handler);
          this.btn_dismiss.addEventListener("click", this.action_handler);
          this.cb_confirm.addEventListener("click", this.confirm_cb_handler);
          document.addEventListener(`nd:close:${this.id}`, this.on_close_handler);
          this.dialog.style.display = "block";
        };
      };
      exports.OneButtonDialog = class OneButtonDialog extends BaseDialog {
        constructor(args) {
          super("OneButtonDialog", args);
          this.args.type = "dialog";
          this.close_event = `nd:close:${this.id}`;
          this.btn_accept = null;
          const css_class = `nd-modal`;
          const css_style = `width: 30%`;
          const buttons = Util2.compress(`
            <button nd-accept class="btn btn-primary" style="width: 7rem">
                    ${this.args.accept}
            </button>`);
          this.html = Util2.compress(`
                <div nd-dialog id="${this.id}" data-nduuid="${this.id}" class="${css_class}" role="document">
                    <div class="nd-modal-content" style="${css_style}">
                        <h5 class="nd-header">${this.args.title}</h5>
                        <div class="mb-1">${this.args.message}</div>
                        <div class="nd-footer"> ${buttons}</div>
                    </div>
                </div>`);
        }
        // The 'close' event handler
        on_close_handler = (event) => {
          this.logger.info(`Hiding component (${this.return_value})...`);
          this.btn_accept.removeEventListener("click", this.action_handler);
          document.addEventListener(this.close_event, this.on_close_handler);
          this.dialog.remove();
          const redirect_url = this.args.accept_url;
          if (redirect_url) {
            this.logger.info(`Redirecting to '${redirect_url}'`);
            nd.fetcher.redirect(redirect_url);
          }
        };
        action_handler = (event) => {
          switch (event.srcElement) {
            case this.btn_accept:
              this.return_value = "accept";
              break;
          }
          document.dispatchEvent(new Event(this.close_event));
        };
        // Show the dialog
        show() {
          if (!this.inject())
            return;
          this.logger.info("Showing component");
          this.btn_accept = this.dialog.querySelector("[nd-accept]");
          this.btn_accept.addEventListener("click", this.action_handler);
          document.addEventListener(`nd:close:${this.id}`, this.on_close_handler);
          this.dialog.style.display = "block";
        }
      };
      exports.TwoButtonDialog = class TwoButtonDialog extends BaseDialog {
        constructor(args) {
          super("TwoButtonDialog", args);
          this.args.type = "dialog";
          this.close_event = `nd:close:${this.id}`;
          this.btn_dismiss = null;
          this.btn_accept = null;
          const css_class = `nd-modal`;
          const css_style = `width: 30%`;
          const buttons = Util2.compress(`
            <button nd-accept class="btn btn-primary me-2" style="width: 7rem">
                ${this.args.accept}
            </button>
            <button nd-dismiss class="btn btn-danger" style="width: 7rem">
                ${this.args.dismiss}
            </button>`);
          this.html = Util2.compress(`
                <div nd-dialog id="${this.id}" data-nduuid="${this.id}" class="${css_class}" role="document">
                    <div class="nd-modal-content" style="${css_style}">
                        <h5 class="nd-header">${this.args.title}</h5>
                        <div class="mb-1">${this.args.message}</div>
                        <div class="nd-footer"> ${buttons}</div>
                    </div>
                </div>`);
        }
        // The 'close' event handler
        on_close_handler = (event) => {
          this.logger.info(`Hiding component (${this.return_value})...`);
          this.btn_accept.removeEventListener("click", this.action_handler);
          this.btn_dismiss.removeEventListener("click", this.action_handler);
          document.addEventListener(this.close_event, this.on_close_handler);
          this.dialog.remove();
          let redirect_url = null;
          switch (this.return_value) {
            case "accept":
              redirect_url = this.args.accept_url;
              break;
            case "dismiss":
              redirect_url = this.args.dismiss_url;
              break;
          }
          if (redirect_url) {
            this.logger.info(`Redirecting to '${redirect_url}'`);
            nd.fetcher.redirect(redirect_url);
          }
        };
        action_handler = (event) => {
          switch (event.srcElement) {
            case this.btn_accept:
              this.return_value = "accept";
              break;
            case this.btn_dismiss:
              this.return_value = "dismiss";
              break;
          }
          document.dispatchEvent(new Event(this.close_event));
        };
        // Show the dialog
        show() {
          if (!this.inject())
            return;
          this.logger.info("Showing component");
          this.btn_dismiss = this.dialog.querySelector("[nd-dismiss]");
          this.btn_accept = this.dialog.querySelector("[nd-accept]");
          this.btn_accept.addEventListener("click", this.action_handler);
          this.btn_dismiss.addEventListener("click", this.action_handler);
          document.addEventListener(`nd:close:${this.id}`, this.on_close_handler);
          this.dialog.style.display = "block";
        }
      };
      exports.ThreeButtonDialog = class ThreeButtonDialog extends BaseDialog {
        constructor(args) {
          super("ThreeButtonDialog", args);
          this.args.type = "dialog";
          this.close_event = `nd:close:${this.id}`;
          this.btn_apply = null;
          this.btn_dismiss = null;
          this.btn_accept = null;
          const css_class = `nd-modal`;
          const css_style = `width: 30%`;
          const buttons = Util2.compress(`
            <button nd-accept class="btn btn-success me-2" style="width: 7rem">
                ${this.args.accept}
            </button>
            <button nd-apply class="btn btn-secondary me-2" style="width: 7rem">
                ${this.args.apply}
            </button>
            <button nd-dismiss class="btn btn-danger me-2" style="width: 7rem">
                ${this.args.dismiss}
            </button>`);
          this.html = Util2.compress(`
                <div nd-dialog id="${this.id}" data-nduuid="${this.id}" class="${css_class}" role="document">
                    <div class="nd-modal-content" style="${css_style}">
                        <h5 class="nd-header">${this.args.title}</h5>
                        <div class="mb-1">${this.args.message}</div>
                        <div class="nd-footer"> ${buttons}</div>
                    </div>
                </div>`);
        }
        // The 'close' event handler
        on_close_handler = (event) => {
          this.logger.info(`Hiding component (${this.return_value})...`);
          this.btn_accept.removeEventListener("click", this.action_handler);
          this.btn_apply.removeEventListener("click", this.action_handler);
          this.btn_dismiss.removeEventListener("click", this.action_handler);
          document.addEventListener(this.close_event, this.on_close_handler);
          this.dialog.remove();
          let redirect_url = null;
          switch (this.return_value) {
            case "accept":
              redirect_url = this.args.accept_url;
              break;
            case "apply":
              redirect_url = this.args.accept_url;
              break;
            case "dismiss":
              redirect_url = this.args.dismiss_url;
              break;
          }
          if (redirect_url) {
            this.logger.info(`Redirecting to '${redirect_url}'`);
            nd.fetcher.redirect(redirect_url);
          }
        };
        action_handler = (event) => {
          switch (event.srcElement) {
            case this.btn_accept:
              this.return_value = "accept";
              break;
            case this.btn_apply:
              this.return_value = "apply";
              break;
            case this.btn_dismiss:
              this.return_value = "dismiss";
              break;
          }
          document.dispatchEvent(new Event(this.close_event));
        };
        // Show the dialog
        show() {
          if (!this.inject())
            return;
          this.logger.info("Showing component");
          this.btn_apply = this.dialog.querySelector("[nd-apply]");
          this.btn_dismiss = this.dialog.querySelector("[nd-dismiss]");
          this.btn_accept = this.dialog.querySelector("[nd-accept]");
          this.btn_accept.addEventListener("click", this.action_handler);
          this.btn_apply.addEventListener("click", this.action_handler);
          this.btn_dismiss.addEventListener("click", this.action_handler);
          document.addEventListener(`nd:close:${this.id}`, this.on_close_handler);
          this.dialog.style.display = "block";
        }
      };
      exports.CustomDialog = class CustomDialog extends BaseDialog {
        static serializer = new XMLSerializer();
        constructor(args) {
          super("CustomDialog", args);
          this.args.type = "dialog";
          this.close_event = `nd:close:custom`;
          const css_class = `nd-modal`;
          const css_style = `width: ${this.args.width_pc}%`;
          const header = this.args.title ? `<h5 class="nd-header">${this.args.title}</h5>` : "";
          this.html = `
            <div nd-dialog id="${this.id}" data-nduuid="${this.id}" class="${css_class}" role="document">
                <div class="nd-modal-content" style="${css_style}">
                   <div>${header}</div>
                    ${this.args.fragment ? CustomDialog.serializer.serializeToString(this.args.fragment) : "No data ! Check your template ! Press ESC to exit."}
                </div>
            </div>`;
        }
        on_close_handler = (event) => {
          document.removeEventListener(this.close_event, this.on_close_handler);
          document.removeEventListener("keydown", this.esc_key_handler);
          this.dialog.remove();
          nd.tracker.postprocess();
        };
        esc_key_handler = (event) => {
          if (event.key === "Escape") {
            document.dispatchEvent(new CustomEvent(this.close_event));
          }
        };
        show() {
          if (!this.inject())
            return;
          this.logger.info("Showing component", this.dialog);
          const closing_elements = this.dialog.querySelectorAll("[nd-accept], [nd-dismiss]");
          if (closing_elements.length === 0) {
            document.addEventListener("keydown", this.esc_key_handler);
          }
          document.addEventListener(this.close_event, this.on_close_handler);
          this.dialog.style.display = "block";
        }
      };
      exports.Alert = class Alert extends BaseDialog {
        constructor(args) {
          super("Alert", args);
          this.args.type = "notification";
          this.close_btn = null;
          const css_class = `nd-notification bg-${this.args.severity}-subtle`;
          const css_style = `display: inline-block; width: 40%`;
          this.html = Util2.compress(`
            <div nd-notification id="${this.id}" data-nduuid="${this.id}" class="${css_class}" style="${css_style}">
                <div class="nd-content">
                    <span nd-close class="nd-close">&times;</span>
                    ${args.message}
                </div>
            </div>`);
        }
        on_close_handler = (event) => {
          this.logger.info(`Hiding component.`);
          this.close_btn.removeEventListener("click", this.on_close_handler);
          this.dialog.remove();
          const redirect_url = this.args.url;
          if (redirect_url) {
            this.logger.info(`Redirecting to '${redirect_url}'`);
            nd.fetcher.redirect(redirect_url);
          }
        };
        show() {
          if (!this.inject())
            return;
          this.logger.info("Showing component");
          this.close_btn = this.dialog.querySelector("[nd-close]");
          this.close_btn.addEventListener("click", this.on_close_handler);
          this.dialog.style.display = "block";
          setTimeout(() => {
            this.close_btn.click();
          }, TOAST_DELAY_MS);
        }
      };
      exports.Toast = class Toast extends BaseDialog {
        constructor(args) {
          super("Toast", args);
          this.args.type = "notification";
          this.close_btn = null;
          const css_class = "nd-toast";
          const css_style = `width: 30%`;
          this.html = Util2.compress(`
            <div nd-notification id="${this.id}" data-nduuid="${this.id}" class="${css_class}" style="${css_style}" role="alert">
                <div class="nd-content">
                    <span nd-close class="nd-close">&times;</span>
                    <h5 class="nd-toast-header">${this.args.title}</h5>
                    <div class="nd-toast-content">${this.args.message}</div>
                </div>
            </div>`);
        }
        on_close_handler = () => {
          this.logger.info(`Hiding component (${this.dialog.returnValue ? "user dismiss" : "auto dismiss"}).`);
          this.close_btn.removeEventListener("click", this.on_close_handler);
          this.dialog.remove();
          this.dialog.remove();
          const redirect_url = this.args.url;
          if (redirect_url) {
            this.logger.info(`Redirecting to '${redirect_url}'`);
            nd.fetcher.redirect(redirect_url);
          }
        };
        show() {
          if (!this.inject())
            return;
          this.logger.info("Showing component");
          this.close_btn = this.dialog.querySelector("[nd-close]");
          this.close_btn.addEventListener("click", this.on_close_handler);
          this.dialog.style.display = "block";
          setTimeout(() => {
            this.close_btn.click();
          }, TOAST_DELAY_MS);
        }
      };
    }
  });

  // src/server/static/js/components/download.js
  var require_download = __commonJS({
    "src/server/static/js/components/download.js"(exports) {
      var { Logger: Logger2 } = require_logger();
      var { Util: Util2 } = require_util();
      exports.Download = class Download {
        constructor(blob, offset, size, out_filename, mimetype, preview = false) {
          this.logger = new Logger2("Download");
          const blob_slice = blob.slice(offset, offset + size, mimetype);
          this.id = crypto.randomUUID();
          this.href = URL.createObjectURL(blob_slice);
          this.out_filename = out_filename;
          this.preview = preview;
          this.element = null;
          this.html = this.preview ? "" : `<a data-nduuid="${this.id}" style="display: none" href="${this.href}", download="${this.out_filename}"></a>`;
          this.logger.info(this);
        }
        _cleanup = () => {
          this.logger.info("Cleanup", this.element ? this.element : "");
          URL.revokeObjectURL(this.href);
          if (this.element)
            this.element.remove();
        };
        show = () => {
          if (this.preview) {
            this.logger.info("Preview mode !");
            window.open(this.href, "_blank");
            this._cleanup();
            return;
          }
          this.logger.info("Download mode !");
          const fragment = Util2.create_fragment(this.html);
          Util2.insert_fragment(document.body, fragment, true, false);
          this.element = document.querySelector(`[data-nduuid="${this.id}"]`);
          this.element.click();
          setTimeout(() => {
            this._cleanup();
          }, 100);
        };
      };
    }
  });

  // src/server/static/js/modules/event_handler.js
  var require_event_handler = __commonJS({
    "src/server/static/js/modules/event_handler.js"(exports) {
      var { ND_EVENTS } = require_constants();
      var { OneButtonDialog, TwoButtonDialog, ThreeButtonDialog, ConfirmDialog: ConfirmDialog2, Toast: Toast2, Alert: Alert2 } = require_dialogs();
      var { Download } = require_download();
      var { Logger: Logger2 } = require_logger();
      exports.EventHandler = class EventHandler2 {
        constructor() {
          if (!!EventHandler2._instance) {
            return EventHandler2._instance;
          }
          EventHandler2._instance = this;
          this.logger = new Logger2("EventHandler");
          const events = [
            ND_EVENTS.ALERT,
            ND_EVENTS.TOAST,
            ND_EVENTS.CONFIRM,
            ND_EVENTS.ONE_BUTTON_DIALOG,
            ND_EVENTS.TWO_BUTTON_DIALOG,
            ND_EVENTS.THREE_BUTTON_DIALOG,
            ND_EVENTS.CUSTOM_DIALOG,
            ND_EVENTS.DOWNLOAD,
            ND_EVENTS.REDIRECT,
            ND_EVENTS.TITLE
          ];
          events.forEach((event) => {
            this.logger.info(`Adding a listener to handle '${event}' events.`);
            document.addEventListener(event, this._event_handler);
          });
        }
        // Todo : remove
        process(fragment) {
        }
        // Todo : remove
        postprocess() {
        }
        _event_handler = async (event) => {
          this.logger.info(`Event ${event.type}, detail: ${JSON.stringify(event.detail)}.`);
          const detail = event.detail;
          let data = null;
          switch (event.type) {
            case ND_EVENTS.TITLE:
              document.title = detail.title;
              break;
            case ND_EVENTS.ALERT:
              new Alert2(detail).show();
              break;
            case ND_EVENTS.TOAST:
              new Toast2(detail).show();
              break;
            case ND_EVENTS.CONFIRM:
              new ConfirmDialog2(detail).show();
              break;
            case ND_EVENTS.ONE_BUTTON_DIALOG:
              new OneButtonDialog(detail).show();
              break;
            case ND_EVENTS.TWO_BUTTON_DIALOG:
              new TwoButtonDialog(detail).show();
              break;
            case ND_EVENTS.THREE_BUTTON_DIALOG:
              new ThreeButtonDialog(detail).show();
              break;
            case ND_EVENTS.DOWNLOAD:
              new Download(detail.data, detail.offset, detail.size, detail.filename, detail.mimetype, detail.mode === "preview").show();
              break;
          }
        };
      };
    }
  });

  // src/server/static/js/modules/zone_handler.js
  var require_zone_handler = __commonJS({
    "src/server/static/js/modules/zone_handler.js"(exports) {
      var { ND_EVENTS } = require_constants();
      var { Logger: Logger2 } = require_logger();
      var { Util: Util2 } = require_util();
      exports.ZoneHandler = class ZoneHandler2 {
        static LOGGER = new Logger2("ZoneHandler", true);
        constructor() {
          if (!!ZoneHandler2._instance) {
            return ZoneHandler2._instance;
          }
          this.logger = ZoneHandler2.LOGGER;
          this.logger.info(`Adding a listener to handle '${ND_EVENTS.UPDATE}' events.`);
          document.addEventListener(ND_EVENTS.UPDATE, this._update_event_handler);
          this.logger.info(`Adding a listener to handle '${ND_EVENTS.ZONE}' events.`);
          document.addEventListener(ND_EVENTS.ZONE, this._zone_event_handler);
          ZoneHandler2._instance = this;
        }
        // Todo : remove
        process(fragment) {
        }
        // Todo : remove
        postprocess() {
        }
        _set_focus = (zone) => {
          const element = zone.querySelector("[autofocus]");
          if (element) {
            document.activeElement ? document.activeElement.blur() : () => {
            };
            element.focus();
          }
        };
        _update_event_handler = (event) => {
          console.log(event.detail);
          this.logger.info(`Event: ${event.type}. Zone: '${event.detail.id}'. Fields: ${event.detail.fields.length}. Action: '${event.detail.action}'.`);
          const zone_id = event.detail.id;
          const action = event.detail.action;
          const zone_fields = event.detail.fields;
          let root_element = null;
          if (zone_fields.length === 0) {
            this.logger.warn(`Event: ${event.type}. Zone: '${event.detail.id}'. No fields to update.`);
            return;
          }
          if (zone_id === null) {
            this.logger.info(`Event: ${event.type}. No zone specified. Processing whole document body.`);
            root_element = document.querySelector("body");
          }
          if (!root_element) {
            document.querySelectorAll("[nd-zone]").forEach((element) => {
              if (element.id === zone_id) {
                root_element = element;
                return;
              }
            });
          }
          if (!root_element) {
            this.logger.error(`Event: ${event.type}. No nd-zone with id="${zone_id}" found.`);
            return;
          }
          zone_fields.forEach((item) => {
            const target = root_element.querySelector(`[id="${item.key}"]`);
            if (!target) {
              this.logger.error(`No element with id="${item.key}" found.`);
              return;
            }
            const tag_name = target.tagName.toLowerCase();
            this.logger.info(`Event: ${event.type}. Zone: '${zone_id}'. Action: ${action}.  Target: ${tag_name}. Value: '${item.value}'.`);
            switch (tag_name) {
              case "input":
              case "textarea":
                target.value = item.value;
                item.readonly ? target.setAttribute("readonly", "") : target.removeAttribute("readonly");
                break;
              case "select":
                if (item.value.includes("<option")) {
                  const fragment = Util2.create_fragment(item.value);
                  Util2.clear_node(target);
                  Util2.insert_fragment(target, fragment, false, true, false);
                } else
                  target.value = item.value;
                item.readonly ? target.setAttribute("readonly", "") : target.removeAttribute("readonly");
                break;
              default:
                target.innerHTML = item.value;
                break;
            }
          });
        };
        _zone_event_handler = (event) => {
          this.logger.info(`Event: ${event.type}. Zone: '${event.detail.id}'. Html: ${event.detail.html.length} characters. Action: '${event.detail.action}'.`);
          const zone_id = event.detail.id;
          const action = event.detail.action;
          const zone_fields = event.detail.fields;
          const zone_content = event.detail.html.trim();
          let zone = null;
          document.querySelectorAll("[nd-zone]").forEach((element) => {
            if (element.id === zone_id) {
              zone = element;
              return;
            }
          });
          if (!zone) {
            this.logger.error(`Event: ${event.type}. Action: ${action}. Zone with id="${zone_id}" not found.`);
            return;
          }
          switch (action) {
            case "show":
            case "focus":
              zone.hidden = false;
              this._set_focus(zone);
              return;
            case "hide":
              zone.hidden = true;
              return;
            case "clear":
              if (zone.querySelectorAll("form").length === 0) {
                this.logger.error(`Event: ${event.type}. Zone: "${zone_id}". Action: ${action}. No form to clear.`);
                return;
              }
              zone.querySelectorAll("[name]").forEach((element) => {
                element.value = "";
              });
              this._set_focus(zone);
              return;
            case "set":
              if (!zone_content) {
                this.logger.error(`Event: ${event.type}. Zone: "${zone_id}". Action: ${action}. No content to inject.`);
                return;
              }
              Util2.clear_node(zone);
              const fragment = Util2.create_fragment(zone_content);
              Util2.insert_fragment(zone, fragment, false, false, false);
              zone.hidden = false;
              break;
            case "remove":
              zone.hidden = true;
              Util2.clear_node(zone);
              break;
          }
          Util2.refresh(zone);
        };
      };
    }
  });

  // src/server/static/js/modules/context_handler.js
  var require_context_handler = __commonJS({
    "src/server/static/js/modules/context_handler.js"(exports) {
      var { ND_EVENTS, NO_CONTEXT } = require_constants();
      var { Logger: Logger2 } = require_logger();
      var { Util: Util2 } = require_util();
      var Context = class _Context {
        static LOGGER = new Logger2("Context", true);
        static ACTIONS = ["show", "hide", "remove", "reset"];
        constructor(template) {
          this.logger = _Context.LOGGER;
          this.name = template.getAttribute("nd-context");
          this.show_selector = null;
          this.hide_selector = null;
          this.remove_selector = null;
          this.reset_selector = null;
          template.content.querySelectorAll("[name]").forEach((param) => {
            if (!_Context.ACTIONS.includes(param.name)) {
              this.logger.error(`Invalid context action: '${param.name}'. Valid values are: ${_Context.ACTIONS.join(", ")}.`);
              return;
            }
            if (!param.hasAttribute("nd-target")) {
              this.logger.error(`No 'nd-target' attribute found. Element:`, param);
              return;
            }
            const value = param.getAttribute("nd-target");
            switch (param.name) {
              case "show":
                this.show_selector = value;
                break;
              case "hide":
                this.hide_selector = value;
                break;
              case "remove":
                this.remove_selector = value;
                break;
              case "reset":
                this.reset_selector = value;
                break;
            }
          });
          this.logger.info(`Handler for the '${this.name}' context created.`);
        }
        apply = () => {
          this.logger.info(`Applying context '${this.name}'.`);
          Util2.get_targets(this.show_selector).forEach((element) => {
            element.hidden = false;
          });
          Util2.get_targets(this.hide_selector).forEach((element) => {
            element.hidden = true;
          });
          Util2.get_targets(this.remove_selector).forEach((element) => {
            if (element.innerHTML === "")
              return;
            Util2.clear_node(element);
            nd.tracker.postprocess();
          });
          Util2.get_targets(this.reset_selector).forEach((element) => {
            element.dispatchEvent(new CustomEvent(ND_EVENTS.RESET));
          });
        };
      };
      exports.ContextHandler = class ContextHandler2 {
        static LOGGER = new Logger2("ContextHandler", true);
        static CONTEXT_ACTIONS = ["show", "hide", "remove", "reset"];
        constructor() {
          if (!!ContextHandler2._instance) {
            return ContextHandler2._instance;
          }
          ContextHandler2._instance = this;
          this.logger = ContextHandler2.LOGGER;
          this.active_context = NO_CONTEXT;
          this.no_context_handler = null;
          this.handlers = [];
          this.logger.info(`Adding a listener to handle '${ND_EVENTS.CONTEXT}' events.`);
          document.addEventListener(ND_EVENTS.CONTEXT, this._set_context);
        }
        _update_handlers = (fragment) => {
          this.logger.info("Updating handlers.");
          const contexts = fragment.querySelectorAll("[nd-context]");
          if (contexts.length === 0)
            return;
          const index = this.handlers.findIndex((handler) => handler.name === NO_CONTEXT);
          this.handlers.splice(index, 1);
          const names = [];
          contexts.forEach((e) => {
            const tag = e.tagName.toLowerCase();
            const context_name = e.getAttribute("nd-context");
            if (tag !== "template") {
              this.logger.error(`Contexts must be defined within a '<template.../>' tag. Provided : '<${tag}.../>'.`);
              return;
            }
            if (!context_name) {
              this.logger.error(`Contexts must have a name !`, e);
              return;
            }
            if (this.handlers.findIndex((handler) => handler.name === context_name) < 0) {
              this.logger.info(`Creating a handler for the '${context_name}' context.`);
              if (context_name === NO_CONTEXT) {
                this.no_context_handler = new Context(e);
              } else {
                this.handlers.push(new Context(e));
              }
            } else {
              this.logger.info(`The handler for the '${context_name}' context already exists.`);
            }
            names.push(context_name);
          });
          if (!names.includes(NO_CONTEXT)) {
            this.logger.error(`A context for '${NO_CONTEXT}' must be present !`);
          }
          this.handlers.slice().forEach((handler) => {
            if (!names.includes(handler.name)) {
              const index2 = this.handlers.findIndex((h) => h.name === handler.name);
              this.handlers.splice(index2, 1);
              this.logger.info(`The handler for the '${handler.name}' context is no longer needed (cleaned).`);
            }
          });
          this._apply();
          this.logger.info("Updating handlers done.");
        };
        process = (fragment) => {
          this._update_handlers(fragment);
        };
        postprocess = () => {
        };
        _apply = () => {
          this.logger.info(`Applying context '${this.active_context}'.`);
          console.log("C", this.no_context_handler.apply);
          this.no_context_handler.apply ? this.no_context_handler.apply() : {};
          this.handlers.forEach((h) => {
            h.name === this.active_context ? h.apply() : {};
          });
        };
        _set_context = (event) => {
          this.logger.info(`Event: ${event.type}. Context: '${event.detail.context}'. Action: '${event.detail.action}'`);
          const { context, action } = event.detail;
          switch (action) {
            case "set":
              if (this.active_context === context) {
                this.logger.info(`Value '${context}' is already set.`);
                break;
              }
              this.active_context = context;
              break;
            case "clear":
              this.active_context = NO_CONTEXT;
              break;
            default:
              return;
          }
          this._apply();
        };
      };
    }
  });

  // src/server/static/js/modules/environment_handler.js
  var require_environment_handler = __commonJS({
    "src/server/static/js/modules/environment_handler.js"(exports) {
      var { ND_EVENTS } = require_constants();
      var { Logger: Logger2 } = require_logger();
      exports.EnvironmentHandler = class EnvironmentHandler2 {
        static LOGGER = new Logger2("EnvironmentHandler", true);
        constructor() {
          if (!!EnvironmentHandler2._instance) {
            return EnvironmentHandler2._instance;
          }
          this.logger = EnvironmentHandler2.LOGGER;
          EnvironmentHandler2._instance = this;
          this.logger = EnvironmentHandler2.LOGGER;
          this.envs = [];
          this.logger.info(`Adding a listener to handle '${ND_EVENTS.ENVIRONMENT}' events.`);
          document.addEventListener(ND_EVENTS.ENVIRONMENT, this._event_handler);
        }
        _update_document = () => {
          this.logger.info(`Updating document. Environment: ${JSON.stringify(this.envs)}.`);
          document.querySelectorAll("[nd-env]").forEach((e) => {
            const key = e.getAttribute("nd-env");
            if (!key) {
              this.logger.error(`No key specified in element`, e);
              return;
            }
            const result = this.envs.find((env) => env.key === key);
            if (!result)
              return;
            e.innerHTML = result.value;
          });
        };
        // Todo : remove
        process = (fragment) => {
        };
        postprocess = () => {
          this._update_document();
        };
        _event_handler = (event) => {
          this.logger.info(`Event: ${event.type}. Data: '${JSON.stringify(event.detail)}'.`);
          const data = event.detail;
          switch (data.action) {
            case "set":
              const result = this.envs.find((env) => env.key === data.key);
              result ? result.value = data.value : this.envs.push({ key: data.key, value: data.value });
              break;
            case "unset":
              const index = this.envs.findIndex((env) => env.key === data.key);
              index >= 0 ? this.envs.splice(index, 1) : () => {
              };
              break;
            case "clear":
              this.envs = [];
              break;
          }
          this._update_document();
          nd.environment = this.envs;
        };
      };
    }
  });

  // src/server/static/js/modules/handler_tracker.js
  var require_handler_tracker = __commonJS({
    "src/server/static/js/modules/handler_tracker.js"(exports) {
      var { Logger: Logger2 } = require_logger();
      var TrackedItem = class {
        constructor(weakref, trackid, event, handler, use_capture) {
          this.weakref = weakref;
          this.trackid = trackid;
          this.event = event;
          this.handler = handler;
          this.use_capture = use_capture;
        }
      };
      exports.HandlerTracker = class HandlerTracker2 {
        static LOGGER = new Logger2("HandlerTracker", true);
        constructor() {
          if (!!HandlerTracker2._instance) {
            return HandlerTracker2._instance;
          }
          this.logger = HandlerTracker2.LOGGER;
          this.tracked_handlers = [];
          HandlerTracker2._instance = this;
        }
        /**
         * Registers an event listener on an element and keeps track of it.
         * It uses a WeakRef to keep track of the element without preventing it from being garbage collected.
         * The element must have a 'data-ndtrack' attribute to be tracked. If it doesn't have one, it will be generated automatically.
         *
         * @param {Element} element - The element to which the event listener is added.
         * @param {string} event - The event to listen for.
         * @param {function} handler - The event handler function.
         * @param {boolean} use_capture - The use_capture flag for the event listener.
         */
        _register_listener = (element, event, handler, use_capture = false) => {
          const weakref = new WeakRef(element);
          weakref.deref().addEventListener(event, handler, use_capture);
          const tracked_item = new TrackedItem(weakref, element.dataset.ndtrack, event, handler, use_capture);
          this.tracked_handlers.push(tracked_item);
          this.logger.info(`Tracking '${event}' handler on element '${element.tagName.toLowerCase()}' (${element.dataset.ndtrack}). Total handlers: ${this.tracked_handlers.length}.`);
        };
        process(fragment) {
        }
        /**
         * Postprocess method to be called after each DOM update to remove event listeners from elements that are no longer in the DOM.
         * It checks each tracked handler and if the element is no longer in the DOM, it removes the event listener and removes the handler from the tracked list.
         * It also logs the number of handlers removed and kept after the postprocessing.
         */
        postprocess() {
          const tracker_count = this.tracked_handlers.length;
          this.logger.info(`Postprocessing : ${tracker_count} handler(s) to check.`);
          if (this.tracked_handlers.length === 0)
            return;
          let deleted_count = 0;
          this.tracked_handlers.slice().forEach((item) => {
            const uuid = item.trackid;
            const selector = `[data-ndtrack="${uuid}"]`;
            if (document.querySelector(selector))
              return;
            const element = item.weakref.deref();
            if (element) {
              element.removeEventListener(item.event, item.handler, item.use_capture);
              this.logger.info(`Cleaned '${item.event}' handler on '${element.tagName.toLowerCase()}' (${uuid}).`);
            } else {
              this.logger.info(`Element '${uuid}' already went to garbage (GC).`);
            }
            const index = this.tracked_handlers.findIndex(({ trackid }) => trackid === uuid);
            this.tracked_handlers.splice(index, 1);
            deleted_count++;
          });
          this.logger.info(`Postprocessing : ${tracker_count} total handler(s), ${deleted_count} handler(s) removed. ${this.tracked_handlers.length} handlers(s) kept.`);
        }
        /**
         * Adds an event listener to an element and tracks it. It uses the _register_listener method to register the event listener and track it.
         * If the element doesn't have a 'data-ndtrack' attribute, it will be generated automatically.
         *
         * @param {*} element
         * @param {*} event
         * @param {*} handler
         * @param {*} use_capture
         */
        add_listener = (element, event, handler, use_capture = false) => {
          if (!element.hasAttribute("data-ndtrack")) {
            element.dataset.ndtrack = crypto.randomUUID();
          }
          this._register_listener(element, event, handler, use_capture);
        };
      };
    }
  });

  // src/server/static/js/modules/form.js
  var require_form = __commonJS({
    "src/server/static/js/modules/form.js"(exports) {
      var { Logger: Logger2 } = require_logger();
      var { ND_EVENTS } = require_constants();
      var { Util: Util2 } = require_util();
      exports.Form = class Form {
        constructor(form) {
          this.logger = new Logger2("Form");
          this.form = form;
          this.form_str = Util2.serialize_form(this.form);
          this.is_dirty = false;
          this.targets_selector = "";
          this.confirm_dialog = null;
          this.accept_url = null;
          this.dismiss_url = null;
          this.targets_selector = form.getAttribute("nd-target");
          const form_actions = [
            { name: "nd-accept", element: form.querySelector("[nd-accept]"), handler: this.accept, required: true },
            { name: "nd-apply", element: form.querySelector("[nd-apply]"), handler: this.apply, required: false },
            { name: "nd-dismiss", element: form.querySelector("[nd-dismiss]"), handler: this.dismiss, required: false },
            { name: "nd-revert", element: form.querySelector("[nd-revert]"), handler: this.revert, required: false },
            { name: "nd-clear", element: form.querySelector("[nd-clear]"), handler: this.clear, required: false }
          ];
          const template_id = form.getAttribute("nd-confirm");
          if (template_id) {
            this.confirm_dialog = nd.dialog.get(template_id);
          }
          form_actions.forEach((a) => {
            a.required && !a.element ? this.logger.error(`Required element with an '${a.name}' attribute is required !`) : () => {
            };
            a.element ? nd.tracker.add_listener(a.element, "click", a.handler) : () => {
            };
            a.name === "nd-accept" && a.element ? this.accept_url = a.element.getAttribute("nd-url") : () => {
            };
            a.name === "nd-dismiss" && a.element ? this.dismiss_url = a.element.getAttribute("nd-url") : () => {
            };
          });
          form.querySelectorAll("[name]").forEach((field) => {
            nd.tracker.add_listener(field, "change", this.on_change);
          });
          nd.tracker.add_listener(this.form, "submit", this.on_submit);
          nd.tracker.add_listener(this.form, ND_EVENTS.FORM_RESET, this.on_reset_request);
          nd.tracker.add_listener(this.form, ND_EVENTS.RESET, this.on_reset_request);
        }
        close = async (reason) => {
          this.logger.info(`Closing form. Reason: '${reason}.'`);
          switch (reason) {
            case "accept":
              this.accept_url ? await nd.fetcher.fetch_data(this.accept_url) : {};
              break;
            case "dismiss":
              this.dismiss_url ? await nd.fetcher.fetch_data(this.dismiss_url) : {};
              break;
          }
          document.dispatchEvent(new CustomEvent("nd:close:custom"));
        };
        save_state = () => {
          this.logger.info("Saving form state.");
          this.form_str = Util2.serialize_form(this.form);
          this.is_dirty = false;
        };
        on_reset_request = (event) => {
          this.form.reset();
          const first_input = this.form.querySelector("input");
          first_input ? first_input.focus() : () => {
          };
        };
        on_change = () => {
          this.is_dirty = this.form_str !== Util2.serialize_form(this.form);
        };
        on_submit = (event) => {
          event.preventDefault();
        };
        confirm = async () => {
          this.form.setAttribute("novalidate", "");
          const result = this.confirm_dialog ? await this.confirm_dialog.run() === "accept" : true;
          this.form.removeAttribute("novalidate");
          const first_input = this.form.querySelector("input");
          first_input ? first_input.focus() : () => {
          };
          return result;
        };
        accept = async () => {
          if (!this.form.reportValidity())
            return;
          this.logger.info(`Submit: submitting. Form is valid.`);
          const reply = await nd.fetcher.send_form(this.form, "accept");
          this.update_targets(reply);
          this.close("accept");
        };
        update_targets = (reply) => {
          const targets = Util2.get_targets(this.targets_selector);
          if (reply && targets) {
            const fragment = Util2.create_fragment(reply);
            targets.forEach((target) => {
              Util2.clear_node(target);
              Util2.insert_fragment(target, fragment, false, true);
            });
          }
        };
        apply = async () => {
          if (!this.is_dirty) {
            this.logger.info("Apply: no changes.");
            return;
          }
          if (!this.form.reportValidity())
            return;
          this.logger.info(`Apply: submitting. Form is valid.`);
          const reply = await nd.fetcher.send_form(this.form, "apply");
          this.update_targets(reply);
          this.save_state();
        };
        dismiss = async () => {
          this.logger.info("Dismissing, dirty form: ", this.is_dirty);
          let do_proceed = true;
          do_proceed = await this.confirm();
          do_proceed ? this.close("dismiss") : {};
        };
        clear = async () => {
          this.logger.info("Clearing, dirty form: ", this.is_dirty);
          let do_proceed = true;
          if (this.is_dirty)
            do_proceed = await this.confirm();
          do_proceed ? this.form.reset() : {};
        };
        revert = async () => {
          this.logger.info("Revering, dirty form: ", this.is_dirty);
          if (!this.is_dirty) {
            this.logger.info("Revert: no changes.");
            return;
          }
          if (await this.confirm()) {
            this.logger.info("Revert: restoring previous state.");
            Util2.deserialize_form(this.form, this.form_str);
            this.is_dirty = false;
          } else {
            this.logger.info("Revert: action cancelled.");
          }
        };
      };
    }
  });

  // src/server/static/js/modules/form_handler.js
  var require_form_handler = __commonJS({
    "src/server/static/js/modules/form_handler.js"(exports) {
      var { Logger: Logger2 } = require_logger();
      var { Form } = require_form();
      exports.FormHandler = class FormHandler {
        constructor() {
          this.logger = new Logger2("FormHandler");
          this.forms = [];
        }
        /**
         * Process a given fragment.
         */
        process(fragment) {
          fragment.querySelectorAll("[nd-form]").forEach((element) => {
            if (element.tagName !== "FORM") {
              this.logger.error(`The 'nd-form' attribute can only be on a <form> element !`);
              return;
            }
            new Form(element);
            this.logger.info("New form instance created.");
          });
        }
        /**
         * Clean the DOM (remove unused handlers)
         */
        postprocess() {
        }
      };
    }
  });

  // src/server/static/js/modules/fetcher.js
  var require_fetcher = __commonJS({
    "src/server/static/js/modules/fetcher.js"(exports) {
      var { ND_EVENTS, VERSION } = require_constants();
      var { Download } = require_constants();
      var { Logger: Logger2 } = require_logger();
      var { Form } = require_form();
      var { Util: Util2 } = require_util();
      exports.Fetcher = class Fetcher2 {
        static LOGGER = new Logger2("Fetcher", true);
        static METHODS = ["get", "post", "delete", "nav"];
        // Singleton constructor !
        constructor() {
          if (!!Fetcher2._instance) {
            return Fetcher2._instance;
          }
          this.logger = Fetcher2.LOGGER;
          Fetcher2._instance = this;
          this.main_container = null;
          this.events = [];
        }
        set_main_container = (element) => {
          this.logger.info(`The main container is `, element);
          this.main_container = element;
        };
        _process_headers = (headers) => {
          let headers_dump = [];
          headers.forEach((v, k) => {
            headers_dump.push(`'${k}'->'${v}'`);
            const sse = k.toLowerCase();
            switch (sse) {
              case "x-nd-environment":
                const data = JSON.parse(v);
                this.logger.info(`Received server environment '${sse}'. Content: '${v}'.`);
                document.dispatchEvent(new CustomEvent(ND_EVENTS.ENVIRONMENT, { detail: data }));
                break;
              case "x-nd-event":
                this.events = JSON.parse(v);
                this.logger.info(`Received server messages '${sse}'. Content: '${v}'.`);
                break;
              case "x-nd-url":
                break;
            }
          });
          this.logger.info(`Headers : 
${headers_dump.join("\n")}`);
        };
        // Dispatch received events !
        _process_events = (payload) => {
          this.logger.info(`Processing events...`);
          this.events.forEach((event) => {
            this.logger.info(`Event: `, event);
            const type = event.type;
            let target = document;
            if (type === ND_EVENTS.DOWNLOAD)
              event.detail.data = payload;
            if (type === ND_EVENTS.FORM_RESET) {
              const form_id = event.detail.form_id;
              target = document.querySelector(`[data-ndtrack="${form_id}"]`);
            }
            const detail = JSON.stringify(event.detail);
            if (target) {
              this.logger.info(`Dispatching event '${type}'. Detail: '${detail}'.`);
              target.dispatchEvent(new CustomEvent(type, { detail: event.detail }));
            } else {
              this.logger.warn(`No target found for event '${type}'. Detail: '${detail}'.`);
            }
          });
          return payload;
        };
        async execute_fetch(request) {
          const url = request.url;
          this.events = [];
          let status = null;
          let data = null;
          request.headers.append("X-Nd-Version", `"${VERSION}"`);
          request.headers.append("X-Nd-Url", `"${request.url}"`);
          request.headers.append("X-Nd-Environment", `${JSON.stringify(nd.environment)}`);
          document.dispatchEvent(new CustomEvent(ND_EVENTS.FETCH_BEFORE, { detail: { url, data: null, status } }));
          try {
            const response = await fetch(request);
            this.logger.info(`Response status: ${response.status}`);
            if (!response.ok) {
              document.dispatchEvent(new CustomEvent(ND_EVENTS.FETCH_ERROR, { detail: { url, data: null, status: response.status } }));
              this.logger.error(`Response status: ${response.status}`);
              return null;
            }
            this._process_headers(response.headers);
            const payload = await response.blob();
            this.logger.info(`Result is of type '${payload.type}'.`);
            const data2 = await this._process_events(payload).text();
            document.dispatchEvent(new CustomEvent(ND_EVENTS.FETCH_AFTER, { detail: { url, data: data2, status } }));
            return data2;
          } catch (error) {
            document.dispatchEvent(new CustomEvent(ND_EVENTS.FETCH_ERROR, { detail: { url, data: error.message, status } }));
            this.logger.error(`Error on url '${url}':  ${error.message}`);
            return null;
          }
        }
        async send_form(form, operation = "accept") {
          const formdata = new FormData(form);
          formdata.append("nd-form_id", form.dataset.ndtrack);
          formdata.append("nd-form_operation", operation);
          const request = new Request(form.action, {
            method: form.method,
            body: formdata
          });
          return await this.execute_fetch(request);
        }
        async post_form_data(formdata, url) {
          const request = new Request(url, {
            method: "post",
            body: formdata
          });
          return await this.execute_fetch(request);
        }
        _redirect_to = async (url) => {
          if (!url.startsWith("/")) {
            this.logger.error(`Cannot navigate to '${url}'. Only relative URLs are allowed !`);
            return;
          }
          if (url === "/") {
            this.logger.error(`Navigation to '/' is not allowed !`);
            return;
          }
          if (!this.main_container) {
            this.logger.error(`Cannot navigate to '${url}'. No main contais defined !`);
            return;
          }
          const request = new Request(url);
          this.logger.info(`Fetching '${url}' in a 'get' request.`);
          const data = await this.execute_fetch(request);
          if (data) {
            Util2.clear_node(this.main_container);
            const fragment = Util2.create_fragment(data);
            Util2.insert_fragment(this.main_container, fragment, false, true);
          }
          document.dispatchEvent(new CustomEvent(ND_EVENTS.NAVIGATION, { detail: { url, data } }));
        };
        /**
         * fetch_data - fetch data from server as text
         */
        async fetch_data(url) {
          let [_method, _url] = ["get", url];
          if (url.includes("::")) {
            [_method, _url] = url.split("::");
            if (!Fetcher2.METHODS.includes(_method)) {
              this.logger.error(`Only ${Fetcher2.METHODS.join(" or ")} URL modifiers are allowed. Supplied method was '${_method}:'.`);
              return;
            }
          }
          if (_method === "nav") {
            await this._redirect_to(_url);
            return;
          }
          const request = new Request(_url, { method: _method });
          this.logger.info(`Fetching '${_url}' in a '${_method}' request.`);
          return await this.execute_fetch(request);
        }
        redirect = async (url) => {
          if (!url)
            return;
          url.startsWith("nav::") ? () => {
          } : url = "nav::" + url;
          return await this.fetch_data(url);
        };
      };
    }
  });

  // src/server/static/js/modules/notification.js
  var require_notification = __commonJS({
    "src/server/static/js/modules/notification.js"(exports) {
      var { Logger: Logger2 } = require_logger();
      var { Alert: Alert2, Toast: Toast2 } = require_dialogs();
      var MODE = "mode";
      var MODES = ["alert", "toast"];
      var PARAMS_ALERT = [
        { name: "mode", required: true, defaut: null },
        { name: "severity", required: true, default: "primary" },
        { name: "message", required: true, default: "Missing message !" },
        { name: "url", required: false, default: null }
      ];
      var PARAMS_TOAST = [
        { name: "mode", required: true, defaut: null },
        { name: "title", required: true, default: "No title defined !" },
        { name: "message", required: true, default: "Missing message !" },
        { name: "url", required: false, default: null }
      ];
      exports.Notification = class Notification2 {
        static LOGGER = new Logger2("Notification", true);
        constructor() {
          if (!!Notification2._instance) {
            return Notification2._instance;
          }
          this.logger = Notification2.LOGGER;
          Notification2._instance = this;
        }
        get_dict = (template) => {
          const result = {};
          const warnings = [];
          const errors = [];
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
          const template = document.getElementById(template_id);
          if (!template) {
            this.logger.error(`Template with 'id=${template_id}' not found.`);
            return;
          }
          const param_names = [];
          template.content.querySelectorAll("param").forEach((p) => {
            param_names.push(p.name);
          });
          if (!param_names.includes(MODE)) {
            this.logger.error(`Parameter '${MODE}' is missing in template with 'id=${template_id}'.`);
            return;
          }
          const mode = template.content.querySelector('[name="mode"]').value.toLowerCase();
          if (!MODES.includes(mode)) {
            this.logger.error(`Parameter '${MODE}' must be ${MODES.join(" or ")} in template with 'id=${template_id}'.`);
            return;
          }
          const dict = this.get_dict(template);
          switch (dict.mode) {
            case "alert":
              return new Alert2(dict);
            case "toast":
              return new Toast2(dict);
          }
        };
        show = (template_id) => {
          const dialog = this.get(template_id);
          if (dialog)
            dialog.show();
        };
      };
    }
  });

  // src/server/static/js/modules/dialog.js
  var require_dialog = __commonJS({
    "src/server/static/js/modules/dialog.js"(exports) {
      var { Logger: Logger2 } = require_logger();
      var { OneButtonDialog, TwoButtonDialog, ThreeButtonDialog, ConfirmDialog: ConfirmDialog2, CustomDialog } = require_dialogs();
      var MODE = "mode";
      var MODES = ["info", "choice", "options", "secure", "modal"];
      var PARAMS_INFO = [
        { name: "mode", required: true, defaut: null },
        { name: "title", required: true, default: "Missing title !" },
        { name: "message", required: true, default: "Missing message !" },
        { name: "accept", required: true, default: "OK" },
        { name: "accept_url", required: false, default: null }
      ];
      var PARAMS_CHOICE = [
        { name: "mode", required: true, defaut: null },
        { name: "title", required: true, default: "Missing title !" },
        { name: "message", required: true, default: "Missing message !" },
        { name: "accept", required: true, default: "OK" },
        { name: "accept_url", required: false, default: null },
        { name: "dismiss", required: true, default: "Cancel" },
        { name: "dismiss_url", required: false, default: null }
      ];
      var PARAMS_SECURE = [
        { name: "mode", required: true, defaut: null },
        { name: "title", required: true, default: "Missing title !" },
        { name: "message", required: true, default: "Missing message !" },
        { name: "confirm", required: true, default: "Please confirm" },
        { name: "accept", required: true, default: "OK" },
        { name: "accept_url", required: false, default: null },
        { name: "dismiss", required: true, default: "Cancel" },
        { name: "dismiss_url", required: false, default: null }
      ];
      var PARAMS_OPTIONS = [
        { name: "mode", required: true, defaut: null },
        { name: "title", required: true, default: "Missing title !" },
        { name: "message", required: true, default: "Missing message !" },
        { name: "accept", required: true, default: "OK" },
        { name: "accept_url", required: false, default: null },
        { name: "apply", required: true, default: "OK" },
        { name: "apply_url", required: false, default: null },
        { name: "dismiss", required: true, default: "Cancel" },
        { name: "dismiss_url", required: false, default: null }
      ];
      var PARAMS_MODAL = [
        { name: "mode", required: true, defaut: null },
        { name: "title", required: false, default: null },
        { name: "width_pc", required: false, default: "30" }
      ];
      exports.Dialog = class Dialog2 {
        static LOGGER = new Logger2("Dialog", true);
        constructor() {
          if (!!Dialog2._instance) {
            return Dialog2._instance;
          }
          this.logger = Dialog2.LOGGER;
          Dialog2._instance = this;
        }
        get_dict = (template) => {
          const result = {};
          const warnings = [];
          const errors = [];
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
          const template = document.getElementById(template_id);
          if (!template) {
            this.logger.error(`Template with 'id=${template_id}' not found.`);
            return;
          }
          const param_names = [];
          template.content.querySelectorAll("param").forEach((p) => {
            param_names.push(p.name);
          });
          if (!param_names.includes(MODE)) {
            this.logger.error(`Parameter '${MODE}' is missing in template with 'id=${template_id}'.`);
            return;
          }
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
              return new ConfirmDialog2(dict);
            case "modal":
              return new CustomDialog(dict);
          }
          return null;
        };
        show = (dialog_str) => {
          const dialog = this.get(dialog_str);
          if (dialog)
            dialog.show();
        };
      };
    }
  });

  // src/server/static/js/modules/qr_scanner.js
  var require_qr_scanner = __commonJS({
    "src/server/static/js/modules/qr_scanner.js"(exports) {
      exports.QRScanner = class QRScanner {
        constructor(scan_device_id = "", camera_selector = "camera", btn_ok = "scan", btn_close = "close", div_reader = "reader", post_to = "") {
          this.scanner = new Html5Qrcode(div_reader);
          this.close = document.getElementById(btn_close);
          this.camera = document.getElementById(camera_selector);
          this.scan = document.getElementById(btn_ok);
          this.post_to = post_to;
          nd.tracker.add_listener(this.close, "click", this.close_handler);
          nd.tracker.add_listener(this.camera, "change", this.select_change_handler);
          nd.tracker.add_listener(this.scan, "click", this.scan_handler);
          Html5Qrcode.getCameras().then((devices) => {
            devices.forEach((device) => {
              const option = document.createElement("option");
              option.value = device.id;
              option.text = device.label;
              this.camera.add(option);
              if (option.value == scan_device_id) {
                option.selected = true;
                this.scan.disabled = false;
              }
            });
          }).catch((err) => {
            console.log("Error: ", err);
          });
        }
        close_handler = (event) => {
          if (this.scanner.stateManagerProxy.isScanning()) {
            this.scanner.stop().then((ignore) => {
            }).catch((err) => {
            });
          }
          document.dispatchEvent(new CustomEvent("nd:close:custom"));
        };
        select_change_handler = (event) => {
          if (this.scanner.stateManagerProxy.isScanning()) {
            this.scanner.stop().then((ignore) => {
            }).catch((err) => {
            });
          }
          this.scan.disabled = this.camera.value == "";
        };
        scan_handler = (event) => {
          this.do_scan(this.camera.value);
        };
        do_scan = (camera_device_id) => {
          if (!camera_device_id || camera_device_id === "")
            return;
          this.scanner.start(
            camera_device_id,
            { fps: 10, qrbox: 250 },
            async (decodedText, decodedResult) => {
              this.scanner.stop().then((ignore) => {
                const formdata = new FormData();
                formdata.append("scan_device", camera_device_id);
                formdata.append("scan_result", decodedText);
                nd.fetcher.post_form_data(formdata, this.post_to).then((data) => {
                  this.close.click();
                });
              });
            },
            (errorMessage) => {
            }
          ).catch((err) => {
          });
        };
      };
    }
  });

  // src/server/static/js/main.js
  var { INFOS, DIALOG_CONTAINER, NOTIFICATION_CONTAINER } = require_constants();
  var { Debug } = require_debug();
  var { Logger } = require_logger();
  var { DocumentSetup } = require_document_setup();
  var PROG_INFO = `${INFOS.PROGNAME} ${INFOS.VERSION}`;
  var core_logger = new Logger("Core", true);
  core_logger.info(`${PROG_INFO} : initializing...`);
  var { Util } = require_util();
  var { SelectHandler } = require_select_handler();
  var { PollHandler } = require_poll_handler();
  var { SourceHandler } = require_source_handler();
  var { VersionHandler } = require_version_handler();
  var { LinkHandler } = require_link_handler();
  var { EventHandler } = require_event_handler();
  var { ZoneHandler } = require_zone_handler();
  var { ContextHandler } = require_context_handler();
  var { EnvironmentHandler } = require_environment_handler();
  var { HandlerTracker } = require_handler_tracker();
  var { FormHandler } = require_form_handler();
  var { Fetcher } = require_fetcher();
  var { Notification } = require_notification();
  var { Dialog } = require_dialog();
  var { QRScanner } = require_qr_scanner();
  var { Alert, ConfirmDialog, Toast } = require_dialogs();
  if (typeof bootstrap === "undefined")
    throw new Error("Bootstrap library not present !");
  var bs_version = bootstrap.Tooltip.VERSION;
  [bs_major, _, _] = bs_version.split(".");
  if (bs_major < 5)
    throw new Error(`${PROGNAME} needs Bootstrap 5.x.x library. Current Bootstrap version is ${bs_version}.`);
  var nd_init = () => {
    return new Promise((resolve) => {
      const debug = new Debug();
      const nd_core = {
        // Core
        info: INFOS,
        version: PROG_INFO,
        debug,
        util: new Util(),
        fetcher: new Fetcher(),
        QRScanner,
        core_logger,
        // The 'Core' logger
        tracker: new HandlerTracker(),
        notification: new Notification(),
        dialog: new Dialog(),
        dialog_container: null,
        notification_container: null,
        environment: [],
        // Handlers (will be initialized when DOM is loaded)
        handlers: [],
        // Layer
        layer: {
          can_open: (type) => {
            switch (type) {
              case "dialog":
                if (!(nd.dialog_container instanceof HTMLElement)) {
                  core_logger.error(`To display dialogs a '${DIALOG_CONTAINER}' container must be present in the DOM.`);
                  return false;
                }
                return true;
              case "notification":
                if (!(nd.notification_container instanceof HTMLElement)) {
                  core_logger.error(`To display notifications a '${NOTIFICATION_CONTAINER}' container must be present in the DOM.`);
                  return false;
                }
                return true;
            }
            return false;
          },
          open: (args) => {
            const type = args.type;
            const uuid = args.id;
            const fragment = Util.create_fragment(args.content);
            switch (type) {
              case "dialog":
                Util.insert_fragment(nd.dialog_container, fragment, true, true, true);
                break;
              case "notification":
                Util.insert_fragment(nd.notification_container, fragment, true, true, true);
                break;
              default:
                core_logger.error(`Unknown layer type : '${type}'.`);
                return;
            }
            Util.insert_fragment(nd.dialog_container, fragment, true, true, true);
            const new_element = document.querySelector(`[data-nduuid="${uuid}"]`);
            Util.refresh(new_element);
            return new_element;
          }
        },
        create_handlers: () => {
          nd.handlers = [
            new PollHandler(),
            new SourceHandler(),
            new VersionHandler(),
            new LinkHandler(),
            new SelectHandler(),
            new EventHandler(),
            new ContextHandler(),
            new ZoneHandler(),
            new FormHandler(),
            new HandlerTracker(),
            new EnvironmentHandler()
          ];
        },
        on_dom_ready: () => {
          DocumentSetup.apply();
          nd.dialog_container = document.querySelector(`[${DIALOG_CONTAINER}]`);
          nd.notification_container = document.querySelector(`[${NOTIFICATION_CONTAINER}]`);
          const nd_init2 = document.querySelector("[nd-init]");
          if (nd_init2) {
            nd.fetcher.set_main_container(nd_init2);
          } else {
            core_logger.warn(`No 'nd-init' element found in the document !`);
          }
          core_logger.info(`Creating handlers...`);
          nd.create_handlers();
          core_logger.info(`Refreshing the document...`);
          Util.refresh(document);
        }
      };
      resolve(nd_core);
    });
  };
  navigation.addEventListener("navigate", (event) => {
    const url = new URL(event.destination.url);
    const is_download = event.sourceElement.hasAttribute("download");
    if (!is_download) {
      event.preventDefault();
      core_logger.info(`Prevented navigation to '${event.destination.url}'.`);
    }
  });
  document.addEventListener("submit", (event) => {
  });
  var on_dom_loaded = async () => {
    nd.on_dom_ready();
    removeEventListener("DOMContentLoaded", on_dom_loaded);
  };
  nd_init().then((nd_core) => {
    window.nd = nd_core;
    core_logger.info(`${PROG_INFO} : ready !`);
  });
  addEventListener("DOMContentLoaded", on_dom_loaded);
})();
