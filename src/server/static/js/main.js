/**
 * Include needed modules
 */
const { INFOS } = require("./constants.js");
const { Debug } = require("./modules/debug.js");
const { Util } = require("./modules/util.js");
const { EventHandler } = require("./modules/event_handler.js");
const { SwitchHandler } = require("./modules/switch_handler.js");
const { PollHandler } = require("./modules/poll_handler.js");
const { LinkHandler } = require("./modules/link_handler.js");
const { ToastHandler } = require("./modules/toast_handler.js");
const { ModalHandler } = require("./modules/modal_handler.js");

// Components
const { ModalDialog } = require("./components/modal_dialog.js");
const { ModalConfirmation } = require("./components/modal_confirmation.js");
const { Toast } = require("./components/toast.js");

const PROG_INFO = `${INFOS.PROGNAME} ${INFOS.VERSION}`;

// Check bootstrap presence and version
if (typeof bootstrap === "undefined") throw new Error("Bootstrap library not present !");
const bs_version = bootstrap.Tooltip.VERSION;
[bs_major, _, _] = bs_version.split(".");
if (bs_major < 5) throw new Error(`${PROGNAME} needs Bootstrap 5.x.x library. Current Bootstrap version is ${bs_version}.`);

console.log(`${PROG_INFO} : initializing...`);

// Create the nd object in the 'window' namespace
window.nd = {
    // Core
    info: INFOS,
    debug: new Debug(),
    util: new Util(false),
    event: new EventHandler(false),
    // Components
    components: {
        ModalDialog: ModalDialog,
        ModalConfirmation: ModalConfirmation,
        Toast: Toast,
    },
    // Handlers (will be initialized when DOM is loaded)
    handlers: null,
    // Layer
    layer: {
        open: async (args) => {
            const container = document.querySelector("[nd-modal-container]");
            if (!container) throw new Error("No nd-modal-container element is present !");
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
            poll: new PollHandler(false),
            link: new LinkHandler(false),
            switch: new SwitchHandler(false),
            toast: new ToastHandler(false),
            modal: new ModalHandler(false),
        };
    },
    on_dom_ready: () => {
        console.log(`Creating handlers...`);
        nd.create_handlers();
        console.log(`Refreshing the document...`);
        nd.refresh(document);
        console.log(`${PROG_INFO} : ready !`);
    },
};

/**
 * Fetch request interceptor
 */
const { fetch: originalFetch } = window;

window.fetch = async (...args) => {
    const [resource, config] = args;
    // request interceptor here
    const response = await originalFetch(resource, config);
    let events = [];

    // Process the response headers
    // Check for the SSE identifier
    response.headers.forEach((v, k) => {
        const sse = k.toLowerCase();
        let match = false;
        switch (sse) {
            case "x-nd-event":
                events = JSON.parse(v);
                match = true;
                break;
            case "x-nd-title":
                document.title = v;
                match = true;
                break;
        }
        if (match && nd.debug.active()) console.log(`Received server message '${sse}'.`);
    });

    // Dispatch received events !
    events.forEach((event) => {
        document.dispatchEvent(new CustomEvent(event.type, { detail: event.detail }));
    });

    // Return the response body
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
    console.log(`Prevented navigation to '${event.destination.url}'.`);
    event.preventDefault();
});

addEventListener("beforeunload", on_before_unload);
addEventListener("DOMContentLoaded", on_dom_loaded);
