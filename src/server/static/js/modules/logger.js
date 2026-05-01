const { Debug } = require("./debug.js");

exports.Logger = class Logger {
    constructor(source, silent = false) {
        const name = "Logger";
        this.source = source;
        this.debug = new Debug();
        if (!this.debug.is_active()) return;
        if (this.debug.is_filtered(name)) return;
        if (!silent) console.info(`INFO | ${name} | Creating a logger for ${this.source}`);
    }

    info() {
        if (!this.debug.is_active()) return;
        if (this.debug.is_filtered(this.source)) return;
        console.info(`INFO | ${this.source} |`, ...arguments);
    }

    error() {
        console.error(`ERROR | ${this.source} |`, ...arguments);
    }

    warn() {
        console.warn(`WARNING | ${this.source} |`, ...arguments);
    }
};
