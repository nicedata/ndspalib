exports.Debug = class Debug {
    constructor() {
        if (!!Debug._instance) {
            return Debug._instance;
        }
        this._debug = false;
        this._classname = "Debug";
        this._filter = [];
        Debug._instance = this;
    }

    enable() {
        this._debug = true;
        console.info(`INFO | ${this._classname} | Debugging is enabled.`);
    }

    disable() {
        this._debug = false;
        console.info(`INFO | ${this._classname} | Debugging is disabled.`);
    }

    is_active() {
        return this._debug;
    }

    filter(items) {
        if (!Array.isArray(items)) console.error(`ERROR | ${this._classname} | Function debug.filter() requires a list as an argument.`);
        this._filter = items;
        if (this._debug) console.log(`INFO | Debug | ${this._classname} filtered source(s) :`, this._filter.toString().replaceAll(",", ", "));
    }

    is_filtered(source) {
        for (const filter of this._filter) if (filter === source) return true;
        return false;
    }
};
