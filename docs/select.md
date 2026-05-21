# Select	

In web pages, we often need to select data from a dropdown list. Such a list is implemented in HTML with the  `<select ... />` element.<br>
Our `ndspalib` library allows to enhance the native features of this element :

- get the select options from the server
- use URLs in options (along with values)
- update page segments with the selected value or with server sent data
- show or hide parts of the page depending on the selected option

## Select attributes

|        Attribute         | Meaning                                                      |
| :----------------------: | ------------------------------------------------------------ |
|       `nd-select`        | Indicates that the `<select ... />` element will be handled by `ndspalib` . |
|      `nd-selected`       | Set the selection to the given value.                        |
|       `nd-target`        | A space separated list of HTML targets that will be affected by changes in the selector. |
|   `nd-url`<sup>1</sup>   | The select options are fetched from the specified server endpoint. |
|       `nd-inform`        | Like `nd-target`, but refers to one (or more) `<select.../> ` elements.<br />When the actual `<select.../>`changes, the targets defined in `nd-inform` will be reloaded with new options.<br />**Note** : The `nd-inform` target(s) must be `<select.../>` elements ! <br />See a full example below (use cases). |
| `nd-default`<sup>2</sup> | The text to label the first option.<br />This is useful when the options are fetched from the server and nothing is returned. |

**Notes** :<br> <sup>1)</sup> The endpoint has to return the options in the `<option value="?">...</option><option value="?">...</option>...` format (a string containing all options).<br><br><sup>2)</sup> If  `nd-default="-- Select something --"` is defined, `ndspalib` will create an option with no value like this : `<option>-- select something --</option>`. This will ensure to have at least on option in the selector and keep the UI nice. 

### See

- `nd-target` specifications [:link:](/ndspalib/attributes/nd-target)  
- `nd-url` specifications [:link:](/ndspalib/attributes/nd-url)

## Select options

Usually, select options are specified like this :

```html
...
<option value="value 1">First option</option>
<option value="value 2">Second option</option>
...
```

To make it easier to develop web applications, we can define more complex `<options>` like this :

```html
...
<option value"value 1" nd-url="/echo/test_1">First option</option>
<option value"value 2" nd-url="/echo/test_2">Second option</option>
...
```

This allows us to process both a **value** and a **link**. For example, the **value** could be used to update a form field, while the **link** in `nd-url` could be used to display a help section.

## Target attributes

The **targets** *i.e.* the elements that will be affected by the selector changes may contain following attributes : 

| Attribute | Meaning |
| --------- | ------- |
| `nd-show-for` | Element is **displayed** when the selector gets a specific value (the * wildcard character is allowed). |
| `nd-hide-for` | Element is **hidden**  when the selector gets a specific value (the * wildcard character is allowed). |
| `nd-url`      | The content is updated with a server response from the specified URL, **extended** with the selected value.<br />As an example : if the `nd-url ` is `/echo` and the selected value is `'hello'`, the `/echo/hello` server endpoint will be fetched. |
| `nd-sync`     | The content of the element is updated with the selected **value**. |
| `nd-follow`   | The option value contain an **URL**. <br />The content of the target element will be updated with the data fetched from this endpoint. |
| `nd-activate` | The target will be 'activated', *i.e.* transformed into a link: <br />&bull; an `nd-link` attribute is added<br />&bull; an `nd-url` attribute containing the option's url is added<br />&Rightarrow; the element is now clickable ! |

**Note** :  `nd-sync`, `nd-follow`  and `nd-activate`are mutually exclusive !

## Use cases

### Cascaded select with <code>nd-inform</code>

```html
<div class="border border-secondary-subtle rounded p-3">
    <div class="row">
        <div class="col-3">
            <!-- On selection change, this selector will inform the #models selector -->
            <select id="brands" nd-select nd-inform="#models" class="form-select">
                <option>-- Select a brand --</option>
                <!-- 
					value: the brand name
					nd-url: the endpoint that returns the models of the given brand 
				-->
                <option value="volkswagen" nd-url="/icc/volkswagen">Volkswagen</option>
                <option value="mercedes" nd-url="/icc/mercedes">Mercedes</option>
                <option value="audi" nd-url="/icc/audi">Audi</option>
                <option value="renault" nd-url="/icc/renault">Renault</option>
            </select>
        </div>
        <div class="col-3">
            <!-- The model selector (initially empty) -->
            <select id="models" nd-select nd-target="#result" nd-default="-- Select a model --" class="form-select">
            </select>
        </div>
    </div>
    <div class="row mt-3">
        <div class="col-3">
            <div>Selected : <code id="result" nd-sync nd-show-for="*"></code></div>
        </div>
    </div>
</div>
```



### Update and show a button with `nd-activate`

This is the initial HTML code :

```html
<div class=capture"row d-flex align-items-center">
    <div class="col-3">
        <select nd-select nd-target="#my_button" class="form-select mt-3 mb-3" aria-label="Default select example">
            <option>-- Select a template --</option>
            <option value="New payment" nd-url="/template/0">New payment</option>
            <option value="Template 1" nd-url="/template/1">Template one</option>
            <option value="Template 2" nd-url="/template/2">Template two</option>
        </select>
    </div>
    <div class="col-2">
        <!-- The button wil be updated from the select options -->
        <button id="my_button" nd-activate nd-show-for="*" type="button" class="..."></button>
    </div>
</div>
```

If the user selects let's say Template 1', the button is modified like this :

```html
<button id="my_button" nd-activate="" nd-show-for="*" type="button" class="..." nd-link="" nd-url="/template/1" data-ndtrack="776aeaea-5154-4af8-8d38-3e4ee1a50a49">Template 1</button>
```

In conjunction with server sent events, this feature can be used to trigger the display of a new page *e.g.* for an order form.
