# Polling

Elements with an `[nd-poll]` attribute are reloaded from the server periodically.

## Attributes

| Attribute     | Effect / Purpose                                             |
| ------------- | ------------------------------------------------------------ |
| `nd-poll`     | The element is handled by the `ndspalib` library.<br />Elements with this attribute are periodically reloaded. |
| `nd-interval` | Poll interval in milliseconds. Default to 10000 (10 seconds). |
| `nd-url`      | The URL that will be fetched.                                |
| `nd-target`   | The target(s) to be updated with endpoint sent data.<br />If not specified, the inner content is updated |
| `nd-action`   | A reference to a JavaScript function (accessible in the `window` namespace) to be executed when the URL is fetched from the server. |

## Examples

Poll the `/poll` url every `3000` ms (3 seconds) and update all elements having the `target` class.

```html
<div nd-poll nd-url="/poll" nd-target=".target" nd-interval="3000" class="mb-3 border p-1"></div>
```

Poll the `/poll` url every `5000` ms (5 seconds) and update the element having the `target-c` id.

```html
<div nd-poll nd-url="/poll" nd-target="#target-c" nd-interval="5000" class="mb-3 border p-1"></div>
```

Poll the `/poll` url every `10000` ms (10 seconds which is the **default** value) and update the the inner content of the element itself since no `nd-target` is specified.

```html
<div nd-poll nd-url="/poll" class="mb-3 border p-1"></div>
```

#### 

