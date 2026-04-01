/**
 * Include needed modules
 */
const { INFOS, DIALOG_CONTAINER_ATTRIBUTE } = require("./constants.js");
const { Debug } = require("./modules/debug.js");
const { Logger } = require("./modules/logger.js");
const { Util } = require("./modules/util.js");
const { Events } = require("./modules/events.js");
const { SwitchHandler } = require("./modules/switch_handler.js");
const { PollHandler } = require("./modules/poll_handler.js");
const { LinkHandler } = require("./modules/link_handler.js");
const { ToastHandler } = require("./modules/toast_handler.js");
const { AlertHandler } = require("./modules/alert_handler.js");
const { DialogHandler } = require("./modules/dialog_handler.js");
const { ConfirmationHandler } = require("./modules/confirmation_handler.js");
const { DownloadHandler } = require("./modules/download_handler.js");
const { Fetcher } = require("./modules/fetcher.js");

// Components
const { Dialog } = require("./components/dialog.js");
const { Confirmation } = require("./components/confirmation.js");
const { Toast } = require("./components/toast.js");
const { Alert } = require("./components/alert.js");

const PROG_INFO = `${INFOS.PROGNAME} ${INFOS.VERSION}`;

// Check bootstrap presence and version
if (typeof bootstrap === "undefined") throw new Error("Bootstrap library not present !");
const bs_version = bootstrap.Tooltip.VERSION;
[bs_major, _, _] = bs_version.split(".");
if (bs_major < 5) throw new Error(`${PROGNAME} needs Bootstrap 5.x.x library. Current Bootstrap version is ${bs_version}.`);

const debug = new Debug(); // Create a new Debug singleton
const logger = new Logger("Main"); // Create a logger for this module (Main)
// const fetcher = new Fetcher(); // Create a new Fetcher singleton

logger.info(`${PROG_INFO} : initializing...`);

// Create the nd object in the 'window' namespace
window.nd = {
    // Core
    info: INFOS,
    debug: debug,
    util: new Util(),
    events: new Events(),
    fetcher: new Fetcher(),
    // Components
    components: {
        Dialog: Dialog,
        Confirmation: Confirmation,
        Toast: Toast,
        Alert: Alert,
    },
    // Handlers (will be initialized when DOM is loaded)
    handlers: null,
    // Layer
    layer: {
        open: async (args) => {
            const container = document.querySelector(`[${DIALOG_CONTAINER_ATTRIBUTE}]`);
            if (!container) throw new Error(`No ${DIALOG_CONTAINER_ATTRIBUTE} element is present !`);
            const uuid = args.id;
            const fragment = nd.util.create_fragment(args.content);
            nd.util.insert_fragment(container, fragment, true, true);
            const dialog = document.querySelector(`[data-nduuid="${uuid}"]`);
            return dialog;
        },
    },
    refresh: (fragment) => {
        // Step 1 : process the fragment (update handlers)
        for (const [_, handler] of Object.entries(nd.handlers)) {
            handler.process(fragment);
        }

        // Step 2 : postprocess the (update handlers)
        for (const [_, handler] of Object.entries(nd.handlers)) {
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
            download: new DownloadHandler(),
        };
    },
    on_dom_ready: () => {
        logger.info(`Creating handlers...`);
        nd.create_handlers();
        logger.info(`Refreshing the document...`);
        nd.refresh(document);
        logger.info(`${PROG_INFO} : ready !`);
    },
};

/**
 * Fetch request interceptor
 */
const { fetch: originalFetch } = window;

window.Sfetch = async (...args) => {
    const [resource, config] = args;

    // request interceptor here
    const response = await originalFetch(resource, config);
    let events = [];

    // Process the response headers - check for SSE identifiers
    response.headers.forEach((v, k) => {
        const sse = k.toLowerCase();
        // this._logger.info(`${k} -> ${v}`);
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
        if (match) logger.info(`Received server message '${sse}'. Content: '${content}'.`);
    });

    // Dispatch received events !
    events.forEach((event) => {
        logger.info(`Dispatching event '${event.type}'. Detail: '${JSON.stringify(event.detail)}'.`);
        document.dispatchEvent(new CustomEvent(event.type, { detail: event.detail }));
    });

    // Return the response body
    console.log("R1", response);
    return response;
};

const on_before_unload = (e) => {
    var confirmationMessage = "\\o/";
    e.returnValue = confirmationMessage; // Gecko, Trident, Chrome 34+
    return confirmationMessage; // Gecko, WebKit, Chrome <34};
};

const on_dom_loaded = () => {
    nd.on_dom_ready();
    removeEventListener("DOMContentLoaded", on_dom_loaded);
};

// Prevent navigation since this is a Single Page Aplication !
navigation.addEventListener("navigate", (event) => {
    const is_download = event.sourceElement.hasAttribute("download");
    if (!is_download) {
        event.preventDefault();
        logger.info(`Prevented navigation to '${event.destination.url}'.`);
    }
});

// addEventListener("beforeunload", on_before_unload);
addEventListener("DOMContentLoaded", on_dom_loaded);
