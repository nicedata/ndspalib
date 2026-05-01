const { BaseHandler } = require("./base_handler.js");
const { Select } = require("./select.js");

exports.SelectHandler = class SelectHandler extends BaseHandler {
    constructor() {
        super();
    }

    process(fragment) {
        // If there are no nd-selectes, DO NOTHING
        if (document.querySelectorAll("[nd-select]").length == 0) return;
        fragment.querySelectorAll("[nd-select]").forEach((element) => {
            new Select(element);
        });
    }

    postprocess() {}
};
