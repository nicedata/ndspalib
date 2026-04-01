const { Debug } = require("./debug.js");

exports.Logger = class Logger {
    constructor(source) {
        const class_name = this.constructor.name;
        this._source = source;
        this._debug = new Debug();
        if (!this._debug.is_active()) return;
        if (this._debug.is_filtered(class_name)) return;
        console.info(`INFO | ${class_name} | Creating a logger for ${this._source}`);
    }

    info() {
        if (!this._debug.is_active()) return;
        if (this._debug.is_filtered(this._source)) return;
        console.info(`INFO | ${this._source} |`, ...arguments);
    }

    error() {
        console.error(`ERROR | ${this._source} |`, ...arguments);
    }

    warn() {
        console.warn(`WARNING | ${this._source} |`, ...arguments);
    }
};
