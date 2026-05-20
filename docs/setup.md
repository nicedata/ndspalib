# Basic project setup

## Classical setup

In Flask (or other frameworks), rendering web pages is done by using a base template which be included by sub-templates like this (`jinja2`) :

```jinja
{% extends "base.html" %}

{% block title %}Index{% endblock %}

{% block content%}
<h1>Index</h1>
{% endblock %}
```

Each time a sub-template is processed, the base template is reloaded, which consumes bandwidth.

## SPA setup

In a single page application, the base template is loaded once when the user accesses the site like this :

```html
<!doctype html>
<html lang="fr">
  <head>
    <title>Base page</title>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <!-- 
		Style sheets, JS scripts, etc... (ommitted for clarity)  
	-->
    <!-- Nice Data Systems SPA Library (must be loaded here !) -->
    <script src="https://cdn.jsdelivr.net/gh/nicedata/ndspalib@latest/release/ndspalib.js"></script>
  </head>

  <body class="container flex-column">
    <div nd-notification-container class="nd-notification-container"></div>
    <div nd-dialog-container class=""></div>
    <h1 class="text-center">Nice Data Systems Javascript SPA library</h1>

    <!-- Navigation (start) -->
    <nav class="border-bottom border-top pb-2 pt-2 mt-3">
      <a href="/index" nd-link nd-target="main" class="border-end ps-2 pe-2"
        >Home</a
      >
      <a
        href="/polltest"
        nd-link
        nd-url="/polltest"
        nd-target="main"
        class="border-end ps-2 pe-2"
        >Polling</a
      >
      <a href="/links" nd-link nd-target="main" class="border-end ps-2 pe-2"
        >Links</a
      >
      <a href="/selects" nd-link nd-target="main" class="border-end ps-2 pe-2"
        >Select</a
      >
      <a
        href="/components"
        nd-link
        nd-target="main"
        class="border-end ps-2 pe-2"
        >Components</a
      >
      <a href="/zones" nd-link nd-target="main" class="border-end ps-2 pe-2"
        >Zones</a
      >
      <a href="/contexts" nd-link nd-target="main" class="border-end ps-2 pe-2"
        >Contexts</a
      >
      <a
        href="/websession"
        nd-link
        nd-target="main"
        class="border-end ps-2 pe-2"
        >Web Session</a
      >
      <a href="/forms" nd-link nd-target="main" class="border-end ps-2 pe-2"
        >Forms</a
      >
      <a
        href="/environment"
        nd-link
        nd-target="main"
        class="border-end ps-2 pe-2"
        >Environment</a
      >
      <a href="/icc" nd-link nd-target="main" class="border-end ps-2 pe-2"
        >ICC</a
      >
      <a href="/sandbox" nd-link nd-target="main" class="border-end ps-2 pe-2"
        >Sandbox</a
      >
      <span
        nd-zone="user-status"
        class="text-primary"
        style="float: right"
      ></span>
    </nav>
    <!-- Navigation (end) -->

    <!-- The main container  -->
    <main class="mt-3" nd-init="/icc">
      <!-- Will be updated with the response of nd-init -->
    </main>
  </body>
</html>
```

In Flask, the '/' endpoint is served like so :

```python
@app.route("/")
def home():
    return render_template("base.html", ...})

```

The base template is then loaded. Notice the `nd-init="/icc"` attribute on the `<main .../>` section this tells `ndspalib` to fetch its content from the `/icc` endpoint.

## Navigation

The `<nav ... />` section contains the navigation links, for example :

```html
<a href="/components" nd-link nd-target="main" class="border-end ps-2 pe-2"
  >Components</a
>
```

The `nd-link` attribute tells `ndspalib` that we have a link. The `href="/components"` attribute tells where to get data from and the `nd-target="main"` indicates that the fetched data is to be put into the `<main .../>` section.

So far, so good. We achieved what we wanted : only a specific section is updated when we click on a link and the base page is loaded only once. We now can dive deeper into `ndspalib` !
