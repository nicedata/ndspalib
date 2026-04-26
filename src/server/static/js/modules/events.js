/**
 * Class Events
 *
 * Manage event listeners
 */
const { Logger } = require("./logger.js");
exports.Events = class Events {
    constructor() {
        this.logger = new Logger(this.constructor.name);
        // List of active event listeners (array of [event, element, listener] arrays)
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
        // Last argument is always the listener function
        let [event, selector, listener] = [null, null, args.pop()];

        switch (args.length) {
            case 1: // Form 1
                event = args.pop();
                this._listeners.push([event, selector, listener]);
                document.addEventListener(event, listener);
                this.logger.info(`Calling function on(), first form. Selector: ${selector}, event:${event}, listener:${listener}`);
                break;
            case 2: // Form 2
                [selector, event] = [args.pop(), args.pop()];
                document.querySelectorAll(selector).forEach((element) => {
                    this._listeners.push([event, element, listener]);
                    element.addEventListener(event, listener);
                    this.logger.info(`Calling function on(), second form. Selector: ${selector}, event:${event}, listener:${listener}`);
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
        args.reverse(); // <- First argument is now the event name
        let [event, selector, listener] = [args.pop(), null, null];

        switch (args.length) {
            case 0:
                this._listeners.forEach((item, index) => {
                    const [event, element, listener] = item;
                    if (event === event) {
                        this.logger.info(`Calling function off(), first form. Selector: ${selector}, event:${event}, listener:${listener}`);
                        document.removeEventListener(event, listener);
                        this._listeners.splice(index, 1);
                    }
                });
                break;
            case 1:
                selector = args.pop();
                Array.from(document.querySelectorAll(selector)).forEach((target) => {
                    this._listeners.forEach((item, index) => {
                        const [event, element, listener] = item;
                        if (event === event && element === target) {
                            this.logger.info(`Calling function off(), second form. Selector: ${selector}, event:${event}, listener:${listener}`);
                            element.removeEventListener(event, listener);
                            this._listeners.splice(index, 1);
                        }
                    });
                });
                break;
            default:
                return;
        }
    }

    fire(event, detail) {
        document.dispatchEvent(new CustomEvent(event, { detail: detail }));
    }

    /**
     * Remove ALL event listeners
     *
     */
    flush() {
        this._listeners.forEach((item, _) => {
            const [event, element, listener] = item;
            element.removeEventListener(event, listener);
            this.logger.info(`Calling function flush(). Selector: ${selector}, event:${event}, listener:${listener}`);
        });
        this._listeners = [];
    }
};
