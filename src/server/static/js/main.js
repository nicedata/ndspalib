/**
 * Include needed modules
 */
const { INFOS, DIALOG_CONTAINER, NOTIFICATION_CONTAINER } = require("./constants.js");
const { Debug } = require("./modules/debug.js");
const { Logger } = require("./modules/logger.js");
const { Util } = require("./modules/util.js");
const { Events } = require("./modules/events.js");
const { SwitchHandler } = require("./modules/switch_handler.js");
const { PollHandler } = require("./modules/poll_handler.js");
const { SourceHandler } = require("./modules/source_handler.js");
const { VersionHandler } = require("./modules/version_handler.js");
const { LinkHandler } = require("./modules/link_handler.js");
const { EventHandler } = require("./modules/event_handler.js");
const { ZoneHandler } = require("./modules/zone_handler.js");
const { ContextHandler } = require("./modules/context_handler.js");
const { FormHandler } = require("./modules/form_handler.js");
const { Fetcher } = require("./modules/fetcher.js");
// Components
const { Alert, DialogFactory, ConfirmDialog, Toast } = require("./components/dialogs.js");

// Dev
const { Form } = require("./modules/form.js");

const PROG_INFO = `${INFOS.PROGNAME} ${INFOS.VERSION}`;

// Create a logger
const core_logger = new Logger("Core", true);

// Check bootstrap presence and version
if (typeof bootstrap === "undefined") throw new Error("Bootstrap library not present !");
const bs_version = bootstrap.Tooltip.VERSION;
[bs_major, _, _] = bs_version.split(".");
if (bs_major < 5) throw new Error(`${PROGNAME} needs Bootstrap 5.x.x library. Current Bootstrap version is ${bs_version}.`);

const ORIGIN = window.location.origin;

const nd_init = () => {
    return new Promise((resolve) => {
        const debug = new Debug(); // Create a new Debug singleton

        // Create the nd object in the 'window' namespace
        const nd_core = {
            // Core
            info: INFOS,
            version: PROG_INFO,
            debug: debug,
            util: new Util(),
            events: new Events(),
            fetcher: new Fetcher(),
            glogger: core_logger, // The 'Core' logger
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
                    const uuid = args.id;
                    const fragment = nd.util.create_fragment(args.content);

                    // Get the DOM target
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

                    // Insert the new fragment (append AND refresh)
                    nd.util.insert_fragment(nd.dialog_container, fragment, true, true, true);

                    // Get the freshly inserted element
                    const new_element = document.querySelector(`[data-nduuid="${uuid}"]`);

                    // Refresh it !
                    nd.util.refresh(new_element);

                    return new_element;
                },
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
                    new FormHandler(),
                ];
            },

            on_dom_ready: () => {
                nd.dialog_container = document.querySelector(`[${DIALOG_CONTAINER}]`);
                nd.notification_container = document.querySelector(`[${NOTIFICATION_CONTAINER}]`);
                core_logger.info(`Creating handlers...`);
                nd.create_handlers();
                core_logger.info(`Refreshing the document...`);
                nd.util.refresh(document);
            },
        };
        resolve(nd_core);
    });
};

// Handle browser unload event
const on_before_unload = (e) => {
    var confirmationMessage = "\\o/";
    e.returnValue = confirmationMessage; // Gecko, Trident, Chrome 34+
    return confirmationMessage; // Gecko, WebKit, Chrome <34};
};

// Prevent navigation since this is a Single Page Aplication !
navigation.addEventListener("navigate", (event) => {
    const url = new URL(event.destination.url);
    const is_download = event.sourceElement.hasAttribute("download");
    if (!is_download) {
        event.preventDefault();
        core_logger.info(`Prevented navigation to '${event.destination.url}'.`);
    }
});

document.addEventListener("submit", (event) => {
    console.log("Submit", event);
});

// DOM Content Loaded handler
const on_dom_loaded = async () => {
    nd.on_dom_ready();
    removeEventListener("DOMContentLoaded", on_dom_loaded);
};

// initialize framework, then attach it to the current window
core_logger.info(`${PROG_INFO} : initializing...`);
nd_init().then((nd_core) => {
    window.nd = nd_core;
    core_logger.info(`${PROG_INFO} : ready !`);
});

// addEventListener("beforeunload", on_before_unload);
addEventListener("DOMContentLoaded", on_dom_loaded);
