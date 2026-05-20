# `nd-target`

This attribute defines the element(s) that will be updated with the server response. The attribute value must be compatible with the JavaScript`querySelectorAll(...)` function, *i.e.* a space separated list of values.

## Format

The format to use is **`nd-target="tag .css_class #element_id [attr]"`**. 

| Target                | Example                                                  |
| :-------------------- | :------------------------------------------------------- |
| Any HTML tag          | `<... nd-target="div form" />`                           |
| A CSS class name      | `<... nd-select nd-target=".status-zone .indicators" />` |
| An HTML element ID    | `<... nd-select nd-target="#my-zone #status-bar" />`     |
| An attribute selector | `<... nd-select nd-target=[nd-link]" />`                 |

!!! Note
	All types  may, of course, be mixed.

## Used in

:white_check_mark: `nd-link`  :white_check_mark:`nd-poll` :white_check_mark:`nd-select`

