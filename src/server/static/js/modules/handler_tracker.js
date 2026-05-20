/**
 * HandlerTracker is a singleton class that keeps track of event handlers added to elements in the DOM.
 *
 * It is designed to work with the ndspalib framework to automatically remove event listeners from elements that are no longer in the DOM after a DOM update.
 * The main idea is to use a WeakRef to keep track of the elements without preventing them from being garbage collected.
 *
 * It allows to automatically remove event listeners from elements that are no longer in the DOM after a DOM update.
 * It provides a postprocess method that should be called after each DOM update to remove event listeners from elements that are no longer in the DOM.
 * It also provides an add_listener method to add event listeners to elements and track them.
 */
const { Logger } = require("./logger.js");

/**
 * A TrackedItem is a structure to keep track of an event handler.
 * It contains a WeakRef to the element, the tracker ID, the event, the handler and the use_capture flag.
 */
class TrackedItem {
    constructor(weakref, trackid, event, handler, use_capture) {
        this.weakref = weakref; // A WeakRef to the element
        this.trackid = trackid; // The tracker ID (from the data-ndtrack attribute)
        this.event = event; //The event to listen for
        this.handler = handler; // The event handler function
        this.use_capture = use_capture; // The use_capture flag for the event listener
    }
}

/**
 * HandlerTracker is a singleton class that keeps track of event handlers added to elements in the DOM.
 */
exports.HandlerTracker = class HandlerTracker {
    static LOGGER = new Logger("HandlerTracker", true);
    constructor() {
        // Singleton !
        if (!!HandlerTracker._instance) {
            return HandlerTracker._instance;
        }
        this.logger = HandlerTracker.LOGGER;
        this.tracked_handlers = []; // A list of TrackedItems
        HandlerTracker._instance = this;
    }

    /**
     * Registers an event listener on an element and keeps track of it.
     * It uses a WeakRef to keep track of the element without preventing it from being garbage collected.
     * The element must have a 'data-ndtrack' attribute to be tracked. If it doesn't have one, it will be generated automatically.
     *
     * @param {Element} element - The element to which the event listener is added.
     * @param {string} event - The event to listen for.
     * @param {function} handler - The event handler function.
     * @param {boolean} use_capture - The use_capture flag for the event listener.
     */
    _register_listener = (element, event, handler, use_capture = false) => {
        const weakref = new WeakRef(element);
        weakref.deref().addEventListener(event, handler, use_capture);
        const tracked_item = new TrackedItem(weakref, element.dataset.ndtrack, event, handler, use_capture);
        this.tracked_handlers.push(tracked_item);
        this.logger.info(`Tracking '${event}' handler on element '${element.tagName.toLowerCase()}' (${element.dataset.ndtrack}).`);
    };

    process(fragment) {}

    /**
     * Postprocess method to be called after each DOM update to remove event listeners from elements that are no longer in the DOM.
     * It checks each tracked handler and if the element is no longer in the DOM, it removes the event listener and removes the handler from the tracked list.
     * It also logs the number of handlers removed and kept after the postprocessing.
     */
    postprocess() {
        this.logger.info(`Postprocessing : ${this.tracked_handlers.length} handler(s) to check.`);
        if (this.tracked_handlers.length === 0) return;

        // We use slice() to create a copy of the tracked_handlers array because we will modify the original array while iterating.
        let deleted_count = 0;
        this.tracked_handlers.slice().forEach((item) => {
            const uuid = item.trackid;

            // If the element is still in the DOM, we keep the handler and do nothing
            const selector = `[data-ndtrack="${uuid}"]`;
            if (document.querySelector(selector)) return;

            // If the element is no longer in the DOM, we remove the event listener and remove the handler from the tracked list
            // We use the WeakRef to get the element, if it is still in memory.
            // If it is not in memory, it means that it has been garbage collected and we don't need to do anything.
            const element = item.weakref.deref();
            if (element) {
                this.logger.info(`Cleaning '${item.event}' handler on '${element.tagName.toLowerCase()}' (${uuid}).`);
                element.removeEventListener(item.event, item.handler, item.use_capture);
            } else {
                this.logger.info(`Element '${uuid}' already went to garbage (GC).`);
            }

            // We remove the handler from the tracked list
            const index = this.tracked_handlers.findIndex(({ trackid }) => trackid === uuid);
            this.tracked_handlers.splice(index, 1);
            deleted_count++;
        });
        this.logger.info(`Postprocessing : ${deleted_count} handler(s) removed. ${this.tracked_handlers.length} handlers(s) kept.`);
    }

    /**
     * Adds an event listener to an element and tracks it. It uses the _register_listener method to register the event listener and track it.
     * If the element doesn't have a 'data-ndtrack' attribute, it will be generated automatically.
     *
     * @param {*} element
     * @param {*} event
     * @param {*} handler
     * @param {*} use_capture
     */
    add_listener = (element, event, handler, use_capture = false) => {
        // If the element doesn't have a 'data-ndtrack' attribute, we generate one automatically
        if (!element.hasAttribute("data-ndtrack")) {
            element.dataset.ndtrack = crypto.randomUUID();
        }
        // We register the event listener and track it
        this._register_listener(element, event, handler, use_capture);
    };
};
