const { BaseHandler } = require("./base_handler.js");
const { Select } = require("./select.js");

exports.SelectHandler = class SelectHandler extends BaseHandler {
    constructor() {
        super();
    }

    process(fragment) {
        fragment.querySelectorAll("[nd-select]").forEach((element) => {
            new Select(element);
        });
    }

    postprocess() {}
};
