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
        VERSION: "1.0.9-dev",
        AUTHOR: "Martin Mohnhaupt <martin.mohnhaupt@etik.com>",
        LICENCE: "MIT License, https://mit-license.org/",
        INSPIREDBY: {
          HTMX: "HTMX : https://htmx.org/",
          UNPOLY: "UNPOLY : https://unpoly.com/"
        }
      };
      exports.INFOS = INFOS2;
      exports.VERSION = INFOS2.VERSION;
      exports.TARGET_NONE = ":none:";
      exports.ND_EVENTS = {
        POLL_START: "nd:poll:start",
        POLL_END: "nd:poll:end",
        FRAGMENT_BEFORE_INSERT: "nd:fragment:before_insert",
        FRAGMENT_AFTER_INSERT: "nd:fragment:after_insert",
        FETCH_BEFORE: "nd:fetch:before",
        FETCH_AFTER: "nd:fetch:after",
        FETCH_ERROR: "nd:fetch:error",
        ALERT: "nd:alert",
        TOAST: "nd:toast",
        DIALOG: "nd:dialog",
        CONFIRM: "nd:confirm",
        DOWNLOAD: "nd:download"
      };
      exports.TOAST_CONTAINER_ATTRIBUTE = "nd-toast-container";
      exports.DIALOG_CONTAINER_ATTRIBUTE = "nd-dialog-container";
      exports.ALERT_CONTAINER_ATTRIBUTE = "nd-alert-container";
      exports.TOAST_DELAY_MS = 3e3;
      exports.POLL_DEFAULT_INTERVAL_MS = 1e4;
      exports.noop = () => {
      };
      exports.STYLING = {
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
    "src/server/static/js/modules/debug.js"(exports) {
      exports.Debug = class Debug2 {
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
    "src/server/static/js/modules/logger.js"(exports) {
      var { Debug: Debug2 } = require_debug();
      exports.Logger = class Logger {
        constructor(source) {
          const class_name = this.constructor.name;
          this._source = source;
          this._debug = new Debug2();
          if (!this._debug.is_active())
            return;
          if (this._debug.is_filtered(class_name))
            return;
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
    "src/server/static/js/modules/util.js"(exports) {
      var { ND_EVENTS, VERSION } = require_constants();
      var { Logger: Logger2 } = require_logger();
      exports.Util = class Util {
        constructor() {
          this._logger = new Logger2(this.constructor.name);
        }
        // Source - https://stackoverflow.com/a/4700265
        // Posted by El Ronnoco, modified by community. See post 'Timeline' for change history
        // Retrieved 2026-02-15, License - CC BY-SA 4.0
        truncate(input, len = 50) {
          return input.length > len ? `${input.substring(0, len)}...` : input;
        }
        set_uuid(element) {
          const uuid = crypto.randomUUID();
          element.dataset.nduuid = uuid;
          this._logger.info(`Attributed an UUID to element`, Object(element));
          return uuid;
        }
        /**
         * noop - function that does nothing.
         */
        noop() {
          this._logger.info(`Function noop() called`);
        }
        /**
         * get_targets - get all elements by a selector,
         */
        get_targets(selector2) {
          this._logger.info(`Function get_targets() called. Selector: '${selector2}'`);
          if (typeof selector2 !== "string" || !selector2)
            return Array(0);
          selector2 = selector2.trim();
          return Array.from(document.querySelectorAll(selector2));
        }
        /**
         * clear_node - delete a specific node.
         */
        clear_node(node) {
          this._logger.info(`Function clear_node() called. Node name: '${node.nodeName.toLowerCase()}'`);
          const range = document.createRange();
          range.selectNodeContents(node);
          range.deleteContents();
        }
        /**
         * create_fragment - create a document fragment from HTML code.
         */
        create_fragment(html) {
          this._logger.info(`Function create_fragment() called. Content: '${this.truncate(html)}'`);
          const range = document.createRange();
          return range.createContextualFragment(html);
        }
        /**
         * insert_fragment - replace or append a fragment in a specific target.
         */
        insert_fragment(target, fragment, append = false, refresh = false) {
          this._logger.info(`Function insert_fragment() called. Target: '${target.tagName.toLowerCase()}'. Mode: ${append ? "append" : "replace"}.`);
          document.dispatchEvent(new CustomEvent(ND_EVENTS.FRAGMENT_BEFORE_INSERT, { detail: { target, fragment, append } }));
          append ? this.noop() : this.clear_node(target);
          const result = target.appendChild(fragment);
          refresh ? nd.refresh(target) : () => {
          };
          document.dispatchEvent(new CustomEvent(ND_EVENTS.FRAGMENT_AFTER_INSERT, { detail: { target, data: fragment, append } }));
          return result;
        }
        /**
         * sleep_ms - sleep during a specific period (ms).
         */
        async sleep_ms(ms) {
          this._logger.info(`Function sleep_ms() called. Timeout: ${ms}ms.`);
          await new Promise((resolve) => setTimeout(resolve, ms));
        }
        /**
         * compress - Compress a string (remove duplicate whitechars).
         */
        compress(str) {
          if (typeof str !== "string")
            return str;
          this._logger.info(`Function compress() called. String: '${this.truncate(str)}'.`);
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
          this._logger.info(`Function navigate_to() called. Url: '${url}'. Link: ${result ? "found" : "not found"}.`);
          return result;
        };
      };
    }
  });

  // src/server/static/js/modules/events.js
  var require_events = __commonJS({
    "src/server/static/js/modules/events.js"(exports) {
      var { Logger: Logger2 } = require_logger();
      exports.Events = class Events {
        constructor() {
          this._logger = new Logger2(this.constructor.name);
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
          let [event, selector2, listener] = [null, null, args.pop()];
          switch (args.length) {
            case 1:
              event = args.pop();
              this._listeners.push([event, selector2, listener]);
              document.addEventListener(event, listener);
              this._logger.info(`Calling function on(), first form. Selector: ${selector2}, event:${event}, listener:${listener}`);
              break;
            case 2:
              [selector2, event] = [args.pop(), args.pop()];
              document.querySelectorAll(selector2).forEach((element) => {
                this._listeners.push([event, element, listener]);
                element.addEventListener(event, listener);
                this._logger.info(`Calling function on(), second form. Selector: ${selector2}, event:${event}, listener:${listener}`);
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
          let [event, selector2, listener] = [args.pop(), null, null];
          switch (args.length) {
            case 0:
              this._listeners.forEach((item, index) => {
                const [event2, element, listener2] = item;
                if (event2 === event2) {
                  this._logger.info(`Calling function off(), first form. Selector: ${selector2}, event:${event2}, listener:${listener2}`);
                  document.removeEventListener(event2, listener2);
                  this._listeners.splice(index, 1);
                }
              });
              break;
            case 1:
              selector2 = args.pop();
              Array.from(document.querySelectorAll(selector2)).forEach((target) => {
                this._listeners.forEach((item, index) => {
                  const [event2, element, listener2] = item;
                  if (event2 === event2 && element === target) {
                    this._logger.info(`Calling function off(), second form. Selector: ${selector2}, event:${event2}, listener:${listener2}`);
                    element.removeEventListener(event2, listener2);
                    this._listeners.splice(index, 1);
                  }
                });
              });
              break;
            default:
              return;
          }
        }
        /**
         * Remove ALL event listeners
         *
         */
        flush() {
          this._listeners.forEach((item, _2) => {
            const [event, element, listener] = item;
            element.removeEventListener(event, listener);
            this._logger.info(`Calling function flush(). Selector: ${selector}, event:${event}, listener:${listener}`);
          });
          this._listeners = [];
        }
      };
    }
  });

  // src/server/static/js/modules/base_handler.js
  var require_base_handler = __commonJS({
    "src/server/static/js/modules/base_handler.js"(exports) {
      var { Logger: Logger2 } = require_logger();
      exports.BaseHandler = class BaseHandler {
        constructor() {
          this._logger = new Logger2(this.constructor.name);
        }
        /**
         * Process a given fragment.
         */
        process(fragment) {
          this._logger.error(`The 'process(fragment)' method is not implemented.`);
        }
        /**
         * Clean the DOM after loading fragments.
         */
        postprocess() {
          this._logger.error(`The 'postprocess(fragment)' method is not implemented.`);
        }
      };
    }
  });

  // src/server/static/js/modules/switch_handler.js
  var require_switch_handler = __commonJS({
    "src/server/static/js/modules/switch_handler.js"(exports) {
      var { BaseHandler } = require_base_handler();
      exports.SwitchHandler = class SwitchHandler extends BaseHandler {
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
          fragment.querySelectorAll("[nd-switch]").forEach((element) => {
            const nd_switch = element.getAttribute("nd-switch");
            const nd_options_url = element.getAttribute("nd-options-url");
            this._logger.info(`Processing switch element`, element);
            if (element.tagName !== "SELECT") {
              this._logger.error(`<nd-switch> only applies to 'select' tags. Error element:`, element);
              return;
            }
            if (nd_options_url) {
              this._logger.info(`Getting select option from url '${nd_options_url}'.`);
              nd.fetcher.fetch_data(nd_options_url).then((data) => {
                const fragment2 = nd.util.create_fragment(data);
                nd.util.insert_fragment(element, fragment2);
              });
            }
            const targets = Array();
            nd_switch.split(" ").forEach((s) => {
              if (s) {
                this._logger.info(`Processing switch element with class or id '${s}'`);
                document.querySelectorAll(s).forEach((t) => {
                  this._logger.info(`Found target identified by '${s}' (class or id) :`, t);
                  targets.push(t);
                });
              }
            });
            if (element.tagName == "SELECT") {
              this._update_targets(element, targets);
              element.addEventListener("change", () => {
                this._update_targets(element, targets);
              });
            }
          });
        }
        _update_targets(selector2, targets) {
          const value = selector2.options[selector2.selectedIndex].getAttribute("value");
          targets.forEach((e) => {
            const nd_show_for = e.getAttribute("nd-show-for");
            const nd_hide_for = e.getAttribute("nd-hide-for");
            const nd_url = e.getAttribute("nd-url");
            const has_nd_sync = e.hasAttribute("nd-sync");
            const has_nd_url = nd_url ? true : false;
            const show_targets = nd_show_for ? nd_show_for.split(" ") : [];
            const hide_targets = nd_hide_for ? nd_hide_for.split(" ") : [];
            if (has_nd_sync) {
              if (has_nd_url && value) {
                const url = `${nd_url}/${value}`;
                nd.fetcher.fetch_data(url).then((data) => {
                  const fragment = nd.util.create_fragment(data);
                  nd.util.insert_fragment(e, fragment);
                });
              } else {
                e.innerText = value ? value : "";
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
    "src/server/static/js/modules/poll_handler.js"(exports) {
      var { POLL_DEFAULT_INTERVAL_MS } = require_constants();
      var { BaseHandler } = require_base_handler();
      exports.PollHandler = class PollHandler extends BaseHandler {
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
            this._logger.info(`Cleared and removed timer ${timer.id} for ${timer.uuid}.`);
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
            const uuid = nd.util.set_uuid(element);
            if (!url) {
              this._logger.error(`No <nd-url> defined on element`, Object(element));
            }
            if (!interval_ms || isNaN(interval_ms)) {
              interval_ms = POLL_DEFAULT_INTERVAL_MS;
            } else {
              interval_ms = Number(interval_ms);
              interval_ms = interval_ms < 1e3 ? 1e3 : interval_ms;
            }
            if (url)
              this._poll(uuid, url, targets, interval_ms);
          });
        }
        /**
         * Polling function
         */
        _poll(uuid, url, targets, interval_ms) {
          const timeout_id = setTimeout(() => {
            clearTimeout(timeout_id);
            const result = this._timers.find(({ id, uuid: uuid2 }) => id === timeout_id);
            const index = this._timers.indexOf(result);
            this._timers.splice(index, 1);
            this._logger.info(`Removed timer ${result.id} for ${result.uuid}. Active timers : ${this._timers.length}`);
            if (!document.hidden) {
              nd.fetcher.fetch_data(url).then((data) => {
                targets.forEach((t) => {
                  const fragment = nd.util.create_fragment(data);
                  nd.util.insert_fragment(t, fragment, false, true);
                });
              });
            }
            this._poll(uuid, url, targets, interval_ms);
          }, interval_ms);
          this._timers.push({ id: timeout_id, uuid });
          this._logger.info(`Added timer ${timeout_id} (${interval_ms}ms) for ${uuid}. Active timers : ${this._timers.length}`);
        }
      };
    }
  });

  // src/server/static/js/modules/link_handler.js
  var require_link_handler = __commonJS({
    "src/server/static/js/modules/link_handler.js"(exports) {
      var { TARGET_NONE } = require_constants();
      var { BaseHandler } = require_base_handler();
      exports.LinkHandler = class LinkHandler extends BaseHandler {
        constructor() {
          super();
          this._handlers = [];
        }
        /**
         * Process a given fragment.
         */
        process(fragment) {
          if (document.querySelectorAll("[nd-link]").length == 0)
            return;
          fragment.querySelectorAll("[nd-link]").forEach((element) => {
            let url = element.getAttribute("href");
            url = url ? url : element.getAttribute("nd-url");
            const append = false;
            const selector2 = element.getAttribute("nd-target");
            const targets = selector2 ? nd.util.get_targets(selector2) : [];
            if (!url) {
              this._logger.error(`No <nd-url> defined on element`, element);
            }
            if (!targets.length && selector2 && selector2.toLowerCase() !== TARGET_NONE) {
              this._logger.error(`No <nd-target> defined on element`, element);
            }
            const uuid = nd.util.set_uuid(element);
            if (url) {
              element.addEventListener("click", (event) => {
                this._click_handler(event, url, targets);
              });
              this._handlers.push(uuid);
              this._logger.info(`Added a click handler on element`, element);
            }
          });
        }
        /**
         * Clean the DOM (remove unused handlers)
         */
        postprocess() {
          const handlers_to_remove = [];
          const handlers_count = this._handlers.length;
          this._handlers.forEach((uuid) => {
            if (document.querySelectorAll(`[data-nduuid="${uuid}"]`).length == 0) {
              handlers_to_remove.push(uuid);
            }
          });
          handlers_to_remove.forEach((uuid) => {
            const index = this._handlers.indexOf(uuid);
            this._handlers.splice(index, 1);
            this._logger.info(`Removed link handler for element ${uuid}`);
          });
          const cleaned_handlers_count = handlers_count - this._handlers.length;
          if (cleaned_handlers_count)
            this._logger.info(`Cleaned ${cleaned_handlers_count} of ${this._handlers.length} link handlers`);
        }
        _click_handler(event, url, targets) {
          event.preventDefault();
          nd.fetcher.fetch_data(url).then((data) => {
            if (data) {
              targets.forEach((t) => {
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
    }
  });

  // src/server/static/js/components/toast.js
  var require_toast = __commonJS({
    "src/server/static/js/components/toast.js"(exports) {
      var { TOAST_DELAY_MS } = require_constants();
      var { Logger: Logger2 } = require_logger();
      exports.Toast = class Toast {
        constructor(container = null, category = "", header = "", body = "", redirect_url = null) {
          this._logger = new Logger2(this.constructor.name);
          this.id = crypto.randomUUID();
          this._container = container;
          this._delay_ms = TOAST_DELAY_MS;
          this._redirect_url = redirect_url;
          this.toast_element = null;
          this.html = nd.util.compress(`
            <div data-nduuid="${this.id}" class="toast mt-2" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header">
                    <strong id="id_header_text" class="me-auto text-${category}"><i class="bi bi-exclamation-square me-2"></i>${header}</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div id="id_div_toast_body" class="toast-body">${body}</div>
            </div>`);
        }
        destroy = (with_redirect = true) => {
          this.toast_element.classList.remove("show");
          this.toast_element.remove();
          if (!with_redirect)
            return;
          if (this._redirect_url) {
            this._logger.info(`Will redirect to '${this._redirect_url}'.`);
            const ok = nd.util.navigate_to(this._redirect_url);
            if (!ok)
              this._logger.error(`Redirection to '${this._redirect_url}' fails !`);
          } else {
            this._logger.info(`No redirection url was specified.`);
          }
        };
        show = () => {
          const fragment = nd.util.create_fragment(this.html);
          nd.util.insert_fragment(this._container, fragment, true);
          this.toast_element = this._container.querySelector(`[data-nduuid="${this.id}"]`);
          const btn_close = this.toast_element.querySelector("button");
          this.toast_element.classList.add("show");
          const timeout_id = setTimeout(() => {
            this.destroy();
          }, this._delay_ms);
          btn_close.onclick = (e) => {
            clearTimeout(timeout_id);
            this.destroy(false);
            this._logger.info(`Action cancelled by user.`);
          };
        };
      };
    }
  });

  // src/server/static/js/modules/toast_handler.js
  var require_toast_handler = __commonJS({
    "src/server/static/js/modules/toast_handler.js"(exports) {
      var { ND_EVENTS, TOAST_CONTAINER_ATTRIBUTE } = require_constants();
      var { Toast: Toast2 } = require_toast();
      var { BaseHandler } = require_base_handler();
      exports.ToastHandler = class ToastHandler extends BaseHandler {
        constructor() {
          super();
          this._container = document.querySelector(`[${TOAST_CONTAINER_ATTRIBUTE}]`);
          if (!this._container) {
            this._logger.error(`No '${TOAST_CONTAINER_ATTRIBUTE}' element is present !`);
            return;
          }
          document.addEventListener(ND_EVENTS.TOAST, this._toast_event_handler);
        }
        // Baseclass override
        process = (fragment) => {
        };
        // Baseclass override
        postprocess = () => {
        };
        _toast_event_handler = (event) => {
          const detail = event.detail;
          new Toast2(this._container, detail.category, detail.header, detail.body, detail.redirect_url).show();
        };
      };
    }
  });

  // src/server/static/js/components/alert.js
  var require_alert = __commonJS({
    "src/server/static/js/components/alert.js"(exports) {
      var { TOAST_DELAY_MS } = require_constants();
      var { Logger: Logger2 } = require_logger();
      exports.Alert = class Alert {
        constructor(container = null, category = "", message = "", redirect_url = null) {
          this._logger = new Logger2(this.constructor.name);
          this._id = crypto.randomUUID();
          this._container = container;
          this._delay_ms = TOAST_DELAY_MS;
          this._redirect_url = redirect_url;
          this.alert_element = null;
          this._timeout_id = null;
          this.html = nd.util.compress(`
            <div data-nduuid="${this._id}" class="alert alert-primary alert-dismissible mb-1" role="alert">
                ${message}
                <button type="button" class="btn-close" aria-label="Close"></button>
            </div>`);
        }
        destroy = (with_redirect = true) => {
          this.alert_element.classList.remove("show");
          this.alert_element.remove();
          if (!with_redirect)
            return;
          if (this._redirect_url) {
            this._logger.info(`Will redirect to '${this._redirect_url}'.`);
            const ok = nd.util.navigate_to(this._redirect_url);
            if (!ok)
              this._logger.error(`Redirection to '${this._redirect_url}' fails !`);
          } else {
            this._logger.info(`No redirection url was specified.`);
          }
        };
        show = () => {
          const fragment = nd.util.create_fragment(this.html);
          nd.util.insert_fragment(this._container, fragment, true);
          this.alert_element = this._container.querySelector(`[data-nduuid="${this._id}"]`);
          const btn_close = this.alert_element.querySelector("button");
          this.alert_element.classList.add("show");
          const timeout_id = setTimeout(() => {
            this.destroy();
          }, this._delay_ms);
          btn_close.onclick = (e) => {
            clearTimeout(timeout_id);
            this.destroy(false);
            this._logger.info(`Action cancelled by user.`);
          };
        };
      };
    }
  });

  // src/server/static/js/modules/alert_handler.js
  var require_alert_handler = __commonJS({
    "src/server/static/js/modules/alert_handler.js"(exports) {
      var { ND_EVENTS, ALERT_CONTAINER_ATTRIBUTE } = require_constants();
      var { Alert: Alert2 } = require_alert();
      var { BaseHandler } = require_base_handler();
      exports.AlertHandler = class AlertHandler extends BaseHandler {
        constructor() {
          super();
          this._container = document.querySelector(`[${ALERT_CONTAINER_ATTRIBUTE}]`);
          if (!this._container) {
            this._logger.error(`No '${ALERT_CONTAINER_ATTRIBUTE}' element is present !`);
            return;
          }
          document.addEventListener(ND_EVENTS.ALERT, this._alert_event_handler);
        }
        // Baseclass override
        process = (fragment) => {
        };
        // Baseclass override
        postprocess = () => {
        };
        _alert_event_handler = (event) => {
          const detail = event.detail;
          new Alert2(this._container, detail.category, detail.message, detail.redirect_url, this._debug).show();
        };
      };
    }
  });

  // src/server/static/js/components/base_dialog.js
  var require_base_dialog = __commonJS({
    "src/server/static/js/components/base_dialog.js"(exports) {
      var { Logger: Logger2 } = require_logger();
      exports.BaseDialog = class BaseDialog {
        constructor(title, message, lang, accept_url, dismiss_url) {
          this._logger = new Logger2(this.constructor.name);
          this.id = crypto.randomUUID();
          this.accept_event_id = `nd:${this.id}:accept`;
          this.dismiss_event_id = `nd:${this.id}:dismiss`;
          this.accept_url = accept_url;
          this.dismiss_url = dismiss_url;
          this.accept_btn = null;
          this.dismiss_btn = null;
          this.title = title;
          this.message = message;
          this.lang = lang;
          this.dialog = null;
          this._bootstrap_dialog = null;
          this._accept_handler = () => {
          };
          this._dismiss_handler = () => {
          };
          nd.events.on(this.accept_event_id, this._on_accept);
          nd.events.on(this.dismiss_event_id, this._on_dismiss);
        }
        // Accept event handler
        _on_accept = (event) => {
          this._logger.info(`Accept on dialog ${this.id}`);
          this._accept_handler();
          this._close(true);
        };
        // Dismiss event handler
        _on_dismiss = (event) => {
          this._logger.info(`Dismiss on dialog ${this.id}`);
          this._dismiss_handler();
          this._close(false);
        };
        _close = (accepted = false) => {
          this._logger.info(`Closing dialog ${this.id} (${accepted ? "accepted" : "dismissed"})`);
          this._bootstrap_dialog.hide();
          nd.events.off(this.accept_event_id);
          nd.events.off(this.dismiss_event_id);
          this.cleanup();
          this.dialog.remove();
          const redirect_to = accepted ? this.accept_url : this.dismiss_url;
          if (redirect_to)
            nd.util.navigate_to(redirect_to);
        };
        // Remove specific handlers (may be overridden in sub classes)
        cleanup = () => {
        };
        // Set another accept handler
        set_accept_handler(func = () => {
        }) {
          if (typeof func === "function")
            this._accept_handler = func;
        }
        // Set another dismiss handler
        set_dismiss_handler(func = () => {
        }) {
          if (typeof func === "function")
            this._dismiss_handler = func;
        }
        async show() {
          this.dialog = await nd.layer.open({
            content: this.html,
            // HTML content
            id: this.id
            // Set the context
          });
          this.accept_btn = this.dialog.querySelector("[nd-accept]");
          this.dismiss_btn = this.dialog.querySelector("[nd-dismiss]");
          this.accept_btn.addEventListener("click", (e) => {
            document.dispatchEvent(new CustomEvent(this.accept_event_id, { detail: { id: this.id } }));
          });
          this.dismiss_btn.addEventListener("click", (e) => {
            document.dispatchEvent(new CustomEvent(this.dismiss_event_id, { detail: { id: this.id } }));
          });
          this._bootstrap_dialog = new bootstrap.Modal(this.dialog, { backdrop: "static" });
          this._bootstrap_dialog.show();
        }
      };
    }
  });

  // src/server/static/js/components/dialog.js
  var require_dialog = __commonJS({
    "src/server/static/js/components/dialog.js"(exports) {
      var { BaseDialog } = require_base_dialog();
      var LANGS = ["de", "fr", "en"];
      var I18N = {
        fr: {
          yes: "Oui",
          no: "Non"
        },
        en: {
          yes: "Yes",
          no: "No"
        },
        de: {
          yes: "Ja",
          no: "Nein"
        }
      };
      var DEFAULTS = {
        lang: "en",
        title: "Dialog 'title' is not defined !",
        message: "Dialog 'message' is not defined !"
      };
      exports.Dialog = class Dialog extends BaseDialog {
        // Constructor
        constructor(title = DEFAULTS.title, message = DEFAULTS.message, lang = DEFAULTS.lang, accept_url = "", dismiss_url = "") {
          super(title, message, lang, accept_url, dismiss_url);
          lang = LANGS.includes(lang) ? lang.toLowerCase() : DEFAULTS.lang;
          this.lang = I18N[lang];
          this.html = nd.util.compress(`
            <div class="modal" data-nduuid="${this.id}" tabindex="-1" role="dialog" aria-labelledby="Modal dialog" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title"><!--<i class="bi bi-question-circle me-2" aria-hidden="true"></i>-->${this.title}</h5>
                        </div>
                        <div class="modal-body">${this.message}</div>
                        <div class="modal-footer">
                            <div class="col-md-12 text-center">
                                <button type="button" class="btn btn-primary" style="width: 5rem" nd-accept>${this.lang.yes}</button>
                                <button type="button" class="btn btn-secondary" style="width: 5rem" nd-dismiss>${this.lang.no}</button>
                            </div>
                        </div>
                    </div>
                </div>    
            </div>`);
        }
        // Show the dialog
        async show() {
          super.show().then(() => {
          });
        }
      };
    }
  });

  // src/server/static/js/modules/dialog_handler.js
  var require_dialog_handler = __commonJS({
    "src/server/static/js/modules/dialog_handler.js"(exports) {
      var { ND_EVENTS, DIALOG_CONTAINER_ATTRIBUTE: DIALOG_CONTAINER_ATTRIBUTE2 } = require_constants();
      var { Dialog: Dialog2 } = require_dialog();
      var { BaseHandler } = require_base_handler();
      exports.DialogHandler = class DialogHandler extends BaseHandler {
        constructor() {
          super();
          const container = document.querySelector(`[${DIALOG_CONTAINER_ATTRIBUTE2}]`);
          if (!container)
            throw new Error(`No '${DIALOG_CONTAINER_ATTRIBUTE2}' element is present !`);
          document.addEventListener(ND_EVENTS.DIALOG, this._modal_event_handler);
        }
        // Baseclass override
        process = (fragment) => {
        };
        // Baseclass override
        postprocess = () => {
        };
        _modal_event_handler = (event) => {
          const detail = event.detail;
          new Dialog2(detail.header, detail.body, detail.lang, detail.accept_url, detail.dismiss_url).show();
        };
      };
    }
  });

  // src/server/static/js/components/confirmation.js
  var require_confirmation = __commonJS({
    "src/server/static/js/components/confirmation.js"(exports) {
      var { BaseDialog } = require_base_dialog();
      var LANGS = ["de", "fr", "en"];
      var I18N = {
        fr: {
          yes: "Oui",
          no: "Non",
          confirm: "SVP, Confirmer l'op\xE9ration"
        },
        en: {
          yes: "Yes",
          no: "No",
          confirm: "Please, confirm the operation"
        },
        de: {
          yes: "Ja",
          no: "Nein",
          confirm: "Bitte Vorgang best\xE4tigen"
        }
      };
      var DEFAULTS = {
        lang: "en",
        title: "Confirmation 'title' is not defined !",
        message: "Confirmation 'message' is not defined !"
      };
      exports.Confirmation = class Confirmation extends BaseDialog {
        // Constructor
        constructor(title, message, lang, accept_url, dismiss_url) {
          super(title, message, lang, accept_url, dismiss_url);
          this.confirm_cb = null;
          this.title = title ? title : DEFAULTS.title;
          this.message = message ? message : DEFAULTS.message;
          lang = LANGS.includes(lang) ? lang.toLowerCase() : DEFAULTS.lang;
          this.lang = I18N[lang];
          this.html = nd.util.compress(`
            <div class="modal" data-nduuid="${this.id}" tabindex="-1" role="dialog" aria-labelledby="Modal dialog" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title"><!-- <i class="bi bi-exclamation-circle me-2 text-danger" aria-hidden="true"> --></i>${this.title}</h5>
                        </div>
                        <div class="modal-body">${this.message}</div>
                        <div class="modal-footer">  
                            <div class="d-flex flex-row align-items-center w-100">
                                <div class="col-7">
                                    <!-- Confirmation checkbox -->
                                    <input type="checkbox"><label><i class="bi bi-arrow-left ms-2 me-1"></i>${this.lang.confirm}</label>
                                </div>
                                <div class="col-5 text-end">
                                    <button type="button" class="btn btn-secondary" style="width: 5rem" nd-dismiss>${this.lang.no}</button>
                                    <button type="button" class="btn" style="width: 5rem" nd-accept disabled>${this.lang.yes}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>    
            </div>`);
        }
        cleanup = () => {
          this.confirm_cb.removeEventListener("click", this._confirm_cb_listener);
        };
        // Show the dialog
        async show() {
          super.show().then(() => {
            this.confirm_cb = this.dialog.querySelector("input");
            this.confirm_cb.addEventListener("click", this._confirm_cb_listener);
          });
        }
        // Confirmation checkbox event listener
        _confirm_cb_listener = () => {
          if (this.confirm_cb.checked) {
            this.accept_btn.classList.add("btn-danger");
            this.accept_btn.disabled = false;
          } else {
            this.accept_btn.classList.remove("btn-danger");
            this.accept_btn.disabled = true;
          }
        };
      };
    }
  });

  // src/server/static/js/modules/confirmation_handler.js
  var require_confirmation_handler = __commonJS({
    "src/server/static/js/modules/confirmation_handler.js"(exports) {
      var { ND_EVENTS, DIALOG_CONTAINER_ATTRIBUTE: DIALOG_CONTAINER_ATTRIBUTE2 } = require_constants();
      var { Confirmation: Confirmation2 } = require_confirmation();
      var { BaseHandler } = require_base_handler();
      exports.ConfirmationHandler = class ConfirmationHandler extends BaseHandler {
        constructor() {
          super();
          const container = document.querySelector(`[${DIALOG_CONTAINER_ATTRIBUTE2}]`);
          if (!container)
            throw new Error(`No '${DIALOG_CONTAINER_ATTRIBUTE2}' element is present !`);
          document.addEventListener(ND_EVENTS.CONFIRM, this._modal_event_handler);
        }
        // Baseclass override
        process = (fragment) => {
        };
        // Baseclass override
        postprocess = () => {
        };
        _modal_event_handler = (event) => {
          const detail = event.detail;
          new Confirmation2(detail.header, detail.body, detail.lang, detail.accept_url, detail.dismiss_url).show();
        };
      };
    }
  });

  // src/server/static/js/components/download.js
  var require_download = __commonJS({
    "src/server/static/js/components/download.js"(exports) {
      var { Logger: Logger2 } = require_logger();
      exports.Download = class Download {
        // id: '6ad835f2-a1f5-494c-b587-dd348624be2d', data: Blob, mimetype: 'application/pdf', filename: 'book.pdf'
        constructor(blob, out_filename, preview = false) {
          this._logger = new Logger2(this.constructor.name);
          this._blob = blob;
          this._id = crypto.randomUUID();
          this._href = URL.createObjectURL(blob);
          this._out_filename = out_filename;
          this._preview = preview;
          this._element = null;
          this.html = this._preview ? "" : nd.util.compress(`<a data-nduuid="${this._id}" style="display: none" href="${this._href}", download="${this._out_filename}"a></a>`);
          this._logger.info(this);
        }
        show = () => {
          if (this._preview) {
            window.open(URL.createObjectURL(this._blob), "_blank");
            URL.revokeObjectURL(this._href);
            return;
          }
          const fragment = nd.util.create_fragment(this.html);
          nd.util.insert_fragment(document.body, fragment, true, false);
          this._element = document.querySelector(`[data-nduuid="${this._id}"]`);
          this._logger.info("Showing element", this._element);
          this._element.click();
          setTimeout(() => {
            this._logger.info("Removing element", this._element);
            URL.revokeObjectURL(this._href);
            this._element.remove();
          }, 1e3);
        };
      };
    }
  });

  // src/server/static/js/modules/download_handler.js
  var require_download_handler = __commonJS({
    "src/server/static/js/modules/download_handler.js"(exports) {
      var { ND_EVENTS } = require_constants();
      var { Download } = require_download();
      var { BaseHandler } = require_base_handler();
      exports.DownloadHandler = class DownloadHandler extends BaseHandler {
        constructor() {
          super();
          document.addEventListener(ND_EVENTS.DOWNLOAD, this._download_event_handler);
        }
        // Baseclass override
        process = (fragment) => {
        };
        // Baseclass override
        postprocess = () => {
        };
        _download_event_handler = (event) => {
          const detail = event.detail;
          this._logger.info(event);
          const component = new Download(detail.data, detail.filename, detail.preview);
          component.show();
        };
      };
    }
  });

  // src/server/static/js/modules/fetcher.js
  var require_fetcher = __commonJS({
    "src/server/static/js/modules/fetcher.js"(exports) {
      var { ND_EVENTS, VERSION } = require_constants();
      var { Download } = require_constants();
      var { Logger: Logger2 } = require_logger();
      exports.Fetcher = class Fetcher2 {
        constructor() {
          if (!!Fetcher2._instance) {
            return Fetcher2._instance;
          }
          this._logger = new Logger2("Fetcher");
          Fetcher2._instance = this;
          this._events = [];
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
                this._events = JSON.parse(v);
                content = v;
                match = true;
                break;
              case "x-nd-title":
                document.title = v;
                match = true;
                content = v;
                break;
            }
            if (match)
              this._logger.info(`Received server message '${sse}'. Content: '${content}'.`);
          });
          this._logger.info(`Headers : ${headers_dump}`);
        };
        // Dispatch received events !
        _process_events = (payload) => {
          this._logger.info(`Processing events...`);
          this._events.forEach((event) => {
            this._logger.info(`Event: `, event);
            const type = event.type;
            switch (type) {
              case "nd:download":
                event.detail.data = payload;
                break;
              default:
                break;
            }
            this._logger.info(`Dispatching event '${type}'. Detail: '${JSON.stringify(event.detail)}'.`);
            document.dispatchEvent(new CustomEvent(type, { detail: event.detail }));
          });
          return payload;
        };
        /**
         * fetch_data - fetch data from server as text (default) or json.
         */
        async fetch_data(url) {
          this._logger.info(`Function fetch_data() called. Url: '${url}'.`);
          this._events = [];
          let status = null;
          let data = null;
          const request = new Request(url);
          request.headers.append("X-Nd-Version", `"${VERSION}"`);
          request.headers.append("X-Nd-Url", `"${url}"`);
          document.dispatchEvent(new CustomEvent(ND_EVENTS.FETCH_BEFORE, { detail: { url, data: null, status } }));
          try {
            const response = await fetch(request);
            this._logger.info(`Response status: ${response.status}`);
            if (!response.ok) {
              document.dispatchEvent(new CustomEvent(ND_EVENTS.FETCH_ERROR, { detail: { url, data: null, status: response.status } }));
              this._logger.error(`Response status: ${response.status}`);
              return null;
            }
            this._process_headers(response.headers);
            const payload = await response.blob();
            this._logger.info(`Result is of type '${payload.type}'.`);
            const data2 = await this._process_events(payload).text();
            document.dispatchEvent(new CustomEvent(ND_EVENTS.FETCH_AFTER, { detail: { url, data: data2, status } }));
            return data2;
          } catch (error) {
            document.dispatchEvent(new CustomEvent(ND_EVENTS.FETCH_ERROR, { detail: { url, data: error.message, status } }));
            this._logger.error(`Error on url '${url}':  ${error.message}`);
            return null;
          }
        }
      };
    }
  });

  // src/server/static/js/main.js
  var { INFOS, DIALOG_CONTAINER_ATTRIBUTE } = require_constants();
  var { Debug } = require_debug();
  var { Logger } = require_logger();
  var { Util } = require_util();
  var { Events } = require_events();
  var { SwitchHandler } = require_switch_handler();
  var { PollHandler } = require_poll_handler();
  var { LinkHandler } = require_link_handler();
  var { ToastHandler } = require_toast_handler();
  var { AlertHandler } = require_alert_handler();
  var { DialogHandler } = require_dialog_handler();
  var { ConfirmationHandler } = require_confirmation_handler();
  var { DownloadHandler } = require_download_handler();
  var { Fetcher } = require_fetcher();
  var { Dialog } = require_dialog();
  var { Confirmation } = require_confirmation();
  var { Toast } = require_toast();
  var { Alert } = require_alert();
  var PROG_INFO = `${INFOS.PROGNAME} ${INFOS.VERSION}`;
  if (typeof bootstrap === "undefined")
    throw new Error("Bootstrap library not present !");
  var bs_version = bootstrap.Tooltip.VERSION;
  [bs_major, _, _] = bs_version.split(".");
  if (bs_major < 5)
    throw new Error(`${PROGNAME} needs Bootstrap 5.x.x library. Current Bootstrap version is ${bs_version}.`);
  var debug = new Debug();
  var logger = new Logger("Main");
  logger.info(`${PROG_INFO} : initializing...`);
  window.nd = {
    // Core
    info: INFOS,
    debug,
    util: new Util(),
    events: new Events(),
    fetcher: new Fetcher(),
    // Components
    components: {
      Dialog,
      Confirmation,
      Toast,
      Alert
    },
    // Handlers (will be initialized when DOM is loaded)
    handlers: null,
    // Layer
    layer: {
      open: async (args) => {
        const container = document.querySelector(`[${DIALOG_CONTAINER_ATTRIBUTE}]`);
        if (!container)
          throw new Error(`No ${DIALOG_CONTAINER_ATTRIBUTE} element is present !`);
        const uuid = args.id;
        const fragment = nd.util.create_fragment(args.content);
        nd.util.insert_fragment(container, fragment, true, true);
        const dialog = document.querySelector(`[data-nduuid="${uuid}"]`);
        return dialog;
      }
    },
    refresh: (fragment) => {
      for (const [_2, handler] of Object.entries(nd.handlers)) {
        handler.process(fragment);
      }
      for (const [_2, handler] of Object.entries(nd.handlers)) {
        handler.postprocess();
      }
    },
    create_handlers: () => {
      nd.handlers = {
        poll: new PollHandler(),
        link: new LinkHandler(),
        switch: new SwitchHandler(),
        toast: new ToastHandler(),
        dialog: new DialogHandler(),
        confirmation: new ConfirmationHandler(),
        alert: new AlertHandler(),
        download: new DownloadHandler()
      };
    },
    on_dom_ready: () => {
      logger.info(`Creating handlers...`);
      nd.create_handlers();
      logger.info(`Refreshing the document...`);
      nd.refresh(document);
      logger.info(`${PROG_INFO} : ready !`);
    }
  };
  var { fetch: originalFetch } = window;
  window.Sfetch = async (...args) => {
    const [resource, config] = args;
    const response = await originalFetch(resource, config);
    let events = [];
    response.headers.forEach((v, k) => {
      const sse = k.toLowerCase();
      let match = false;
      let content = null;
      switch (sse) {
        case "x-nd-event":
          events = JSON.parse(v);
          content = v;
          match = true;
          break;
        case "x-nd-title":
          document.title = v;
          match = true;
          content = v;
          break;
        case "x-nd-stream":
          match = true;
          content = v;
      }
      if (match)
        logger.info(`Received server message '${sse}'. Content: '${content}'.`);
    });
    events.forEach((event) => {
      logger.info(`Dispatching event '${event.type}'. Detail: '${JSON.stringify(event.detail)}'.`);
      document.dispatchEvent(new CustomEvent(event.type, { detail: event.detail }));
    });
    console.log("R1", response);
    return response;
  };
  var on_dom_loaded = () => {
    nd.on_dom_ready();
    removeEventListener("DOMContentLoaded", on_dom_loaded);
  };
  navigation.addEventListener("navigate", (event) => {
    const is_download = event.sourceElement.hasAttribute("download");
    if (!is_download) {
      event.preventDefault();
      logger.info(`Prevented navigation to '${event.destination.url}'.`);
    }
  });
  addEventListener("DOMContentLoaded", on_dom_loaded);
})();
