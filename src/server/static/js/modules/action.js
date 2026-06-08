/**
 * Action module for handling custom actions defined in HTML elements with the "nd-action" attribute.
 * The "nd-action" attribute can specify a JavaScript function to be executed before or after a fetch operation.
 * The action can also specify a URL to fetch data from and target elements to inform about the action.
 *
 * Example usage in HTML:
 * <button nd-action="before::doSomething()" nd-url="/api/data" nd-target="#result">Click me</button>
 */
const { Logger } = require("./logger.js");
const { Util } = require("./util.js");

// Allowed action modifiers
const ACTION_MODIFIERS = ["before", "after"];

/**
 * Class representing the details of an action, including when to execute, the URL to fetch, source element, target elements, and data.
 */
class ActionDetail {
    when = null;
    url = null;
    source = null;
    targets = [];
    str_data = null;
    json_data = null;
}

/**
 * Class representing an action defined by the "nd-action" attribute. It parses the action details and provides a method to execute the action.
 * The action can be executed before or after a fetch operation, and it can inform target elements with the fetched data.
 * The action is defined as a JavaScript function that can be called with the action details when executed.
 * The constructor of the Action class takes an HTML element as input, extracts the action details from the "nd-action" attribute, and sets up the action function.
 * The excecute method of the Action class executes the action function with the provided data and logs the execution.
 * The Action class uses a static logger for logging information and errors related to action processing.
 * The Action class also provides a method to set target elements after the action has been created, allowing for dynamic updates to the targets.
 * The Action class is designed to be used in conjunction with a tracking system that listens for events and triggers the execution of actions based on the defined behavior in the HTML elements.
 *
 */
exports.Action = class Action {
    static LOGGER = new Logger("Action", true);

    constructor(element) {
        this.logger = Action.LOGGER; // Use the static logger for all instances of Action
        this.code = null; // The JavaScript code as string
        this.when = null; // When to execute the action: "before" or "after"
        this.action = null; // The function created from the code string
        this.details = new ActionDetail(); // An instance of ActionDetail to hold the details of the action

        // Get the action code and details from the element's attributes
        const action = element.getAttribute("nd-action");
        if (!action) return;

        // Source element
        this.details.source = element;

        // URL to fetch data from
        const href = element.getAttribute("href");
        const nd_url = element.getAttribute("nd-url");
        this.details.url = href ? href : nd_url ? nd_url : null;

        // Target elements to inform about the action
        const selector = element.getAttribute("nd-target");
        this.details.targets = Util.get_targets(selector);

        // Determine when to execute the action and extract the code
        if (action.includes("::")) {
            [this.when, this.code] = action.split("::");
            if (!ACTION_MODIFIERS.includes(this.when)) {
                this.logger.error(`Only 'before' and 'after' action modifiers are allowed. Element :`, element);
                return;
            }
        } else {
            this.code = action;
            this.when = "before";
        }

        this.details.when = this.when;

        // If no URL is present, excecute before the fetch by default.
        // If a URL is present, the action will be executed according to the specified modifier (before or after).
        this.details.url ? {} : (this.when = "before");

        // Create the action function from the code string.
        // The function will be called with the action details when executed.
        this.action = new Function(this.code);
    }

    // Method to set target elements after the action has been created, allowing for dynamic updates to the targets.
    set_targets = (targets) => {
        this.details.targets = targets;
    };

    // Method to execute the action function with the provided data and log the execution.
    excecute = (data = null) => {
        this.logger.info(`Executing ${this.code}, ${this.when} fetch.`);
        this.details.str_data = data;

        // Try to parse the data as JSON. If parsing fails, set json_data to null.
        try {
            this.details.json_data = JSON.parse(data);
        } catch (error) {
            this.details.json_data = null;
        }

        // Call the action function with the action details.
        // The function can use the details to perform its logic, such as updating target elements or processing the fetched data.
        this.action.call(null, this.details);
    };
};
