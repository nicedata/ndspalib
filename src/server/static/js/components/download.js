const { Logger } = require("../modules/logger.js");
exports.Download = class Download {
    constructor(blob, out_filename, preview = false) {
        this.logger = new Logger("Download");

        this.blob = blob;
        this.id = crypto.randomUUID(); // Give this instance an ID (UUID) !
        this.href = URL.createObjectURL(blob);
        this.out_filename = out_filename;

        this.preview = preview;
        this.element = null;
        this.html = this.preview ? "" : nd.util.compress(`<a data-nduuid="${this.id}" style="display: none" href="${this.href}", download="${this.out_filename}"></a>`);
        this.logger.info(this);
    }

    _cleanup = () => {
        this.logger.info("Cleanup", this.element ? this.element : "");
        URL.revokeObjectURL(this.href);
        if (this.element) this.element.remove();
    };

    show = () => {
        if (this.preview) {
            this.logger.info("Preview mode !");
            window.open(this.href, "_blank");
            this._cleanup();
            return;
        }

        this.logger.info("Download mode !");

        // Create a fragment
        const fragment = nd.util.create_fragment(this.html);

        // Append to the document
        nd.util.insert_fragment(document.body, fragment, true, false);
        this.element = document.querySelector(`[data-nduuid="${this.id}"]`);

        // Click to initiate download
        this.element.click();

        // Remove the link element after 100 msec
        setTimeout(() => {
            this._cleanup();
        }, 100);
    };
};
