exports.EventHandler = class EventHandler {
    constructor(debug = false) {
        const class_name = this.constructor.name;
        debug ? console.log(`${class_name} debug is ON.`) : () => {};
        this._debug = debug;
        this.listeners = []; // List of form [(event, element, listener), ...]
    }

    /**
     * Add event listeners
     *
     * Calling forms :
     *    Form 1 :  on(event, listener)
     *    Form 2 :  on(event, selector, listener)
     */
    on(...args) {
        // Last argument is always the listener function
        let [event, selector, listener] = [null, null, args.pop()];

        switch (args.length) {
            case 1: // Form 1
                event = args.pop();
                this._debug ? console.log("Form 1", event, listener) : () => {};
                this.listeners.push([event, selector, listener]);
                document.addEventListener(event, listener);
                break;
            case 2: // Form 2
                [selector, event] = [args.pop(), args.pop()];
                this._debug ? console.log("Form 2", event, selector, listener) : () => {};
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
        // First argument is now the event name
        let [event, selector, listener] = [args.pop(), null, null];

        switch (args.length) {
            case 0:
                this.listeners.forEach((item, index) => {
                    const [event, element, listener] = item;
                    if (event === event) {
                        this._debug ? console.log("off, form 1", event, element, listener) : () => {};
                        document.removeEventListener(event, listener);
                        this.listeners.splice(index, 1);
                    }
                });
                break;
            case 1:
                selector = args.pop();
                Array.from(document.querySelectorAll(selector)).forEach((target) => {
                    this.listeners.forEach((item, index) => {
                        const [event, element, listener] = item;
                        this._debug ? console.log("off, form 2", event, element, listener) : () => {};
                        if (event === event && element === target) {
                            element.removeEventListener(event, listener);
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
