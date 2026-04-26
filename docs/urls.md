# URLs

Several elements handled by our `ndspalib` may (or must) contain  an  `nd-url` attribute like this :

```html
<button type="button" class="btn btn-outline-secondary col-2" nd-accept nd-url="/posted">Submit</button>
```

This attribute in the basic form, when used will redirect the user to the specified url. 

However, it is sometimes useful to inform the server that something happened, **without** modifying the current page. This can be done by adding modifiers in front of the `nd-url` value.  The allowed values are `get:`  and `post:`.

| HTML code                                                   | Effect                                               |
| ----------------------------------------------------------- | ---------------------------------------------------- |
| `<button nd-accept nd-url="get:/posted"> ... </button>`     | Will fetch the `/posted` url with a **GET** request  |
| `<button nd-dismiss nd-url="post:/cancel">Cancel</button> ` | Will fetch the `/cancel` url with a **POST** request |



