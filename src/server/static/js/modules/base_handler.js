const ERR_NO_NDSPA = require("../constants.js").ERR_NO_NDSPA;

exports.BaseHandler = class BaseHandler {
    constructor(debug = false) {
        debug ? console.log(`${this.constructor.name} debug is ON.`) : () => {};
        if (typeof window.nd === "undefined") throw new Error(ERR_NO_NDSPA);
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
