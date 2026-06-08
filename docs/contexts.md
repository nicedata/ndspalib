# Contexts

Execution contexts - or *application states* - determine primarily what is to be be shown (or hidden) on a web page. This can be achieved in the page rendering phase (on the server) before the page is sent to the frontend. In a single page 	application, this is what we want to avoid. 

Wouldn't it be nice to have a web page listening to server commands telling what page fragment is to be shown, hidden, removed, etc..., without reloading a whole page ?

This is what we do by using server sent contexts. `ndspalib` interprets this information, executes the right operations and applies the results to the right page fragment(s).

To describe a context behavior, we use (as for dialogs) the HTML `<template ... />` tag. It offers a nice, built-in way, hidden from the user interface, to express key-value pairs which is exactly what we need.

The context-dependent operations we handle are the following :

- **show** : show a given fragment
- **hide** : hide a given fragment
- **remove** : remove a given fragment

## Context attributes

Contexts are described like this :

```html
<!-- Context (::none::) -->
<template nd-context="::none::">
    <param name="show" nd-target="#id_login  #forms">
    <param name="hide" nd-target="#id_logout #id_my_account">
    <param name="remove" nd-target="">
</template>

<!-- Context (authenticated) -->
<template nd-context="authenticated">
    <param name="show" nd-target="#id_logout #id_my_account">
    <param name="hide" nd-target="#id_login #forms">
    <param name="remove" nd-target="#forms">
</template>
```

Two contexts are described. The `::none::` context describes which selectors are to be shown or hidden when no context is active. 

The `authenticated` context describes what is to be shown, hidden or removed once the `authenticated` context is active. The context value is set or reset via a server sent event.

The `nd-target` attribute represents a list of targets. See the   [`nd-target` documentation](/ndspalib/attributes/nd-target/).

### The `::none::` context

This context definition must be present. It indicates the initial page state, *i.e.* how the page has to look like when no context is active.

## A simple example

Please look at the  [Web Session example](/ndspalib/examples/websession/) !

------

> Updated : 28.05.2026 - MM
