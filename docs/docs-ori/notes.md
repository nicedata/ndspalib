# Notes

## Event handlers

In a single page application, sections may be updated with content for which event listeners will be attached. When such a section is removed from the DOM, the previously attached event listeners, although no longer active, remain in somewhere in memory. When section replacement operations occur a lot, the browser may slow down.

This is why we are using a "Listener Tracker" which performs the following operations :

- register event listeners (and the element on which it is attached)
- remove event listeners when the element is no longer in the DOM

The Listener Tracker is executed on the whole page (the `document`)  every time a section is updated. We use the JavaScript `WeakRef()` objects to allow the garbage collector to do its job.

On controlled elements like dialogs and forms, we explicitly clean the used event handlers.

## Debugging

...

## Syncing element

In many use cases, when elements change, other elements need to be adapted. For example, if a dropdown, if an option is selected, you may want to inform other elements of this change. This could be done with the help of JavaScript, or by a page reload. Our philosophy is 1) no page reloads and 2) as less JS as possible.

- Send events ?
- Get element id and simulate 'change' or 'click' ?



