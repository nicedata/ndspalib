const { Logger } = require("../modules/logger.js");
exports.Download = class Download {
    // id: '6ad835f2-a1f5-494c-b587-dd348624be2d', data: Blob, mimetype: 'application/pdf', filename: 'book.pdf'
    constructor(blob, out_filename, preview = false) {
        this._logger = new Logger(this.constructor.name);
        this._blob = blob;
        this._id = crypto.randomUUID(); // Give this instance an ID (UUID) !
        this._href = URL.createObjectURL(blob);
        this._out_filename = out_filename;

        this._preview = preview;
        this._element = null;
        this.html = this._preview ? "" : nd.util.compress(`<a data-nduuid="${this._id}" style="display: none" href="${this._href}", download="${this._out_filename}"a></a>`);
        this._logger.info(this);
    }

    show = () => {
        if (this._preview) {
            window.open(URL.createObjectURL(this._blob), "_blank");
            URL.revokeObjectURL(this._href);
            return;
        }

        // Create a fragment
        const fragment = nd.util.create_fragment(this.html);
        // Append to the document
        nd.util.insert_fragment(document.body, fragment, true, false);
        this._element = document.querySelector(`[data-nduuid="${this._id}"]`);

        this._logger.info("Showing element", this._element);

        // Click to initiate download
        this._element.click();

        // Remove the link element after 100 msec
        setTimeout(() => {
            this._logger.info("Removing element", this._element);
            URL.revokeObjectURL(this._href);
            this._element.remove();
        }, 1000);
    };
};
