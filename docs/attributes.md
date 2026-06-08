# Attributes	

In `ndspalib`, we use `nd-` prefixed attributes. Some attributes may have a value (like `nd-url="/my_endpoint"`), and some may not. 

- Attributes with no value are used to identify HTML elements which will be handled in a special way. 
  They can be considered like tags. 
  However, we have a few exceptions in this category (marked with an asterisk), often related to server sent events (SSE).
- Attributes with a value are used as parameters as we would use them in a function.

## Attributes without values

|        Attribute         | Meaning / Purpose                                            |
| :----------------------: | ------------------------------------------------------------ |
|        `nd-link`         | The element will be handled as a link. It becomes clickable. The cursor changes hovering. |
|        `nd-poll`         | The element will act as a poller to execute periodic fetches or actions. |
|       `nd-select`        | The `<select .../>` element will be enhanced with more features. |
| `nd-context`<sup>*</sup> | The section (*e.g.* a `<div.. />`) will be shown or hidden depending on server sent context. |
|   `nd-env`<sup>*</sup>   | The content of the element will be replaced with a server sent environment variable. |
|        `nd-form`         | The `<form .../>` element will be enhanced with more features. |
|       `nd-accept`        | Forms : define an element that will trigger the submit event. |
|        `nd-apply`        | Forms : define an element that will submit the form without leaving the edit mode. |
|       `nd-dismiss`       | Forms : define an element that will trigger a submission cancel. |
|        `nd-clear`        | Forms : define an element that will trigger the clear event. |
|       `nd-revert`        | Forms : define an element that will restore the forms previous content. |
|  `nd-zone`<sup>*</sup>   | Defined a zone for a bulk update.                            |

## Attributes with values

|  Attribute  | Meaning / Purpose                                            |
| :---------: | ------------------------------------------------------------ |
|  `nd-init`  | On a section, indicates the endpoint to be fetched when the page is processed. This is a one-time process. |
| `nd-source` | On a section, indicates the endpoint to be fetched when the page is processed. |
|  `nd-url`   | The endpoint to be fetched (on elements that do not support the `href` attribute) |
| `nd-target` | The section(s) to be updated with the endpoint data.         |





