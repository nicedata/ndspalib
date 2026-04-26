# Forms	

**Forms** bearing the `nd-form` attribute will be handled by our `ndspalib`. 

They are set up like this :

```html
<form nd-form method="post" action="/sse/form">
	...
</form>
```

Form events will then be handled by the `ndspalib`.  The native `submit` event is prevented. 

Several operations can be simply done through button (or links) :

- **accept** : the form is submitted (if checks are OK). The form is removed from the DOM. A redirection **after** the form submission may be specified.
- **apply** : the form is submitted (if checks are OK) and remains open.
- **dismiss** : the form is closed. The form is removed from the DOM. A redirection **after** the form close may be specified.
- **revert** : the form content is reverted to the last saved state.
- **clear** : the form is cleared.

When the form data is changed, and before a destructive operation, a confirmation dialog is displayed. It is possible to override the default confirmation dialog by adding an `nd-confirm` element into the form's body like this :

```html
<div nd-confirm nd-title="Approbation nécessaire" nd-message="Effectuer l'opération ?">
	<div nd-button nd-label="Oh oui" nd-action="accept"></div>
	<div nd-button nd-label="Non merci" nd-action="dismiss"></div>
</div>
```

## A simple example

```html
<form nd-form method="post" action="/sse/form">

    <!-- Confirmation dialog -->
    <div nd-confirm nd-title="Approbation nécessaire" nd-message="Effectuer l'opération ?">
        <div nd-button nd-label="Oh oui" nd-action="accept"></div>
        <div nd-button nd-label="Non merci" nd-action="dismiss"></div>
    </div>

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
        <!-- Button with action : after submission, redirect to /posted -->
        <button type="button" class="btn btn-outline-secondary col-2" nd-accept nd-url="/posted">Submit</button>
        <!-- Button with action : after cancelling, redirect to /not_posted -->
        <button type="button" class="btn btn-outline-secondary col-2" nd-dismiss nd-url="/not_posted">Dismiss</button>
        <!-- Buttons acting on the form itself -->
        <button type="button" class="btn btn-outline-secondary col-2" nd-apply>Apply</button>
        <button type="button" class="btn btn-outline-secondary col-2" nd-revert>Revert</button>
        <button type="button" class="btn btn-outline-secondary col-2" nd-clear>Clear</button>
    </div>

</form>
```

