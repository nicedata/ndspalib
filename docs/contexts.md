> Under construction !!!

# Contexts

A **context** is a fragment in the HTML source which can be shown or hidden. The purpose is to show or hide parts of an HTML page depending of a context.

For example, if a user is logged in, certain menu items will be available to that user, while they will be hidden from users who are not logged in. This is illustrated in the example below.

A context is identified by the `nd-context` attribute.

## Context attributes

|    Attribute    | Meaning                                                      |
| :-------------: | ------------------------------------------------------------ |
|  `nd-context`   | Indicated a context-dependent element.                       |
|  `nd-show-for`  | A list of contexts in which this elements is to be displayed. |
|  `nd-hide-for`  | A list of contexts in which this elements is to be hidden.   |
| `nd-remove-for` | A list of contexts in which this element will be emptied.    |

**Notes** 

1. At least, one of `nd-show-for` or  `nd-hide-for` must be specified.
2. If only  `nd-hide-for` is set, and no context is set, the element will be visible !

## Usage

| HTML code                                                    | Effect                                                       |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `<div nd-context nd-show-for="authenticated"> ... </div> `   | Will be show when the context is set to `authenticated`.     |
| `<div nd-context nd-hide-for="authenticated"> ... </div> `   | Will be hidden when the context is set to `authenticated`.   |
| `<div nd-context ... nd-remove-for="authenticated"> ... </div> ` | The element content will be cleared when he context is set to `authenticated`. |

## A simple example

Please look at the  [Web Session example](/ndspalib/examples/websession/) !

------

> Updated : 22.05.2026 - MM
