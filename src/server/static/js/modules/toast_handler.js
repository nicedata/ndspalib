const ND_EVENTS = require("../constants.js").ND_EVENTS;
const TOAST_DELAY_MS = require("../constants.js").TOAST_DELAY_MS;

exports.ToastHandler = class ToastHandler {
    constructor() {
        if (typeof window.nd === "undefined") throw new Error("ND library not present !");
        this._targets = [];
        this._delay_ms = TOAST_DELAY_MS;
        this._init();
    }

    reload() {
        this._init();
    }

    _toast_event_handler = (event) => {
        // Create a document fragment from the event detail
        const fragment = nd.util.create_fragment(event.detail);
        // Apply to each target
        this._targets.forEach((target) => {
            // Append
            nd.util.insert_fragment(target, fragment, true);
            const toast_element = target.lastChild;
            toast_element.classList.add("show");
            // Remove after a given delay
            setTimeout(() => {
                toast_element.classList.remove("show");
                toast_element.remove();
            }, this._delay_ms);
        });
    };

    _init() {
        // Get all targets having the nd-toast attribute
        document.querySelectorAll("[nd-toast]").forEach((element) => {
            this._targets.push(element);
        });

        // Add a hd:toast event listener
        document.addEventListener(ND_EVENTS.TOAST, this._toast_event_handler);
    }
};
