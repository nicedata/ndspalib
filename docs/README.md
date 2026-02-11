# Documentation

## Introduction

### Polling

Elements with an `[nd-poll]` attribute are reloaded from the server periodically.

#### Attributes

| Attribute     | Default | Meaning                                                                           |
| ------------- | ------- | --------------------------------------------------------------------------------- |
| `nd-poll`     |         | Elements with an `[nd-poll]` attribute are reloaded from the server periodically. |
| `nd-url`      |         | URL to poll                                                                       |
| `nd-target`   |         | Target selector (`#id`, `.class`). If not specified, the inner content is updated |
| `nd-interval` | 10000   | Poll interval in milliseconds                                                     |

#### Examples

Poll the `/poll` url every `3000` ms (3 seconds) and update all elements having the `target` class.

```html
<div nd-poll nd-url="/poll" nd-target=".target" nd-interval="3000" class="mb-3 border p-1"></div>
```

Poll the `/poll` url every `5000` ms (5 seconds) and update the element having the `target-c` id.

```html
<div nd-poll nd-url="/poll" nd-target="#target-c" nd-interval="5000" class="mb-3 border p-1"></div>
```

Poll the `/poll` url every `10000` ms (10 seconds which is the **default** value) and update the the inner content of the element itself since no `nd-target` is specified.

```html
<div nd-poll nd-url="/poll" class="mb-3 border p-1"></div>
```

### Links & buttons

```html
<div class="mb-3">
    <button nd-link nd-url="/poll" nd-target=".target" class="btn btn-primary">A</button>
    <button nd-link class="btn btn-primary">B</button>
    <button nd-link nd-url="/test" nd-target="#target-c" class="btn btn-primary">C</button>
</div>
```

### Select

#### Attributes

| Attribute     | Default | Meaning                                                      |
| ------------- | ------- | ------------------------------------------------------------ |
| `nd-switch`   |         | `<select>` elements with an `nd-switch` will update targets on option change. |
| `nd-url`      |         | URL to poll                                                  |
| `nd-target`   |         | Target selector (`#id`, `.class`). If not specified, the inner content is updated |
| `nd-interval` | 10000   | Poll interval in milliseconds                                |

#### Examples

```html
<div class="row mb-3 align-items-center">
    <div class="col-2">
        <select class="form-select" aria-label="Default select example" nd-switch=".numbers">
            <option>-- Select a value --</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3 with love">Three</option>
            <option value="4">Four</option>
        </select>
    </div>
    <div class="col-auto">
        <!-- Show if there is a value -->
        <div class="col-form-label numbers form-control" nd-show-for="*">Value :</div>
    </div>
    <div class="col-auto">
        <!-- Sync with source selector value -->
        <div class="numbers border-success form-control" nd-show-for="*" nd-sync></div>
    </div>
    <div class="col-auto">
        <!-- Sync with server url -->
        <div class="numbers border-success form-control" nd-show-for="*" nd-sync nd-url="/dummy"></div>
    </div>
    <div class="col-auto">
        <!-- Hide if there is a value -->
        <div class="numbers border-danger form-control" nd-hide-for="*">No value !</div>
    </div>
</div>
```
