exports.Debug = class Debug {
    constructor() {
        if (!!Debug._instance) {
            return Debug._instance;
        }
        this.debug = true;
        this.classname = "Debug";
        this.filter_items = [];
        this.filter_override = [];
        Debug._instance = this;
    }

    enable() {
        this.debug = true;
        console.info(`INFO | ${this.classname} | Debugging is enabled.`);
    }

    disable() {
        this.debug = false;
        console.info(`INFO | ${this.classname} | Debugging is disabled.`);
    }

    is_active() {
        return this.debug;
    }

    ignore = (items) => {
        if (!Array.isArray(items)) {
            console.error(`ERROR | ${this.classname} | Function debug.ignore() requires a list of strings as an argument.`);
            return;
        }
        this.filter_items = items;
        this.filter_items.includes("*") ? (this.filter_items = ["*"]) : () => {};
        if (this.debug) console.log(`INFO | Debug | ${this.classname} ignored source(s) :`, this.filter_items.join(", "));
    };

    force = (items) => {
        if (!Array.isArray(items)) {
            console.error(`ERROR | ${this.classname} | Function debug.force() requires a list of strings as an argument.`);
            return;
        }
        this.filter_override = items;
        if (this.debug) console.log(`INFO | Debug | ${this.classname} forced source(s) :`, this.filter_override.join(", "));
    };

    is_filtered(source) {
        if (this.filter_override.includes(source)) return false;
        let result = false;
        this.filter_items.includes("*") ? (result = true) : this.filter_items.includes(source);
        return result;
    }
};
