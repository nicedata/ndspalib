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
        VERSION: "1.0.10-dev",
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
        REDIRECT: "nd:redirect",
        ZONE: "nd:zone",
        CONTEXT: "nd:context"
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
            TOAST_CONTAINER: "toast-container top-0 start-50 translate-middle-x",
            MODAL_CONTAINER: "",
            ALERT_CONTAINER: "top-0 start-50 translate-middle-x position-absolute mt-1 w-50",
            ALERT: {
              DIV: "alert alert-primary alert-dismissible mb-1",
              BUTTON: "btn-close"
            }
          }
        },
        TAILWIND: {
          CLASSES: {
            TOAST_CONTAINER: "",
            MODAL_CONTAINER: "",
            ALERT_CONTAINER: ""
          },
          ALERT: {}
        },
        VANILLA: {
          CLASSES: {
            TOAST_CONTAINER: "",
            MODAL_CONTAINER: "",
            ALERT_CONTAINER: ""
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
          this._debug = true;
          this._classname = "Debug";
          this._filter = [];
          Debug2._instance = this;
        }
        enable() {
          this._debug = true;
          console.info(`INFO | ${this._classname} | Debugging is enabled.`);
        }
        disable() {
          this._debug = false;
          console.info(`INFO | ${this._classname} | Debugging is disabled.`);
        }
        is_active() {
          return this._debug;
        }
        filter(items) {
          if (!Array.isArray(items))
            console.error(`ERROR | ${this._classname} | Function debug.filter() requires a list as an argument.`);
          this._filter = items;
          if (this._debug)
            console.log(`INFO | Debug | ${this._classname} filtered source(s) :`, this._filter.toString().replaceAll(",", ", "));
        }
        is_filtered(source) {
          for (const filter of this._filter)
            if (filter === source)
              return true;
          return false;
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
          const class_name = this.constructor.name;
          this._source = source;
          this._debug = new Debug2();
          if (!this._debug.is_active())
            return;
          if (this._debug.is_filtered(class_name))
            return;
          if (!silent)
            console.info(`INFO | ${class_name} | Creating a logger for ${this._source}`);
        }
        info() {
          if (!this._debug.is_active())
            return;
          if (this._debug.is_filtered(this._source))
            return;
          console.info(`INFO | ${this._source} |`, ...arguments);
        }
        error() {
          console.error(`ERROR | ${this._source} |`, ...arguments);
        }
        warn() {
          console.warn(`WARNING | ${this._source} |`, ...arguments);
        }
      };
    }
  });

  // src/server/static/js/modules/util.js
  var require_util = __commonJS({
    "src/server/static/js/modules/util.js"(exports2) {
      var { ND_EVENTS, VERSION } = require_constants();
      var { Logger: Logger2 } = require_logger();
      exports2.Util = class Util {
        constructor() {
          this.logger = new Logger2("Util");
        }
        // Source - https://stackoverflow.com/questions/42406520/populate-an-html-form-from-a-formdata-object
        serialize_form(form) {
          const data2 = new FormData(form);
          return new URLSearchParams(data2).toString();
        }
        deserialize_form(form, formdata) {
          const entries = new URLSearchParams(formdata).entries();
          for (const [key, val] of entries) {
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
        navigate_to = (url2) => {
          let result = false;
          document.querySelectorAll("[nd-link]").forEach((link) => {
            const nd_url = link.getAttribute("nd-url");
            const href = link.getAttribute("href");
            if (href === url2 || nd_url === url2) {
              link.click();
              result = true;
              return;
            }
          });
          this.logger.warn(`navigate_to | Url: '${url2}'. Link: ${result ? "found" : "not found"}.`);
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
      var { Logger: Logger2 } = require_logger();
      exports2.Events = class Events {
        constructor() {
          this.logger = new Logger2(this.constructor.name);
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
      var { Logger: Logger2 } = require_logger();
      exports2.BaseHandler = class BaseHandler {
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

  // src/server/static/js/modules/switch_handler.js
  var require_switch_handler = __commonJS({
    "src/server/static/js/modules/switch_handler.js"(exports2) {
      var { BaseHandler: BaseHandler2 } = require_base_handler();
      exports2.SwitchHandler = class SwitchHandler extends BaseHandler2 {
        constructor() {
          super();
        }
        process(fragment) {
          if (document.querySelectorAll("[nd-switch]").length == 0)
            return;
          this._process(fragment);
        }
        postprocess() {
        }
        _process(fragment) {
          fragment.querySelectorAll("[nd-switch]").forEach(async (element) => {
            const nd_switch = element.getAttribute("nd-switch");
            const nd_options_url = element.getAttribute("nd-options");
            this.logger.info(`Processing switch element`, element);
            if (element.tagName !== "SELECT") {
              this.logger.error(`<nd-switch> only applies to 'select' tags. Error element:`, element);
              return;
            }
            const targets2 = Array();
            nd_switch.split(" ").forEach((s) => {
              if (s) {
                this.logger.info(`Processing switch element with class or id '${s}'`);
                document.querySelectorAll(s).forEach((t) => {
                  if (t.hasAttribute("nd-show-for") || t.hasAttribute("nd-hide-for")) {
                    t.hidden = true;
                  }
                  this.logger.info(`Found target identified by '${s}' (class or id) :`, t);
                  targets2.push(t);
                });
              }
            });
            if (nd_options_url) {
              this.logger.info(`Getting select option from url '${nd_options_url}'.`);
              await nd.fetcher.fetch_data(nd_options_url).then((data2) => {
                const fragment2 = nd.util.create_fragment(data2);
                nd.util.insert_fragment(element, fragment2);
              });
            }
            element.addEventListener("change", () => {
              this._update_targets(element, targets2);
            });
            element.selectedIndex = 0;
            element.dispatchEvent(new Event("change"));
          });
        }
        _update_targets(selector2, targets2) {
          if (selector2.selectedIndex < 0)
            return;
          const value = selector2.options[selector2.selectedIndex].getAttribute("value");
          targets2.forEach((e) => {
            const nd_show_for = e.getAttribute("nd-show-for");
            const nd_hide_for = e.getAttribute("nd-hide-for");
            const nd_follow = e.hasAttribute("nd-follow");
            const nd_sync = e.hasAttribute("nd-sync");
            const nd_url = e.getAttribute("nd-url");
            const has_nd_url = nd_url ? true : false;
            if (nd_sync && nd_follow) {
              this.logger.error("<nd-sync> and <nd-follow> are nutually exclusive !", e);
              return;
            }
            const show_targets = nd_show_for ? nd_show_for.split(" ") : [];
            const hide_targets = nd_hide_for ? nd_hide_for.split(" ") : [];
            if (nd_sync) {
              if (has_nd_url && value) {
                const url2 = `${nd_url}/${value}`;
                nd.fetcher.fetch_data(url2).then((data2) => {
                  const fragment = nd.util.create_fragment(data2);
                  nd.util.insert_fragment(e, fragment);
                });
              } else {
                e.innerText = value ? value : "";
              }
            }
            if (nd_follow) {
              if (value) {
                nd.fetcher.fetch_data(value).then((data2) => {
                  const fragment = nd.util.create_fragment(data2);
                  nd.util.insert_fragment(e, fragment, false, true);
                });
              } else {
                e.innerHTML = "";
              }
            }
            if (show_targets.includes("*")) {
              e.hidden = value ? false : true;
              show_targets.splice(show_targets.indexOf("*"), 1);
            }
            if (hide_targets.includes("*")) {
              e.hidden = value ? true : false;
              hide_targets.splice(hide_targets.indexOf("*"), 1);
            }
            if (show_targets.length)
              e.hidden = !show_targets.includes(value);
            if (hide_targets.length)
              e.hidden = hide_targets.includes(value);
          });
        }
      };
    }
  });

  // src/server/static/js/modules/poll_handler.js
  var require_poll_handler = __commonJS({
    "src/server/static/js/modules/poll_handler.js"(exports2) {
      var { POLL_DEFAULT_INTERVAL_MS } = require_constants();
      var { BaseHandler: BaseHandler2 } = require_base_handler();
      exports2.PollHandler = class PollHandler extends BaseHandler2 {
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
            const url2 = element.getAttribute("nd-url");
            const selector2 = element.getAttribute("nd-target");
            const targets2 = selector2 ? nd.util.get_targets(selector2) : [element];
            let interval_ms = element.getAttribute("nd-interval");
            const uuid2 = nd.util.set_uuid(element);
            if (!url2) {
              this.logger.error(`No <nd-url> defined on element`, Object(element));
            }
            if (!interval_ms || isNaN(interval_ms)) {
              interval_ms = POLL_DEFAULT_INTERVAL_MS;
            } else {
              interval_ms = Number(interval_ms);
              interval_ms = interval_ms < 1e3 ? 1e3 : interval_ms;
            }
            if (url2)
              this._poll(uuid2, url2, targets2, interval_ms);
          });
        }
        /**
         * Polling function
         */
        _poll(uuid2, url2, targets2, interval_ms) {
          const timeout_id = setTimeout(() => {
            clearTimeout(timeout_id);
            const result = this._timers.find(({ id, uuid: uuid3 }) => id === timeout_id);
            const index = this._timers.indexOf(result);
            this._timers.splice(index, 1);
            this.logger.info(`Removed timer ${result.id} for ${result.uuid}. Active timers : ${this._timers.length}`);
            if (!document.hidden) {
              nd.fetcher.fetch_data(url2).then((data2) => {
                targets2.forEach((t) => {
                  const fragment = nd.util.create_fragment(data2);
                  nd.util.insert_fragment(t, fragment, false, true);
                });
              });
            }
            this._poll(uuid2, url2, targets2, interval_ms);
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
      var { BaseHandler: BaseHandler2 } = require_base_handler();
      exports2.SourceHandler = class SourceHandler extends BaseHandler2 {
        constructor() {
          super();
        }
        process_init(fragment) {
          if (document.querySelectorAll("[nd-init]").length == 0)
            return;
          fragment.querySelectorAll(`[nd-init]`).forEach((element) => {
            const url2 = element.getAttribute("nd-init");
            this.logger.info(`Processing element`, element);
            if (url2 === "/") {
              this.logger.error(`'nd-init' cannot be the root url (/) !`);
              return;
            }
            if (!url2) {
              this.logger.error(`No valid url defined in 'nd-init' on element`, Object(element));
              element.innerHTML = `<span style="color: red">Error: no valid url defined in 'nd-init' on element &lt;${element.tagName.toLowerCase()} data-nduuid="${uuid}"&gt;</span>`;
              return;
            }
            this.logger.info(`nd-init: Fetching data from '${url2}'...`);
            nd.fetcher.fetch_data(url2).then((data2) => {
              if (data2) {
                const fragment2 = nd.util.create_fragment(data2);
                nd.util.insert_fragment(element, fragment2, false, true);
              } else {
                this.logger.error(`Url '${url2}' returned no data !`);
                element.innerHTML = `<span style="color: red">Error: url '${url2}' returned no data for element ${nd.util.as_text(element)}</span>`;
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
            const url2 = element.getAttribute("nd-source");
            this.logger.info(`Processing element`, element);
            if (url2 === "/") {
              this.logger.error(`<nd-source cannot be the root url (/) !`);
              return;
            }
            const uuid2 = nd.util.set_uuid(element);
            if (!url2) {
              this.logger.error(`No valid url defined in 'nd-source' on element`, Object(element));
              element.innerHTML = `<span style="color: red">Error: no valid url defined in 'nd-source' on element &lt;${element.tagName.toLowerCase()} data-nduuid="${uuid2}"&gt;</span>`;
              return;
            }
            this.logger.info(`Fetching data from '${url2}' for element with uuid '${uuid2}'...`);
            nd.fetcher.fetch_data(url2).then((data2) => {
              if (data2) {
                const fragment2 = nd.util.create_fragment(data2);
                nd.util.insert_fragment(element, fragment2, false, true);
              } else {
                this.logger.error(`Url '${url2}' returned no data !`);
                element.innerHTML = `<span style="color: red">Error: url '${url2}' returned no data for element ${nd.util.as_text(element)}</span>`;
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
      var { BaseHandler: BaseHandler2 } = require_base_handler();
      exports2.VersionHandler = class VersionHandler extends BaseHandler2 {
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

  // src/server/static/js/components/dialogs.js
  var require_dialogs = __commonJS({
    "src/server/static/js/components/dialogs.js"(exports2) {
      var { Logger: Logger2 } = require_logger();
      var { TOAST_DELAY_MS, DIALOG_CONTAINER: DIALOG_CONTAINER2 } = require_constants();
      var DEFAULT_ARGS = {
        type: "notification | dialog",
        severity: "danger",
        // Severity
        title: "No title defined !",
        // The dialog's title
        message: "No message defined !",
        // The dialog's body
        buttons: {
          accept: "OK",
          // The 'accept' button's label
          dismiss: "Cancel",
          // The 'dismiss' button's label
          apply: "Apply"
          // The 'apply' button's label
        },
        confirm: "Please, confirm the operation",
        // Confirm checkbox label
        urls: {
          redirect: "/_redirect",
          // The redirect URL
          accept: "/_accept",
          // The 'accept' url
          dismiss: "/_dismiss",
          // The 'dismiss' url
          apply: "/_apply"
          // The 'apply' url
        },
        actions: {
          accept: "js_accept",
          // The 'accept' action
          dismiss: "js_dismiss",
          // The 'dismiss' action
          apply: "js_apply"
          // The 'apply' action
        },
        payload: {
          data: "this is my data stream",
          mimetype: "application/pdf",
          filename: "my_document.pdf",
          mode: "preview"
        },
        custom: {
          html: "<p>This is HTML</p>",
          width_pc: 50
        }
      };
      var BaseDialog = class {
        constructor(logger_name, args) {
          this.logger = new Logger2(logger_name);
          this.id = crypto.randomUUID();
          this.args = args || DEFAULT_ARGS;
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
          console.log(args.buttons.find(({ action: action2 }) => action2 === "accept"));
          console.log(args.buttons.find(({ action: action2 }) => action2 === "dismiss"));
          this.close_event = `nd:close:${this.id}`;
          this.btn_dismiss = null;
          this.btn_accept = null;
          this.cb_confirm = null;
          const accept_button_obj = args.buttons.find(({ action: action2 }) => action2 === "accept");
          const dismiss_button_obj = args.buttons.find(({ action: action2 }) => action2 === "dismiss");
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
          const accept_button_obj = args.buttons.find(({ action: action2 }) => action2 === "accept");
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
          const accept_button_obj = args.buttons.find(({ action: action2 }) => action2 === "accept");
          const dismiss_button_obj = args.buttons.find(({ action: action2 }) => action2 === "dismiss");
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
          const accept_button_obj = args.buttons.find(({ action: action2 }) => action2 === "accept");
          const apply_button_obj = args.buttons.find(({ action: action2 }) => action2 === "apply");
          const dismiss_button_obj = args.buttons.find(({ action: action2 }) => action2 === "dismiss");
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
        constructor() {
          if (!!DialogFactory2._instance) {
            return DialogFactory2._instance;
          }
          this.logger = new Logger2("DialogFactory");
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

  // src/server/static/js/modules/link_handler.js
  var require_link_handler = __commonJS({
    "src/server/static/js/modules/link_handler.js"(exports, module) {
      var { TARGET_NONE } = require_constants();
      var { BaseHandler } = require_base_handler();
      var { TwoButtonDialog } = require_dialogs();
      exports.LinkHandler = class LinkHandler extends BaseHandler {
        constructor() {
          super();
          this.handlers = [];
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
            let url2 = element.getAttribute("href");
            url2 = url2 ? url2 : element.getAttribute("nd-url");
            const nd_zone = element.getAttribute("nd-zone-target");
            const nd_confirm = element.getAttribute("nd-confirm");
            const nd_action = element.getAttribute("nd-action");
            const nd_data = element.getAttribute("nd-data");
            if (!url2) {
              this.logger.error(`No <nd-url> defined on element`, element);
              return;
            }
            const append = false;
            const selector2 = element.getAttribute("nd-target");
            const targets2 = selector2 ? nd.util.get_targets(selector2) : [];
            if (!targets2.length && selector2 && selector2.toLowerCase() !== TARGET_NONE) {
              this.logger.error(`No <nd-target> defined on element`, element);
            }
            const uuid2 = nd.util.set_uuid(element);
            element.addEventListener("click", (event2) => {
              this._click_handler(event2, url2, targets2, nd_confirm, nd_action, nd_data);
            });
            this.handlers.push(uuid2);
            this.logger.info(`Added a click handler on element`, element);
          });
        }
        /**
         * Clean the DOM (remove unused handlers)
         */
        postprocess() {
          const handlers_to_remove = [];
          const handlers_count = this.handlers.length;
          this.handlers.forEach((uuid2) => {
            if (document.querySelectorAll(`[data-nduuid="${uuid2}"]`).length == 0) {
              handlers_to_remove.push(uuid2);
            }
          });
          handlers_to_remove.forEach((uuid2) => {
            const index = this.handlers.indexOf(uuid2);
            this.handlers.splice(index, 1);
            this.logger.info(`Removed link handler for element ${uuid2}`);
          });
          const cleaned_handlers_count = handlers_count - this.handlers.length;
          if (cleaned_handlers_count)
            this.logger.info(`Cleaned ${cleaned_handlers_count} of ${this.handlers.length} link handlers`);
        }
        _click_handler = async (event, url, targets, confirm, action, data) => {
          event.preventDefault();
          let do_proceed = true;
          let request_context = null;
          if (data) {
          }
          if (confirm) {
            const args = nd.util.as_json(confirm);
            do_proceed = await TwoButtonDialog.create_from_args(args).run() === "accept";
          }
          if (do_proceed) {
            action ? eval(action) : () => {
            };
            nd.fetcher.fetch_data(url).then((data2) => {
              if (data2) {
                targets.forEach((t) => {
                  if (t.tagName === "INPUT") {
                    t.value = data2;
                  } else {
                    const fragment = nd.util.create_fragment(data2);
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

  // src/server/static/js/components/download.js
  var require_download = __commonJS({
    "src/server/static/js/components/download.js"(exports2) {
      var { Logger: Logger2 } = require_logger();
      exports2.Download = class Download {
        constructor(blob, out_filename, preview = false) {
          this.logger = new Logger2("Download");
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
      var { Logger: Logger2 } = require_logger();
      exports2.EventHandler = class EventHandler {
        constructor() {
          this.logger = new Logger2("EventHandler");
          const notification_events = [
            ND_EVENTS.ALERT,
            ND_EVENTS.TOAST,
            ND_EVENTS.DIALOG,
            ND_EVENTS.CONFIRM,
            ND_EVENTS.ONE_BUTTON_DIALOG,
            ND_EVENTS.TWO_BUTTON_DIALOG,
            ND_EVENTS.THREE_BUTTON_DIALOG,
            ND_EVENTS.MODAL,
            ND_EVENTS.DOWNLOAD,
            ND_EVENTS.REDIRECT
          ];
          notification_events.forEach((value) => {
            this.logger.info(`Adding a listener to handle '${value}' events.`);
            document.addEventListener(value, this._event_handler);
          });
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
          let data2 = null;
          switch (event2.type) {
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
              data2 = await nd.fetcher.fetch_data(detail.urls.redirect);
              this.logger.info(`Redrect | Data: '${nd.util.truncate(data2)}.`);
              const target = document.querySelector("main");
              if (target) {
                const fragment = nd.util.create_fragment(data2);
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
      var { Logger: Logger2 } = require_logger();
      exports2.ZoneHandler = class ZoneHandler {
        constructor() {
          this.logger = new Logger2("ZoneHandler");
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
          const action2 = event2.detail.action;
          const zone_fields = event2.detail.fields;
          const zone = document.querySelector(`[nd-zone="${zone_name}"]`);
          if (!zone) {
            this.logger.error(`Zone '${zone_name}' not found.`);
            return;
          }
          const has_fields = zone.querySelectorAll(`[nd-zone-field]`).length > 0;
          switch (action2) {
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
      var { Logger: Logger2 } = require_logger();
      exports2.ContextHandler = class ContextHandler {
        constructor() {
          this.logger = new Logger2("ContextHandler");
          this.context = [];
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
            const [context, action2 = "show"] = attribute.split(":");
            if (!["show", "hide"].includes(action2)) {
              this.logger.error(`Unsupported context action: '${action2}. Allowed actions are 'show' or 'hide'.`);
              return;
            }
            switch (action2) {
              case "show":
                e.hidden = this.context.includes(context) ? false : true;
                break;
              case "hide":
                e.hidden = this.context.includes(context) ? true : false;
                break;
            }
          });
        };
        // Todo : remove
        process = (fragment) => {
          this._update_document();
        };
        postprocess = () => {
        };
        _event_handler = (event2) => {
          this.logger.info(`Event: ${event2.type}. Context: '${event2.detail.context}'. Action: '${event2.detail.action}'`);
          const { context, action: action2 } = event2.detail;
          switch (action2) {
            case "set":
              if (this.context.includes(context)) {
                this.logger.info(`Value '${context}' is already present.`);
                return;
              }
              this.context.push(context);
              break;
            case "reset":
              if (!this.context.includes(context)) {
                this.logger.info(`Value '${context}' is not set.`);
                return;
              }
              const index = this.context.indexOf(context);
              index !== -1 ? this.context.splice(index, 1) : () => {
              };
              break;
            default:
              return;
          }
          this._update_document();
        };
      };
    }
  });

  // src/server/static/js/modules/form.js
  var require_form = __commonJS({
    "src/server/static/js/modules/form.js"(exports2) {
      var { Logger: Logger2 } = require_logger();
      exports2.Form = class Form2 {
        static ACTIONS = ["nd-accept", "nd-apply", "nd-dismiss", "nd-revert", "nd-clear"];
        // static REQUIRED_ACTIONS = ["nd-accept", "nd-dismiss"];
        static REQUIRED_ACTIONS = ["nd-accept"];
        constructor(form) {
          this.logger = new Logger2("Form");
          this.form = form;
          this.fields = form.querySelectorAll("[name]");
          this.formdata = new FormData(this.form);
          this.form_str = nd.util.serialize_form(this.form);
          this.is_dirty = false;
          this.confirm_dialog = null;
          Form2.ACTIONS.forEach((action2) => {
            const element = form.querySelector(`[${action2}]`);
            switch (action2) {
              case "nd-accept":
                element ? element.addEventListener("click", this.accept) : () => {
                };
                break;
              case "nd-apply":
                element ? element.addEventListener("click", this.apply) : () => {
                };
                break;
              case "nd-dismiss":
                element ? element.addEventListener("click", this.dismiss) : () => {
                };
                break;
              case "nd-revert":
                element ? element.addEventListener("click", this.revert) : () => {
                };
                break;
              case "nd-clear":
                element ? element.addEventListener("click", this.clear) : () => {
                };
                break;
            }
          });
          const nd_confirm = form.getAttribute("nd-confirm");
          if (nd_confirm) {
            const args = nd.util.as_json(nd_confirm);
            this.confirm_dialog = nd.factory.create("two-button", args);
          }
          nd.util.set_uuid(this.form);
          this.fields.forEach((field) => {
            field.addEventListener("change", this.on_change);
          });
          this.form.addEventListener("submit", this.on_submit);
        }
        save_state = () => {
          this.logger.info("Saving form state.");
          this.formdata = new FormData(this.form);
          this.form_str = nd.util.serialize_form(this.form);
          this.is_dirty = false;
        };
        close = () => {
          const nd_dialog = this.form.closest("[nd-dialog]");
          if (!nd_dialog) {
            return;
          }
          const dialog_id = nd_dialog.id;
          this.logger.info(`Closing the containing dialog (${dialog_id}).`);
          document.dispatchEvent(new Event(`nd:close:${dialog_id}`));
        };
        on_change = () => {
          this.is_dirty = nd.util.serialize_form(this.form) !== this.form_str;
        };
        on_submit = (event2) => {
          this.logger.info("Submit event !");
          event2.preventDefault();
        };
        confirm = async () => {
          if (this.confirm_dialog) {
            const result = await this.confirm_dialog.run();
            return result === "accept";
          }
          return true;
        };
        accept = () => {
          if (!this.form.reportValidity())
            return;
          this.logger.info(`Submit: submitting. Form is valid.`);
          nd.fetcher.send_form(this.form);
          this.close();
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
          let do_proceed2 = true;
          if (this.is_dirty)
            do_proceed2 = await this.confirm();
          do_proceed2 ? this.close() : () => {
          };
        };
        clear = async () => {
          let do_proceed2 = true;
          if (this.is_dirty)
            do_proceed2 = await this.confirm();
          do_proceed2 ? this.form.reset() : () => {
          };
        };
        revert = async () => {
          if (!this.is_dirty) {
            this.logger.info("Revert: no changes.");
            return;
          }
          if (await this.confirm()) {
            this.logger.info("Revert: restoring previous state.");
            this.form_str = nd.util.deserialize_form(this.form, this.formdata);
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
      var { Logger: Logger2 } = require_logger();
      var { Form: Form2 } = require_form();
      exports2.FormHandler = class FormHandler {
        constructor() {
          this.logger = new Logger2("FormHandler");
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
            Form2.REQUIRED_ACTIONS.forEach((action2) => {
              element.querySelector(`[${action2}]`) ? ok_count++ : () => {
              };
            });
            if (ok_count !== Form2.REQUIRED_ACTIONS.length) {
              this.logger.error(`Please ensure that ${Form2.REQUIRED_ACTIONS.join(" and ")} action elements (e. g. <button>, <a>, ...) are set.
  Element:`, element);
              return;
            }
            new Form2(element);
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
      var { Logger: Logger2 } = require_logger();
      exports2.Fetcher = class Fetcher2 {
        // Singleton constructor !
        constructor() {
          if (!!Fetcher2._instance) {
            return Fetcher2._instance;
          }
          this.logger = new Logger2("Fetcher");
          Fetcher2._instance = this;
          this.events = [];
        }
        _process_headers = (headers) => {
          let headers_dump = "";
          headers.forEach((v, k) => {
            headers_dump += `'${k}'->'${v}', `;
            const sse = k.toLowerCase();
            let match = false;
            let content = null;
            switch (sse) {
              case "x-nd-event":
                this.events = JSON.parse(v);
                content = v;
                match = true;
                break;
              case "x-nd-title":
                document.title = v;
                match = true;
                content = v;
                break;
              case "x-nd-url":
                console.log("X-ND-URL", v);
                break;
            }
            if (match)
              this.logger.info(`Received server message '${sse}'. Content: '${content}'.`);
          });
          this.logger.info(`Headers : ${headers_dump}`);
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
        async _do_fetch(request) {
          const url2 = request.url;
          this.events = [];
          let status = null;
          let data2 = null;
          request.headers.append("X-Nd-Version", `"${VERSION}"`);
          request.headers.append("X-Nd-Url", `"${request.url}"`);
          document.dispatchEvent(new CustomEvent(ND_EVENTS.FETCH_BEFORE, { detail: { url: url2, data: null, status } }));
          try {
            const response = await fetch(request);
            this.logger.info(`Response status: ${response.status}`);
            if (!response.ok) {
              document.dispatchEvent(new CustomEvent(ND_EVENTS.FETCH_ERROR, { detail: { url: url2, data: null, status: response.status } }));
              this.logger.error(`Response status: ${response.status}`);
              return null;
            }
            this._process_headers(response.headers);
            const payload = await response.blob();
            this.logger.info(`Result is of type '${payload.type}'.`);
            const data3 = await this._process_events(payload).text();
            document.dispatchEvent(new CustomEvent(ND_EVENTS.FETCH_AFTER, { detail: { url: url2, data: data3, status } }));
            return data3;
          } catch (error) {
            document.dispatchEvent(new CustomEvent(ND_EVENTS.FETCH_ERROR, { detail: { url: url2, data: error.message, status } }));
            this.logger.error(`Error on url '${url2}':  ${error.message}`);
            return null;
          }
        }
        send_form(form) {
          if (!(form instanceof HTMLFormElement)) {
            this.logger.error("send_form: subitted data is not an HTMLFormElement.");
            return;
          }
          return this._do_fetch(
            new Request(form.action, {
              method: form.method,
              body: new FormData(form)
            })
          );
        }
        /**
         * fetch_data - fetch data from server as text
         */
        async fetch_data(url2) {
          this.logger.info(`fetch_data | Url: '${url2}'.`);
          const request = new Request(url2);
          return this._do_fetch(request);
        }
      };
    }
  });

  // src/server/static/js/main.js
  var { INFOS, DIALOG_CONTAINER, NOTIFICATION_CONTAINER } = require_constants();
  var { Debug } = require_debug();
  var { Logger } = require_logger();
  var { Util } = require_util();
  var { Events } = require_events();
  var { SwitchHandler } = require_switch_handler();
  var { PollHandler } = require_poll_handler();
  var { SourceHandler } = require_source_handler();
  var { VersionHandler } = require_version_handler();
  var { LinkHandler } = require_link_handler();
  var { EventHandler } = require_event_handler();
  var { ZoneHandler } = require_zone_handler();
  var { ContextHandler } = require_context_handler();
  var { FormHandler } = require_form_handler();
  var { Fetcher } = require_fetcher();
  var { Alert, DialogFactory, ConfirmDialog, Toast } = require_dialogs();
  var { Form } = require_form();
  var PROG_INFO = `${INFOS.PROGNAME} ${INFOS.VERSION}`;
  var core_logger = new Logger("Core", true);
  if (typeof bootstrap === "undefined")
    throw new Error("Bootstrap library not present !");
  var bs_version = bootstrap.Tooltip.VERSION;
  [bs_major, _, _] = bs_version.split(".");
  if (bs_major < 5)
    throw new Error(`${PROGNAME} needs Bootstrap 5.x.x library. Current Bootstrap version is ${bs_version}.`);
  var ORIGIN = window.location.origin;
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
        glogger: core_logger,
        // The 'Core' logger
        factory: new DialogFactory(),
        dialog_container: null,
        notification_container: null,
        // Form: Form,
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
            new SwitchHandler(),
            new EventHandler(),
            new ZoneHandler(),
            new ContextHandler(),
            new FormHandler()
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
    const url2 = new URL(event2.destination.url);
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
  core_logger.info(`${PROG_INFO} : initializing...`);
  nd_init().then((nd_core) => {
    window.nd = nd_core;
    core_logger.info(`${PROG_INFO} : ready !`);
  });
  addEventListener("DOMContentLoaded", on_dom_loaded);
})();
