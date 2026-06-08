# Zones

A **zone** is a fragment in the HTML source which can be updated independently from other parts. 

It is identified with the `nd-zone` attribute. We introduced this attribute to make the HTML code more readable.

> **A note on HTML `id`**s :The HTML `id` attribute is supposed to be unique in a document. However, for zone handling, we accept duplicate IDs. The ID must be unique within a zone. The reason for doing so is to avoid to introduce a new `nd-` attribute to identify a zone field. This may change in the future, if requested by users.

## Zone actions

Following actions may be performed on a zone :

| Action        | Effect                                                       | Behind the scene                                             |
| ------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| show<br>focus | Shows the zone                                               | The display style is set to  `display: inline`               |
| hide          | Hides the zone                                               | The display style is set to  `display: none`                 |
| set           | The zone is set                                              | The whole zone is updated with server sent HTML code. The zone fragment is reprocessed. |
| remove        | Remove a zone from the DOM                                   | The content of a zone is deleted. The container fragment is reprocessed. |
| clear         | Clear all fields bearing a `name` attribute, except `csfr` token fields | Removes focus of the `document.activeElement` and set it to the **first** element in the zone bearing an `autofocus` attribute |

## How to use

On the Python backend side (SPA Middleware), 2 methods are implemented:

1. `zone(id, action:str, html:str='')` : do operations on the whole zone
2. ` update_ui(zone_id: str | None, fields)` update individual elements in a zone or the whole document body

## Examples

Zones may be defined like this  this (**case I**) :

```html
<div nd-zone id="my_zone">
    <h1 id="title"><!-- Title from sse --></h1>
    <p id="first-paragraph">
       <!-- first paragraph from sse -->
    </p>
    <h2 id="subtitle"><!-- Subtitle from sse --></h2>
    <p id="second-paragraph">
       <!-- second paragraph from sse -->
    </p>
</div>
```

, or like this (**case II**) :

```html
<div nd-zone id="forms">
    <!-- Forms zone -->
</div>

```

- **Case I** : the server may send update events with specific data for specific fields. Only the elements bearing the `id`  attribute, specified in the server response will be updated. (use of `update_ui("my_zone", list_of_fields)`).
- **Case II** : the whole zone can be updated with HTML code sent in the server response. (use of `zone("forms", "set", "HTML code...")`)

## 
