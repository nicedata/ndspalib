# Form

HTML forms bearing the `nd-form` attribute will be handled (and enhanced) by our `ndspalib`. 

## Form attributes

|  Attribute   | Meaning                                                      |
| :----------: | ------------------------------------------------------------ |
|  `nd-form`   | Indicates that the `<form ... />` element will be handled by `ndspalib`.<br>In particular the native `submit` event. |
| `nd-confirm` | A reference to a confirmation dialog template.               |

When the form data is changed, and before a destructive operation, a confirmation dialog is displayed. It is possible to override the default confirmation dialog by adding an `nd-confirm` element reference. This element is a `<template.../>` element that cold look like this:

```html
<template id="simple_confirm_dialog">
    <param name="mode" value="simple">
    <param name="title" value="Approval required">
    <param name="message" value="Do you really want to do this ?">
    <param name="confirm" value=""> <!-- Not relevant here ! -->
    <param name="accept" value="Yes">
    <param name="dismiss" value="No">
</template>
```

## Form elements

In the form itself five `nd-` elements be defined (`<button.../>`, `<a.../>``, ...) specific actions :

| Element attribute |                                                              | Required |
| :---------------: | ------------------------------------------------------------ | :------: |
|    `nd-accept`    | The form is submitted (if checks are OK).<br>The form is removed from the DOM.<br/>An endpoint can be fetched **after** this event if an `nd-url` is specified. | **Yes**  |
|   `nd-dismiss`    | The form is closed.<br>The form is removed from the DOM.<br/>An endpoint can be fetched **after** this event if an `nd-url` is specified. | **Yes**  |
|    `nd-apply`     | The form is submitted (if checks are OK) and remains open.   |    No    |
|    `nd-revert`    | The form content is reverted to the last saved state.        |    No    |
|    `nd-clear`     | The form is cleared.                                         |    No    |



## A simple example

```html
<form nd-form method="post" nd-confirm="confirm_dialog" action="/sse/form">
    <!-- Form fields -->
    <div class="mb-3">
        <label for="id_email" class="form-label">Email address</label>
        <input type="email" name="email" class="form-control" id="id_email" aria-describedby="email_help" autocomplete="email" autofocus required />
        <div id="email_help" class="form-text">We'll never share your email with anyone else.</div>
    </div>
    <div class="mb-3">
        <label for="id_password" class="form-label">Password</label>
        <input type="password" name="password" class="form-control" id="id_password" autocomplete="off" required />
    </div>
    <div class="mb-3 form-check">
        <input type="checkbox" name="checkout" class="form-check-input" id="id_checkout" />
        <label class="form-check-label" for="id_checkout">Check me out</label>
    </div>

    <!-- Buttons with possible actions -->
    <div class="text-center">
        <!-- Button with action : after submission, fetch '/form/submit' in a POST request -->
        <div class="btn btn-outline-secondary col-2" nd-accept nd-url="post::/form/submit">Submit</div>
        <!-- Button with action : after cancelling, fetch '/form/dismiss' in a GET request -->
        <button class="btn btn-outline-secondary col-2" nd-dismiss nd-url="get::/form/dismiss">Dismiss</button>
        <!-- Buttons acting on the form itself -->
        <button class="btn btn-outline-secondary col-2" nd-apply>Apply</button>
        <button class="btn btn-outline-secondary col-2" nd-revert>Revert</button>
        <button class="btn btn-outline-secondary col-2" nd-clear>Clear</button>
    </div>
</form>

<!-- The confirm dialog template -->
<template id="confirm_dialog">
    <param name="mode" value="simple">
    <param name="title" value="Please confirm !">
    <param name="message" value="Do you really want to do this ?">
    <param name="confirm" value=""> <!-- Not relevant here ! -->
    <param name="accept" value="Yes">
    <param name="dismiss" value="No">
</template>
```

