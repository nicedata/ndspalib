# Zones

A **zone** is a fragment in the HTML source which can be updated independently from other parts. 

It is identified with the `nd-zone` attribute. 

Within a zone there may be HTML portions (like `<div>`, `<p>`, `<span>`, ...) bearing a `nd-zone-field` attribute which defines a sub-zone.

A zone can be seen like a form with fields.

## Two basic examples

Zones may be defined like this  this (**case I**) :

```html
<div nd-zone="my_zone">
    <h1 d-zone-item="title"><!-- Title from sse --></h1>
    <p nd-zone-field="first-paragraph">
       <!-- first paragraph from sse -->
    </p>
    <h2 d-zone-item="subtitle"><!-- Subtitle from sse --></h2>
    <p nd-zone-field="second-paragraph">
       <!-- second paragraph from sse -->
    </p>
</div>
```

, or like this (**case II**) :

```html
<div nd-zone="forms">
    <!-- Forms zone -->
</div>

```

- **Case I** : the server may send update events with specific data for specific fields . Only the elements bearing the `nd-zone-field`  attribute, specified in the server response will be updated.
- **Case II** : the whole zone will be updated with the server response since no elements bearing an  `nd-zone-field`  attribute are specified.

## Actions

Following actions max be performed on a zone :

| Action | Effect                                                       | Behind the scene                                             | Applies to            |
| ------ | ------------------------------------------------------------ | ------------------------------------------------------------ | --------------------- |
| show   | Shows the zone                                               | The display style is set to  `display: inline`               | Zone                  |
| hide   | Hides the zone                                               | The display style is set to  `display: none`                 | Zone                  |
| set    | The zone is set                                              | If elements bearing a `nd-zone-field`  attribute exist, they are updated with specific content. If not, the whole zone content is replaced. The container fragment is reprocessed. | Zone                  |
| remove | Remove a zone from the DOM                                   | The content of a zone is deleted. The container fragment is reprocessed. | Zone                  |
| clear  | Clear all fields bearing a `name` attribute, except `csfr` token fields | Removes focus of the `document.activeElement` and set it to the **first** element in the zone bearing an `autofocus` attribute | Zone containing forms |
