const { ND_EVENTS } = require("../constants.js");
const { Logger } = require("./logger.js");
const { Util } = require("./util.js");

exports.ZoneHandler = class ZoneHandler {
    static LOGGER = new Logger("ZoneHandler", true);
    constructor() {
        if (!!ZoneHandler._instance) {
            return ZoneHandler._instance;
        }
        this.logger = ZoneHandler.LOGGER;
        // Add an event listeners
        this.logger.info(`Adding a listener to handle '${ND_EVENTS.UPDATE}' events.`);
        document.addEventListener(ND_EVENTS.UPDATE, this._update_event_handler);
        this.logger.info(`Adding a listener to handle '${ND_EVENTS.ZONE}' events.`);
        document.addEventListener(ND_EVENTS.ZONE, this._zone_event_handler);
        ZoneHandler._instance = this;
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

    _update_event_handler = (event) => {
        console.log(event.detail);
        this.logger.info(`Event: ${event.type}. Zone: '${event.detail.id}'. Fields: ${event.detail.fields.length}. Action: '${event.detail.action}'.`);
        const zone_id = event.detail.id;
        const action = event.detail.action;
        const zone_fields = event.detail.fields;
        let root_element = null;

        if (zone_fields.length === 0) {
            this.logger.warn(`Event: ${event.type}. Zone: '${event.detail.id}'. No fields to update.`);
            return;
        }

        if (zone_id === null) {
            this.logger.info(`Event: ${event.type}. No zone specified. Processing whole document body.`);
            root_element = document.querySelector("body");
        }

        if (!root_element) {
            document.querySelectorAll("[nd-zone]").forEach((element) => {
                if (element.id === zone_id) {
                    root_element = element;
                    return;
                }
            });
        }

        if (!root_element) {
            this.logger.error(`Event: ${event.type}. No nd-zone with id="${zone_id}" found.`);
            return;
        }

        zone_fields.forEach((item) => {
            // Get the target to update
            const target = root_element.querySelector(`[id="${item.key}"]`);

            // Check if we found it
            if (!target) {
                this.logger.error(`No element with id="${item.key}" found.`);
                return;
            }

            const tag_name = target.tagName.toLowerCase();
            this.logger.info(`Event: ${event.type}. Zone: '${zone_id}'. Action: ${action}.  Target: ${tag_name}. Value: '${item.value}'.`);
            switch (tag_name) {
                case "input":
                case "textarea":
                    target.value = item.value;
                    item.readonly ? target.setAttribute("readonly", "") : target.removeAttribute("readonly");
                    break;
                case "select":
                    if (item.value.includes("<option")) {
                        const fragment = Util.create_fragment(item.value);
                        Util.clear_node(target);
                        Util.insert_fragment(target, fragment, false, true, false);
                    } else target.value = item.value;
                    item.readonly ? target.setAttribute("readonly", "") : target.removeAttribute("readonly");
                    break;
                default:
                    target.innerHTML = item.value;
                    break;
            }
        });
    };

    _zone_event_handler = (event) => {
        this.logger.info(`Event: ${event.type}. Zone: '${event.detail.id}'. Html: ${event.detail.html.length} characters. Action: '${event.detail.action}'.`);

        // Shortcuts
        const zone_id = event.detail.id;
        const action = event.detail.action;
        const zone_fields = event.detail.fields;
        const zone_content = event.detail.html.trim();
        let zone = null;

        // Find the zone in the DOM, return if not found.
        document.querySelectorAll("[nd-zone]").forEach((element) => {
            if (element.id === zone_id) {
                zone = element;
                return;
            }
        });

        if (!zone) {
            this.logger.error(`Event: ${event.type}. Action: ${action}. Zone with id="${zone_id}" not found.`);
            return;
        }

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
                if (zone.querySelectorAll("form").length === 0) {
                    this.logger.error(`Event: ${event.type}. Zone: "${zone_id}". Action: ${action}. No form to clear.`);
                    return;
                }
                zone.querySelectorAll("[name]").forEach((element) => {
                    element.value = "";
                });
                this._set_focus(zone);
                return; // No refresh needed
            case "set":
                if (!zone_content) {
                    this.logger.error(`Event: ${event.type}. Zone: "${zone_id}". Action: ${action}. No content to inject.`);
                    return;
                }
                Util.clear_node(zone);
                const fragment = Util.create_fragment(zone_content);
                Util.insert_fragment(zone, fragment, false, false, false);
                // Show zone
                zone.hidden = false;
                break;
            case "remove":
                zone.hidden = true;
                Util.clear_node(zone); // Simply clear the zone
                break;
        }

        // Finally refresh the zone
        Util.refresh(zone);
    };
};
