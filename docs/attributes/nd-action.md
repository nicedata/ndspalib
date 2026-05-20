# `nd-action`

This attribute allows to link user developed JavaScript with `ndspalib`. The action may be executed before or after a data fetch operation or a polling event.

## Format

The format to use is **`nd-action="js_function('param1', 'param2', ..., arguments)"`**. 

!!! Note 
	It is important to have the last function parameter to be **`arguments`** : this allows to access the action details in the JavaScript function.

## Used in

:white_check_mark:`nd-link` :white_check_mark:`nd-poll`

## Modifiers

The action may be executed before (the default) or after a fetch or poll operation by using the `before::` or `after::` prefixes :

- Before : `nd-action="js_function(arguments)"` or <br>  `nd-action="before::js_function(arguments)"`
- After :    `nd-action="after::js_function(arguments)"`

## Action details

The action details are available in the user function.

```javascript
class ActionDetail {
    when = null;      // 'before' or 'after' fetch or poll
    url = null;       // the url being fetched 
    source = null;    // the element that was clicked or that triggered a poll operation
    targets = [];     // the list of targets (a list of HTMLElement)
    str_data = null;  // the fetched data as a string
    json_data = null; // the fetched data as JSON (when possible)
}
```

The user function should be declared with  `..args` parameters like this :

```javascript
do_something = (...args) => {
	// Get the arguments as a dictionary
    const result = nd.util.action_detail_dict(args);

    // Debug
    const source = result.detail.source;
    if (source.id === 'test-action') {
        console.log('Debug:', source);
        source.innerHTML = `<code>${crypto.randomUUID().replaceAll('-', '').toUpperCase()}</code>`
    }
}
```

**Note** : our `nd.util.action_detail_dict(args)` function transforms an the `...arg` into a dictionary.  For example `nd-action="do_something('Martin','Klaus', arguments)"` gets these arguments : 

```javascript
{
    "arg0": "Martin",
    "arg1": "Klaus",
    "detail": {              // <- This key is present if there are details !!!
        "when": "before",
        "url": null,
        "source": {},
        "targets": [
            {}
        ],
        "str_data": null,
        "json_data": null
    }
}
```

