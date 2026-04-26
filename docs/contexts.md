# Contexts

A **context** is a fragment in the HTML source which can be shown or hidden. The purpose is to show or hide parts of an HTML page depending of a context.

For example, if a user is logged in, certain menu items will be available to that user, while they will be hidden from users who are not logged in. This is illustrated in the example below.

A context is identified by the `nd-context` attribute. 

By default, when a context is set, items bearing the `nd-context` attribute with the the given value are shown. 

This behavior can be inverted by adding the `:hide` modifier to the context name.

| HTML code                                           | Effect                                                    |
| --------------------------------------------------- | --------------------------------------------------------- |
| `<div nd-context="authenticated"> ... </div> `      | Will be show when the context is set to `authenticated`   |
| `<div nd-context="authenticated:hide"> ... </div> ` | Will be hidden when the context is set to `authenticated` |

By default, when no context is set, the element bearing an `nd-context` attribute are **hidden**.

## A simple example

The example shows a web session cycle using `nd-context`. This is what happens :

- First display of the page : the users sees the `Welcome`, `News`, `Contact`, `Login` menu items.
- When the user clicks on `Login`, the login form is displayed.
- If the login operation fails, an error alert is displayed and the form is cleared
- If the operation succeeds, the login form is removed from the DOM.
  - The menu the user now sees is `Welcome`, `News`, `Contact`,  `My Account`, `Logout` .
- When the user clicks on `Logout`, a message is displayed and the page now looks as it was at the beginning.

All This works without one line of JavaScript for two reasons :

1.  Our `ndspalib` library has been loaded in the base HTML page and
2. Our  `flask-spa` middleware id loaded in Python.

The HTML code looks like this :

```html
<!-- Menu -->
<div class="border-bottom border-top pb-2 pt-2 mt-3">
    <!-- Items that are always shown -->
    <a href="/websession" nd-link class="border-end ps-2 pe-2">Welcome</a>
    <a href="/websession" nd-link class="border-end ps-2 pe-2">News</a>
    <a href="/websession" nd-link class="border-end ps-2 pe-2">Contact</a>
    <!-- Context dependent items -->
    <a nd-context="authenticated" href="/websession/admin" nd-link class="border-end ps-2 pe-2">My Account</a>
    <a nd-context="authenticated:hide" href="/websession/login" nd-link nd-target="#forms" class="border-end ps-2 pe-2">Login</a>
    <a nd-context="authenticated" href="/websession/logout" nd-link class="border-end ps-2 pe-2">Logout</a>
</div>
<div id="forms" nd-context="authenticated:hide" nd-zone="forms">
    <!-- Form will be updated by SSE -->
</div>	
```

The Python code to handle this is here :

```python
# =======================================================================
# Websession tests
@app.route("/websession/<string:arg>", methods=["GET", "POST"])
def websession_endpoint(arg=""):
    VALID_USERS = {"user@test.com", "admin@test.com", "superadmin@test.com"}

    if request.method == "POST":
        # Get the email from the POSTed data
        email = request.form.get("email", None)

        if email in VALID_USERS:
            app.alert(EventSeverity.SUCCESS, f"You are logged in ! Your email is <strong>{email}</strong>.")
            app.set_context("authenticated")  # Set the context to 'authenticated'
            app.zone("forms", "remove")  # Remove the sign-up form from the DOM
        else:
            app.alert(EventSeverity.DANGER, "Login failed !")
            app.zone("forms", "clear")  # Clear the sign-up form

    if request.method == "GET":
        if arg == "login":
            # Get the login form.
            # It will be injected into the <div id="forms" ...> element via the nd-target="#forms" attrtibute in the
            # <a ... nd-target="#forms" ...>Login</a> element.
            return render_template("/partials/login_form.html")
        if arg == "logout":
            app.alert(EventSeverity.SUCCESS, "You are logged out !")
            app.clear_context("authenticated")

    return ""

```



