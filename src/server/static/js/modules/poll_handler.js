/**
 * Class PollHandler
 *
 * Handles elements bearing the nd-poll attribute.
 *
 */

const { BaseHandler } = require("./base_handler.js");
const { Poll } = require("./poll.js");

exports.PollHandler = class PollHandler extends BaseHandler {
    constructor() {
        super();
        this.timers = []; // Timers to watch
    }

    /**
     * Process a given fragment.
     */
    process = (fragment) => {
        // If there are no pollers, clear the timers list
        if (document.querySelectorAll("[nd-poll]").length == 0) return;

        // Process this fragment
        fragment.querySelectorAll(`[nd-poll]`).forEach((element) => {
            // Handle element in the Poll class
            const poller = new Poll(element);

            // Start polling
            this.poll(poller);
        });
    };

    /**
     * Clean the DOM (remove unused timers)
     */
    postprocess = () => {
        const timers_to_clear = [];

        this.timers.forEach((timer, index) => {
            // find the uuid of elements NOT present in the document
            if (document.querySelectorAll(`[data-nduuid="${timer.uuid}"]`).length == 0) {
                clearTimeout(timer.id);
                timers_to_clear.push(timer);
            }
        });

        // Instance list cleanup
        timers_to_clear.forEach((timer) => {
            const index = this.timers.indexOf(timer);
            this.timers.splice(index, 1);
            this.logger.info(`Cleared and removed timer ${timer.id} for ${timer.uuid}.`);
        });
    };

    /**
     * Polling function
     */
    poll = (poller) => {
        const timeout_id = setTimeout(() => {
            // Clear the current timeout
            clearTimeout(timeout_id);

            // Remove this timeout ID from the pollers list
            const timer = this.timers.find(({ id, uuid }) => id === timeout_id);
            const timer_index = this.timers.indexOf(timer);
            this.timers.splice(timer_index, 1);
            this.logger.info(`Removed timer ${timer.id} for ${timer.uuid}. Active timers : ${this.timers.length}`);

            // Execute the poll action
            poller.poll();

            // Start a new poll !
            this.poll(poller);
        }, poller.interval_ms);

        // Add this tmeout ID to the timers list
        this.timers.push({ id: timeout_id, uuid: poller.uuid });
        this.logger.info(`Added timer ${timeout_id} (${poller.interval_ms}ms) for ${poller.uuid}. Active timers : ${this.timers.length}`);
    };
};
