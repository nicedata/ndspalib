# Select	

In web pages, we often need to **select** data from a dropdown list implemented via a `select ... />` element. Our `ndspalib` library allows to enhance the native features of this element :

- get the select options from the server
- use URLs in the option values
- update page zones with the selected value
- update page zones with server sent data
- show or hide parts of the page depending on the selected option

## Select attributes

| Selector attributes | Meaning                                                      |
| :-----------------: | ------------------------------------------------------------ |
|     `nd-select`     | Specifies that this `<select ... />` will be handled by `ndspalib` . |
|     `nd-target`     | A space separated list of HTML targets that will be affected by changes in the selector. |
|      `nd-url`       | The select options are fetched from the specified server endpoint. |

The target(s) specified in the `nd-target` attribute may be :

| Target             | Example                                                     |
| ------------------ | ----------------------------------------------------------- |
| Any HTML tag       | `<select nd-select nd-target="div form" />`                 |
| An HTML element ID | `<select nd-select nd-target="#my-zone #status-bar" />`     |
| A CSS selector     | `<select nd-select nd-target=".status-zone .indicators" />` |

The `nd-target` attribute may, of course contain a mix of all these types !

## Select options

Usually, select options are specified like this :

```html
...
<option value="value 1">First option</option>
<option value="value 2">Second option</option>
...
```

To make it easier to develop web applications, we can define more complex `<options>` like this :

```html
...
<option value"value 1" nd-url="/echo/test_1">First option</option>
<option value"value 2" nd-url="/echo/test_2">Second option</option>
...
```

This allows us to process both a **value** and a **link**.  

The **value** could be used to update a form field, while the **link** in `nd-url` could be used to display a help section.

## Target attributes

The **targets** *i.e.* the elements that will be affected by the selector changes may contain following attributes : 

| Target element attributes | Meaning                                                      |
| ------------------------- | ------------------------------------------------------------ |
| `nd-show-for`             | Element is **displayed** when the selector gets a specific value (the ***** wildcard character is allowed). |
| `nd-hide-for`             | Element is **hidden**  when the selector gets a specific value (the ***** wildcard character is allowed). |
| `nd-sync`                 | The content of the element is updated with the selected value. |
| `nd-follow`               | The option values contain URLs. The content of the element will be updated with the data fetched this endpoint. |
| `nd-activate`             |                                                              |
| `nd-url`                  | The content is updated with a server response from the specified URL extended with the selected value.<br />If the `nd-url ` is `/echo` and the selected value is `hello`, the `/echo/hello` server endpoint will be fetched. |
| **Note**                  | `nd-sync`, `nd-follow`  and `nd-activate`are mutually exclusive ! |



