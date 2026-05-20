# `nd-url`

This attribute defines an URL.

## Format

The format to use is **`nd-url="an_url"`**. The URL may refer to 

- internal endpoints like `/api/test`  or
- external endpoints like `https://time.now/developer/api/timezone/Europe/Zurich`  

## Modifiers

| Modifier  | Effect                                                       |
| --------- | ------------------------------------------------------------ |
| `` (none) | Issues a fetch GET request (the **default**).                |
| `get::`   | Issues a fetch GET request.                                  |
| `post::`  | Issues a fetch POST request.                                 |
| `nav::`   | Navigation to a specific URL within the site.<br>The URL defined in `nd-url="nav::/..."` **MUST** be relative (*i.e.* refer to a site local endpoint). |

## Note on the `nav::` modifier

When the system starts up, it searches for a (unique) `nd-init="(url)"` element which will be considered as the **main container**. The URL defined in `nd-url="nav::/..."` will be fetched and the resulting data is then injected into this main container.

For example if we have this main container declaration in the base page like

```html
<main class="mt-3" nd-init="/forms">
    <!-- Will be updated with the response of nd-init -->
</main>
```

, the code for navigation like

```html
<a href="/index" nd-link nd-target="main" class="border-end ps-2 pe-2">Home</a>
```

is equivalent to

```html
<a href="nav::/index" nd-link class="border-end ps-2 pe-2">Home</a>
```

## Used in

:white_check_mark:`nd-link` :white_check_mark:`nd-poll` :white_check_mark:`nd-select`  :white_check_mark:`nd-form`
