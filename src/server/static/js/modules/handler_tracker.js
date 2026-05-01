/**
 * This class implements structures and methods to avoid event handler to be created and never been destroyed.
 */
const { Logger } = require("./logger.js");

exports.HandlerTracker = class HandlerTracker {
    static LOGGER = new Logger("HandlerTracker", true);
    constructor() {
        // Singleton !
        if (!!HandlerTracker._instance) {
            return HandlerTracker._instance;
        }
        this.logger = HandlerTracker.LOGGER;
        this.handlers = [];
        HandlerTracker._instance = this;
    }

    _register_listener = (element, event, handler, use_capture = null) => {
        const weakref = new WeakRef(element);
        use_capture === true ? weakref.deref().addEventListener(event, handler, use_capture) : weakref.deref().addEventListener(event, handler);

        const item = {
            weakref: weakref,
            trackid: element.dataset.ndtrack,
            event: event,
            handler: handler,
            use_capture: use_capture,
        };
        this.handlers.push(item);
        this.logger.info(`Tracking '${event}' handler on element '${element.tagName.toLowerCase()}' (${element.dataset.ndtrack}).`);
    };

    process(fragment) {}

    postprocess() {
        // Remove event listeners from elements which are not in the DOM
        this.logger.info(`Postprocessing : ${this.handlers.length} handler(s) to check.`);
        if (this.handlers.length === 0) return;

        // We use a copy of the original since we'll permorm mutations !
        let deleted_count = 0;
        this.handlers.slice().forEach((tracker) => {
            const uuid = tracker.trackid;
            const selector = `[data-ndtrack="${uuid}"]`;

            // If the tracked element is in the DOM, skip
            if (document.querySelector(selector)) return;

            const element = tracker.weakref.deref();
            if (element) {
                this.logger.info(`Cleaning '${tracker.event}' handler on '${element.tagName.toLowerCase()}' (${uuid}).`);
                // Remove the event listener
                element.removeEventListener(tracker.event, tracker.handler);
            } else {
                this.logger.info(`Element '${uuid}' already went to garbage (GC).`);
            }
            // Remove this tracker from the list
            const index = this.handlers.findIndex(({ trackid }) => trackid === uuid);
            this.handlers.splice(index, 1);
            deleted_count++;
        });
        this.logger.info(`Postprocessing : ${deleted_count} handler(s) removed. ${this.handlers.length} handlers(s) kept.`);
    }

    add_listener = (element, event, handler) => {
        if (!element.hasAttribute("data-ndtrack")) {
            element.dataset.ndtrack = crypto.randomUUID();
        }
        this._register_listener(element, event, handler);
    };
};
