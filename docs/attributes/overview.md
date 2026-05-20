# Attributes - overview

In this section we describe all `nd-` attributes used in `ndspalib` : in which elements they may be used and what they do.

|   Attribute   | Purpose                                                      | Used in              |
| :-----------: | ------------------------------------------------------------ | -------------------- |
|  `nd-action`  | Defines an action. Reference to JavaScript code.             | `nd-link`  `nd-poll` |
| `nd-interval` | Defines a time interval in milliseconds. Defaults to 10000 ms (10 s). | `nd-poll`            |
|  `nd-target`  | A list of target elements (tag, id, CSS class).              | `nd-link`  `nd-poll` |
|   `nd-url`    | An URL                                                       | `nd-link`  `nd-poll` |

## Matrix

|               |     `nd-link`      |     `nd-poll`      |    `nd-select`     |
| :-----------: | :----------------: | :----------------: | :----------------: |
|   `nd-url`    | :white_check_mark: | :white_check_mark: | :white_check_mark: |
|  `nd-target`  | :white_check_mark: | :white_check_mark: | :white_check_mark: |
|  `nd-action`  | :white_check_mark: | :white_check_mark: |                    |
| `nd-confirm`  | :white_check_mark: |                    |                    |
| `nd-interval` |                    | :white_check_mark: |                    |
| `nd-hide-for` |                    |                    | :white_check_mark: |
| `nd-show-for` |                    |                    | :white_check_mark: |



