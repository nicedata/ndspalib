const PROGNAME = require("../constants.js").PROGNAME;

exports.Debug = class Debug {
    constructor() {
        this._debug = true;
    }

    enable() {
        this._debug = true;
        console.log(`${PROGNAME}: debugging is enabled.`);
    }

    disable() {
        this._debug = false;
        console.log(`${PROGNAME}: debugging is disabled.`);
    }

    active() {
        return this._debug;
    }
};
