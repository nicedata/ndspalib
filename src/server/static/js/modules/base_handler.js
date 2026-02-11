exports.BaseHandler = class BaseHandler {
    constructor(debug = false) {
        const class_name = this.constructor.name;
        debug ? console.log(`${class_name} debug is ON.`) : () => {};
        if (typeof window.nd === "undefined") throw new Error("NDSPA library not present !");
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
