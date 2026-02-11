(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // src/server/static/js/constants.js
  var require_constants = __commonJS({
    "src/server/static/js/constants.js"(exports) {
      exports.PROGNAME = "NDS SPA utilities";
      exports.VERSION = "1.0.0-dev";
      exports.PREFIX = "nd";
      exports.ND_EVENTS = {
        POLL_START: "nd:poll:start",
        POLL_END: "nd:poll:end",
        FRAGMENT_BEFORE_INSERT: "nd:fragment:before_insert",
        FRAGMENT_AFTER_INSERT: "nd:fragment:after_insert",
        FETCH_BEFORE: "nd:fetch:before",
        FETCH_AFTER: "nd:fetch:after",
        FETCH_ERROR: "nd:fetch:error",
        TOAST: "nd:toast"
      };
      exports.TOAST_DELAY_MS = 3e3;
      exports.POLL_DEFAULT_INTERVAL_MS = 1e4;
    }
  });

  // src/server/static/js/modules/debug.js
  var require_debug = __commonJS({
    "src/server/static/js/modules/debug.js"(exports) {
      var PROGNAME = require_constants().PROGNAME;
      exports.Debug = class Debug {
        constructor() {
          this._debug = true;
        }
        enable() {
          this._debug = true;
          console.log(`${PROGNAME}: debugging is enabled.`);
        }
        disable() {
          this._debug = false;
          console.log(`${PROGNAME}: debugging is disabled.`);
        }
        active() {
          return this._debug;
        }
      };
    }
  });

  // src/server/static/js/modules/util.js
  var require_util = __commonJS({
    "src/server/static/js/modules/util.js"(exports) {
      var ND_EVENTS = require_constants().ND_EVENTS;
      var VERSION = require_constants().VERSION;
      exports.Util = class Util {
        constructor() {
        }
        /**
         * noop - function that does nothing.
         */
        noop() {
        }
        /**
         * get_targets - get all elements by a selector,
         */
        get_targets(selector) {
          if (typeof selector !== "string" || !selector)
            return Array(0);
          selector = selector.trim();
          return Array.from(document.querySelectorAll(selector));
        }
        /**
         * clear_node - delete a specific node.
         */
        clear_node(node) {
          const range = document.createRange();
          range.selectNodeContents(node);
          range.deleteContents();
        }
        /**
         * create_fragment - create a document fragment from HTML code.
         */
        create_fragment(html) {
          const range = document.createRange();
          return range.createContextualFragment(html);
        }
        /**
         * insert_fragment - replace or append a fragment in a specific target.
         */
        insert_fragment(target, fragment, append = false, refresh = false) {
          document.dispatchEvent(new CustomEvent(ND_EVENTS.FRAGMENT_BEFORE_INSERT, { detail: { target, fragment, append } }));
          append ? this.noop() : this.clear_node(target);
          const result = target.appendChild(fragment);
          refresh ? nd.refresh(target) : this.noop();
          document.dispatchEvent(new CustomEvent(ND_EVENTS.FRAGMENT_AFTER_INSERT, { detail: { target, data: fragment, append } }));
          return result;
        }
        /**
         * fetch_data - fetch data from server as text (default) or json.
         */
        async fetch_data(url, as_json = false) {
          let status = null;
          const request = new Request(url);
          request.headers.append("X-Nd-Version", `"${VERSION}"`);
          request.headers.append("X-Nd-Url", `"${url}"`);
          document.dispatchEvent(new CustomEvent(ND_EVENTS.FETCH_BEFORE, { detail: { url, data: null, status } }));
          try {
            const response = await fetch(request);
            status = response.status;
            if (!response.ok) {
              document.dispatchEvent(new CustomEvent(ND_EVENTS.FETCH_ERROR, { detail: { url, data: null, status } }));
              throw new Error(`Response status: ${response.status}`);
            }
            const result = as_json ? await response.json() : await response.text();
            document.dispatchEvent(new CustomEvent(ND_EVENTS.FETCH_AFTER, { detail: { url, data: result, status } }));
            return result;
          } catch (error) {
            document.dispatchEvent(new CustomEvent(ND_EVENTS.FETCH_ERROR, { detail: { url, data: error.message, status } }));
            console.error(`Error on url '${url}':  ${error.message}`);
            return null;
          }
        }
        /**
         * sleep_ms - sleep during a specific period (ms).
         */
        async sleep_ms(ms) {
          console.log(`Sleeping for ${ms}ms`);
          await new Promise((resolve) => setTimeout(resolve, ms));
        }
        /**
         * compress - Compress a string (remove duplicate whitechars).
         */
        compress(str) {
          if (typeof str !== "string")
            return str;
          return str.replace(/\n+/g, " ").replace(/\r+/g, " ").replace(/  +/g, " ");
        }
      };
    }
  });

  // src/server/static/js/modules/event_handler.js
  var require_event_handler = __commonJS({
    "src/server/static/js/modules/event_handler.js"(exports) {
      exports.EventHandler = class EventHandler {
        constructor(debug = false) {
          this._debug = debug;
          this.listeners = [];
        }
        /**
         * Add event listeners
         *
         * Calling forms :
         *    Form 1 :  on(event, listener)
         *    Form 2 :  on(event, selector, listener)
         */
        on(...args) {
          let [event, selector, listener] = [null, null, args.pop()];
          switch (args.length) {
            case 1:
              event = args.pop();
              this._debug ? console.log("Form 1", event, listener) : () => {
              };
              this.listeners.push([event, selector, listener]);
              document.addEventListener(event, listener);
              break;
            case 2:
              [selector, event] = [args.pop(), args.pop()];
              this._debug ? console.log("Form 2", event, selector, listener) : () => {
              };
              document.querySelectorAll(selector).forEach((element) => {
                this.listeners.push([event, element, listener]);
                element.addEventListener(event, listener);
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
          let [event, selector, listener] = [args.pop(), null, null];
          switch (args.length) {
            case 0:
              this.listeners.forEach((item, index) => {
                const [event2, element, listener2] = item;
                if (event2 === event2) {
                  this._debug ? console.log("off, form 1", event2, element, listener2) : () => {
                  };
                  document.removeEventListener(event2, listener2);
                  this.listeners.splice(index, 1);
                }
              });
              break;
            case 1:
              selector = args.pop();
              Array.from(document.querySelectorAll(selector)).forEach((target) => {
                this.listeners.forEach((item, index) => {
                  const [event2, element, listener2] = item;
                  this._debug ? console.log("off, form 2", event2, element, listener2) : () => {
                  };
                  if (event2 === event2 && element === target) {
                    element.removeEventListener(event2, listener2);
                    this.listeners.splice(index, 1);
                  }
                });
              });
              break;
            default:
              return;
          }
        }
      };
    }
  });

  // src/server/static/js/modules/base_handler.js
  var require_base_handler = __commonJS({
    "src/server/static/js/modules/base_handler.js"(exports) {
      exports.BaseHandler = class BaseHandler {
        constructor(debug = false) {
          const class_name = this.constructor.name;
          debug ? console.log(`${class_name} debug is ON.`) : () => {
          };
          if (typeof window.nd === "undefined")
            throw new Error("ND library not present !");
          this._debug = debug;
        }
        /**
         * Process a given fragment.
         */
        process(fragment) {
          throw new Error("The 'process(fragment)' method is not implemented.");
        }
        /**
         * Clean the DOM after loading fragments
         */
        postprocess() {
          throw new Error("The 'postprocess(fragment)' method is not implemented.");
        }
        /**
         * Set an uuid on an element
         */
        set_uuid(element) {
          const uuid = crypto.randomUUID();
          element.dataset.nduuid = uuid;
          return uuid;
        }
      };
    }
  });

  // src/server/static/js/modules/switch_handler.js
  var require_switch_handler = __commonJS({
    "src/server/static/js/modules/switch_handler.js"(exports) {
      BaseHandler = require_base_handler().BaseHandler;
      exports.SwitchHandler = class SwitchHandler extends BaseHandler {
        constructor(debug) {
          super(debug);
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
            const nd_options = element.getAttribute("nd-options-url");
            if (element.tagName !== "SELECT") {
              if (nd.debug.active()) {
                console.warn("<nd-switch> only applies to 'select' tags !", element);
              } else
                throw new Error(`X<nd-switch> only applies to 'select' tags ! ${element.innerHTML}`);
            }
            if (nd_options) {
              nd.util.fetch_data(nd_options).then((data) => {
                const fragment2 = nd.util.create_fragment(data);
                nd.util.insert_fragment(element, fragment2);
              });
            }
            const targets = Array();
            nd_switch.split(" ").forEach((s) => {
              if (s) {
                document.querySelectorAll(s).forEach((t) => {
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
        _update_targets(selector, targets) {
          const value = selector.options[selector.selectedIndex].getAttribute("value");
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
                nd.util.fetch_data(url).then((data) => {
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
      var POLL_DEFAULT_INTERVAL_MS = require_constants().POLL_DEFAULT_INTERVAL_MS;
      BaseHandler = require_base_handler().BaseHandler;
      exports.PollHandler = class PollHandler extends BaseHandler {
        constructor(debug = false) {
          super(debug);
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
              if (this._debug)
                console.log(`Cleared timeout ${timer.id} for ${timer.uuid}.`);
            }
          });
          timers_to_clear.forEach((timer) => {
            const index = this._timers.indexOf(timer);
            this._timers.splice(index, 1);
            if (this._debug)
              console.log(`Removed timer ${timer.id} for ${timer.uuid}.`);
          });
          this._debug ? console.log(`Poll timers count: ${this._timers.length}`) : () => {
          };
        }
        /**
         * Clear the polling timers
         */
        _clear_timers() {
          this._timers.forEach((e) => {
            clearTimeout(e.id);
            if (this._debug)
              console.log(`Removed poll timeout ${e.id} for ${e.uuid}`);
          });
          this._timers = [];
        }
        /**
         * Process (internal) a given fragment (HTML element)
         */
        _process(fragment) {
          fragment.querySelectorAll(`[nd-poll]`).forEach((element) => {
            const url = element.getAttribute("nd-url");
            const selector = element.getAttribute("nd-target");
            const targets = selector ? nd.util.get_targets(selector) : [element];
            let interval_ms = element.getAttribute("nd-interval");
            const uuid = this.set_uuid(element);
            if (!url) {
              if (this._debug) {
                console.warn("No <nd-url> defined on", element);
              } else
                throw new Error(`No <nd-url> defined on '${element.innerHTML}'`);
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
          if (this._debug)
            console.log("Poller count before:", this._timers.length);
          const timeout_id = setTimeout(() => {
            clearTimeout(timeout_id);
            const result = this._timers.find(({ id, uuid: uuid2 }) => id === timeout_id);
            const index = this._timers.indexOf(result);
            this._timers.splice(index, 1);
            if (!document.hidden) {
              nd.util.fetch_data(url).then((data) => {
                targets.forEach((t) => {
                  const fragment = nd.util.create_fragment(data);
                  nd.util.insert_fragment(t, fragment, false, true);
                });
              });
            }
            this._poll(uuid, url, targets, interval_ms);
          }, interval_ms);
          this._timers.push({ id: timeout_id, uuid });
          if (this._debug)
            console.log("Poller count after:", this._timers.length);
        }
      };
    }
  });

  // src/server/static/js/modules/link_handler.js
  var require_link_handler = __commonJS({
    "src/server/static/js/modules/link_handler.js"(exports) {
      BaseHandler = require_base_handler().BaseHandler;
      exports.LinkHandler = class LinkHandler extends BaseHandler {
        constructor(debug = false) {
          super(debug);
          this._handlers = [];
        }
        /**
         * Process a given fragment.
         */
        process(fragment) {
          if (document.querySelectorAll("[nd-link]").length == 0)
            return;
          this._process(fragment);
        }
        /**
         * Clean the DOM (remove unused handlers)
         */
        postprocess() {
          const handlers_to_remove = [];
          this._handlers.forEach((uuid) => {
            if (document.querySelectorAll(`[data-nduuid="${uuid}"]`).length == 0) {
              handlers_to_remove.push(uuid);
            }
          });
          handlers_to_remove.forEach((uuid) => {
            const index = this._handlers.indexOf(uuid);
            this._handlers.splice(index, 1);
            if (this._debug)
              console.log(`Removed link handler for ${uuid}`);
          });
          this._debug ? console.log(`Link handlers count: ${this._handlers.length}`) : () => {
          };
        }
        _click_handler(event, url, targets) {
          event.preventDefault();
          nd.util.fetch_data(url).then((data) => {
            if (data) {
              targets.forEach((t) => {
                const fragment = nd.util.create_fragment(data);
                nd.util.insert_fragment(t, fragment, false, true);
              });
            }
          });
        }
        /**
         * Process (internal) a given fragment (HTML element)
         */
        _process(fragment) {
          fragment.querySelectorAll("[nd-link]").forEach((element) => {
            let url = element.getAttribute("href");
            url = url ? url : element.getAttribute("nd-url");
            const append = false;
            const selector = element.getAttribute("nd-target");
            const targets = selector ? nd.util.get_targets(selector) : [];
            if (!url) {
              if (nd.debug.active()) {
                console.warn("No <nd-url> defined on: %o", element);
              } else
                throw new Error(`No <nd-url> defined on: ${element.innerHTML}`);
            }
            if (!targets.length && selector && selector.toLowerCase() !== "none") {
              if (nd.debug.active()) {
                console.warn("No <nd-target> defined on: %o", element);
              } else
                throw new Error(`No <nd-target> defined on: ${element.innerHTML}`);
            }
            const uuid = this.set_uuid(element);
            if (url) {
              element.addEventListener("click", (event) => {
                this._click_handler(event, url, targets);
              });
              this._handlers.push(uuid);
            }
          });
        }
      };
    }
  });

  // src/server/static/js/modules/toast_handler.js
  var require_toast_handler = __commonJS({
    "src/server/static/js/modules/toast_handler.js"(exports) {
      var ND_EVENTS = require_constants().ND_EVENTS;
      var TOAST_DELAY_MS = require_constants().TOAST_DELAY_MS;
      exports.ToastHandler = class ToastHandler {
        constructor() {
          if (typeof window.nd === "undefined")
            throw new Error("ND library not present !");
          this._targets = [];
          this._delay_ms = TOAST_DELAY_MS;
          this._init();
        }
        reload() {
          this._init();
        }
        _toast_event_handler = (event) => {
          const fragment = nd.util.create_fragment(event.detail);
          this._targets.forEach((target) => {
            nd.util.insert_fragment(target, fragment, true);
            const toast_element = target.lastChild;
            toast_element.classList.add("show");
            setTimeout(() => {
              toast_element.classList.remove("show");
              toast_element.remove();
            }, this._delay_ms);
          });
        };
        _init() {
          document.querySelectorAll("[nd-toast]").forEach((element) => {
            this._targets.push(element);
          });
          document.addEventListener(ND_EVENTS.TOAST, this._toast_event_handler);
        }
      };
    }
  });

  // src/server/static/js/components/modal_dialog.js
  var require_modal_dialog = __commonJS({
    "src/server/static/js/components/modal_dialog.js"(exports) {
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
        title: "ModalDialog.title is not defined !",
        message: "ModalDialog.message is not defined !",
        // No Operation function
        noop: () => {
          console.log("NOOP");
        }
      };
      exports.ModalDialog = class ModalDialog {
        // Constructor
        constructor(title, message, lang) {
          this.dialog = null;
          this.bs_dialog = null;
          this.title = title ? title : DEFAULTS.title;
          this.message = message ? message : DEFAULTS.message;
          lang = LANGS.includes(lang) ? lang.toLowerCase() : DEFAULTS.lang;
          this.lang = I18N[lang];
          this.id = crypto.randomUUID();
          this.html = nd.util.compress(`
            <div class="modal" data-nduuid="${this.id}" tabindex="-1" role="dialog" aria-labelledby="Modal dialog" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title"><i class="bi bi-question-circle me-2" aria-hidden="true"></i>${this.title}</h5>
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
          console.log(this.html);
          this._accept_handler = DEFAULTS.noop;
          this._cancel_handler = DEFAULTS.noop;
          this._on_accept = (event) => {
            this._accept_handler();
            this._remove_event_handlers();
          };
          this._on_cancel = (event) => {
            this._cancel_handler();
            this._remove_event_handlers();
          };
          this._remove_event_handlers = () => {
            this.bs_dialog.hide();
            nd.event.off(`nd:${this.id}:accept`);
            nd.event.off(`nd:${this.id}:dismiss`);
            this.dialog.remove();
          };
          nd.event.on(`nd:${this.id}:accept`, this._on_accept);
          nd.event.on(`nd:${this.id}:dismiss`, this._on_cancel);
        }
        // Set another accept handler
        set_accept_handler(func = DEFAULTS.noop) {
          if (typeof func === "function")
            this._accept_handler = func;
        }
        // Set another cancel handler
        set_cancel_handler(func = DEFAULTS.noop) {
          if (typeof func === "function")
            this._cancel_handler = func;
        }
        // Show the dialog
        async show() {
          this.dialog = await nd.layer.open({
            mode: "modal",
            // We want a modal !
            content: this.html,
            // HTML content
            id: this.id,
            // Set the current context (timestamp)
            dismissable: "button",
            // Use only buttons to dismiss the dialog !
            history: false
            // Do not track url changes
          });
          this.bs_dialog = new bootstrap.Modal(this.dialog, { backdrop: "static" });
          const accept_btn = this.dialog.querySelector("[nd-accept]");
          const cancel_btn = this.dialog.querySelector("[nd-dismiss]");
          accept_btn.addEventListener("click", (e) => {
            document.dispatchEvent(new CustomEvent(`nd:${this.id}:accept`, { detail: { id: this.id } }));
          });
          cancel_btn.addEventListener("click", (e) => {
            document.dispatchEvent(new CustomEvent(`nd:${this.id}:dismiss`, { detail: { id: this.id } }));
          });
          this.bs_dialog.show();
        }
      };
    }
  });

  // src/server/static/js/main.js
  var require_main = __commonJS({
    "src/server/static/js/main.js"() {
      var PROGNAME = require_constants().PROGNAME;
      var VERSION = require_constants().VERSION;
      var Debug = require_debug().Debug;
      var Util = require_util().Util;
      var EventHandler = require_event_handler().EventHandler;
      var SwitchHandler = require_switch_handler().SwitchHandler;
      var PollHandler = require_poll_handler().PollHandler;
      var LinkHandler = require_link_handler().LinkHandler;
      var ToastHandler = require_toast_handler().ToastHandler;
      var ModalDialog = require_modal_dialog().ModalDialog;
      var PROG_INFO = `${PROGNAME} ${VERSION}`;
      console.log(`${PROG_INFO} initializing...`);
      if (typeof bootstrap === "undefined")
        throw new Error("Bootstrap library not present !");
      var bs_version = bootstrap.Tooltip.VERSION;
      [bs_major, _, _] = bs_version.split(".");
      if (bs_major < 5)
        throw new Error(`${PROGNAME} needs Bootstrap 5.x.x library. Current Bootstrap version is ${bs_version}.`);
      nd = window.nd ? window.nd : {};
      nd.version = VERSION;
      nd.debug = new Debug();
      nd.util = new Util();
      nd.event = new EventHandler();
      nd.components = {};
      nd.components.ModalDialog = ModalDialog;
      nd.layer = {};
      nd.layer.open = async (args) => {
        const container = document.querySelector("[nd-modal-container]");
        if (!container)
          throw new Error("No nd-modal-container element is present !");
        const uuid = args.id;
        const fragment = nd.util.create_fragment(args.content);
        nd.util.insert_fragment(container, fragment, true, true);
        const dialog = document.querySelector(`[data-nduuid="${uuid}"]`);
        return dialog;
      };
      var { fetch: originalFetch } = window;
      window.fetch = async (...args) => {
        let [resource, config] = args;
        const response = await originalFetch(resource, config);
        let events = [];
        let title = null;
        let sse = null;
        response.headers.forEach((v, k) => {
          const sse2 = k.toLowerCase();
          let match = false;
          switch (sse2) {
            case "x-nd-event":
              events = JSON.parse(v);
              match = true;
            case "x-nd-title":
              document.title = v;
              match = true;
          }
          if (match && nd.debug.active())
            console.log(`Received server message '${sse2}'.`);
        });
        events.forEach((event) => {
          document.dispatchEvent(new CustomEvent(event.type, { detail: event.detail }));
        });
        return response;
      };
      nd.refresh = (fragment) => {
        const HANDLERS = [nd.handlers.poll, nd.handlers.link, nd.handlers.switch, nd.handlers.toast];
        nd.handlers.poll.process(fragment);
        nd.handlers.link.process(fragment);
        nd.handlers.switch.process(fragment);
        nd.handlers.poll.postprocess();
        nd.handlers.link.postprocess();
        nd.handlers.switch.postprocess();
      };
      var on_dom_loaded = () => {
        nd.handlers = {
          poll: new PollHandler(false),
          link: new LinkHandler(false),
          switch: new SwitchHandler(true),
          toast: new ToastHandler()
        };
        nd.refresh(document);
        console.log(`${PROG_INFO} ready !`);
        removeEventListener("DOMContentLoaded", on_dom_loaded);
      };
      navigation.addEventListener("navigate", (event) => {
        console.log(`Prevented navigation to '${event.destination.url}'.`);
        event.preventDefault();
      });
      addEventListener("DOMContentLoaded", on_dom_loaded);
    }
  });

  // src/server/static/js/package.js
  require_main();
})();
