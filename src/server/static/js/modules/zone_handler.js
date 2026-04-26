const { ND_EVENTS } = require("../constants.js");
const { Logger } = require("./logger.js");

exports.ZoneHandler = class ZoneHandler {
    constructor() {
        this.logger = new Logger("ZoneHandler");

        // Add an event listeners
        this.logger.info(`Adding a listener to handle '${ND_EVENTS.ZONE}' events.`);
        document.addEventListener(ND_EVENTS.ZONE, this._event_handler);
    }

    // Todo : remove
    process(fragment) {}

    // Todo : remove
    postprocess() {}

    _set_focus = (zone) => {
        const element = zone.querySelector("[autofocus]");
        if (element) {
            document.activeElement ? document.activeElement.blur() : () => {};
            element.focus();
        }
    };

    _event_handler = (event) => {
        this.logger.info(`Event: ${event.type}. Zone: '${event.detail.name}'. Fields: ${event.detail.fields.length}. Action: '${event.detail.action}'.`);

        // Shortcuts
        const zone_name = event.detail.name;
        const action = event.detail.action;
        const zone_fields = event.detail.fields;

        // Find the zone in the DOM, return if not found.
        const zone = document.querySelector(`[nd-zone="${zone_name}"]`);
        if (!zone) {
            this.logger.error(`Zone '${zone_name}' not found.`);
            return;
        }

        // Does the zone have fields ?
        const has_fields = zone.querySelectorAll(`[nd-zone-field]`).length > 0;

        // Process the actions
        switch (action) {
            case "show": // Show & return
            case "focus":
                zone.hidden = false;
                this._set_focus(zone);
                return;
            case "hide": // Hide & return
                zone.hidden = true;
                return;
            case "clear":
                zone.querySelectorAll("[name]").forEach((element) => {
                    element.value = "";
                });
                this._set_focus(zone);
                return; // No refresh needed
            case "set":
                if (!has_fields) {
                    if (zone_fields.length !== 1) this.logger.info(`Zone has no 'nd-zone-field' elements. Using the first item in the list.`);
                    nd.util.clear_node(zone);
                    zone.innerHTML = zone_fields[0].value;
                } else {
                    zone_fields.forEach((item) => {
                        // Get the target to update
                        const target = zone.querySelector(`[nd-zone-field="${item.key}"]`);

                        // Check if we found it
                        if (!target) {
                            this.logger.error(`No element bears an nd-zone-field="${item.key}" attribute.`);
                            return;
                        }

                        //Update
                        target.innerHTML = item.value;
                    });
                }
                // Show zone
                zone.hidden = false;
                break;
            case "remove":
                zone.hidden = true;
                nd.util.clear_node(zone); // Simply clear the zone
                break;
        }

        // Finally refresh the zone
        nd.util.refresh(zone);
    };
};
