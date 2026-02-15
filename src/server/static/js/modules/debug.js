const { PROGNAME, VERSION } = require("../constants.js");

exports.Debug = class Debug {
    constructor() {
        this._debug = true;
    }

    enable() {
        this._debug = true;
        console.log(`Debugging is enabled.`);
    }

    disable() {
        this._debug = false;
        console.log(`Debugging is disabled.`);
    }

    active() {
        return this._debug;
    }
};
