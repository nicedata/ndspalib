/**
 * Class BaseHandler
 *
 */
const { Logger } = require("./logger.js");

exports.BaseHandler = class BaseHandler {
    constructor() {
        this._logger = new Logger(this.constructor.name);
    }

    /**
     * Process a given fragment.
     */
    process(fragment) {
        this._logger.error(`The 'process(fragment)' method is not implemented.`);
    }

    /**
     * Clean the DOM after loading fragments.
     */
    postprocess() {
        this._logger.error(`The 'postprocess(fragment)' method is not implemented.`);
    }
};
