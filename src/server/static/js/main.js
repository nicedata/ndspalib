/**
 * Include needed modules
 */
const PROGNAME = require("./constants.js").PROGNAME;
const VERSION = require("./constants.js").VERSION;
const Debug = require("./modules/debug.js").Debug;
const Util = require("./modules/util.js").Util;
const EventHandler = require("./modules/event_handler.js").EventHandler;
const SwitchHandler = require("./modules/switch_handler.js").SwitchHandler;
const PollHandler = require("./modules/poll_handler.js").PollHandler;
const LinkHandler = require("./modules/link_handler.js").LinkHandler;
const { ToastHandler } = require("./modules/toast_handler.js");
const { ModalHandler } = require("./modules/modal_handler.js");

// Components
const ModalDialog = require("./components/modal_dialog.js").ModalDialog;
const ModalConfirmation = require("./components/modal_confirmation.js").ModalConfirmation;
const Toast = require("./components/toast.js").Toast;

const PROG_INFO = `${PROGNAME} ${VERSION}`;

console.log(`${PROG_INFO} initializing...`);

// Check bootstrap presence and version
if (typeof bootstrap === "undefined") throw new Error("Bootstrap library not present !");
const bs_version = bootstrap.Tooltip.VERSION;
[bs_major, _, _] = bs_version.split(".");
if (bs_major < 5) throw new Error(`${PROGNAME} needs Bootstrap 5.x.x library. Current Bootstrap version is ${bs_version}.`);

// Create the nd object
nd = window.nd ? window.nd : {};

nd.version = VERSION;
nd.debug = new Debug();
nd.util = new Util();
nd.event = new EventHandler(false);

// Components
nd.components = {};
nd.components.ModalDialog = ModalDialog;
nd.components.ModalConfirmation = ModalConfirmation;
nd.components.Toast = Toast;

nd.layer = {};
nd.layer.open = async (args) => {
    const container = document.querySelector("[nd-modal-container]");
    if (!container) throw new Error("No nd-modal-container element is present !");
    const uuid = args.id;
    const fragment = nd.util.create_fragment(args.content);
    nd.util.insert_fragment(container, fragment, true, true);
    const dialog = document.querySelector(`[data-nduuid="${uuid}"]`);
    return dialog;
};

/**
 * Fetch request interceptor
 */
const { fetch: originalFetch } = window;

window.fetch = async (...args) => {
    let [resource, config] = args;
    // request interceptor here
    const response = await originalFetch(resource, config);
    let events = [];
    let title = null;
    let sse = null;

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

    // If there are events, dispatch them !
    events.forEach((event) => {
        document.dispatchEvent(new CustomEvent(event.type, { detail: event.detail }));
    });

    // response interceptor here
    return response;
};

nd.refresh = (fragment) => {
    const HANDLERS = [nd.handlers.poll, nd.handlers.link, nd.handlers.switch, nd.handlers.toast, nd.handlers.modal];
    nd.handlers.poll.process(fragment);
    nd.handlers.link.process(fragment);
    nd.handlers.switch.process(fragment);
    nd.handlers.toast.process(fragment);
    nd.handlers.modal.process(fragment);

    nd.handlers.poll.postprocess();
    nd.handlers.link.postprocess();
    nd.handlers.switch.postprocess();
    nd.handlers.toast.postprocess();
    nd.handlers.modal.postprocess();
};

const on_before_unload = (e) => {
    var confirmationMessage = "\\o/";
    e.returnValue = confirmationMessage; // Gecko, Trident, Chrome 34+
    return confirmationMessage; // Gecko, WebKit, Chrome <34};
};

const on_dom_loaded = () => {
    nd.handlers = {
        poll: new PollHandler(false),
        link: new LinkHandler(false),
        switch: new SwitchHandler(false),
        toast: new ToastHandler(false),
        modal: new ModalHandler(false),
    };
    nd.refresh(document);
    console.log(`${PROG_INFO} ready !`);
    removeEventListener("DOMContentLoaded", on_dom_loaded);
};

// Prevent navigation since this is a Single Page Aplication !
navigation.addEventListener("navigate", (event) => {
    console.log(`Prevented navigation to '${event.destination.url}'.`);
    event.preventDefault();
});

// addEventListener("beforeunload", on_before_unload);
addEventListener("DOMContentLoaded", on_dom_loaded);
