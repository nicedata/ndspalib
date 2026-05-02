(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // src/server/static/js/constants.js
  var require_constants = __commonJS({
    "src/server/static/js/constants.js"(exports2) {
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
      exports2.INFOS = INFOS2;
      exports2.PROGNAME = INFOS2.PROGNAME;
      exports2.VERSION = INFOS2.VERSION;
      exports2.TARGET_NONE = ":none:";
      exports2.ND_EVENTS = {
        // Core events
        POLL_START: "nd:poll:start",
        POLL_END: "nd:poll:end",
        FRAGMENT_BEFORE_INSERT: "nd:fragment:before_insert",
        FRAGMENT_AFTER_INSERT: "nd:fragment:after_insert",
        FETCH_BEFORE: "nd:fetch:before",
        FETCH_AFTER: "nd:fetch:after",
        FETCH_ERROR: "nd:fetch:error",
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
        ZONE: "nd:zone",
        CONTEXT: "nd:context",
        ENVIRONMENT: "nd:environ",
        TITLE: "nd:title"
      };
      exports2.DIALOG_CONTAINER = "nd-dialog-container";
      exports2.NOTIFICATION_CONTAINER = "nd-notification-container";
      exports2.TOAST_DELAY_MS = 3e3;
      exports2.POLL_DEFAULT_INTERVAL_MS = 1e4;
      exports2.noop = () => {
      };
      exports2.STYLING = {
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
    "src/server/static/js/modules/debug.js"(exports2) {
      exports2.Debug = class Debug2 {
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
    "src/server/static/js/modules/logger.js"(exports2) {
      var { Debug: Debug2 } = require_debug();
      exports2.Logger = class Logger {
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
    "src/server/static/js/modules/util.js"(exports2) {
      var { ND_EVENTS, VERSION } = require_constants();
      var { Logger: Logger3 } = require_logger();
      exports2.Util = class Util2 {
        static LOGGER = new Logger3("Util", true);
        constructor() {
          this.logger = Util2.LOGGER;
        }
        // Source - https://stackoverflow.com/questions/42406520/populate-an-html-form-from-a-formdata-object
        // Source - https://stackoverflow.com/questions/42406520/populate-an-html-form-from-a-formdata-object/79932100#79932100
        serialize_form(form) {
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
        deserialize_form(form, serialized_form_data) {
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
        truncate(input, len = 50) {
          if (typeof input !== "string")
            return input;
          return input.length > len ? `${input.substring(0, len)}...` : input;
        }
        set_uuid(element) {
          const uuid2 = crypto.randomUUID();
          element.dataset.nduuid = uuid2;
          this.logger.info(`set_uuid | Attributed an UUID to element`, Object(element));
          return uuid2;
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
        get_targets(selector2) {
          this.logger.info(`get_targets | selector: '${selector2}'`);
          if (typeof selector2 !== "string" || !selector2)
            return Array(0);
          selector2 = selector2.trim();
          return Array.from(document.querySelectorAll(selector2));
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
        }
        /**
         * insert_fragment - replace or append a fragment in a specific target.
         */
        insert_fragment(target, fragment, append = false, refresh = false, new_layer = false) {
          this.logger.info(`insert_fragment | Target: '${target.tagName.toLowerCase()}'. Mode: ${append ? "append" : "replace"}. Refresh: ${refresh ? "yes" : "no"}.`);
          document.dispatchEvent(new CustomEvent(ND_EVENTS.FRAGMENT_BEFORE_INSERT, { detail: { target, fragment, append } }));
          append ? () => {
          } : this.clear_node(target);
          target.appendChild(fragment);
          if (new_layer)
            return;
          refresh ? this.refresh(target) : () => {
          };
          document.dispatchEvent(new CustomEvent(ND_EVENTS.FRAGMENT_AFTER_INSERT, { detail: { target, data: fragment, append } }));
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
          if (typeof str !== "string")
            return str;
          this.logger.info(`compress | String: '${this.truncate(str)}'.`);
          return str.replace(/\n+/g, " ").replace(/\r+/g, " ").replace(/  +/g, " ");
        }
        navigate_to = async (new_url) => {
          let [method, url] = ["navigate", ""];
          if (new_url.includes(":")) {
            [method, url] = new_url.split(":");
            if (!["get", "post"].includes(method)) {
              this.logger.error(`Only 'get:' or 'post:' url modifiers are allowed. Supplied method was '${method}:'.`);
              return;
            }
          } else {
            url = new_url;
          }
          if (["get", "post"].includes(method)) {
            this.logger.info(`Fetching url '${url} with a '${method}' request.`);
            console.log(`Fetching url '${url} with a '${method}' request'`);
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
          this.logger.warn(`navigate_to | Url: '${new_url}'. Link: ${result ? "found" : "not found"}.`);
          return result;
        };
        as_json = (value) => {
          const cleaned_value = value.replaceAll("\\'", "#####").replaceAll("'", '"').replaceAll("#####", "'");
          return JSON.parse(cleaned_value);
        };
      };
    }
  });

  // src/server/static/js/modules/events.js
  var require_events = __commonJS({
    "src/server/static/js/modules/events.js"(exports2) {
      var { Logger: Logger3 } = require_logger();
      exports2.Events = class Events2 {
        static LOGGER = new Logger3("Events", true);
        constructor() {
          this.logger = Events2.LOGGER;
          this._listeners = [];
        }
        /**
         * Add event listeners
         *
         * Calling forms :
         *    Form 1 :  on(event, listener)
         *    Form 2 :  on(event, selector, listener)
         */
        on(...args) {
          let [event2, selector2, listener] = [null, null, args.pop()];
          switch (args.length) {
            case 1:
              event2 = args.pop();
              this._listeners.push([event2, selector2, listener]);
              document.addEventListener(event2, listener);
              this.logger.info(`Calling function on(), first form. Selector: ${selector2}, event:${event2}, listener:${listener}`);
              break;
            case 2:
              [selector2, event2] = [args.pop(), args.pop()];
              document.querySelectorAll(selector2).forEach((element) => {
                this._listeners.push([event2, element, listener]);
                element.addEventListener(event2, listener);
                this.logger.info(`Calling function on(), second form. Selector: ${selector2}, event:${event2}, listener:${listener}`);
              });
              break;
            default:
          }
        }
        /**
         * Remove event listeners
         *
         * Calling forms :
         *    Form 1 :  off(event)
         *    Form 2 :  off(event, selector)
         */
        off(...args) {
          args.reverse();
          let [event2, selector2, listener] = [args.pop(), null, null];
          switch (args.length) {
            case 0:
              this._listeners.forEach((item, index) => {
                const [event3, element, listener2] = item;
                if (event3 === event3) {
                  this.logger.info(`Calling function off(), first form. Selector: ${selector2}, event:${event3}, listener:${listener2}`);
                  document.removeEventListener(event3, listener2);
                  this._listeners.splice(index, 1);
                }
              });
              break;
            case 1:
              selector2 = args.pop();
              Array.from(document.querySelectorAll(selector2)).forEach((target) => {
                this._listeners.forEach((item, index) => {
                  const [event3, element, listener2] = item;
                  if (event3 === event3 && element === target) {
                    this.logger.info(`Calling function off(), second form. Selector: ${selector2}, event:${event3}, listener:${listener2}`);
                    element.removeEventListener(event3, listener2);
                    this._listeners.splice(index, 1);
                  }
                });
              });
              break;
            default:
              return;
          }
        }
        fire(event2, detail) {
          document.dispatchEvent(new CustomEvent(event2, { detail }));
        }
        /**
         * Remove ALL event listeners
         *
         */
        flush() {
          this._listeners.forEach((item, _2) => {
            const [event2, element, listener] = item;
            element.removeEventListener(event2, listener);
            this.logger.info(`Calling function flush(). Selector: ${selector}, event:${event2}, listener:${listener}`);
          });
          this._listeners = [];
        }
      };
    }
  });

  // src/server/static/js/modules/base_handler.js
  var require_base_handler = __commonJS({
    "src/server/static/js/modules/base_handler.js"(exports2) {
      var { Logger: Logger3 } = require_logger();
      exports2.BaseHandler = class BaseHandler {
        constructor() {
          this.logger = new Logger3(this.constructor.name);
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

  // src/server/static/js/components/dialogs.js
  var require_dialogs = __commonJS({
    "src/server/static/js/components/dialogs.js"(exports2) {
      var { Logger: Logger3 } = require_logger();
      var { TOAST_DELAY_MS, DIALOG_CONTAINER: DIALOG_CONTAINER2 } = require_constants();
      var BaseDialog = class {
        constructor(logger_name, args) {
          this.logger = new Logger3(logger_name);
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
        static create_from_args(args = null) {
          throw new Error("Method create_from_args() is not implemented !");
        }
        escape_key_handler = (event2) => {
          if (event2.key === "Escape") {
            event2.stopImmediatePropagation();
            event2.preventDefault();
          }
        };
        get_redirect_url = () => {
          let redirect_url = null;
          if (this.args.urls) {
            switch (this.dialog.returnValue) {
              case "accept":
                redirect_url = this.args.urls.accept ? this.args.urls.accept : null;
                break;
              case "apply":
                redirect_url = this.args.urls.dismiss ? this.args.urls.dismiss : null;
                break;
              case "dismiss":
                redirect_url = this.args.urls.dismiss ? this.args.urls.dismiss : null;
                break;
              case "":
                redirect_url = this.args.urls.redirect ? this.args.urls.redirect : null;
                break;
            }
          }
          return redirect_url;
        };
        on_close_handler = () => {
          this.logger.error("Method on_close_handler() is not implemented !");
        };
      };
      exports2.ConfirmDialog = class ConfirmDialog3 extends BaseDialog {
        constructor(args) {
          super("ConfirmDialog", args);
          this.args.type = "dialog";
          console.log(args.buttons.find(({ action }) => action === "accept"));
          console.log(args.buttons.find(({ action }) => action === "dismiss"));
          this.close_event = `nd:close:${this.id}`;
          this.btn_dismiss = null;
          this.btn_accept = null;
          this.cb_confirm = null;
          const accept_button_obj = args.buttons.find(({ action }) => action === "accept");
          const dismiss_button_obj = args.buttons.find(({ action }) => action === "dismiss");
          const accept_url = accept_button_obj ? accept_button_obj.url : null;
          const dismiss_url = dismiss_button_obj ? dismiss_button_obj.url : null;
          const css_class = `nd-modal`;
          const css_style = `width: 30%`;
          const buttons = nd.util.compress(`
            <button nd-dismiss class="btn btn-secondary" style="width: 7rem">
                ${dismiss_button_obj ? dismiss_button_obj.label : "???"}
            </button>
            <button nd-accept class="btn btn-secondary" style="width: 7rem" disabled>
                ${accept_button_obj ? accept_button_obj.label : "???"}
            </button>`);
          this.html = nd.util.compress(`
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
        on_close_handler = (event2) => {
          this.logger.info(`Hiding component (${this.return_value})...`);
          this.btn_accept.removeEventListener("click", this.action_handler);
          this.btn_dismiss.removeEventListener("click", this.action_handler);
          this.cb_confirm.removeEventListener("click", this.confirm_cb_handler);
          document.removeEventListener(this.close_event, this.on_close_handler);
          this.dialog.remove();
        };
        action_handler = (event2) => {
          switch (event2.srcElement) {
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
        static create_from_args(args) {
          return new ConfirmDialog3(args);
        }
      };
      exports2.OneButtonDialog = class OneButtonDialog2 extends BaseDialog {
        constructor(args) {
          super("OneButtonDialog", args);
          this.args.type = "dialog";
          this.close_event = `nd:close:${this.id}`;
          this.btn_accept = null;
          const accept_button_obj = args.buttons.find(({ action }) => action === "accept");
          const css_class = `nd-modal`;
          const css_style = `width: 30%`;
          const buttons = nd.util.compress(`
            <button nd-accept class="btn btn-primary" style="width: 7rem">
                    ${accept_button_obj ? accept_button_obj.label : "???"}
            </button>`);
          this.html = nd.util.compress(`
                <div nd-dialog id="${this.id}" data-nduuid="${this.id}" class="${css_class}" role="document">
                    <div class="nd-modal-content" style="${css_style}">
                        <h5 class="nd-header">${this.args.title}</h5>
                        <div class="mb-1">${this.args.message}</div>
                        <div class="nd-footer"> ${buttons}</div>
                    </div>
                </div>`);
        }
        // The 'close' event handler
        on_close_handler = (event2) => {
          this.logger.info(`Hiding component (${this.return_value})...`);
          this.btn_accept.removeEventListener("click", this.action_handler);
          document.addEventListener(this.close_event, this.on_close_handler);
          this.dialog.remove();
        };
        action_handler = (event2) => {
          switch (event2.srcElement) {
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
        static create_from_args(args) {
          return new OneButtonDialog2(args);
        }
      };
      exports2.TwoButtonDialog = class TwoButtonDialog3 extends BaseDialog {
        constructor(args) {
          super("TwoButtonDialog", args);
          this.args.type = "dialog";
          this.close_event = `nd:close:${this.id}`;
          this.btn_dismiss = null;
          this.btn_accept = null;
          const accept_button_obj = args.buttons.find(({ action }) => action === "accept");
          const dismiss_button_obj = args.buttons.find(({ action }) => action === "dismiss");
          const css_class = `nd-modal`;
          const css_style = `width: 30%`;
          const buttons = nd.util.compress(`
            <button nd-accept class="btn btn-primary me-2" style="width: 7rem">
                ${accept_button_obj ? accept_button_obj.label : "???"}
            </button>
            <button nd-dismiss class="btn btn-danger" style="width: 7rem">
                ${dismiss_button_obj ? dismiss_button_obj.label : "???"}
            </button>`);
          this.html = nd.util.compress(`
                <div nd-dialog id="${this.id}" data-nduuid="${this.id}" class="${css_class}" role="document">
                    <div class="nd-modal-content" style="${css_style}">
                        <h5 class="nd-header">${this.args.title}</h5>
                        <div class="mb-1">${this.args.message}</div>
                        <div class="nd-footer"> ${buttons}</div>
                    </div>
                </div>`);
        }
        // The 'close' event handler
        on_close_handler = (event2) => {
          this.logger.info(`Hiding component (${this.return_value})...`);
          this.btn_accept.removeEventListener("click", this.action_handler);
          this.btn_dismiss.removeEventListener("click", this.action_handler);
          document.addEventListener(this.close_event, this.on_close_handler);
          this.dialog.remove();
        };
        action_handler = (event2) => {
          switch (event2.srcElement) {
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
        static create_from_args = (args) => {
          return new TwoButtonDialog3(args);
        };
      };
      exports2.ThreeButtonDialog = class ThreeButtonDialog2 extends BaseDialog {
        constructor(args) {
          super("ThreeButtonDialog", args);
          this.args.type = "dialog";
          console.log(args);
          this.close_event = `nd:close:${this.id}`;
          this.btn_apply = null;
          this.btn_dismiss = null;
          this.btn_accept = null;
          const accept_button_obj = args.buttons.find(({ action }) => action === "accept");
          const apply_button_obj = args.buttons.find(({ action }) => action === "apply");
          const dismiss_button_obj = args.buttons.find(({ action }) => action === "dismiss");
          const css_class = `nd-modal`;
          const css_style = `width: 30%`;
          const buttons = nd.util.compress(`
            <button nd-accept class="btn btn-success me-2" style="width: 7rem">
                ${accept_button_obj ? accept_button_obj.label : "???"}
            </button>
            <button nd-apply class="btn btn-secondary me-2" style="width: 7rem">
                ${apply_button_obj ? apply_button_obj.label : "???"}
            </button>
            <button nd-dismiss class="btn btn-danger me-2" style="width: 7rem">
                ${dismiss_button_obj ? dismiss_button_obj.label : "???"}
            </button>`);
          this.html = nd.util.compress(`
                <div nd-dialog id="${this.id}" data-nduuid="${this.id}" class="${css_class}" role="document">
                    <div class="nd-modal-content" style="${css_style}">
                        <h5 class="nd-header">${this.args.title}</h5>
                        <div class="mb-1">${this.args.message}</div>
                        <div class="nd-footer"> ${buttons}</div>
                    </div>
                </div>`);
        }
        // The 'close' event handler
        on_close_handler = (event2) => {
          this.logger.info(`Hiding component (${this.return_value})...`);
          this.btn_accept.removeEventListener("click", this.action_handler);
          this.btn_apply.removeEventListener("click", this.action_handler);
          this.btn_dismiss.removeEventListener("click", this.action_handler);
          document.addEventListener(this.close_event, this.on_close_handler);
          this.dialog.remove();
        };
        action_handler = (event2) => {
          switch (event2.srcElement) {
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
        static create_from_args(args) {
          return new ThreeButtonDialog2(args);
        }
      };
      exports2.CustomDialog = class CustomDialog2 extends BaseDialog {
        constructor(args) {
          super("CustomDialog", args);
          this.args.type = "dialog";
          console.log(this.args);
          this.close_event = `nd:close:${this.id}`;
          const css_class = `nd-modal`;
          const css_style = `width: ${this.args.width_pc}%`;
          const header = this.args.title ? `<h5 class="nd-header">${this.args.title}</h5>` : "";
          this.html = nd.util.compress(`
            <div nd-dialog id="${this.id}" data-nduuid="${this.id}" class="${css_class}" role="document">
                <div class="nd-modal-content" style="${css_style}">
                   <div>${header}</div>
                    <div>${this.args.html}</div>
                </div>
            </div>`);
        }
        on_close_handler = (event2) => {
          document.removeEventListener(this.close_event, this.on_close_handler);
          this.dialog.remove();
        };
        apply_handler = () => {
        };
        show() {
          if (!this.inject())
            return;
          this.logger.info("Showing component");
          document.addEventListener(this.close_event, this.on_close_handler);
          this.dialog.style.display = "block";
        }
        static create_from_args(args) {
          return new CustomDialog2(args);
        }
      };
      exports2.Alert = class Alert3 extends BaseDialog {
        constructor(args) {
          super("Alert", args);
          this.args.type = "notification";
          this.close_btn = null;
          const css_class = `nd-notification bg-${this.args.severity}-subtle`;
          const css_style = `display: inline-block; width: 40%`;
          this.html = nd.util.compress(`
            <div nd-notification id="${this.id}" data-nduuid="${this.id}" class="${css_class}" style="${css_style}">
                <div class="nd-content">
                    <span nd-close class="nd-close">&times;</span>
                    ${args.message}
                </div>
            </div>`);
        }
        on_close_handler = (event2) => {
          this.logger.info(`Hiding component.`);
          this.close_btn.removeEventListener("click", this.on_close_handler);
          this.dialog.remove();
          const redirect_url = this.args.urls && this.args.urls.redirect ? this.args.urls.redirect : null;
          if (redirect_url) {
            this.logger.info(`Redirecting to '${redirect_url}'`);
            nd.util.navigate_to(redirect_url);
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
        static create_from_args(args) {
          return new Alert3(args);
        }
      };
      exports2.Toast = class Toast3 extends BaseDialog {
        constructor(args) {
          super("Toast", args);
          this.args.type = "notification";
          this.close_btn = null;
          const css_class = "nd-toast";
          const css_style = `width: 30%`;
          this.html = nd.util.compress(`
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
          const redirect_url = this.args.urls && this.args.urls.redirect ? this.args.urls.redirect : null;
          if (redirect_url) {
            this.logger.info(`Redirecting to '${redirect_url}'`);
            nd.util.navigate_to(redirect_url);
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
        static create_from_args(args) {
          return new Toast3(args);
        }
      };
      var { Alert: Alert2, Toast: Toast2, OneButtonDialog, TwoButtonDialog: TwoButtonDialog2, ThreeButtonDialog, ConfirmDialog: ConfirmDialog2, CustomDialog } = require_dialogs();
      exports2.DialogFactory = class DialogFactory2 {
        static LOGGER = new Logger3("DialogFactory", true);
        constructor() {
          if (!!DialogFactory2._instance) {
            return DialogFactory2._instance;
          }
          this.logger = DialogFactory2.LOGGER;
        }
        create(type, args) {
          this.logger.info(`Create a new dialog. Type: '${type}'. Arguments: ${args ? JSON.stringify(args) : "none"}.`);
          switch (type) {
            case "alert":
              return Alert2.create_from_args(args);
            case "toast":
              return Toast2.create_from_args(args);
            case "one-button":
              return OneButtonDialog.create_from_args(args);
            case "two-button":
              return TwoButtonDialog2.create_from_args(args);
            case "three-button":
              return ThreeButtonDialog.create_from_args(args);
            case "confirm":
              return ConfirmDialog2.create_from_args(args);
            case "custom":
              return CustomDialog.create_from_args(args);
          }
          return null;
        }
      };
    }
  });

  // src/server/static/js/modules/link.js
  var require_link = __commonJS({
    "src/server/static/js/modules/link.js"(exports, module) {
      var { Logger } = require_logger();
      var { TwoButtonDialog } = require_dialogs();
      exports.Link = class _Link {
        static LOGGER = new Logger("Link", true);
        constructor(element) {
          this.logger = _Link.LOGGER;
          this.element = element;
          this.url = null;
          this.confirm = null;
          this.action = null;
          this.data = null;
          this.targets = [];
          element.removeAttribute("data-ndtrack");
          const href = element.getAttribute("href");
          this.url = href ? href : element.getAttribute("nd-url");
          this.confirm = element.getAttribute("nd-confirm");
          this.action = element.getAttribute("nd-action");
          this.data = element.getAttribute("nd-data");
          if (!this.url) {
            this.logger.error(`No <nd-url> defined on element`, element);
            return;
          }
          const append = false;
          const selector2 = element.getAttribute("nd-target");
          this.targets = selector2 ? nd.util.get_targets(selector2) : [];
          if (!this.targets.length && selector2 && selector2.toLowerCase() !== TARGET_NONE) {
            this.logger.error(`No <nd-target> defined on element`, element);
          }
          nd.tracker.add_listener(element, "click", this._click_handler);
          this.logger.info(`New Link created (${element.getAttribute("data-ndtrack")}).`);
        }
        _click_handler = async (event) => {
          event.preventDefault();
          let do_proceed = true;
          let request_context = null;
          if (this.data) {
          }
          if (this.confirm) {
            const args = nd.util.as_json(this.confirm);
            do_proceed = await TwoButtonDialog.create_from_args(args).run() === "accept";
          }
          if (do_proceed) {
            this.action ? eval(this.action) : () => {
            };
            nd.fetcher.fetch_data(this.url).then((data) => {
              if (data) {
                this.targets.forEach((t) => {
                  if (t.tagName === "INPUT") {
                    t.value = data;
                  } else {
                    const fragment = nd.util.create_fragment(data);
                    nd.util.insert_fragment(t, fragment, false, true);
                  }
                });
              }
            });
          }
        };
      };
    }
  });

  // src/server/static/js/modules/select.js
  var require_select = __commonJS({
    "src/server/static/js/modules/select.js"(exports2) {
      var { Logger: Logger3 } = require_logger();
      var { Link } = require_link();
      exports2.Select = class Select {
        constructor(element) {
          this.logger = new Logger3("Select");
          this.selector = element;
          this.targets = [];
          const nd_targets = element.getAttribute("nd-target");
          const nd_options_url = element.getAttribute("nd-url");
          if (element.tagName !== "SELECT") {
            this.logger.error(`'nd-select' only apply to 'select' tags. Error element:`, element);
            return;
          }
          const targets = Array();
          if (nd_targets) {
            nd_targets.split(" ").forEach((target) => {
              if (target) {
                this.logger.info(`Processing switch element with class or id '${target}'`);
                document.querySelectorAll(target).forEach((t) => {
                  if (t.hasAttribute("nd-show-for") || t.hasAttribute("nd-hide-for")) {
                    t.hidden = true;
                  }
                  this.logger.info(`Found target identified by '${target}' (class or id) :`, t);
                  this.targets.push(t);
                });
              }
            });
          }
          nd.tracker.add_listener(element, "change", this._update_targets);
          if (nd_options_url) {
            this.logger.info(`Getting select option from url '${nd_options_url}'.`);
            nd.fetcher.fetch_data(nd_options_url).then((data) => {
              const fragment = nd.util.create_fragment(data);
              nd.util.insert_fragment(element, fragment);
              this._setup();
              return;
            });
          }
          this._setup();
        }
        _setup = () => {
          this.selector.selectedIndex = 0;
          this.selector.dispatchEvent(new Event("change"));
        };
        _update_targets = (event2) => {
          if (this.selector.selectedIndex < 0)
            return;
          const option = this.selector.options[this.selector.selectedIndex];
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
              target.setAttribute("nd-link", "");
              target.setAttribute("nd-url", link);
              new Link(target);
              nd.util.refresh(target);
            }
            if (nd_sync) {
              if (has_nd_url && value) {
                const url = `${nd_url}/${value}`;
                nd.fetcher.fetch_data(url).then((data) => {
                  const fragment = nd.util.create_fragment(data);
                  nd.util.insert_fragment(target, fragment);
                });
              } else {
                target.innerText = value ? value : "";
              }
            }
            if (nd_follow && link) {
              nd.fetcher.fetch_data(link).then((data) => {
                const fragment = nd.util.create_fragment(data);
                nd.util.insert_fragment(target, fragment, false, true);
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
        };
      };
    }
  });

  // src/server/static/js/modules/select_handler.js
  var require_select_handler = __commonJS({
    "src/server/static/js/modules/select_handler.js"(exports2) {
      var { BaseHandler } = require_base_handler();
      var { Select } = require_select();
      exports2.SelectHandler = class SelectHandler extends BaseHandler {
        constructor() {
          super();
        }
        process(fragment) {
          if (document.querySelectorAll("[nd-select]").length == 0)
            return;
          fragment.querySelectorAll("[nd-select]").forEach((element) => {
            new Select(element);
          });
        }
        postprocess() {
        }
      };
    }
  });

  // src/server/static/js/modules/poll_handler.js
  var require_poll_handler = __commonJS({
    "src/server/static/js/modules/poll_handler.js"(exports2) {
      var { POLL_DEFAULT_INTERVAL_MS } = require_constants();
      var { BaseHandler } = require_base_handler();
      exports2.PollHandler = class PollHandler extends BaseHandler {
        constructor() {
          super();
          this._timers = [];
        }
        /**
         * Process a given fragment.
         */
        process(fragment) {
          if (document.querySelectorAll("[nd-poll]").length == 0)
            return;
          this._process(fragment);
        }
        /**
         * Clean the DOM (remove unused timers)
         */
        postprocess() {
          const timers_to_clear = [];
          this._timers.forEach((timer, index) => {
            if (document.querySelectorAll(`[data-nduuid="${timer.uuid}"]`).length == 0) {
              clearTimeout(timer.id);
              timers_to_clear.push(timer);
            }
          });
          timers_to_clear.forEach((timer) => {
            const index = this._timers.indexOf(timer);
            this._timers.splice(index, 1);
            this.logger.info(`Cleared and removed timer ${timer.id} for ${timer.uuid}.`);
          });
        }
        /**
         * Process (internal) a given fragment (HTML element)
         */
        _process(fragment) {
          fragment.querySelectorAll(`[nd-poll]`).forEach((element) => {
            const url = element.getAttribute("nd-url");
            const selector2 = element.getAttribute("nd-target");
            const targets = selector2 ? nd.util.get_targets(selector2) : [element];
            let interval_ms = element.getAttribute("nd-interval");
            const uuid2 = nd.util.set_uuid(element);
            if (!url) {
              this.logger.error(`No <nd-url> defined on element`, Object(element));
            }
            if (!interval_ms || isNaN(interval_ms)) {
              interval_ms = POLL_DEFAULT_INTERVAL_MS;
            } else {
              interval_ms = Number(interval_ms);
              interval_ms = interval_ms < 1e3 ? 1e3 : interval_ms;
            }
            if (url)
              this._poll(uuid2, url, targets, interval_ms);
          });
        }
        /**
         * Polling function
         */
        _poll(uuid2, url, targets, interval_ms) {
          const timeout_id = setTimeout(() => {
            clearTimeout(timeout_id);
            const result = this._timers.find(({ id, uuid: uuid3 }) => id === timeout_id);
            const index = this._timers.indexOf(result);
            this._timers.splice(index, 1);
            this.logger.info(`Removed timer ${result.id} for ${result.uuid}. Active timers : ${this._timers.length}`);
            if (!document.hidden) {
              nd.fetcher.fetch_data(url).then((data) => {
                targets.forEach((t) => {
                  const fragment = nd.util.create_fragment(data);
                  nd.util.insert_fragment(t, fragment, false, true);
                });
              });
            }
            this._poll(uuid2, url, targets, interval_ms);
          }, interval_ms);
          this._timers.push({ id: timeout_id, uuid: uuid2 });
          this.logger.info(`Added timer ${timeout_id} (${interval_ms}ms) for ${uuid2}. Active timers : ${this._timers.length}`);
        }
      };
    }
  });

  // src/server/static/js/modules/source_handler.js
  var require_source_handler = __commonJS({
    "src/server/static/js/modules/source_handler.js"(exports2) {
      var { BaseHandler } = require_base_handler();
      exports2.SourceHandler = class SourceHandler extends BaseHandler {
        constructor() {
          super();
        }
        process_init(fragment) {
          if (document.querySelectorAll("[nd-init]").length == 0)
            return;
          fragment.querySelectorAll(`[nd-init]`).forEach((element) => {
            const url = element.getAttribute("nd-init");
            this.logger.info(`Processing element`, element);
            if (url === "/") {
              this.logger.error(`'nd-init' cannot be the root url (/) !`);
              return;
            }
            if (!url) {
              this.logger.error(`No valid url defined in 'nd-init' on element`, Object(element));
              element.innerHTML = `<span style="color: red">Error: no valid url defined in 'nd-init' on element &lt;${element.tagName.toLowerCase()} data-nduuid="${uuid}"&gt;</span>`;
              return;
            }
            this.logger.info(`nd-init: Fetching data from '${url}'...`);
            nd.fetcher.fetch_data(url).then((data) => {
              if (data) {
                const fragment2 = nd.util.create_fragment(data);
                nd.util.insert_fragment(element, fragment2, false, true);
              } else {
                this.logger.error(`Url '${url}' returned no data !`);
                element.innerHTML = `<span style="color: red">Error: url '${url}' returned no data for element ${nd.util.as_text(element)}</span>`;
              }
            });
            element.removeAttribute("nd-init");
          });
        }
        /**
         * Process a given fragment.
         */
        process(fragment) {
          this.process_init(fragment);
          if (document.querySelectorAll("[nd-source]").length == 0)
            return;
          fragment.querySelectorAll(`[nd-source]`).forEach((element) => {
            const url = element.getAttribute("nd-source");
            this.logger.info(`Processing element`, element);
            if (url === "/") {
              this.logger.error(`<nd-source cannot be the root url (/) !`);
              return;
            }
            const uuid2 = nd.util.set_uuid(element);
            if (!url) {
              this.logger.error(`No valid url defined in 'nd-source' on element`, Object(element));
              element.innerHTML = `<span style="color: red">Error: no valid url defined in 'nd-source' on element &lt;${element.tagName.toLowerCase()} data-nduuid="${uuid2}"&gt;</span>`;
              return;
            }
            this.logger.info(`Fetching data from '${url}' for element with uuid '${uuid2}'...`);
            nd.fetcher.fetch_data(url).then((data) => {
              if (data) {
                const fragment2 = nd.util.create_fragment(data);
                nd.util.insert_fragment(element, fragment2, false, true);
              } else {
                this.logger.error(`Url '${url}' returned no data !`);
                element.innerHTML = `<span style="color: red">Error: url '${url}' returned no data for element ${nd.util.as_text(element)}</span>`;
              }
            });
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

  // src/server/static/js/modules/version_handler.js
  var require_version_handler = __commonJS({
    "src/server/static/js/modules/version_handler.js"(exports2) {
      var { BaseHandler } = require_base_handler();
      exports2.VersionHandler = class VersionHandler extends BaseHandler {
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
    "src/server/static/js/modules/link_handler.js"(exports2) {
      var { BaseHandler } = require_base_handler();
      var { Link } = require_link();
      exports2.LinkHandler = class LinkHandler extends BaseHandler {
        constructor() {
          super();
        }
        /**
         * Process a given fragment.
         */
        process(fragment) {
          if (fragment.querySelectorAll("[nd-link]").length == 0)
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

  // src/server/static/js/components/download.js
  var require_download = __commonJS({
    "src/server/static/js/components/download.js"(exports2) {
      var { Logger: Logger3 } = require_logger();
      exports2.Download = class Download {
        constructor(blob, out_filename, preview = false) {
          this.logger = new Logger3("Download");
          this.blob = blob;
          this.id = crypto.randomUUID();
          this.href = URL.createObjectURL(blob);
          this.out_filename = out_filename;
          this.preview = preview;
          this.element = null;
          this.html = this.preview ? "" : nd.util.compress(`<a data-nduuid="${this.id}" style="display: none" href="${this.href}", download="${this.out_filename}"></a>`);
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
          const fragment = nd.util.create_fragment(this.html);
          nd.util.insert_fragment(document.body, fragment, true, false);
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
    "src/server/static/js/modules/event_handler.js"(exports2) {
      var { ND_EVENTS } = require_constants();
      var { OneButtonDialog, TwoButtonDialog: TwoButtonDialog2, ThreeButtonDialog, ConfirmDialog: ConfirmDialog2, Toast: Toast2, Alert: Alert2 } = require_dialogs();
      var { Download } = require_download();
      var { Logger: Logger3 } = require_logger();
      exports2.EventHandler = class EventHandler2 {
        constructor() {
          if (!!EventHandler2._instance) {
            return EventHandler2._instance;
          }
          this.logger = new Logger3("EventHandler");
          const notification_events = [
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
          notification_events.forEach((value) => {
            this.logger.info(`Adding a listener to handle '${value}' events.`);
            document.addEventListener(value, this._event_handler);
          });
          EventHandler2._instance = this;
        }
        // Todo : remove
        process(fragment) {
        }
        // Todo : remove
        postprocess() {
        }
        _event_handler = async (event2) => {
          this.logger.info(`Event received: ${event2.type}.`);
          this.logger.info(`Event detail: ${JSON.stringify(event2.detail)}.`);
          const detail = event2.detail;
          let data = null;
          switch (event2.type) {
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
              new TwoButtonDialog2(detail).show();
              break;
            case ND_EVENTS.THREE_BUTTON_DIALOG:
              new ThreeButtonDialog(detail).show();
              break;
            case ND_EVENTS.DOWNLOAD:
              new Download(detail.data, detail.filename, detail.mode === "preview").show();
              break;
            case ND_EVENTS.REDIRECT:
              this.logger.info(`Redrect | Url: '${detail.urls.redirect}'...`);
              data = await nd.fetcher.fetch_data(detail.urls.redirect);
              this.logger.info(`Redrect | Data: '${nd.util.truncate(data)}.`);
              const target = document.querySelector("main");
              if (target) {
                const fragment = nd.util.create_fragment(data);
                nd.util.insert_fragment(target, fragment, false, true, false);
                nd.util.refresh(target);
              }
              break;
          }
        };
      };
    }
  });

  // src/server/static/js/modules/zone_handler.js
  var require_zone_handler = __commonJS({
    "src/server/static/js/modules/zone_handler.js"(exports2) {
      var { ND_EVENTS } = require_constants();
      var { Logger: Logger3 } = require_logger();
      exports2.ZoneHandler = class ZoneHandler {
        constructor() {
          this.logger = new Logger3("ZoneHandler");
          this.logger.info(`Adding a listener to handle '${ND_EVENTS.ZONE}' events.`);
          document.addEventListener(ND_EVENTS.ZONE, this._event_handler);
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
        _event_handler = (event2) => {
          this.logger.info(`Event: ${event2.type}. Zone: '${event2.detail.name}'. Fields: ${event2.detail.fields.length}. Action: '${event2.detail.action}'.`);
          const zone_name = event2.detail.name;
          const action = event2.detail.action;
          const zone_fields = event2.detail.fields;
          const zone = document.querySelector(`[nd-zone="${zone_name}"]`);
          if (!zone) {
            this.logger.error(`Zone '${zone_name}' not found.`);
            return;
          }
          const has_fields = zone.querySelectorAll(`[nd-zone-field]`).length > 0;
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
              zone.querySelectorAll("[name]").forEach((element) => {
                element.value = "";
              });
              this._set_focus(zone);
              return;
            case "set":
              if (!has_fields) {
                if (zone_fields.length !== 1)
                  this.logger.info(`Zone has no 'nd-zone-field' elements. Using the first item in the list.`);
                nd.util.clear_node(zone);
                zone.innerHTML = zone_fields[0].value;
              } else {
                zone_fields.forEach((item) => {
                  const target = zone.querySelector(`[nd-zone-field="${item.key}"]`);
                  if (!target) {
                    this.logger.error(`No element bears an nd-zone-field="${item.key}" attribute.`);
                    return;
                  }
                  target.innerHTML = item.value;
                });
              }
              zone.hidden = false;
              break;
            case "remove":
              zone.hidden = true;
              nd.util.clear_node(zone);
              break;
          }
          nd.util.refresh(zone);
        };
      };
    }
  });

  // src/server/static/js/modules/context_handler.js
  var require_context_handler = __commonJS({
    "src/server/static/js/modules/context_handler.js"(exports2) {
      var { ND_EVENTS } = require_constants();
      var { Logger: Logger3 } = require_logger();
      exports2.ContextHandler = class ContextHandler2 {
        static LOGGER = new Logger3("ContextHandler", true);
        constructor() {
          this.logger = ContextHandler2.LOGGER;
          this.contexts = [];
          this.logger.info(`Adding a listener to handle '${ND_EVENTS.CONTEXT}' events.`);
          document.addEventListener(ND_EVENTS.CONTEXT, this._event_handler);
        }
        _update_document = () => {
          this.logger.info("Updating document.");
          document.querySelectorAll("[nd-context]").forEach((e) => {
            const attribute = e.getAttribute("nd-context");
            if (!attribute) {
              this.logger.error(`No context specified in element`, e);
              return;
            }
            const [context, action = "show"] = attribute.split(":");
            if (!["show", "hide"].includes(action)) {
              this.logger.error(`Unsupported context action: '${action}. Allowed actions are 'show' or 'hide'.`);
              return;
            }
            switch (action) {
              case "show":
                e.hidden = this.contexts.includes(context) ? false : true;
                break;
              case "hide":
                e.hidden = this.contexts.includes(context) ? true : false;
                break;
            }
          });
        };
        // Todo : remove
        process = (fragment) => {
        };
        postprocess = () => {
          this._update_document();
        };
        _event_handler = (event2) => {
          this.logger.info(`Event: ${event2.type}. Context: '${event2.detail.context}'. Action: '${event2.detail.action}'`);
          const { context, action } = event2.detail;
          switch (action) {
            case "set":
              if (this.contexts.includes(context)) {
                this.logger.info(`Value '${context}' is already present.`);
                return;
              }
              this.contexts.push(context);
              break;
            case "reset":
              if (!this.contexts.includes(context)) {
                this.logger.info(`Value '${context}' is not set.`);
                return;
              }
              const index = this.contexts.indexOf(context);
              index !== -1 ? this.contexts.splice(index, 1) : () => {
              };
              break;
            case "clear":
              this.contexts = [];
              break;
            default:
              return;
          }
          this._update_document();
        };
      };
    }
  });

  // src/server/static/js/modules/environment_handler.js
  var require_environment_handler = __commonJS({
    "src/server/static/js/modules/environment_handler.js"(exports2) {
      var { ND_EVENTS } = require_constants();
      var { Logger: Logger3 } = require_logger();
      exports2.EnvironmentHandler = class EnvironmentHandler2 {
        static LOGGER = new Logger3("EnvironmentHandler", true);
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
        _event_handler = (event2) => {
          this.logger.info(`Event: ${event2.type}. Data: '${JSON.stringify(event2.detail)}'.`);
          const data = event2.detail;
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
    "src/server/static/js/modules/handler_tracker.js"(exports2) {
      var { Logger: Logger3 } = require_logger();
      exports2.HandlerTracker = class HandlerTracker2 {
        static LOGGER = new Logger3("HandlerTracker", true);
        constructor() {
          if (!!HandlerTracker2._instance) {
            return HandlerTracker2._instance;
          }
          this.logger = HandlerTracker2.LOGGER;
          this.handlers = [];
          HandlerTracker2._instance = this;
        }
        _register_listener = (element, event2, handler, use_capture = null) => {
          const weakref = new WeakRef(element);
          use_capture === true ? weakref.deref().addEventListener(event2, handler, use_capture) : weakref.deref().addEventListener(event2, handler);
          const item = {
            weakref,
            trackid: element.dataset.ndtrack,
            event: event2,
            handler,
            use_capture
          };
          this.handlers.push(item);
          this.logger.info(`Tracking '${event2}' handler on element '${element.tagName.toLowerCase()}' (${element.dataset.ndtrack}).`);
        };
        process(fragment) {
        }
        postprocess() {
          this.logger.info(`Postprocessing : ${this.handlers.length} handler(s) to check.`);
          if (this.handlers.length === 0)
            return;
          let deleted_count = 0;
          this.handlers.slice().forEach((tracker) => {
            const uuid2 = tracker.trackid;
            const selector2 = `[data-ndtrack="${uuid2}"]`;
            if (document.querySelector(selector2))
              return;
            const element = tracker.weakref.deref();
            if (element) {
              this.logger.info(`Cleaning '${tracker.event}' handler on '${element.tagName.toLowerCase()}' (${uuid2}).`);
              element.removeEventListener(tracker.event, tracker.handler);
            } else {
              this.logger.info(`Element '${uuid2}' already went to garbage (GC).`);
            }
            const index = this.handlers.findIndex(({ trackid }) => trackid === uuid2);
            this.handlers.splice(index, 1);
            deleted_count++;
          });
          this.logger.info(`Postprocessing : ${deleted_count} handler(s) removed. ${this.handlers.length} handlers(s) kept.`);
        }
        add_listener = (element, event2, handler) => {
          if (!element.hasAttribute("data-ndtrack")) {
            element.dataset.ndtrack = crypto.randomUUID();
          }
          this._register_listener(element, event2, handler);
        };
      };
    }
  });

  // src/server/static/js/modules/form.js
  var require_form = __commonJS({
    "src/server/static/js/modules/form.js"(exports2) {
      var { Logger: Logger3 } = require_logger();
      exports2.Form = class Form {
        static ACTIONS = ["nd-accept", "nd-apply", "nd-dismiss", "nd-revert", "nd-clear"];
        static REQUIRED_ACTIONS = ["nd-accept"];
        constructor(form) {
          this.logger = new Logger3("Form");
          this.form = form;
          this.form_str = nd.util.serialize_form(this.form);
          this.is_dirty = false;
          this.confirm_dialog = null;
          this.accept_url = null;
          this.dismiss_url = null;
          this.event_listeners = [];
          nd.util.set_uuid(this.form);
          this.confirm_dialog = this.get_confirm_dialog(this.form);
          Form.ACTIONS.forEach((action) => {
            const element = form.querySelector(`[${action}]`);
            switch (action) {
              case "nd-accept":
                if (element) {
                  element.addEventListener("click", this.accept);
                  this.event_listeners.push({ element, event: "click", handler: this.accept });
                  this.accept_url = element.getAttribute("nd-url") || null;
                }
                break;
              case "nd-apply":
                if (element) {
                  element.addEventListener("click", this.apply);
                  this.event_listeners.push({ element, event: "click", handler: this.apply });
                }
                break;
              case "nd-dismiss":
                if (element) {
                  element.addEventListener("click", this.dismiss);
                  this.event_listeners.push({ element, event: "click", handler: this.dismiss });
                  this.dismiss_url = element.getAttribute("nd-url") || null;
                }
                break;
              case "nd-revert":
                if (element) {
                  element.addEventListener("click", this.revert);
                  this.event_listeners.push({ element, event: "click", handler: this.revert });
                }
                break;
              case "nd-clear":
                if (element) {
                  element.addEventListener("click", this.clear);
                  this.event_listeners.push({ element, event: "click", handler: this.clear });
                }
                break;
            }
          });
          form.querySelectorAll("[name]").forEach((field) => {
            field.addEventListener("change", this.on_change);
            this.event_listeners.push({ element: field, event: "change", handler: this.on_change });
          });
          this.form.addEventListener("submit", this.on_submit);
          this.event_listeners.push({ element: this.form, event: "submit", handler: this.on_submit });
        }
        get_confirm_dialog = (form) => {
          const nd_confirm = form.querySelector("[nd-confirm]");
          let args = {};
          if (nd_confirm) {
            args.title = nd_confirm.getAttribute("nd-title") || "No title";
            args.message = nd_confirm.getAttribute("nd-message") || "No message";
            if (nd_confirm.querySelector("[nd-button"))
              args.buttons = [];
            nd_confirm.querySelectorAll("[nd-button]").forEach((btn) => {
              const dict = {};
              dict.action = btn.getAttribute("nd-action") || "dismiss";
              dict.label = btn.getAttribute("nd-label") || dict.action;
              dict.url = btn.getAttribute("nd-url") || null;
              args.buttons.push(dict);
            });
          } else {
            args = {
              title: "Approval needed",
              message: "Apply form changes ?",
              buttons: [
                { action: "accept", label: "Yes" },
                { action: "dismiss", label: "No" }
              ]
            };
          }
          return nd.dialog_factory.create("two-button", args);
        };
        close = (reason) => {
          this.logger.info(`Closing form. Reason: '${reason}.'`);
          const nd_dialog = this.form.closest("[nd-dialog]");
          this.logger.info(`Removing attached event listeners (${this.event_listeners.length}).`);
          this.event_listeners.forEach((listener) => {
            listener.element.removeEventListener(listener.event, listener.handler);
          });
          this.form.remove();
          if (nd_dialog) {
            const dialog_id = nd_dialog.id;
            this.logger.info(`Closing the containing dialog (${dialog_id}).`);
            document.dispatchEvent(new Event(`nd:close:${dialog_id}`));
          }
          switch (reason) {
            case "accept":
              this.accept_url ? nd.util.navigate_to(this.accept_url) : () => {
              };
              break;
            case "dismiss":
              this.dismiss_url ? nd.util.navigate_to(this.dismiss_url) : () => {
              };
              break;
          }
        };
        save_state = () => {
          this.logger.info("Saving form state.");
          this.form_str = nd.util.serialize_form(this.form);
          this.is_dirty = false;
        };
        on_change = () => {
          this.is_dirty = this.form_str !== nd.util.serialize_form(this.form);
        };
        on_submit = (event2) => {
          this.logger.info("Submit event !");
          event2.preventDefault();
        };
        confirm = async () => {
          const result = await this.confirm_dialog.run();
          return result === "accept";
        };
        accept = () => {
          if (!this.form.reportValidity())
            return;
          this.logger.info(`Submit: submitting. Form is valid.`);
          nd.fetcher.send_form(this.form);
          this.close("accept");
        };
        apply = () => {
          if (!this.is_dirty) {
            this.logger.info("Apply: no changes.");
            return;
          }
          if (!this.form.reportValidity())
            return;
          this.logger.info(`Apply: submitting. Form is valid.`);
          nd.fetcher.send_form(this.form);
          this.save_state();
        };
        dismiss = async () => {
          this.logger.info("Dismissing, dirty form: ", this.is_dirty);
          let do_proceed2 = true;
          if (this.is_dirty)
            do_proceed2 = await this.confirm();
          do_proceed2 ? this.close("dismiss") : () => {
          };
        };
        clear = async () => {
          this.logger.info("Clearing, dirty form: ", this.is_dirty);
          let do_proceed2 = true;
          if (this.is_dirty)
            do_proceed2 = await this.confirm();
          do_proceed2 ? this.form.reset() : () => {
          };
        };
        revert = async () => {
          this.logger.info("Revering, dirty form: ", this.is_dirty);
          if (!this.is_dirty) {
            this.logger.info("Revert: no changes.");
            return;
          }
          if (await this.confirm()) {
            this.logger.info("Revert: restoring previous state.");
            nd.util.deserialize_form(this.form, this.form_str);
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
    "src/server/static/js/modules/form_handler.js"(exports2) {
      var { Logger: Logger3 } = require_logger();
      var { Form } = require_form();
      exports2.FormHandler = class FormHandler {
        constructor() {
          this.logger = new Logger3("FormHandler");
          this.forms = [];
        }
        /**
         * Process a given fragment.
         */
        process(fragment) {
          if (document.querySelectorAll("[nd-form]").length == 0)
            return;
          fragment.querySelectorAll("[nd-form]").forEach((element) => {
            if (element.tagName !== "FORM") {
              this.logger.error(`The 'nd-form' attribute can only be on a <form> element !`);
              return;
            }
            let ok_count = 0;
            Form.REQUIRED_ACTIONS.forEach((action) => {
              element.querySelector(`[${action}]`) ? ok_count++ : () => {
              };
            });
            if (ok_count !== Form.REQUIRED_ACTIONS.length) {
              this.logger.error(`Please ensure that ${Form.REQUIRED_ACTIONS.join(" and ")} action elements (e. g. <button>, <a>, ...) are set.
  Element:`, element);
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
    "src/server/static/js/modules/fetcher.js"(exports2) {
      var { ND_EVENTS, VERSION } = require_constants();
      var { Download } = require_constants();
      var { Logger: Logger3 } = require_logger();
      exports2.Fetcher = class Fetcher2 {
        static LOGGER = new Logger3("Fetcher", true);
        // Singleton constructor !
        constructor() {
          if (!!Fetcher2._instance) {
            return Fetcher2._instance;
          }
          this.logger = Fetcher2.LOGGER;
          Fetcher2._instance = this;
          this.events = [];
        }
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
                console.log("X-ND-URL", v);
                break;
            }
          });
          this.logger.info(`Headers : 
${headers_dump.join("\n")}`);
        };
        // Dispatch received events !
        _process_events = (payload) => {
          this.logger.info(`Processing events...`);
          this.events.forEach((event2) => {
            this.logger.info(`Event: `, event2);
            const type = event2.type;
            switch (type) {
              case "nd:download":
                event2.detail.data = payload;
                break;
              default:
                break;
            }
            this.logger.info(`Dispatching event '${type}'. Detail: '${JSON.stringify(event2.detail)}'.`);
            document.dispatchEvent(new CustomEvent(type, { detail: event2.detail }));
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
          request.headers.append("X-Nd-Environment", `"${JSON.stringify(nd.environment)}"`);
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
        send_form(form) {
          if (!(form instanceof HTMLFormElement)) {
            this.logger.error("send_form: subitted data is not an HTMLFormElement.");
            return;
          }
          return this.execute_fetch(
            new Request(form.action, {
              method: form.method,
              body: new FormData(form)
            })
          );
        }
        /**
         * fetch_data - fetch data from server as text
         */
        async fetch_data(url) {
          this.logger.info(`fetch_data | Url: '${url}'.`);
          const request = new Request(url);
          return this.execute_fetch(request);
        }
      };
    }
  });

  // src/server/static/js/main.js
  var { INFOS, DIALOG_CONTAINER, NOTIFICATION_CONTAINER } = require_constants();
  var { Debug } = require_debug();
  var { Logger: Logger2 } = require_logger();
  var PROG_INFO = `${INFOS.PROGNAME} ${INFOS.VERSION}`;
  var core_logger = new Logger2("Core", true);
  core_logger.info(`${PROG_INFO} : initializing...`);
  var { Util } = require_util();
  var { Events } = require_events();
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
  var { Alert, DialogFactory, ConfirmDialog, Toast } = require_dialogs();
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
        events: new Events(),
        fetcher: new Fetcher(),
        core_logger,
        // The 'Core' logger
        dialog_factory: new DialogFactory(),
        tracker: new HandlerTracker(),
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
            const uuid2 = args.id;
            const fragment = nd.util.create_fragment(args.content);
            switch (type) {
              case "dialog":
                nd.util.insert_fragment(nd.dialog_container, fragment, true, true, true);
                break;
              case "notification":
                nd.util.insert_fragment(nd.notification_container, fragment, true, true, true);
                break;
              default:
                core_logger.error(`Unknown layer type : '${type}'.`);
                return;
            }
            nd.util.insert_fragment(nd.dialog_container, fragment, true, true, true);
            const new_element = document.querySelector(`[data-nduuid="${uuid2}"]`);
            nd.util.refresh(new_element);
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
            new ZoneHandler(),
            new ContextHandler(),
            new FormHandler(),
            new HandlerTracker(),
            new EnvironmentHandler()
          ];
        },
        on_dom_ready: () => {
          nd.dialog_container = document.querySelector(`[${DIALOG_CONTAINER}]`);
          nd.notification_container = document.querySelector(`[${NOTIFICATION_CONTAINER}]`);
          core_logger.info(`Creating handlers...`);
          nd.create_handlers();
          core_logger.info(`Refreshing the document...`);
          nd.util.refresh(document);
        }
      };
      resolve(nd_core);
    });
  };
  navigation.addEventListener("navigate", (event2) => {
    const url = new URL(event2.destination.url);
    const is_download = event2.sourceElement.hasAttribute("download");
    if (!is_download) {
      event2.preventDefault();
      core_logger.info(`Prevented navigation to '${event2.destination.url}'.`);
    }
  });
  document.addEventListener("submit", (event2) => {
    console.log("Submit", event2);
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
