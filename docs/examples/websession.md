# Login / Logout using `ndspalib` and SSE

This example implements a simple a web session cycle :

- A user authenticates
- An authenticated user logs out

The HTML source code is this one :

```html
<!-- Menu -->
<div class="border-bottom border-top pb-2 pt-2 mt-3">
    <!-- Items that are always shown -->
    <a nd-link nd-action="alert('Welcome Page')" class="border-end ps-2 pe-2">Welcome</a>
    <a nd-link nd-action="alert('News Page')" class="border-end ps-2 pe-2">News</a>
    <a nd-link nd-action="alert('Contact Page')" class="border-end ps-2 pe-2">Contact</a>
    <!-- Context dependent items -->
    <a nd-link nd-context="authenticated" nd-action="alert('My Account Page')" class="border-end ps-2 pe-2">My Account</a>
    <a nd-link nd-context="authenticated:hide" href="/websession/login" nd-target="#forms" class="border-end ps-2 pe-2">Login</a>
    <a nd-link nd-context="authenticated" nd-confirm="logout_dialog" href="/websession/logout" class="border-end ps-2 pe-2">Logout</a>
</div>
<div id="forms" nd-context="authenticated:remove">
    <!-- Form will be updated by SSE -->
</div>

<!-- The logout confirmation dialog template -->
<template id="logout_dialog">
    <param name="mode" value="simple">
    <param name="title" value="Logout">
    <param name="message" value="Do you want to close this session ?">
    <param name="confirm" value=""> <!-- Not relevant here ! -->
    <param name="accept" value="Yes">
    <param name="dismiss" value="No">
</template>
```

## Initial state

There is a navigation menu in which the common (non authenticated) user can see links to the 'Welcome', 'News' and 'Contact' pages.<br>Other links ('My Account', 'Login' and 'Logout') bear an `nd-context` attribute which affect their visibility :

- 'My account' and 'Logout' are visible only if the context has `authenticated`
- 'Logout' is hidden if the context has `authenticated` (`nd-context="authenticated:hide"`)

When the user clicks on 'Welcome', 'News' or 'Contact', an alert is displayed to simulate a site navigation.

## Login

When the user clicks on 'Login' the `/websession/login` is fetched from the server , injected into the forms container ( `id="forms"`) and shown. 

The server sent data is here :

```html
<form nd-form method="post" action="/websession/login" class="p-3">
    <!-- Form header -->
    <div class="row justify-content-center">
        <h2 class="col text-center">Sign In !</h2>
    </div>
    <!-- Form fields (email & password) -->
    <div class="row justify-content-center mb-3">
        <div class="col-5">
            <label for="id_email" class="form-label">Email address</label>
            <input type="email" name="email" class="form-control" id="id_email" autocomplete="email" autofocus required />
        </div>
    </div>
    <div class="row justify-content-center mb-3">
        <div class="col-5">
            <label for="id_password" class="form-label">Password</label>
            <input type="password" name="password" class="form-control" id="id_password" autocomplete="off" required />
        </div>
    </div>
    <!-- Form actions (accept, dismiss) -->
    <div class="row justify-content-center">
        <div class="col-5 text-center">
            <!-- Submit the form to "/websession/login" (the form action) -->
            <button nd-accept class="btn btn-outline-primary">Connect</button>
            <!-- Cancel action : navigate to "/websession" -->
            <button nd-dismiss nd-url="nav::/websession" class="btn btn-outline-danger">Dismiss</button>
        </div>
    </div>
</form>
```

  - If the user clicks on 'Dismiss', the user navigates to the start state.
  - If the user fills out the form an clicks on 'Connect' this happens :
      - the form is posted to `/websession/login`
      - the server returns a `context="authenticated"` context in its response
      - `ndspalib` handles the response :
          - the forms container is cleared (due to `nd-context="authenticated:remove"`)
          - the 'Login' link is hidden
          - The 'My Account' and 'Logout' links become visible

## Logout

When the (authenticated) user clicks on 'Logout', this happens :

- the logout confirmation dialog is displayed

- if the user accepts the logout operation :

  - the `"/websession/logout` endpoint is fetched
  - the server removes the `context="authenticated"` in its response
  - the page is reset to its original state

## Behind the scene

In this example, the backend is a Flask server along with our `FlaskMiddleware`. The python code we use is quite simple :

```python
# =======================================================================
# Websession tests
@app.route("/websession/<string:arg>", methods=["GET", "POST"])
def websession_endpoint(arg=""):
    VALID_USERS = {"user@test.com", "admin@test.com", "superadmin@test.com"}

    if request.method == "POST":
        # Get the email and the form id from the POSTed data
        email = request.form.get("email", None)
        form_id = request.form.get("form_id", "")

        if email in VALID_USERS:
            # Trigger a success alert and set the context to 'authenticated'
            app.alert("success", f"You are logged in ! Your email is <strong>{email}</strong>.")
            app.context("authenticated", "set")
        else:
            # Trigger an alert and reset the form
            app.alert("danger", "Login failed !")
            app.reset_form(form_id)

    if request.method == "GET":
        if arg == "login":
            # Provide the login form.
            # It will be injected into the <div id="forms" .../> element via the nd-target="#forms" attrtibute in the
            # <a ... nd-target="#forms" ...>Login</a> element.
            return render_template("/partials/login_form.html")
        if arg == "logout":
            app.alert("success", "You are logged out !")
            app.context("authenticated", "reset")  # Remove 'authenticated' context

    return ""
```



## Endnote

This simple example illustrates what can be done without having one line of user-produced JavaScript.
